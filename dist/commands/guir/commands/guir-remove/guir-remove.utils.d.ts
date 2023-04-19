import { ReturnType } from '../../../../gcli.types';
import { GuirNS } from '../../guir.types';
export declare class RemoveComponent {
    componentName: string;
    path: string;
    constructor(componentName: string);
    setComponentPath(): void;
    validateComponentPath(): void;
    getMap(): ReturnType<{
        map: GuirNS.GuirMapConfig;
    }>;
    removeComponentDirectory(): void;
    removeRecursivelySubComponents(map: GuirNS.GuirMapConfig, componentName: string): ReturnType;
    updateMapFile(map: GuirNS.GuirMapConfig): void;
    remove(): ReturnType;
}
export declare const getRemoveConfirmation: () => ReturnType<{
    shouldRemove: boolean;
}>;
