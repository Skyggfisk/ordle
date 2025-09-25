const assetsDir = './dist/assets';
const outputFile = './src/asset-cache-list.json';

async function getAssetUrls(dir: string, baseUrl: string): Promise<string[]> {
  const urls: string[] = [];
  const glob = new Bun.Glob(`${dir}/*`);
  for await (const file of glob.scan()) {
    const filename = file.split('/').pop();
    urls.push(`${baseUrl}/${filename}`);
  }
  return urls;
}

async function main() {
  try {
    const assetUrls = await getAssetUrls(assetsDir, '/ordle/assets');
    await Bun.write(outputFile, JSON.stringify(assetUrls, null, 2));
    console.log('Asset cache list generated:', outputFile);
  } catch (err) {
    console.error('Error generating asset cache list:', err);
    process.exit(1);
  }
}

main();
