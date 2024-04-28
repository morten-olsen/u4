import { join } from 'path';
import prompt from 'prompt';

/** @type { import('../../src/types.mjs').Context } */
const createContext = async ({ fs, root, target, context }) => {
  let prefix = context.prefix;

  const pkgLocation = join(root, 'package.json');
  if (fs.existsSync(pkgLocation)) {
    const pkg = JSON.parse(await fs.readFile(pkgLocation));
    prefix = pkg.u4?.prefix;
  }

  if (!prefix) {
    throw new Error('prefix is required');
  }

  const { name } = await prompt.get({
    properties: {
      name: {
        description: 'Enter name for mono-pkg',
        type: 'string',
        required: true,
      },
    },
  });


  return {
    prefix,
    name,
  };
};

export { createContext };
