import { basename, dirname, join, relative, resolve } from 'node:path';
import glob from 'fast-glob';
import ejs from 'ejs';
import Handlebars from 'handlebars';
import { CONTEXT_FILENAME } from './context/context.mjs';
import { readFile } from 'node:fs/promises';

const skip = Symbol('skip');
const remove = Symbol('remove');

const getPath = (target, context) => {
  const path = Handlebars.compile(target)({context});
  return path;
};
/**
 * @typedef {Object} GenerateOptions
 * @property {string} name
 * @property {string} target
 * @property {import('../context/context.mjs').Context} context
 */

/**
 * @param {string} file
 * @param {GenerateOptions} options 
 */
const generateFile = async (file, options) => {
  const { name, target, context } = options;
  if (basename(name) === CONTEXT_FILENAME) {
    return;
  }
  const currentContext = await context.get(file, target);

  if (name.endsWith('.gen.mjs')) {
    const targetLocation = getPath(join(target, name.slice(0, -8)), currentContext);
    const { generate } = await import(file);
    const result = await generate({
      fs: context.fs,
      target: targetLocation,
      context: currentContext,
      skip,
      remove,
    });
    if (result === skip) {
      return;
    }
    if (result === remove) {
      await context.fs.rm(targetLocation);
      return;
    }
    await context.fs.writeFile(targetLocation, result); 
    return;
  }

  if (name.endsWith('.gen.ejs')) {
    const targetLocation = getPath(join(target, name.slice(0, -8)), currentContext);
    const template = await readFile(file, 'utf-8');
    const config = {
      override: true,
    };
    const result = await ejs.render(template, {
      context: currentContext,
      config,
    });
    if (!config.override && await context.fs.existsSync(targetLocation)) {
      return;
    }
    await context.fs.writeFile(targetLocation, result); 
    return;
  }

  files:{
    const content = await readFile(file);
    const targetLocation = getPath(join(target, name), currentContext);
    await context.fs.writeFile(targetLocation, content);
  }
}


/**
 * @param {GenerateOptions} options 
 */
const generate = async (options) => {
  const { name, context } = options;
  const location = resolve(context.cwd, name);
  const files = await glob(join(location, '**/*'), { onlyFiles: true, dot: true });
  for (const file of files) {
    const relativeLocation = relative(join(context.cwd, name), file);
    await generateFile(file, { ...options, name: relativeLocation});
  }
}

export { generate, skip };