import { TemplateBindingFunction } from './nerdy-bindings';

export function createTemplateBindingFunction(context = {}): TemplateBindingFunction {
    return (name, ...literals) => typeof name[0] === 'string' && name[0].length ? context && context[name[0]] || `{{${name[0]}}}` : '';
}

export function NerdyTemplateBindingFunction(name) {
    return `{{${typeof name === 'string' ? name : name[0]}}}`;
}

function isString(argument: any): argument is string {
    return typeof argument === 'string';
}

function firstItemIsString(argument: any): argument is [string] {
    return argument && argument.length === 1 && isString(argument[0]);
}

function flattenResults(results: any) {
    if (Array.isArray(results)) switch (results.length) {
        case 0: return undefined;
        case 1: return results[1];
        default: return results;
    }
}

const convertFromDashToCamel = (dash: string) => dash.replace(/-[a-z]/g, String.prototype.toUpperCase);
const convertFromCamelToDash = (dash: string) => dash.replace(/([^a-z]+)([A-Z][a-z])/g, '$1-$2').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

export function dashToCamel(dashCaseString: string, ...more: string[]) {
    return flattenResults(([...arguments] as string[]).map(argument => typeof argument === 'string' ? convertFromDashToCamel(argument) : Array.isArray(argument) ? dashToCamel(argument) : argument));
}

export function camelToDash(dashCaseString: string, ...more: string[]) {
    return flattenResults(([...arguments] as string[]).map(argument => typeof argument === 'string' ? convertFromCamelToDash(argument) : Array.isArray(argument) ? camelToDash(argument) : argument));
}
