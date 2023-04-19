export declare type GlobalConfig = {
    guir?: {
        rootDir: string;
    };
};
export declare type Args = Array<string>;
export declare type BaseCommandKey = 'gpm' | 'guir';
export declare type BaseCommands = {
    [key in BaseCommandKey]: Args;
};
export declare type GetBaseCommands = () => Partial<BaseCommands>;
export declare type Log = (message: any) => void;
export declare type LogError = (error: string | Error) => void;
export declare type ReturnType<T extends object = {}> = {
    error?: boolean;
} & Partial<T>;
export declare type AssertType<T> = {
    error?: boolean;
} & T;
