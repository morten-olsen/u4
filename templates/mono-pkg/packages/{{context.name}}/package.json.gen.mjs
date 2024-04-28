import { getPackageVersion } from '../../../../src/utils/npm.mjs';

/** @type { import('../../../../src/types.mjs').Generator } */
const generate = async ({ context, target,fs }) => {
  const pkg = {
    name: `${context.prefix}-${context.name}`,
    version: '0.0.1',
    type: 'module',
    scripts: {
      build: 'tsc -b'
    },
    files: [
      "./dist"
    ],
    main: "./dist/esm/index.js",
    types: "./dist/esm/index.d.ts",
    exports: {
      ".": {
        "import": "./dist/esm/index.js"
      }
    },
    u4: {},
  };

  if (fs.existsSync(target)) {
    const currentPkg = JSON.parse(await fs.readFile(target));
    Object.assign(pkg, currentPkg);
  }

  pkg.u4 = {
    ...pkg.u4,
    type: 'mono-pkg',
  };

  pkg.devDependencies = {
    ...pkg.devDependencies,
    [`${context.prefix}-configs`]: "workspace:^",
    'typescript': await getPackageVersion('typescript'),
    '@types/node': await getPackageVersion('@types/node'),
  };


  return JSON.stringify(pkg, null, 2);
};

export { generate };