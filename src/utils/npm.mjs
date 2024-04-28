const getPackageManifest = async (packageName) => {
  const manifestResponse = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
  const manifest = await manifestResponse.json();
  return manifest;
};

const getPackageVersion = async (packageName) => {
  const manifest = await getPackageManifest(packageName);
  return manifest.version;
};

export { getPackageManifest, getPackageVersion };