"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guir_add_1 = require("./commands/guir-add");
const guir_remove_1 = __importDefault(require("./commands/guir-remove/guir-remove"));
const guir_store_1 = __importDefault(require("./guir.store"));
const guir_utils_1 = require("./guir.utils");
function guir(args) {
    /**
     * Acquire global config or quit
     */
    const { error, globalConfig } = (0, guir_utils_1.getGuirGlobalConfig)();
    if (error)
        return (0, guir_utils_1.guirHelper)({ template: 'Could not load config file', isError: true });
    /**
     * Set global config to store
     */
    guir_store_1.default.setState({ globalConfig });
    const command = (0, guir_utils_1.getGuirCommand)(args);
    const commandArgs = args.slice(1);
    switch (Object.keys(command)[0]) {
        case 'add':
            (0, guir_add_1.guirAdd)(commandArgs);
            break;
        case 'remove':
            (0, guir_remove_1.default)(commandArgs);
            break;
        default:
            return (0, guir_utils_1.guirHelper)({ template: 'Show help', isEmpty: true });
    }
}
exports.default = guir;
