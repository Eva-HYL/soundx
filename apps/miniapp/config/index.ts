import type { UserConfigExport } from '@tarojs/cli';

const API_BASE = process.env.TARO_APP_API_BASE ?? 'http://localhost:3000/api/v1';

const config: UserConfigExport = {
  projectName: 'soundx-miniapp',
  date: '2026-04-23',
  designWidth: 750,
  deviceRatio: { 640: 2.34 / 2, 750: 1, 828: 1.81 / 2 },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {
    API_BASE: JSON.stringify(API_BASE),
  },
  copy: { patterns: [], options: {} },
  framework: 'react',
  compiler: 'webpack5',
  cache: { enable: false },
  mini: {
    postcss: {
      pxtransform: { enable: true, config: {} },
      url: { enable: true, config: { limit: 1024 } },
      cssModules: { enable: false },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['nutui-react-taro', 'nutui-react'],
    postcss: {
      autoprefixer: { enable: true },
      cssModules: { enable: false },
    },
  },
};

export default config;
