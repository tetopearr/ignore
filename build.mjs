import { build } from 'esbuild';
import { readdirSync, existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join } from 'path';

const pluginsDir = './plugins';
const distDir = './dist';

if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });

const plugins = readdirSync(pluginsDir);

for (const plugin of plugins) {
  const pluginPath = join(pluginsDir, plugin);
  const entryPoint = join(pluginPath, 'src', 'index.ts');

  if (existsSync(entryPoint)) {
    console.log(`Building plugin: ${plugin}`);
    
    const pluginDist = join(distDir, 'plugins', plugin);
    if (!existsSync(pluginDist)) mkdirSync(pluginDist, { recursive: true });

    await build({
      entryPoints: [entryPoint],
      bundle: true,
      format: 'iife',
      target: 'es2020',
      external: ['@revenge-mod/*', 'venom', 'vendetta'],
      outfile: join(pluginDist, 'index.js'),
    });

    const manifestPath = join(pluginPath, 'manifest.json');
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      manifest.main = 'index.js';
      writeFileSync(
        join(pluginDist, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
      );
    }

    const htmlPath = join(pluginPath, 'index.html');
    if (existsSync(htmlPath)) {
      copyFileSync(htmlPath, join(pluginDist, 'index.html'));
    }
  }
}
