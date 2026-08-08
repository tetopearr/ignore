import { build } from 'esbuild';
import { readdirSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const pluginsDir = './plugins';
const distDir = './dist';

if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });

const plugins = readdirSync(pluginsDir);

for (const plugin of plugins) {
  const pluginPath = join(pluginsDir, plugin);
  const entryPoint = join(pluginPath, 'src', 'index.ts');

  if (existsSync(entryPoint)) {
    console.log(`Building: ${plugin}`);

    const pluginDist = join(distDir, 'plugins', plugin);
    if (!existsSync(pluginDist)) mkdirSync(pluginDist, { recursive: true });

    // Bundle plugin into IIFE format
    await build({
      entryPoints: [entryPoint],
      bundle: true,
      format: 'iife',
      globalName: 'PluginModule',
      footer: {
        js: 'module.exports = PluginModule.default || PluginModule;'
      },
      target: 'es2020',
      outfile: join(pluginDist, 'index.js'),
    });

    // Copy manifest
    const manifestPath = join(pluginPath, 'manifest.json');
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      manifest.main = 'index.js';
      writeFileSync(
        join(pluginDist, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
      );
    }
  }
}

// Global landing page (dist/index.html)
const rootHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>hi</title>
  <style>
    body { background: #0f0f13; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    h1 { font-size: 5rem; margin: 0; }
    p { color: #b5bac1; }
  </style>
</head>
<body>
  <h1>hi</h1>
  <p>this is not how to install this</p>
</body>
</html>`;

writeFileSync(join(distDir, 'index.html'), rootHtml);
