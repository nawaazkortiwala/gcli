"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guirAddOptionShortHand = exports.guirAddRegex = void 0;
const guir_config_1 = require("../../guir.config");
exports.guirAddRegex = Object.assign(Object.assign({}, guir_config_1.guirRegex), { boolOptions: {
        bare: /^(\-b|\-\-bare)$/,
        override: /^(\-o|\-\-override)$/,
    }, valueOptions: {
        path: {
            flag: /^(\-p|\-\-path)$/,
            value: /^(\.\/)?(([a-zA-z_]+[0-9-.]*[a-zA-z_]*)(\/)?)+$/,
        },
        screens: {
            flag: /^(\-s|\-\-screens)$/,
            value: new RegExp(`^(${guir_config_1.guirScreens.map((screen) => screen).join('|')}):(${guir_config_1.guirScreens
                .map((screen) => screen)
                .join('|')})$`), // basically -> /^(xs|sm|md|lg|xl):(xs|sm|md|lg|xl)$/
        },
        screenSelective: {
            flag: /^(\-ss|\-\-screenSelective)$/,
            value: `^(${guir_config_1.guirScreens.map((screen) => screen).join('|')})\\s*(,\\s*(${guir_config_1.guirScreens
                .map((screen) => screen)
                .join('|')}))*$`,
        },
        component: {
            flag: /^(\-c|\-\-component)$/,
            value: /^[a-zA-z_]+[\w\W.-]*$/,
        },
    } });
exports.guirAddOptionShortHand = ['b', 'o', 'p', 's', 'c', 'ss'];
