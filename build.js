import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';

async function bundle() {
  // 首先使用esbuild打包
  await build({
    entryPoints: ['server/index.js'],
    bundle: true,
    platform: 'node',
    target: 'node16',
    format: 'cjs',
    outfile: 'dist/bundle.cjs',
    define: {
      'import.meta.url': 'import_meta_url'
    },
    banner: {
      js: 'const import_meta_url = require("url").pathToFileURL(__filename).toString();'
    }
  });

  // 修改打包后的文件以支持pkg
  const bundled = readFileSync('dist/bundle.cjs', 'utf8');
  const modified = bundled.replace(
    /import\.meta\.url/g,
    'require("url").pathToFileURL(__filename).toString()'
  );
  writeFileSync('dist/bundle.cjs', modified);
}

bundle().catch(console.error);
