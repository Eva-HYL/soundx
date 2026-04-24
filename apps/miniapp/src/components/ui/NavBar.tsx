import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { TU } from '../../constants/tokens';
import { useSafeArea } from '../../hooks/useSafeArea';

interface NavBarProps {
  title: string;
  dark?: boolean;
  bg?: string;
  right?: React.ReactNode;
  onBack?: () => void;
}

export function NavBar({ title, dark, bg, right, onBack }: NavBarProps) {
  const { statusBarHeight } = useSafeArea();
  const c = dark ? '#fff' : TU.text;
  const background = bg ?? (dark ? 'transparent' : TU.white);

  return (
    <View
      style={{
        background: background,
        borderBottom: dark ? 'none' : `1rpx solid ${TU.borderLight}`,
        flexShrink: 0,
      }}
    >
      {/* Status-bar spacer — fills the area behind the Dynamic Island / notch */}
      <View style={{ height: `${statusBarHeight}px` }} />
      <View
        style={{
          height: '88rpx',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0 28rpx',
          position: 'relative',
        }}
      >
        <View
          style={{ width: '120rpx', display: 'flex', alignItems: 'center' }}
          onClick={onBack ?? (() => Taro.navigateBack())}
        >
          <Text style={{ fontSize: '40rpx', color: c }}>‹</Text>
        </View>
        <View style={{ flex: 1, textAlign: 'center' }}>
          <Text style={{ fontSize: '32rpx', fontWeight: 500, color: c }}>{title}</Text>
        </View>
        <View style={{ width: '120rpx', textAlign: 'right' }}>{right}</View>
      </View>
    </View>
  );
}
