import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = process.env.GITHUB_REPOSITORY?.split('/').pop();
const pagesBase = process.env.VITE_BASE_PATH
  || (process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/Vincent-Luhanga/');

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? pagesBase : '/',
  plugins: [react()],
});
