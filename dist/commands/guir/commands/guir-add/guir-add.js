"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const gcli_utils_1 = require("../../../../gcli.utils");
const guir_utils_1 = require("../../guir.utils");
const guir_add_config_1 = require("./guir-add.config");
const guir_add_utils_1 = require("./guir-add.utils");
const guirAdd = (args) => {
    // const guirGlobalConfig = getGuirGlobalConfig()
    try {
        if ((0, guir_utils_1.isArgsEmpty)(args)) {
            throw new Error('argsEmpty');
        }
        /**
         * Gets the component name
         */
        const { error: componentNameError, match: componentName } = (0, guir_utils_1.getMatchedArg)(args[0], guir_add_config_1.guirAddRegex.component);
        if (componentNameError) {
            throw new Error('componentNameInvalid');
        }
        const optionsObj = new guir_add_utils_1.Options(args);
        /**
         * Gets the options
         */
        const _a = optionsObj.getOptions(), { error: optionError } = _a, options = __rest(_a, ["error"]);
        console.log(options);
        if (optionError) {
            throw new Error('optionsInvalid');
        }
        /**
         * Validate options
         */
        const { error: optionValidationError } = optionsObj.validateOptions(options, args.slice(1));
        if (optionValidationError) {
            throw new Error('optionsValidationError');
        }
        /**
         * Add component to FS
         */
        const buildComponent = new guir_add_utils_1.BuildComponent(componentName, options);
        // buildComponent.build
        // const { error: buildError } = { error: false }
        const { error: buildError, buildConfig } = buildComponent.build();
        if (buildError) {
            throw new Error('buildError');
        }
        /**
         * Adding component to map file.
         */
        const { error: mapAdditionError } = guir_utils_1.GuirMap.addComponent(buildConfig);
        if (mapAdditionError) {
            throw new Error('mapAdditionError');
        }
        (0, gcli_utils_1.log)(`✅ Component "${componentName}" created!`);
        return {
            error: false,
        };
    }
    catch (error) {
        (0, gcli_utils_1.logError)('Failed to create component.');
        (0, guir_utils_1.guirHelper)({ template: error.message, isError: true });
        return { error: true };
    }
};
exports.default = guirAdd;
