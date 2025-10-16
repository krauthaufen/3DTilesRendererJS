import esbuild from 'esbuild';
import path from 'path';

// Simple alias mapping mirroring vite.config.js packageAliases
const aliases = {
  '3d-tiles-renderer/core': path.resolve(process.cwd(), 'src/core/renderer/index.js'),
  '3d-tiles-renderer/three': path.resolve(process.cwd(), 'src/three/renderer/index.js'),
  '3d-tiles-renderer/core/plugins': path.resolve(process.cwd(), 'src/core/plugins/index.js'),
  '3d-tiles-renderer/three/plugins': path.resolve(process.cwd(), 'src/three/plugins/index.js'),
  '3d-tiles-renderer/plugins': path.resolve(process.cwd(), 'src/plugins.js'),
  '3d-tiles-renderer': path.resolve(process.cwd(), 'src/index.js'),
};

// Simple plugin to rewrite import paths
const aliasPlugin = {
  name: 'alias-plugin',
  setup(build) {
    build.onResolve({ filter: /.*/ }, args => {
      if (aliases[args.path]) {
        return { path: aliases[args.path] };
      }
      // let esbuild handle other paths
      return null;
    });
  }
};

(async () => {
  try {
    const shouldExternalizeThree = process.env.EXTERNAL_THREE === 'true';
    const buildOptions = {
      entryPoints: ['src/index.js'],
      bundle: true,
      minify: true,
      sourcemap: true,
      format: 'iife',
      globalName: 'TilesRendererBundle',
      outfile: 'build/tiles.min.js',
      plugins: [aliasPlugin],
    };

    if ( shouldExternalizeThree ) {
      // externalize three and its example paths so the consumer supplies THREE
      buildOptions.external = [ 'three', 'three/*', 'three/examples/*' ];
    }

    await esbuild.build( buildOptions );
    console.log('Bundled to build/index.min.js');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
