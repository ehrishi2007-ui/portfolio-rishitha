import fs from 'fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const rawPort = process.env.PORT || '4173';

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || '/';
const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
const siteOrigin = 'https://ehrishi2007-ui.github.io';
const attachedAssetsDir = path.resolve(
  import.meta.dirname,
  '..',
  '..',
  'attached_assets',
);

function ogImagePlugin(): Plugin {
  const ogImagePath = path.resolve(attachedAssetsDir, 'og-image.png');
  return {
    name: 'rishitha-os-og-image',
    transformIndexHtml(html) {
      const canonicalUrl = `${siteOrigin}${normalizedBase}`;
      const ogImageUrl = `${siteOrigin}${normalizedBase}og-image.png`;
      return html
        .replace(/__SITE_URL__/g, canonicalUrl)
        .replace(/__OG_IMAGE_URL__/g, ogImageUrl);
    },
    writeBundle(options) {
      if (!fs.existsSync(ogImagePath)) {
        return;
      }
      const outDir =
        options.dir || path.resolve(import.meta.dirname, 'dist/public');
      fs.copyFileSync(ogImagePath, path.resolve(outDir, 'og-image.png'));
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ogImagePlugin(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': attachedAssetsDir,
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
      allow: [path.resolve(import.meta.dirname), attachedAssetsDir],
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
