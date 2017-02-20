export function getAttributesObject(source: HTMLElement | NamedNodeMap): { [name: string]: any } {
    const attributes = source && ((source instanceof NamedNodeMap && source) || (source instanceof HTMLElement && source.attributes));
    return attributes ? Array.from(attributes).reduce((object, attribute) => (object[attribute.name] = attribute.value, object), {}) : undefined;
}
