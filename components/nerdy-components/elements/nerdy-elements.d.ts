import { NerdyElement } from './nerdy-element';

export declare interface NerdyElementConstructor {
    new (): HTMLElement | any;
    is?: string;
}

export declare interface NerdyElementPrototype {
    constructor: (...args: any[]) => NerdyElement;
}
