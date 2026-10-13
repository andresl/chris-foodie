import { defineConfig } from 'astro/config';

// Demo de CookFoodie San Francisco para Christian Van Der Henst.
export default defineConfig({
  site: 'https://chris-foodie.netlify.app',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  compressHTML: true,
  devToolbar: { enabled: false },
  // Leaflet se importa solo al abrir el mapa; en desarrollo hay que preempaquetarlo o Vite responde 504.
  vite: { optimizeDeps: { include: ['leaflet'] } },
});
