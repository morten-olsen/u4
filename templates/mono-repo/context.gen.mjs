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
    const response = await prompt.get({
      properties: {
        prefix: {
          description: 'Enter prefix for mono-repo',
          type: 'string',
          required: true,
        },
      },
    });
    prefix = response.prefix;
  }


  return {
    prefix,
  };
};

export { createContext };