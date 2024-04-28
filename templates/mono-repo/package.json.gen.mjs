import { getPackageVersion } from '../../src/utils/npm.mjs';

/** @type { import('../../src/types.mjs').Generator } */
const generate = async ({ context, target,fs }) => {
  const pkg = {
    name: `${context.prefix}-repo`,
    version: '0.0.1',
    type: 'module',
    private: true,
    workspaces: [
      'packages/*',
    ],
    scripts: {
      build: 'turbo build',
      dev: 'tsc -b -w',
    },
  };

  if (fs.existsSync(target)) {
    const currentPkg = JSON.parse(await fs.readFile(target));
    Object.assign(pkg, currentPkg);
  }

  pkg.u4 = {
    ...pkg.u4,
    type: 'mono-repo',
    prefix: context.prefix,
  };

  pkg.dependencies = {
    ...pkg.dependencies,
    'turbo': await getPackageVersion('turbo'),
    'typescript': await getPackageVersion('typescript'),
    '@types/node': await getPackageVersion('@types/node'),
    '@types/node': await getPackageVersion('@types/node'),
    '@react-native-community/eslint-config': await getPackageVersion('@react-native-community/eslint-config'),
    eslint: await getPackageVersion('eslint'),
    prettier: await getPackageVersion('prettier'),
    '@pnpm/find-workspace-packages': await getPackageVersion('@pnpm/find-workspace-packages'),
  };


  return JSON.stringify(pkg, null, 2);
};

export { generate };