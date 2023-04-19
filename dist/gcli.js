"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gcli_utils_1 = require("./gcli.utils");
const guir_1 = __importDefault(require("./commands/guir/guir"));
function gcli() {
    const baseCommand = (0, gcli_utils_1.getBaseCommand)();
    switch (Object.keys(baseCommand)[0]) {
        case 'guir':
            (0, guir_1.default)(baseCommand.guir);
            break;
        case 'gpm':
        default:
            return (function helper() {
                console.log('[gcli]: Show help');
            })();
    }
}
exports.default = gcli;
