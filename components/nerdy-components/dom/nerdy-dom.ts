import { NerdyElementConstructor } from '../elements'; // import { pretty } from "js-object-pretty-print";

export class NerdyDOM {

    public static activeDocument; // = typeof window !== 'undefined' && 'document' in window && window.document;
    public static activeDOM; // = new NerdyDOM();

    public static get createElementFromTagName() {
        if (NerdyDOM.activeDOM) return NerdyDOM.activeDOM.createElementFromTagName;
    }

    public static get createElementFromClass() {
        if (NerdyDOM.activeDOM) return NerdyDOM.activeDOM.createElementFromClass;
    }

    public static get createErrorElement() {
        if (NerdyDOM.activeDOM) return NerdyDOM.activeDOM.createErrorElement;
    }

    public static get createWrappedElement() {
        if (NerdyDOM.activeDOM) return NerdyDOM.activeDOM.createWrappedElement;
    }

    public static get convertToElement() {
        if (NerdyDOM.activeDOM) return NerdyDOM.activeDOM.convertToElement;
    }

    public static get createElement() {
        if (NerdyDOM.activeDOM) return NerdyDOM.activeDOM.createElement;
    }

    public static get applyAttributes() {
        if (NerdyDOM.activeDOM) return NerdyDOM.activeDOM.applyAttributes;
    }

    public static get insertChild() {
        if (NerdyDOM.activeDOM) return NerdyDOM.activeDOM.insertChild;
    }

    public static get insertChildren() {
        if (NerdyDOM.activeDOM) return NerdyDOM.activeDOM.insertChildren;
    }

    // public stackTracks: any[][] = [];
    // public stackTrack: any[] = [];

    public document: Document;

    constructor(targetDocument: Document = NerdyDOM.activeDocument) {
        this.document = targetDocument;
        for (const method of ['createElementFromTagName', 'createElementFromClass', 'createErrorElement', 'createWrappedElement', 'convertToElement', 'convertToElement', 'convertToElement', 'createElement', 'applyAttributes', 'insertChild', 'insertChildren']) this[method] = this[method].bind(this);
        console.log('NerdyDOM', { this: this, targetDocument, arguments });
    }

    createElementFromTagName(tag: string): HTMLElement | undefined {
        try {
            return this.document.createElement(tag);
        } catch (exception) {
            exception.message = `Error executing createElementFromTagName(${typeof tag === 'string' ? tag : typeof (tag)}): ${exception.message}`;
            return exception; // this.stackTrack.push(exception);
        }
    }

    createElementFromClass(tag: NerdyElementConstructor): HTMLElement | undefined {
        try {
            return new tag();
        } catch (exception) {
            exception.message = `Error executing createElementFromClass(${tag.name || (tag.prototype && tag.prototype.name) || tag.is || tag}): ${exception.message}`;
            return exception; // this.stackTrack.push(exception);
        }
    }

    createErrorElement(exception: Error | string, ...contents: any[]) {
        const message = (typeof exception === 'string' ? exception : typeof exception.message === 'string' ? exception.message : '').trim();
        const header = `Error: ${message.length ? message : 'Unknown Exception'}`;
        // const body = contents.reduce((item, body) => body + (typeof item !== 'undefined' ? ('\n' + pretty(item) + '\n') : ''), '').trim();
        const body = contents.reduce((item, body) => body + (typeof item !== 'undefined' ? ('\n' + item + '\n') : ''), '').trim();
        const element = this.document.createComment(`Error: ${message.length ? message : 'Unknown Exception' + contents}`);
        return element;
    }

    convertToElement(value: any) {
        if (value === undefined) return this.document.createTextNode('UNDEFINED');
        else if (value === null) return this.document.createTextNode('NULL');
        else if (typeof value === 'object' && value instanceof HTMLElement) return value;
        else switch (typeof value) {
            case 'string': return this.document.createTextNode(`"${value}"`);
            case 'number': return this.document.createTextNode(`${value}`);
            case 'boolean': return this.document.createTextNode(value === true ? 'TRUE' : 'FALSE');
            default: return this.document.createTextNode(value); //pretty(
        }
    }

    createWrappedElement(...contents: any[]) {
        const wrapper = this.document.createElement('template');
        if (contents[0] instanceof Error) wrapper.appendChild(this.createErrorElement(contents.shift(), contents));
        else for (const child of contents) wrapper.appendChild(this.convertToElement(child));
    }

    applyAttributes(element: HTMLElement, attributes: { [name: string]: any } = {}) {
        try {
            if (typeof attributes === 'object' && 'setAttribute' in element) for (const name in attributes) element.setAttribute(name, attributes[name]); // tslint:disable-line
        } catch (exception) {
            exception.message = `Error executing applyAttributes(): ${exception.message}`;
            console.error(exception); // this.stackTrack.push(exception);
        }
    }

    insertChild(element: HTMLElement | DocumentFragment, child: any) {
        if (typeof child === 'string') element.appendChild(this.document.createTextNode(child));
        else if (child instanceof HTMLElement) element.appendChild(child);
    }

    insertChildren(element: HTMLTemplateElement | HTMLElement | DocumentFragment, ...children: any[]) {
        const parent = typeof element !== 'object' || !(element instanceof HTMLElement) ? null : element instanceof HTMLTemplateElement ? element.content : element;
        if (!parent) throw new TypeError(`Elements can only be inserted into elements that inherit from HTMLElement or HTMLTemplateElement`);
        typeof children === 'string' ? this.insertChild(parent, children) : children.forEach(child => this.insertChild(parent, child)); // console.log('CHILDREN', children);
    }

    createElement(tag: string | NerdyElementConstructor, attributes: { [name: string]: any } = {}, ...children: HTMLElement[]) {

        try { // this.stackTracks.push(this.stackTrack = [{ tag, attributes, children }]);

            // Create new instance of element
            const element = typeof tag === 'string' ? this.createElementFromTagName(tag) : this.createElementFromClass(tag);

            // If create fails, create a wrapped element from the error for debugging
            if (element instanceof Error) return this.createErrorElement(element, { tag, attributes, children }); // , ...this.stackTrack);

            // Apply attributes to element
            if (attributes && Object.keys(attributes).length) this.applyAttributes(element, attributes);

            // Insert children into element
            if (children.length) this.insertChildren(element, ...children);

            // Return element // console.log('createElement', { tag, attributes, children, arguments, this: this, element });
            return element;
        } catch (exception) {
            console.error(exception); // this.stackTrack.push(exception);
        }
    }

}

if (!NerdyDOM.activeDocument) NerdyDOM.activeDocument = document; // window typeof window !== 'undefined' && 'document' in window && window.document;
if (!NerdyDOM.activeDOM) NerdyDOM.activeDOM = new NerdyDOM();

export default NerdyDOM;
