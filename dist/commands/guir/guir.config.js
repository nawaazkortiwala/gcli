"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guirScreenOrder = exports.guirRegex = exports.guirNestedComponentDirName = exports.guirScreenDirName = exports.guirScreens = exports.guirComponentMapFilename = exports.guirCommandKeys = void 0;
exports.guirCommandKeys = [
    'add',
    'desc',
    'list',
    'move',
    'remove',
    'rename',
];
exports.guirComponentMapFilename = '.guir-map';
exports.guirScreens = ['xs', 'sm', 'md', 'lg', 'xl'];
exports.guirScreenDirName = 'screens';
exports.guirNestedComponentDirName = 'components';
exports.guirRegex = {
    component: /^[a-zA-z_]+[\w\W.-]*$/,
};
exports.guirScreenOrder = {
    xs: 0,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
};
