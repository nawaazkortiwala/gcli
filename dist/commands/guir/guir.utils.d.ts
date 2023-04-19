import { GuirNS } from './guir.types';
import { Args, GlobalConfig, ReturnType } from '../../gcli.types';
/**
 * Returns the "guir" config from the global file at root.
 */
export declare const getGuirGlobalConfig: () => ReturnType<{
    globalConfig: GlobalConfig['guir'];
}>;
/**
 * Prints help text
 */
export declare const guirHelper: ({ template, isEmpty, isError, }: {
    template: string;
    isEmpty?: boolean | undefined;
    isError?: boolean | undefined;
}) => void;
/**
 * Return the commands supplied to guir and follwing values.
 */
export declare const getGuirCommand: GuirNS.GetCommand;
/**
 * Checks arguments length
 */
export declare const isArgsEmpty: (args: Args) => boolean;
/**
 * Matches the given argument against a regex
 */
export declare const getMatchedArg: (arg: string, regex: RegExp | string) => ReturnType<{
    match: string;
}>;
/**
 * Contains utility methods for working with a component
 */
export declare class Component {
    /**
     * Returns the component name in pascal case
     */
    static getComponentName(componentName: string): string;
    /**
     * Returns component's screen component name
     */
    static getScreenComponentName(componentName: string, screen: GuirNS.ScreenType): string;
    /**
     * Returns component's screen file name
     */
    static getScreenFilename(componentName: string, screen: GuirNS.ScreenType, extension?: boolean): string;
    /**
     * Returns component's file name
     */
    static getComponentFilename(componentName: string, extension?: boolean): string;
}
/**
 * For generating component and subcomponent templates
 */
export declare class Template {
    static getIndexFileTemplate(componentName: string): string;
    /**
     * Generates and returns the component's file content
     */
    static getComponentTemplate(componentName: string, screens: Array<GuirNS.ScreenType>): string;
    /**
     * Generates and returns the component's screen component's file content
     */
    static getScreenTemplate(componentName: string, screen: GuirNS.ScreenType): string;
    /**
     * Generate screen directory's index file
     */
    static getScreenIndexTemplate(componentName: string, screens: Array<GuirNS.ScreenType>): string;
}
/**
 * CRUD operation on the component map.
 * 1. Add a component
 * 2. Remove a component
 * 3. Updates name
 * 4. Update path
 */
export declare class GuirMap {
    /**
     * Gets the file path
     */
    static getFilePath(): string;
    /**
     * Creates the map file
     */
    static createFile(path: string): ReturnType;
    /**
     * Reads and return the map config (parsed).
     * Create a new file if not present.
     */
    static getMap(): ReturnType<{
        map: GuirNS.GuirMapConfig;
    }>;
    /**
     * Creates map-specific config
     */
    static pushToMap(map: GuirNS.GuirMapConfig, config: GuirNS.GuirMapConfigNode): GuirNS.GuirMapConfig & {
        [x: string]: GuirNS.GuirMapConfigNode;
    };
    /**
     * Pushes the config to the map file
     */
    static writeMap(map: GuirNS.GuirMapConfig): ReturnType;
    static addComponent(config: GuirNS.GuirMapConfigNode): ReturnType;
    static hasComponent(component: string): ReturnType;
    static getComponentPath(component: string): ReturnType<{
        path: string;
    }>;
    static getComponentAbsPath(component: string): ReturnType<{
        path: string;
    }>;
}
