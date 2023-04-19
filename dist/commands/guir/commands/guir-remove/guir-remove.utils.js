"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemoveConfirmation = exports.RemoveComponent = void 0;
const gcli_utils_1 = require("../../../../gcli.utils");
const guir_utils_1 = require("../../guir.utils");
class RemoveComponent {
    constructor(componentName) {
        this.componentName = '';
        this.path = '';
        this.componentName = componentName;
    }
    setComponentPath() {
        const { error, path: partialPath } = guir_utils_1.GuirMap.getComponentAbsPath(this.componentName);
        if (error) {
            throw new Error("Could not get component's path.");
        }
        this.path = gcli_utils_1.Path.getPath(partialPath);
    }
    validateComponentPath() {
        const pathValid = gcli_utils_1.File.doesFileExist(this.path);
        if (!pathValid) {
            throw new Error('Could not locate component. Seems like it was manually deleted.');
        }
    }
    getMap() {
        const { error: getMapError, map } = guir_utils_1.GuirMap.getMap();
        if (getMapError) {
            throw new Error('Could not update map file');
        }
        return {
            map,
        };
    }
    removeComponentDirectory() {
        const { error } = gcli_utils_1.File.rmDir(this.path);
        if (error) {
            throw new Error('Failed to remove component directory and files.');
        }
    }
    removeRecursivelySubComponents(map, componentName) {
        const removables = Object.values(map).reduce((acc, componentObj) => {
            if (componentObj.component === componentName)
                acc.push(componentObj.name);
            return acc;
        }, []);
        if (removables.length === 0) {
            delete map[componentName];
        }
        if (removables.length) {
            removables.forEach((componentName) => {
                this.removeRecursivelySubComponents(map, componentName);
            });
            delete map[componentName];
        }
        return {
            error: false,
        };
    }
    updateMapFile(map) {
        const { error } = this.removeRecursivelySubComponents(map, this.componentName);
        if (error) {
            throw new Error('Could not update map file.');
        }
        const { error: writeMapError } = guir_utils_1.GuirMap.writeMap(map);
        if (writeMapError) {
            throw new Error('Could not update map file.');
        }
    }
    remove() {
        try {
            /**
             * Sets component path from map
             */
            this.setComponentPath();
            /**
             * Validates the path of the component
             */
            this.validateComponentPath();
            /**
             * Get the map file
             */
            const { map } = this.getMap();
            /**
             * Remove component folder from fs
             */
            this.removeComponentDirectory();
            /**
             * Remove component from map file
             */
            this.updateMapFile(map);
            return { error: false };
        }
        catch (error) {
            (0, gcli_utils_1.logError)(error.message);
            return { error: true };
        }
    }
}
exports.RemoveComponent = RemoveComponent;
const getRemoveConfirmation = () => {
    const decision = gcli_utils_1.Prompt.prompt('Are you sure you want to remove this component? This will remove all the files and directories under it. (Choose Y|y to continue, N|n to cancel): ');
    /**
     * When user enters a value
     */
    if (typeof decision === 'string') {
        switch (decision.toLowerCase()) {
            case 'y':
                return {
                    shouldRemove: true,
                };
            case 'n': {
                return {
                    shouldRemove: false,
                };
            }
            default:
                (0, gcli_utils_1.logError)('Invalid selection. Please retry with a valid choice.');
                return {
                    error: true,
                };
        }
    }
    else {
        /**
         * When the user kills the prompt
         */
        (0, gcli_utils_1.log)('Aborted');
        return {
            error: true,
        };
    }
};
exports.getRemoveConfirmation = getRemoveConfirmation;
