import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      fs: {
        strict: true,
      },
      proxy: {
        '/shop': {
          target: 'http://120.26.208.147:9001', // 目标地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/shop'), // 保持路径
        },
        '/user': {
          target: 'http://120.26.208.147:9002/admin', // 目标地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/user'), // 保持路径
        },
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConfig
);
