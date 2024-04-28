/** @type { import('../../src/types.mjs').Generator } */
const generate = async ({ context, target,fs }) => {
  const config = {
    includes: [],
    references: [],
  };

  if (fs.existsSync(target)) {
    const currentConfig = JSON.parse(await fs.readFile(target));
    Object.assign(config, currentConfig);
  };

  const packages = [...new Set(config.references.map(({ path }) => path))];
  config.references = packages.map((path) => ({ path }));

  return JSON.stringify(config, null, 2);
};

export { generate };