import { Args, ReturnType } from '../../gcli.types';
export declare namespace GuirNS {
    type GlobalConfig = {
        rootDir: string;
    };
    type GuirMapConfigNode = {
        name: string;
        path: string;
        component: string;
    };
    type GuirMapConfig = Record<string, GuirMapConfigNode>;
    type CommandKey = 'add' | 'list' | 'desc' | 'move' | 'remove' | 'rename';
    type Command = Record<CommandKey, Args>;
    type GetCommand = (args: Array<CommandKey>) => Partial<Command>;
    type Store = {
        globalConfig: GlobalConfig;
    };
    enum ScreenTypeEnum {
        xs = "xs",
        sm = "sm",
        md = "md",
        lg = "lg",
        xl = "xl"
    }
    type ScreenType = `${GuirNS.ScreenTypeEnum}`;
    type GuirAdd = (args: Args) => ReturnType;
    type GuirRemove = (args: Args) => ReturnType;
}
