"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zustand_1 = require("zustand");
const store = (0, zustand_1.create)(() => ({
    globalConfig: {
        rootDir: '',
    },
}));
exports.default = store;
