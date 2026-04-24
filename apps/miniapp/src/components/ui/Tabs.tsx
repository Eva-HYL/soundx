import { View, Text } from '@tarojs/components';
import { TU } from '../../constants/tokens';

interface TabsProps {
  tabs: string[];
  active?: number;
  onChange?: (index: number) => void;
}

export function Tabs({ tabs, active = 0, onChange }: TabsProps) {
  return (
    <View
      style={{
        background: TU.white,
        borderBottom: `1rpx solid ${TU.borderLight}`,
        display: 'flex',
        flexDirection: 'row',
        flexShrink: 0,
      }}
    >
      {tabs.map((t, i) => {
        const isActive = i === active;
        return (
          <View
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '24rpx 0',
              position: 'relative',
            }}
            onClick={() => onChange?.(i)}
          >
            <Text
              style={{
                fontSize: '28rpx',
                color: isActive ? TU.brand : TU.text,
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {t}
            </Text>
            {isActive && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '56rpx',
                  height: '6rpx',
                  background: TU.brand,
                  borderRadius: '4rpx',
                }}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}
