"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuirMap = exports.Template = exports.Component = exports.getMatchedArg = exports.isArgsEmpty = exports.getGuirCommand = exports.guirHelper = exports.getGuirGlobalConfig = void 0;
const guir_config_1 = require("./guir.config");
const gcli_config_1 = require("../../gcli.config");
const gcli_utils_1 = require("../../gcli.utils");
const guir_store_1 = __importDefault(require("./guir.store"));
/**
 * Returns the "guir" config from the global file at root.
 */
const getGuirGlobalConfig = () => {
    try {
        const globalConfigFilePath = gcli_utils_1.Path.getPath(gcli_config_1.globalConfigFilename);
        if (gcli_utils_1.File.doesFileExist(globalConfigFilePath)) {
            const globalConfig = require(globalConfigFilePath);
            return {
                globalConfig: globalConfig.guir,
            };
        }
        else
            return { error: true };
    }
    catch (error) {
        (0, gcli_utils_1.logError)(error.message);
        return { error: true };
    }
};
exports.getGuirGlobalConfig = getGuirGlobalConfig;
/**
 * Prints help text
 */
const guirHelper = ({ template, isEmpty, isError, }) => {
    console.log(template, isEmpty, isError);
};
exports.guirHelper = guirHelper;
/**
 * Return the commands supplied to guir and follwing values.
 */
const getGuirCommand = (args) => {
    return args.reduce((baseCommand, baseCommandKey) => {
        const keyIndex = guir_config_1.guirCommandKeys.findIndex((arg) => arg === baseCommandKey);
        if (keyIndex !== -1)
            baseCommand[baseCommandKey] = args.slice(1); // assign arguments after the base command
        return baseCommand;
    }, {});
};
exports.getGuirCommand = getGuirCommand;
/**
 * Checks arguments length
 */
const isArgsEmpty = (args) => {
    return !args.length;
};
exports.isArgsEmpty = isArgsEmpty;
/**
 * Matches the given argument against a regex
 */
const getMatchedArg = (arg, regex) => {
    if (arg) {
        const match = arg.match(regex);
        if (match)
            return { match: match[0] };
    }
    return {
        error: true,
    };
};
exports.getMatchedArg = getMatchedArg;
/**
 * Contains utility methods for working with a component
 */
class Component {
    /**
     * Returns the component name in pascal case
     */
    static getComponentName(componentName) {
        return gcli_utils_1.String.toPascalCase(componentName);
    }
    /**
     * Returns component's screen component name
     */
    static getScreenComponentName(componentName, screen) {
        return `${Component.getComponentName(componentName)}${gcli_utils_1.String.toPascalCase(screen)}`;
    }
    /**
     * Returns component's screen file name
     */
    static getScreenFilename(componentName, screen, extension = true) {
        return `${componentName}-${screen}${extension ? '.tsx' : ''}`;
    }
    /**
     * Returns component's file name
     */
    static getComponentFilename(componentName, extension = true) {
        return `${componentName}${extension ? '.tsx' : ''}`;
    }
}
exports.Component = Component;
/**
 * For generating component and subcomponent templates
 */
class Template {
    static getIndexFileTemplate(componentName) {
        const ComponentName = Component.getComponentName(componentName);
        const template = `
export { default as ${ComponentName} } from './${Component.getComponentFilename(componentName, false)}'
    `;
        return gcli_utils_1.String.trim(template) + '\n';
    }
    /**
     * Generates and returns the component's file content
     */
    static getComponentTemplate(componentName, screens) {
        const ComponentName = Component.getComponentName(componentName);
        const template = `
import React, { FC } from 'react'
import { Render } from '@geoiq-ai/lib.responsive'
${screens.length
            ? `import { ${screens
                .map((screen) => `${Component.getScreenComponentName(componentName, screen)}`)
                .join(', ')} } from './${guir_config_1.guirScreenDirName}'
`
            : ''}
const ${ComponentName}: FC = () => {

  return <Render ${screens
            .map((screen) => ` ${screen}={<${Component.getScreenComponentName(componentName, screen)} />}`)
            .join('')} />
}

export default ${ComponentName}
    `;
        return gcli_utils_1.String.trim(template) + '\n';
    }
    /**
     * Generates and returns the component's screen component's file content
     */
    static getScreenTemplate(componentName, screen) {
        const ComponentName = Component.getScreenComponentName(componentName, screen);
        const template = `
import React, { FC } from 'react'

const ${ComponentName}: FC = () => {
  return null
}

export default ${ComponentName}
    `;
        return gcli_utils_1.String.trim(template) + '\n';
    }
    /**
     * Generate screen directory's index file
     */
    static getScreenIndexTemplate(componentName, screens) {
        const template = `
${screens
            .map((screen) => `export { default as ${Component.getScreenComponentName(componentName, screen)} } from './${Component.getScreenFilename(componentName, screen, false)}'`)
            .join('\n')}
    `;
        return gcli_utils_1.String.trim(template) + '\n';
    }
}
exports.Template = Template;
/**
 * CRUD operation on the component map.
 * 1. Add a component
 * 2. Remove a component
 * 3. Updates name
 * 4. Update path
 */
class GuirMap {
    /**
     * Gets the file path
     */
    static getFilePath() {
        return gcli_utils_1.Path.getPath(guir_config_1.guirComponentMapFilename);
    }
    /**
     * Creates the map file
     */
    static createFile(path) {
        const { error } = gcli_utils_1.File.writeFile(path, '{}');
        if (error) {
            (0, gcli_utils_1.logError)('Failed to create map file.');
        }
        return { error };
    }
    /**
     * Reads and return the map config (parsed).
     * Create a new file if not present.
     */
    static getMap() {
        const path = GuirMap.getFilePath();
        if (!gcli_utils_1.File.doesFileExist(path)) {
            GuirMap.createFile(path);
        }
        const { error, file } = gcli_utils_1.File.readFile(path);
        if (error) {
            (0, gcli_utils_1.logError)('Failed to read map file.');
            return { error };
        }
        try {
            return {
                map: JSON.parse(file),
            };
        }
        catch (error) {
            (0, gcli_utils_1.logError)('Failed to parse map file.');
            return { error: true };
        }
    }
    /**
     * Creates map-specific config
     */
    static pushToMap(map, config) {
        return Object.assign(map, {
            [config.name]: config,
        });
    }
    /**
     * Pushes the config to the map file
     */
    static writeMap(map) {
        const path = GuirMap.getFilePath();
        const { error } = gcli_utils_1.File.writeFile(path, JSON.stringify(map, null, 2));
        if (error) {
            (0, gcli_utils_1.logError)('Failed to write to map file.');
        }
        return { error };
    }
    static addComponent(config) {
        const { error: mapAcquireError, map } = GuirMap.getMap();
        if (mapAcquireError)
            return { error: true };
        const { error: mapWriteError } = GuirMap.writeMap(GuirMap.pushToMap(map, config));
        if (mapWriteError)
            return { error: true };
        return { error: false };
    }
    static hasComponent(component) {
        const { error, map } = GuirMap.getMap();
        if (error) {
            return {
                error: true,
            };
        }
        return {
            error: !map[component],
        };
    }
    static getComponentPath(component) {
        const { error, map } = GuirMap.getMap();
        if (error) {
            return { error: true };
        }
        if (!map[component]) {
            (0, gcli_utils_1.logError)('Component not found.');
            return {
                error: true,
            };
        }
        return {
            path: map[component].path,
        };
    }
    static getComponentAbsPath(component) {
        const { error, path: relativePath } = GuirMap.getComponentPath(component);
        if (error) {
            return { error: true };
        }
        return {
            path: gcli_utils_1.Path.getPath(guir_store_1.default.getState().globalConfig.rootDir, relativePath),
        };
    }
}
exports.GuirMap = GuirMap;
