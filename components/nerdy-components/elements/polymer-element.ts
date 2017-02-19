/// <reference path= '../@types/polymer.d.ts' />

if (window) {
    let goog = (window as any).goog = (window as any).goog || {};
    let reflect = goog.reflect = goog.reflect || {};
    reflect.objectProperty = (s, o) => s;

    // TODO: Figure out how to link import polymer before loading component
    // tslint:disable-next-line:no-var-requires
    require('../../../bower_components/polymer/polymer-element.html');
};
