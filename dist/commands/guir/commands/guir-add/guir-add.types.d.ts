export declare namespace GuirAddNS {
    enum OptionKeysEnum {
        bare = "bare",
        override = "override",
        path = "path",
        screens = "screens",
        screenSelective = "screenSelective",
        component = "component"
    }
    type BoolOptionsMap = {
        [OptionKeysEnum.bare]: boolean;
        [OptionKeysEnum.override]: boolean;
    };
    type ValueOptionMap = {
        [OptionKeysEnum.path]: string;
        [OptionKeysEnum.screens]: string;
        [OptionKeysEnum.screenSelective]: string;
        [OptionKeysEnum.component]: string;
    };
    type OptionMap = {
        boolOptions: GuirAddNS.BoolOptionsMap;
        valueOptions: GuirAddNS.ValueOptionMap;
    };
}
