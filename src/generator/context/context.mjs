import { dirname, join, resolve } from "node:path";
import { existsSync } from "node:fs";

const CONTEXT_FILENAME = "context.gen.mjs";

/**
 * @typedef {Object} ContextOptions
 * @property {string} cwd
 * @property {import('../../layer-fs/layer-fs.mjs').LayerFs} fs
 */
class Context {
  /** @type {ContextOptions} */
  #options;
  #cache = new Map();
  #responses = new Map();

  constructor(options) {
    this.#options = options;
  }

  get cwd() {
    return this.#options.cwd;
  }

  get fs() {
    return this.#options.fs;
  }

  /**
   * 
   * @param {string} start 
   * @param {string} end 
   */
  get = async (start, target = undefined, end = this.cwd) => {
    const contexts = [];
    const fileTarget = resolve(start);
    let currentLocation = dirname(fileTarget);

    while (currentLocation !== "/" && currentLocation !== end) {
      const contextLocation = join(currentLocation, CONTEXT_FILENAME);
      if (!existsSync(contextLocation)) {
        currentLocation = dirname(currentLocation);
        continue;
      }
      if (!this.#cache.has(contextLocation)) {
        const importedContext  = await import(contextLocation);
        this.#cache.set(contextLocation, importedContext);
      }
      const currentContext = this.#cache.get(contextLocation);
      contexts.push(currentContext.createContext);
      if (!currentContext.next) {
        break;
      }
      currentLocation = dirname(currentLocation);
    }

    const context = contexts
      .reverse()
      .reduce(async (acc, context) => {
        if (!this.#responses.has(context)) {
          const currentValue = await context({
            context: await acc,
            fs: this.fs,
            target: fileTarget,
            root: target,
          });
          this.#responses.set(context, currentValue);
        }
        return {
        ...await acc,
        ...this.#responses.get(context),
        }
      }, {});

    return await context;
  }
}

export { Context, CONTEXT_FILENAME };