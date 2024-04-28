import { getPackageVersion } from '../../src/utils/npm.mjs';

/** @type { import('../../src/types.mjs').Generator } */
const generate = async ({ target,fs }) => {
  const pkg = {};

  if (fs.existsSync(target)) {
    const currentPkg = JSON.parse(await fs.readFile(target));
    Object.assign(pkg, currentPkg);
  }

  pkg.exports = {
    ...pkg.exports,
    './trpc-types': {
      types: './dist/esm/router/router.utils.d.ts',
    },
  };

  pkg.dependencies = {
    ...pkg.dependencies,
    fastify: await getPackageVersion('fastify'),
    '@trpc/client': await getPackageVersion('@trpc/client'),
    '@trpc/server': await getPackageVersion('@trpc/server'),
    'superjson': await getPackageVersion('superjson'),
    'zod': await getPackageVersion('zod'),
  };


  return JSON.stringify(pkg, null, 2);
};

export { generate };