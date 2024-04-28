/**
 * @typedef {Object} GenerateApi
 * @property {string} target
 * @property {any} context 
 * @property {import('./layer-fs/layer-fs.mjs').LayerFs} fs
 * @property {Symbol} skip
 * @property {Symbol} remove
 */

/**
 * @typedef {Object} ContextApi
 * @property {string} target
 * @property {any} context 
 * @property {any} root 
 * @property {import('./layer-fs/layer-fs.mjs').LayerFs} fs
 */

/**
 * @typedef {(api: GenerateApi) => Promise<string | Symbol>} Generator
 */

/**
 * @typedef {(api: ContextApi) => Promise<any>} Context
 */