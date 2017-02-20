import * as DOM from '../dom';
import { TemplateBindingFunction, PolymerTemplateBindingFunction, createTemplateBindingFunction } from '../bindings';

export class NerdyTemplate<Prototype> {
    public static define(component: (typeof HTMLElement | any) & { template?: NerdyTemplate<any> | any, _template?: HTMLTemplateElement }, template: HTMLTemplateElement | (($?: TemplateBindingFunction) => HTMLTemplateElement)) {
        return new NerdyTemplate(component, template);
    }

    public static get createElement() { return DOM.createElement; }
    public static get applyAttributes() { return DOM.applyAttributes; }
    public static get insertChildren() { return DOM.insertChildren; }

    public viewModel: Prototype;
    public template: HTMLTemplateElement;

    constructor(component: Prototype, template: HTMLTemplateElement | (($?: TemplateBindingFunction) => HTMLTemplateElement)) {
        this.template = typeof template === 'function' ? template() : template;
    }

}

export namespace NerdyTemplate {
    export declare type BindingFunction = TemplateBindingFunction;
    export const PolymerBindingFunction = PolymerTemplateBindingFunction;

    export namespace BindingFunction {
        export const Polymer = NerdyTemplate.PolymerBindingFunction;
        export const create = createTemplateBindingFunction;
    }
}

export default NerdyTemplate;
