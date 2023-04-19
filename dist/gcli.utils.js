"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prompt = exports.String = exports.File = exports.Path = exports.logError = exports.log = exports.getBaseCommand = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const gcli_config_1 = require("./gcli.config");
const promptSync = require('prompt-sync')();
/**
 * Gets the base command from the process.argv
 */
const getBaseCommand = () => {
    const args = process.argv.slice(2);
    return args.reduce((baseCommand, baseCommandKey) => {
        const keyIndex = gcli_config_1.baseCommandsKeys.findIndex((arg) => arg === baseCommandKey);
        if (keyIndex !== -1)
            baseCommand[baseCommandKey] = args.slice(1); // assign arguments after the base command
        return baseCommand;
    }, {});
};
exports.getBaseCommand = getBaseCommand;
const log = (message) => {
    console.log(`[guir]: ${message}`);
};
exports.log = log;
const logError = (error) => {
    console.error(`[guir]: ❌ ERROR: ${error}`);
};
exports.logError = logError;
/**
 * Provides methods to work with _path_
 */
class Path {
    /**
     * Returns a path-resolved path
     */
    static getPath(...partial) {
        return path.resolve(...partial);
    }
    static joinPath(...partial) {
        return path.join(...partial);
    }
}
exports.Path = Path;
/**
 * Provides methods to work with _fs_
 */
class File {
    /**
     * Read a given file and returns the content in string
     */
    static readFile(filePath) {
        try {
            return {
                file: fs.readFileSync(filePath, {
                    encoding: 'utf-8',
                }),
            };
        }
        catch (error) {
            (0, exports.logError)(`Unable to read file from: ${path.basename(filePath)} at ${filePath}`);
            return {
                error: true,
            };
        }
    }
    /**
     * Checks if the file exists and return bool
     */
    static doesFileExist(path) {
        return fs.existsSync(path);
    }
    // /**
    //  * Checks if the file exits.
    //  * Returns file content in string is does, else and object with error bool
    //  */
    // static getFile(path: string): ReturnType<{
    //   file: string
    // }> {
    //   if (File.doesFileExist(path)) return
    //   return {
    //     file: File.readFile(path),
    //   }
    //   return {
    //     error: true,
    //   }
    // }
    /**
     * Parses string to JSON and return either the json or an error bool
     */
    static parseJsonFile(fileString) {
        try {
            return {
                json: JSON.parse(fileString),
            };
        }
        catch (error) {
            (0, exports.logError)(error.message);
            return { error: true };
        }
    }
    /**
     * Create a directory/folder in the file system or returns an error bool
     */
    static mkdir(dirPath, options) {
        try {
            /**
             * Do not create component dir if component already exists
             * and --override option is not provided.
             */
            if (File.doesFileExist(dirPath)) {
                if (!(options === null || options === void 0 ? void 0 : options.force)) {
                    throw new Error(`Component at ${dirPath} already exists. If you wish to override the existing component, use the --override option.`);
                }
                /**
                 * Remove the existing component directory and all it's content
                 */
                fs.rmdirSync(dirPath, { recursive: true });
            }
            /**
             * Create component directory, recursively
             */
            fs.mkdirSync(dirPath, { recursive: true });
            return {
                error: false,
            };
        }
        catch (error) {
            (0, exports.logError)(error.message);
            return {
                error: true,
            };
        }
    }
    /**
     * Write a file to file system or return an error bool
     */
    static writeFile(filePath, data) {
        try {
            fs.writeFileSync(filePath, data);
            return { error: false };
        }
        catch (error) {
            (0, exports.logError)(error.message);
            return { error: true };
        }
    }
    /**
     * Deletes directory recursively
     */
    static rmDir(dirPath) {
        try {
            fs.rmdirSync(dirPath, {
                recursive: true,
            });
            return { error: false };
        }
        catch (error) {
            (0, exports.logError)(error.message);
            return { error: true };
        }
    }
}
exports.File = File;
class String {
    /**
     * Converts string to  Pascal case format and returns.
     */
    static toPascalCase(value) {
        return value
            .split(/[_\-.]/)
            .filter((entry) => entry)
            .map((entry) => {
            const lowerCased = entry.toLowerCase();
            return lowerCased[0].toUpperCase() + lowerCased.slice(1);
        })
            .join('');
    }
    /**
     * Trims white-spaces and newlines from string and returns.
     */
    static trim(value) {
        return value.trim();
    }
}
exports.String = String;
class Prompt {
    /**
     * Opens up a prompt
     */
    static prompt(message) {
        return promptSync(message);
    }
}
exports.Prompt = Prompt;
