import { Command } from 'commander';
import { templatePath } from '../utils/fs.mjs';
import { generate } from '../generator/generator.mjs';
import { Context } from '../generator/context/context.mjs';
import { createLayerFs } from '../layer-fs/layer-fs.mjs';

const generateCmd = new Command('generator');
generateCmd.alias('g');
generateCmd.argument('<name>', 'name of the generator');
generateCmd.argument('[target]', 'target directory');

generateCmd.action(async (name, target = process.cwd()) => {
  const fs = createLayerFs();
  const context = new Context({
    fs,
    cwd: templatePath,
  });

  await generate({
    name,
    target,
    context,
  });

  const changes = fs.getChanges();

  await fs.apply(process.cwd());
});

export { generateCmd };