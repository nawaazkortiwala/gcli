import { GetBaseCommands, Log, LogError, ReturnType } from './gcli.types';
/**
 * Gets the base command from the process.argv
 */
export declare const getBaseCommand: GetBaseCommands;
export declare const log: Log;
export declare const logError: LogError;
/**
 * Provides methods to work with _path_
 */
export declare class Path {
    /**
     * Returns a path-resolved path
     */
    static getPath(...partial: Array<string>): string;
    static joinPath(...partial: Array<string>): string;
}
/**
 * Provides methods to work with _fs_
 */
export declare class File {
    /**
     * Read a given file and returns the content in string
     */
    static readFile(filePath: string): ReturnType<{
        file: string;
    }>;
    /**
     * Checks if the file exists and return bool
     */
    static doesFileExist(path: string): boolean;
    /**
     * Parses string to JSON and return either the json or an error bool
     */
    static parseJsonFile<T = unknown>(fileString: string): ReturnType<{
        json?: T;
    }>;
    /**
     * Create a directory/folder in the file system or returns an error bool
     */
    static mkdir(dirPath: string, options?: {
        force?: boolean;
    }): ReturnType;
    /**
     * Write a file to file system or return an error bool
     */
    static writeFile(filePath: string, data: string): ReturnType;
    /**
     * Deletes directory recursively
     */
    static rmDir(dirPath: string): {
        error: boolean;
    };
}
export declare class String {
    /**
     * Converts string to  Pascal case format and returns.
     */
    static toPascalCase(value: string): string;
    /**
     * Trims white-spaces and newlines from string and returns.
     */
    static trim(value: string): string;
}
export declare class Prompt {
    /**
     * Opens up a prompt
     */
    static prompt(message: string): any;
}
