import { View, Text } from '@tarojs/components';
import { TU } from '../../constants/tokens';

type BtnType = 'default' | 'primary' | 'secondary' | 'warn' | 'ghost';
type BtnSize = 'small' | 'normal' | 'large';

interface ButtonProps {
  type?: BtnType;
  size?: BtnSize;
  full?: boolean;
  circle?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const TYPE_STYLES: Record<BtnType, { bg: string; color: string; border: string }> = {
  default: { bg: TU.white, color: TU.text, border: TU.border },
  primary: { bg: TU.brand, color: '#fff', border: TU.brand },
  secondary: { bg: TU.white, color: TU.brand, border: TU.brand },
  warn: { bg: TU.error, color: '#fff', border: TU.error },
  ghost: { bg: 'transparent', color: TU.text, border: TU.border },
};

const SIZE_STYLES: Record<BtnSize, { height: string; padding: string; fontSize: string }> = {
  small: { height: '56rpx', padding: '0 28rpx', fontSize: '26rpx' },
  normal: { height: '80rpx', padding: '0 36rpx', fontSize: '30rpx' },
  large: { height: '92rpx', padding: '0 40rpx', fontSize: '30rpx' },
};

export function Button({
  type = 'default',
  size = 'normal',
  full,
  circle,
  disabled,
  children,
  onClick,
}: ButtonProps) {
  const t = TYPE_STYLES[type];
  const s = SIZE_STYLES[size];

  return (
    <View
      style={{
        display: full ? 'flex' : 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: s.height,
        padding: s.padding,
        background: disabled ? TU.borderLight : t.bg,
        border: `1rpx solid ${disabled ? TU.border : t.border}`,
        borderRadius: circle ? '999rpx' : `${TU.radius * 2}rpx`,
        width: full ? '100%' : 'auto',
      }}
      onClick={disabled ? undefined : onClick}
    >
      <Text style={{ color: disabled ? TU.text4 : t.color, fontSize: s.fontSize, lineHeight: 1 }}>
        {children}
      </Text>
    </View>
  );
}
