"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gcli_utils_1 = require("../../../../gcli.utils");
const guir_utils_1 = require("../../guir.utils");
const guir_remove_config_1 = require("./guir-remove.config");
const guir_remove_utils_1 = require("./guir-remove.utils");
const guirRemove = (args) => {
    try {
        if ((0, guir_utils_1.isArgsEmpty)(args)) {
            throw new Error('argsEmpty');
        }
        /**
         * Gets the component name
         */
        const { error: componentNameError, match: componentName } = (0, guir_utils_1.getMatchedArg)(args[0], guir_remove_config_1.guirRemoveRegex.component);
        if (componentNameError) {
            throw new Error('componentNameInvalid');
        }
        /**
         * Show confirmation prompt
         */
        const { error: removeConfirmationError, shouldRemove } = (0, guir_remove_utils_1.getRemoveConfirmation)();
        if (removeConfirmationError)
            throw new Error('confirmationError');
        if (shouldRemove) {
            /**
             * Remove component
             */
            const removeComponentObj = new guir_remove_utils_1.RemoveComponent(componentName);
            const { error: removeComponentError } = removeComponentObj.remove();
            if (removeComponentError)
                throw new Error('removeError');
            (0, gcli_utils_1.log)(`✅ Component "${componentName}" removed!`);
        }
        return {
            error: false,
        };
    }
    catch (error) {
        // guirHelper({ template: error.message, isError: true })
        (0, gcli_utils_1.logError)('Failed to remove component.');
        return { error: true };
    }
};
exports.default = guirRemove;
