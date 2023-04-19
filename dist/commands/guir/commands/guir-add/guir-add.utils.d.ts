import { Args, ReturnType } from '../../../../gcli.types';
import { GuirNS } from '../../guir.types';
import { GuirAddNS } from './guir-add.types';
/**
 * Gets standalone options
 */
export declare class Options {
    args: Args;
    constructor(args: Args);
    /**
     * Returns the start and end index of the given screen range.
     */
    static getScreenIndices(screenRange: string): any[];
    /**
     * Returns an array of unique, screens
     */
    static getSelectiveScreens(screenSelective: GuirAddNS.ValueOptionMap['screenSelective']): string[];
    /**
     * Gets the standalone options
     */
    getBoolOption(): GuirAddNS.BoolOptionsMap;
    /**
     * Gets the options with values
     */
    getValueOptions(): {
        options: GuirAddNS.ValueOptionMap;
        error?: undefined;
    } | {
        error: boolean;
        options?: undefined;
    };
    /**
     * Gets the bool and value options
     */
    getOptions(): ReturnType<{
        boolOptions: GuirAddNS.BoolOptionsMap;
        valueOptions: GuirAddNS.ValueOptionMap;
    }>;
    /**
     * Validate invalid options
     */
    validateInvalidOptions({ boolOptions, valueOptions, }: {
        boolOptions: GuirAddNS.BoolOptionsMap;
        valueOptions: GuirAddNS.ValueOptionMap;
    }, allArgs: Args): ReturnType;
    /**
     * Validates all boolean options
     */
    validateBoolOptions({ boolOptions, valueOptions, }: {
        boolOptions: GuirAddNS.BoolOptionsMap;
        valueOptions: GuirAddNS.ValueOptionMap;
    }): ReturnType;
    /**
     * Validates screen range
     */
    validateScreensOption({ screens }: GuirAddNS.ValueOptionMap): ReturnType;
    /**
     * Validates screen specific option
     */
    validscreenSelectiveOption({ screenSelective, screens }: GuirAddNS.ValueOptionMap): {
        error: boolean;
    };
    /**
     * Validates path option
     */
    validatePathOption(valueOptions: GuirAddNS.ValueOptionMap): {
        error: boolean;
    };
    /**
     * Validates component option
     */
    validateComponentOption({ component }: GuirAddNS.ValueOptionMap): {
        error: boolean;
    };
    validateValueOptions(valueOptions: GuirAddNS.ValueOptionMap): {
        error: boolean;
    };
    validateOptions(options: {
        boolOptions: GuirAddNS.BoolOptionsMap;
        valueOptions: GuirAddNS.ValueOptionMap;
    }, allArgs: Args): {
        error: boolean;
    };
}
export declare const getGuirAddBoolOptions: (args: Array<string>) => GuirAddNS.BoolOptionsMap;
/**
 * Gets the options with values
 */
export declare const getGuirAddValueOptions: (args: Array<string>) => ReturnType<{
    options: GuirAddNS.ValueOptionMap;
}>;
/**
 * Builds the component and it's respective files.
 */
export declare class BuildComponent {
    componentName: string;
    relativeComponentDirPath: string;
    absoluteComponentDirPath: string;
    boolOptions: GuirAddNS.BoolOptionsMap;
    valueOptions: GuirAddNS.ValueOptionMap;
    constructor(componentName: string, options: GuirAddNS.OptionMap);
    /**
     * Path name with the following:
     * - root-dir from the config
     * - the optional path
     * - component name
     */
    setPaths(componentName: string): void;
    /**
     * Creating the directory recursively.
     * Overrides (by removing and re-creating) existing if override option provided.
     */
    makeComponentDir(): void;
    /**
     * Creates the directory for storing screen files.
     */
    makeScreenDir(): void;
    /**
     * Gets a list of screen sizes to add to the component based on the supplied options
     */
    getScreens(): ("xs" | "sm" | "md" | "lg" | "xl")[];
    /**
     * Creates the screen files
     */
    makeScreenDirFiles(screens: Array<GuirNS.ScreenType>): void;
    /**
     * Creates the component file
     */
    makeComponentFiles(screens: Array<GuirNS.ScreenType>): void;
    /**
     * Create index file for exports
     */
    makeIndexFile(): void;
    /**
     * Builds the directories and files for the component
     */
    build(): ReturnType<{
        buildConfig: GuirNS.GuirMapConfigNode;
    }>;
}
