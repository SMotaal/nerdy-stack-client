export * from './templates/nerdy-template';

import NerdyTemplate from './templates/nerdy-template';

export type BindingFunction = NerdyTemplate.BindingFunction;
export const BindingFunction = NerdyTemplate.BindingFunction;

export const { PolymerBindingFunction } = NerdyTemplate;

export default NerdyTemplate;
