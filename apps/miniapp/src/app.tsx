import { PropsWithChildren, useEffect } from 'react';
import Taro from '@tarojs/taro';
import './app.scss';
import { ensureLogin } from './services';

function App({ children }: PropsWithChildren) {
  useEffect(() => {
    ensureLogin().catch(err => {
      console.error('[SoundX] login failed', err);
      Taro.showToast({ title: '登录失败，将使用离线模式', icon: 'none' });
    });
  }, []);

  return children;
}

export default App;
