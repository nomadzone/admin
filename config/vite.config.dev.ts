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
        '/ws': {
          target: 'https://apis.map.qq.com', // 目标地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/'), // 保持路径
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
