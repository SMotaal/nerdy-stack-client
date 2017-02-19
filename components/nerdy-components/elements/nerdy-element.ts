import './polymer-element';
import Template, { BindingFunction, PolymerBindingFunction as $ } from '../templates';
import { enumerable } from '../decorators';
import { NerdyElementConstructor, NerdyElementPrototype } from './nerdy-elements';
import { getAttributesObject } from './nerdy-elements-helpers';

export class NerdyElement extends Polymer.Element {

    public static elements = {};
    public static nerdyTemplate?: Template<any>;

    public static define(constructor: NerdyElementConstructor) {

        const constructorName = constructor && ((constructor as any).name || (constructor as any).displayName) || typeof constructor;

        if (!NerdyElement.isConstructor(constructor)) throw new Error(`Expected a constructor of a NerdyElement in order to define an element, but got ${constructorName} instead.`);

        const tagName = constructor.is;
        const tagNameAvailable = !(tagName in NerdyElement.elements);
        const customElementNameAvailable = window.customElements.get(tagName) === undefined;
        const alreadyDefined = !tagNameAvailable && NerdyElement.elements[tagName] === constructor;

        // Check tagName
        if (tagNameAvailable && customElementNameAvailable) {
            let element;
            try {
                element = document.createElement(tagName);
            } catch (exception) {
                throw new Error(`Cannot define this NerdyElement since the tag name ${tagName} is not valid in the current runtime environment. ${exception.message}`);
            }
        } else if (!tagNameAvailable) {
            throw new Error(`Cannot define this NerdyElement since the tag name ${tagName} is already used to define another NerdyElement.`);
        } else if (!customElementNameAvailable) {
            throw new Error(`Cannot define this NerdyElement since the tag name ${tagName} is already used to define another custom element in the document.`);
        }

        if (alreadyDefined) return;

        if (tagName in NerdyElement.elements) throw new Error(`Cannot define NerdyElement since the tag name '${tagName}' returned by ${constructorName}.is has already been used to define another element. In order to resolve this, you might want to rename the class of one of the elements, or if you prefer to not rename the actual classes, simply set the static is property on either class to use a different tag name.`);

        if (customElementNameAvailable) {
            try {
                window.customElements.define(constructor.is, constructor);
            } catch (exception) {
                throw new Error(`Cannot register this NerdyElement as a custom element in the current runtime environment. ${exception.message}`);
            }
        }

        NerdyElement.elements[tagName] = constructor;

        window.customElements.whenDefined(tagName).then(() => {
            if (window.customElements.get(tagName) !== NerdyElement.elements[tagName]) {
                throw new Error(`NerdyElement: Unexpected mismatch between the NerdyElement registry and the custom element registry for the tag ${tagName}, which can be caused by another custom element racing to be registered using the same tag name and that might result in serious conflicts, or it could be due to some "Web Components" framework or polyfills applying mixins to the original element and that is also can cause unexpected behaviour. Please notify the adiministrators that they should verify that there are no resulting security vulnerabilities.`);
            }
        });

    }

    public static set observedAttributes(attributes) {
        if (this === NerdyElement) return;
        Object.defineProperty(this, 'observedAttributes', {
            value: attributes,
        });
    }

    public static set is(name) {
        if (this === NerdyElement) return;
        Object.defineProperty(this, 'is', {
            value: name,
        });
    }

    public static get is(): string {
        if (this === NerdyElement) return;
        return Object.defineProperty(this, 'is', { value: this.name.replace(/([^a-z]+)([A-Z][a-z])/g, '$1-$2').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() }) && this.is;
    }

    public static get template(): HTMLTemplateElement {
        if (this === NerdyElement) return;
        return this.nerdyTemplate && this.nerdyTemplate.template;
    }

    /**
     *
     *
     * @protected
     * @type {{[name:string]: string}}
     * @memberOf NerdyElement
     */
    // @enumerable.off
    public propertyLookup: { [name: string]: string };

    constructor() {
        super() && typeof this.created === 'function' && this.created();
        this.propertyLookup = {};
    }

    ready() {
        super.ready();
        if (this.attributes.length) this.setProperties(getAttributesObject(this));
    }

    public created?(): void;
    public attached?(): void;
    public detatched?(): void;
    public adopted?(): void;
    public attributeChanged?(attribute: string, oldValue: any, newValue: any): void;

    @enumerable.off
    public connectedCallback() {
        super.connectedCallback(), typeof this.attached === 'function' && this.attached();
    }

    @enumerable.off
    public disconnectedCallback() {
        super.disconnectedCallback(), typeof this.detatched === 'function' && this.detatched();
    }

    @enumerable.off
    public adoptedCallback() {
        super.adoptedCallback(), typeof this.adopted === 'function' && this.adopted();
    }

    @enumerable.off
    public attributeChangedCallback(attribute: string, oldValue: any, newValue: any) {
        super.attributeChangedCallback(attribute, oldValue, newValue), typeof this.attributeChanged === 'function' && this.attributeChanged(attribute, oldValue, newValue);
    }

    @enumerable.off
    assign(...values: Array<{ [name: string]: any }>) {
        return Object.assign(this, ...values);
    }

    /**
     * Goes through each key of the properties parameter and
     * tries to find the best named property match using the
     * findPropertyName method.
     *
     * @param {{ [name: string]: any }} properties
     *
     * @memberOf NerdyElement
     */
    @enumerable.off
    setProperties(properties: { [name: string]: any }) {
        for (const name of Object.keys(properties)) {
            const property = this.findPropertyName(name);
            if (property) this[property] = properties[name];
        }
    }

    @enumerable.off
    getPropertyNames() {
        // TODO: we need a better strategy to populate property names
        return Object.getOwnPropertyNames(this); // Object.keys(this);
    }

    @enumerable.off
    findPropertyName(name: string) {
        // Abort if passed an invalid name
        if (typeof name !== 'string' || (name = name.trim()).length === 0) return;

        // Return property if name exactly matches
        if (name in this) return name;

        // Convert name to stripped-lowercased format
        const simpleName = name.replace(/[\-\s]/g, '').toLowerCase();

        // Return previously matched name using the cached lowercase map
        if (simpleName in this.propertyLookup) return this.propertyLookup[simpleName];

        // Prepare to do some introspection
        const properties = Object.keys(this);

        // If name is dash cased then do a lowercase match against the dedashed name
        if (/\w\-\w/.test(name)) {
            const property = Object.keys(this).find((name, index) => name.toLowerCase() === simpleName);
            if (property) return (this.propertyLookup[simpleName] = property);
        }

        // All basis are covered so we must return undefined because we have no more candidates
        return (this.propertyLookup[simpleName] = undefined);
    }

}

export namespace NerdyElement {
    export function isConstructor(object: any): object is NerdyElementConstructor {
        return typeof object === 'function' && object.is && typeof object.is === 'string';
    }
}

export default NerdyElement;
