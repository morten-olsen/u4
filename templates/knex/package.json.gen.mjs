import { getPackageVersion } from '../../src/utils/npm.mjs';

/** @type { import('../../src/types.mjs').Generator } */
const generate = async ({ target,fs }) => {
  const pkg = {};

  if (fs.existsSync(target)) {
    const currentPkg = JSON.parse(await fs.readFile(target));
    Object.assign(pkg, currentPkg);
  }

  pkg.dependencies = {
    ...pkg.dependencies,
    knex: await getPackageVersion('knex'),
  };


  return JSON.stringify(pkg, null, 2);
};

export { generate };