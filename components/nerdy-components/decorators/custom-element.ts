
export function customElement(constructor: Function & { is: string });
export function customElement(tagName?: string);
export function customElement(argument: string | (Function & { is: string })) {
    let tagName = typeof argument === 'string' ? argument : undefined;
    if (typeof argument === 'function') customElement.registerElement(tagName = customElement.getTagName(argument), argument);
    else return (constructor: Function) => customElement.registerElement(tagName, constructor);
}

export namespace customElement {
    export function getTagName(constructor: Function) {
        if (typeof constructor['is'] === 'string' && constructor['is'].trim().length) constructor['is'].trim();
        if (typeof constructor.name === 'string' && constructor.name.trim().length) return constructor.name.trim().replace(/([^a-z]+)([A-Z][a-z])/g, '$1-$2').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        throw new Error(`Cannot getTagName from the '${constructor.name}' constructor since it does not have the 'is' property defined`);
    }
    export function registerElement(tagName, constructor) {
        if (window.customElements.get(tagName)) throw new Error(`Cannot auto-register custome element since the name ${tagName} is already defined`);
        window.customElements.define(tagName, constructor);
        console.info('@customElement::registerElement', { tagName, constructor });
    }


}

export default customElement;

