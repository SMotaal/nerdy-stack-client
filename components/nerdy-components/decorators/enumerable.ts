/**
 * @enumerable decorator that sets the enumerable property of a class field to false.
 * @param value true|false
 */
export function enumerable(value: boolean) {
    return (target: any, property: string) => {
        const descriptor = Object.getOwnPropertyDescriptor(target, property) || {};
        // tslint:disable-next-line:triple-equals
        if (descriptor.enumerable != value) Object.defineProperty(target, property, { ...descriptor, enumerable: (value = !!value) });
        // console.info('@enumerable', { target, property, enumerable: value });
    };
}

export namespace enumerable {
    export const off = enumerable(false);
    export const on = enumerable(true);
}

export default enumerable;
