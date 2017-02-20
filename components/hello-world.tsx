import { NerdyElement, NerdyTemplate, BindingFunction, createElement, customElement } from './nerdy-components';

@customElement
export default class HelloWorld extends NerdyElement {

    public static counter = 0;

    public static get nerdyTemplate() {
        return NerdyTemplate.define(HelloWorld, ($: BindingFunction = BindingFunction.Polymer) => (
            <template class="class" id='hello-world-component-nerdy-template'>
                <h1 id={$`id`} onclick={$`clickHandler`}>{(this as any).name} {$`counter`}</h1>
                <pre><b>> </b>{$`message`}</pre>
            </template>
        ));
    }

    public static test() {
        const className = this.name, tagName = this.is, container = document.createElement('div');
        container.appendChild(<pre style="background: rgb(255, 192, 0); display: block; padding: 1em; border-radius: 0.25em;">This has only been reliably tested in Chrome (56.0.2924.87)</pre>);
        container.innerHTML = container.innerHTML + `<${tagName} message="this element was created by appending <${tagName} ...></${tagName}> to a <div></div>"></${tagName}>`;
        const elements = {
            declared: container.getElementsByTagName(tagName)[0],
            transpiled: <this message={`this element was transpiled from tsx using <${className} ...></${className}>`}></this>,
            created: Object.assign(document.createElement(tagName), { message: `this element was created by calling document.createElement('${tagName}')` }),
            constructed: (new this()).assign({ message: `this element was created by calling new ${className}()` }),
        };

        console.info(`${className}::test()`, {
            '[class.constructor]': this, '[class.prototype]': this.prototype,
            '[element.prototype]': window.customElements.get(tagName),
            '[elements]': elements,
        });

        for (const key of Object.keys(elements)) if (elements[key] instanceof HTMLElement) container.appendChild(elements[key]); // if (elements[key])

        document.body.appendChild(container);
    }

    public message: string;
    public counter: number = ((this.constructor as any).counter = ((this.constructor as any).counter || 0) + 1);

    public attached() {
        console.log(`${this.constructor.name}#attached()!`, this);
    }

    public clickHandler() {
        console.log(`${this.constructor.name}#clickHandler`, { arguments, this: this }, this);
    }

}

HelloWorld.test();
