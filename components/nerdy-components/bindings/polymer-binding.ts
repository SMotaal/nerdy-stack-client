import { TemplateBindingFunction } from './nerdy-bindings';

export const PolymerTemplateBindingFunction: TemplateBindingFunction = (name) => `{{${typeof name === 'string' ? name : name[0]}}}`;
