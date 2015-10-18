'use strict';

/**
 * jQuery plugins repository
 *
 * @type {exports}
 */
import factory from '../plugin/object-factory.js';
// modules of plugins
import componentOverlay from './component-overlay.js';


export function init() {
    factory('umyComponentOverlay', componentOverlay);
}
