import { build } from 'esbuild';
import { readdirSync, existsSync, mkdirSync } from 'fs';
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
    
    // Build index.js
    await build({
      entryPoints: [entryPoint],
      bundle: true,
      format: 'iife',
      target: 'es2020',
      outfile: join(distDir, 'plugins', plugin, 'index.js'),
    });

    // Copy manifest.json to dist output
    const manifestPath = join(pluginPath, 'manifest.json');
    if (existsSync(manifestPath)) {
      const fs = await import('fs');
      fs.copyFileSync(manifestPath, join(distDir, 'plugins', plugin, 'manifest.json'));
    }
  }
}
