"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildComponent = exports.getGuirAddValueOptions = exports.getGuirAddBoolOptions = exports.Options = void 0;
const gcli_utils_1 = require("../../../../gcli.utils");
const guir_config_1 = require("../../guir.config");
const guir_store_1 = __importDefault(require("../../guir.store"));
const guir_utils_1 = require("../../guir.utils");
const guir_add_config_1 = require("./guir-add.config");
const guir_add_types_1 = require("./guir-add.types");
/**
 * Gets standalone options
 */
class Options {
    constructor(args) {
        this.args = [];
        this.args = args;
    }
    /**
     * Returns the start and end index of the given screen range.
     */
    static getScreenIndices(screenRange) {
        const splitter = screenRange.match(/(:|&)/)[0];
        const [startRange, endRange] = screenRange.split(splitter);
        const startRangeIndex = guir_config_1.guirScreens.findIndex((screen) => screen === startRange);
        const endRangeIndex = guir_config_1.guirScreens.findIndex((screen) => screen === endRange);
        return [startRangeIndex, endRangeIndex, splitter];
    }
    /**
     * Returns an array of unique, screens
     */
    static getSelectiveScreens(screenSelective) {
        return Array.from(new Set(screenSelective.split(',').map((screen) => gcli_utils_1.String.trim(screen))));
    }
    /**
     * Gets the standalone options
     */
    getBoolOption() {
        return this.args.reduce((options, arg) => {
            if ((0, guir_utils_1.getMatchedArg)(arg, guir_add_config_1.guirAddRegex.boolOptions.bare).match)
                options.bare = true;
            if ((0, guir_utils_1.getMatchedArg)(arg, guir_add_config_1.guirAddRegex.boolOptions.override).match)
                options.override = true;
            return options;
        }, {
            bare: false,
            override: false,
        });
    }
    /**
     * Gets the options with values
     */
    getValueOptions() {
        try {
            const options = this.args.reduce((options, arg, index) => {
                Object.keys(guir_add_config_1.guirAddRegex.valueOptions).forEach((optionkey) => {
                    const option = guir_add_config_1.guirAddRegex.valueOptions[optionkey];
                    // Match flag
                    if ((0, guir_utils_1.getMatchedArg)(arg, option.flag).match) {
                        // Check value validity
                        const { error: valueError, match: value } = (0, guir_utils_1.getMatchedArg)(this.args[index + 1], option.value);
                        if (valueError)
                            throw new Error(`Invalid value supplied to ${arg} option.`);
                        else
                            options[optionkey] = value;
                    }
                });
                return options;
            }, {});
            return {
                options,
            };
        }
        catch (error) {
            (0, gcli_utils_1.logError)(error.message);
            return {
                error: true,
            };
        }
    }
    /**
     * Gets the bool and value options
     */
    getOptions() {
        const boolOptions = this.getBoolOption();
        const { error, options: valueOptions } = this.getValueOptions();
        return {
            error,
            boolOptions,
            valueOptions,
        };
    }
    /**
     * Validate invalid options
     */
    validateInvalidOptions({ boolOptions, valueOptions, }, allArgs) {
        const invalidOptions = allArgs
            // Get all options keys
            .filter((arg) => arg.match(/^\-/))
            // Remove the hyphens
            .map((arg) => arg.replace(/\-/g, ''))
            // // Get invalid args
            .filter((arg) => !Object.keys(boolOptions).includes(arg) &&
            !Object.keys(valueOptions).includes(arg) &&
            !guir_add_config_1.guirAddOptionShortHand.includes(arg));
        if (invalidOptions.length) {
            (0, gcli_utils_1.logError)(`Invalid options supplied: ${invalidOptions.join(', ')}`);
            return {
                error: true,
            };
        }
        return {
            error: false,
        };
        // const validOptions = Object.keys(boolOptions).length + Object.keys(valueOptions).length * 2
        // const error = allArgs.length > validOptions
        // if (error) {
        //   logError()
        // }
        // return {
        //   error: allArgs.length > validOptions,
        // }
    }
    /**
     * Validates all boolean options
     */
    validateBoolOptions({ boolOptions, valueOptions, }) {
        if (boolOptions.bare && (valueOptions.screens || valueOptions.screenSelective)) {
            (0, gcli_utils_1.logError)(`Options collision: -b | --${guir_add_types_1.GuirAddNS.OptionKeysEnum.bare} options cannot be passed with -s | --${guir_add_types_1.GuirAddNS.OptionKeysEnum.screens} options or with -ss | --${guir_add_types_1.GuirAddNS.OptionKeysEnum.screenSelective} options. `);
            return {
                error: true,
            };
        }
        return {
            error: false,
        };
    }
    /**
     * Validates screen range
     */
    validateScreensOption({ screens }) {
        if (screens) {
            const [startRangeIndex, endRangeIndex] = Options.getScreenIndices(screens);
            if (startRangeIndex > endRangeIndex) {
                (0, gcli_utils_1.logError)('Invalid range provided for -s | --screen option.');
                return {
                    error: true,
                };
            }
        }
        return {
            error: false,
        };
    }
    /**
     * Validates screen specific option
     */
    validscreenSelectiveOption({ screenSelective, screens }) {
        if (screenSelective) {
            if (screens) {
                (0, gcli_utils_1.logError)(`Options collision: Either pass the -s | --${guir_add_types_1.GuirAddNS.OptionKeysEnum.screens} option or the -ss | --${guir_add_types_1.GuirAddNS.OptionKeysEnum.screenSelective} option. Got both.`);
                return { error: true };
            }
            return {
                error: !Options.getSelectiveScreens(screenSelective).length,
            };
        }
        return {
            error: false,
        };
    }
    /**
     * Validates path option
     */
    validatePathOption(valueOptions) {
        /**
         * Only as any one from path and component options.
         */
        if (valueOptions.component && valueOptions.path) {
            (0, gcli_utils_1.logError)('Options collision: Either pass the -p | --path options or the -c | --component option. Got both.');
            return {
                error: true,
            };
        }
        return {
            error: false,
        };
    }
    /**
     * Validates component option
     */
    validateComponentOption({ component }) {
        if (component) {
            /**
             * Check if component exists in .guirmap
             */
            const { error } = guir_utils_1.GuirMap.hasComponent(component);
            if (error) {
                (0, gcli_utils_1.logError)(`Invalid value provided for -c | --component options. Component named "${component}" does not exist.`);
                return { error: true };
            }
        }
        return { error: false };
    }
    validateValueOptions(valueOptions) {
        return {
            error: this.validatePathOption(valueOptions).error ||
                this.validateScreensOption(valueOptions).error ||
                this.validscreenSelectiveOption(valueOptions).error ||
                this.validateComponentOption(valueOptions).error,
        };
    }
    validateOptions(options, allArgs) {
        const { error: invalidOptionsError } = this.validateInvalidOptions(options, allArgs);
        const { error: boolOptionsError } = this.validateBoolOptions(options);
        const { error: valueOptionsError } = this.validateValueOptions(options.valueOptions);
        return {
            error: invalidOptionsError || boolOptionsError || valueOptionsError,
        };
    }
}
exports.Options = Options;
const getGuirAddBoolOptions = (args) => {
    return args.reduce((options, arg) => {
        if ((0, guir_utils_1.getMatchedArg)(arg, guir_add_config_1.guirAddRegex.boolOptions.bare).match)
            options.bare = true;
        if ((0, guir_utils_1.getMatchedArg)(arg, guir_add_config_1.guirAddRegex.boolOptions.override).match)
            options.override = true;
        return options;
    }, {
        bare: false,
        override: false,
    });
};
exports.getGuirAddBoolOptions = getGuirAddBoolOptions;
/**
 * Gets the options with values
 */
const getGuirAddValueOptions = (args) => {
    try {
        const options = args.reduce((options, arg, index) => {
            Object.keys(guir_add_config_1.guirAddRegex.valueOptions).forEach((optionkey) => {
                const option = guir_add_config_1.guirAddRegex.valueOptions[optionkey];
                // Match flag
                if ((0, guir_utils_1.getMatchedArg)(arg, option.flag).match) {
                    // Check value validity
                    const { error: valueError, match: value } = (0, guir_utils_1.getMatchedArg)(args[index + 1], option.value);
                    if (valueError)
                        throw new Error(`Invalid value supplied to ${arg} option.`);
                    else
                        options[optionkey] = value;
                }
            });
            return options;
        }, {
            path: '',
            screens: '',
        });
        return {
            options,
        };
    }
    catch (error) {
        (0, gcli_utils_1.logError)(error.message);
        return {
            error: true,
        };
    }
};
exports.getGuirAddValueOptions = getGuirAddValueOptions;
/**
 * Builds the component and it's respective files.
 */
class BuildComponent {
    constructor(componentName, options) {
        this.componentName = '';
        this.relativeComponentDirPath = '';
        this.absoluteComponentDirPath = '';
        this.boolOptions = {
            bare: false,
            override: false,
        };
        this.valueOptions = {
            path: '',
            screens: '',
            screenSelective: '',
            component: '',
        };
        this.componentName = componentName;
        this.boolOptions = options.boolOptions;
        this.valueOptions = options.valueOptions;
        this.setPaths(componentName);
        // console.log(this.absoluteComponentDirPath)
        // console.log(this, this.relativeComponentDirPath)
    }
    /**
     * Path name with the following:
     * - root-dir from the config
     * - the optional path
     * - component name
     */
    setPaths(componentName) {
        let dirPath;
        /**
         * Assign component option path from map
         */
        if (this.valueOptions.component) {
            const { error: componentOptionPathError, path } = guir_utils_1.GuirMap.getComponentPath(this.valueOptions.component);
            if (componentOptionPathError) {
                throw new Error(`Failed to get component ${this.valueOptions.component} path.`);
            }
            /**
             * Add the sub-component directory name
             */
            dirPath = gcli_utils_1.Path.joinPath(path, guir_config_1.guirNestedComponentDirName, componentName);
        }
        else {
            /**
             * Assigning path from config and component name
             */
            dirPath = gcli_utils_1.Path.joinPath(this.valueOptions.path || '', componentName);
        }
        this.relativeComponentDirPath = dirPath;
        this.absoluteComponentDirPath = gcli_utils_1.Path.getPath(guir_store_1.default.getState().globalConfig.rootDir, dirPath);
    }
    /**
     * Creating the directory recursively.
     * Overrides (by removing and re-creating) existing if override option provided.
     */
    makeComponentDir() {
        const { error: createDirError } = gcli_utils_1.File.mkdir(this.absoluteComponentDirPath, {
            force: this.boolOptions.override,
        });
        if (createDirError) {
            throw new Error('Failed to create directory.');
        }
    }
    /**
     * Creates the directory for storing screen files.
     */
    makeScreenDir() {
        const screenDirPath = gcli_utils_1.Path.joinPath(this.absoluteComponentDirPath, guir_config_1.guirScreenDirName);
        const { error: createDirError } = gcli_utils_1.File.mkdir(screenDirPath);
        if (createDirError) {
            throw new Error('Failed to create sub-directories.');
        }
    }
    /**
     * Gets a list of screen sizes to add to the component based on the supplied options
     */
    getScreens() {
        // For screen range
        if (this.valueOptions.screens) {
            const [startRangeIndex, endRangeIndex] = Options.getScreenIndices(this.valueOptions.screens);
            return guir_config_1.guirScreens.slice(startRangeIndex, endRangeIndex + 1);
        }
        // For specific screens
        if (this.valueOptions.screenSelective) {
            const screens = Options.getSelectiveScreens(this.valueOptions.screenSelective);
            // Order the screens as per the defined screen order
            screens.sort((a, b) => {
                return guir_config_1.guirScreenOrder[a] > guir_config_1.guirScreenOrder[b]
                    ? 1
                    : -1;
            });
            return screens;
        }
        return guir_config_1.guirScreens;
    }
    /**
     * Creates the screen files
     */
    makeScreenDirFiles(screens) {
        screens.forEach((screen) => {
            const screenFilePath = gcli_utils_1.Path.joinPath(this.absoluteComponentDirPath, guir_config_1.guirScreenDirName, guir_utils_1.Component.getScreenFilename(this.componentName, screen));
            const { error: createDirError } = gcli_utils_1.File.writeFile(screenFilePath, guir_utils_1.Template.getScreenTemplate(this.componentName, screen));
            if (createDirError) {
                throw new Error('Failed to create files.');
            }
        });
        const screenIndexFilePath = gcli_utils_1.Path.joinPath(this.absoluteComponentDirPath, guir_config_1.guirScreenDirName, 'index.ts');
        // console.log(Template.getScreenIndexTemplate(this.componentName, screens))
        const { error: writeIndexFileError } = gcli_utils_1.File.writeFile(screenIndexFilePath, guir_utils_1.Template.getScreenIndexTemplate(this.componentName, screens));
        if (writeIndexFileError) {
            throw new Error('Failed to create files.');
        }
    }
    /**
     * Creates the component file
     */
    makeComponentFiles(screens) {
        const componentFilePath = gcli_utils_1.Path.joinPath(this.absoluteComponentDirPath, guir_utils_1.Component.getComponentFilename(this.componentName));
        const { error: createDirError } = gcli_utils_1.File.writeFile(componentFilePath, guir_utils_1.Template.getComponentTemplate(this.componentName, screens));
        if (createDirError) {
            throw new Error('Failed to create files.');
        }
    }
    /**
     * Create index file for exports
     */
    makeIndexFile() {
        const componentFilePath = gcli_utils_1.Path.joinPath(this.absoluteComponentDirPath, 'index.ts');
        const { error: writeIndexFileError } = gcli_utils_1.File.writeFile(componentFilePath, guir_utils_1.Template.getIndexFileTemplate(this.componentName));
        if (writeIndexFileError) {
            throw new Error('Failed to create files.');
        }
    }
    /**
     * Builds the directories and files for the component
     */
    build() {
        try {
            // Make component dir
            this.makeComponentDir();
            // No screens if bare option is passed
            if (!this.boolOptions.bare) {
                // Make sub dir
                this.makeScreenDir();
                // Make sub dir files
                const screens = this.getScreens();
                this.makeScreenDirFiles(screens);
                // Make component file
                this.makeComponentFiles(screens);
            }
            else {
                // Make component file
                this.makeComponentFiles([]);
            }
            // Make index file
            this.makeIndexFile();
            return {
                error: false,
                buildConfig: {
                    name: this.componentName,
                    path: this.relativeComponentDirPath,
                    component: this.valueOptions.component,
                },
            };
        }
        catch (error) {
            (0, gcli_utils_1.logError)(error.message);
            return {
                error: true,
            };
        }
    }
}
exports.BuildComponent = BuildComponent;
