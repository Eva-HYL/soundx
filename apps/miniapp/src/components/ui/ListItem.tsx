import { View, Text, Switch } from '@tarojs/components';
import { TU } from '../../constants/tokens';

interface ListItemProps {
  title: string;
  extraText?: string;
  note?: string;
  arrow?: 'right' | 'none';
  last?: boolean;
  isSwitch?: boolean;
  switchChecked?: boolean;
  onSwitchChange?: (checked: boolean) => void;
  onClick?: () => void;
}

export function ListItem({
  title,
  extraText,
  note,
  arrow = 'right',
  last,
  isSwitch,
  switchChecked,
  onSwitchChange,
  onClick,
}: ListItemProps) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '28rpx 30rpx',
        background: TU.white,
        borderBottom: last ? 'none' : `1rpx solid ${TU.borderLight}`,
      }}
      onClick={onClick}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: '30rpx', color: TU.text, lineHeight: 1.4 }}>{title}</Text>
        {note && (
          <Text style={{ fontSize: '24rpx', color: TU.text3, marginTop: '6rpx', display: 'block' }}>
            {note}
          </Text>
        )}
      </View>
      {extraText != null && (
        <Text style={{ fontSize: '28rpx', color: TU.text3, marginLeft: '24rpx' }}>{extraText}</Text>
      )}
      {isSwitch && (
        <Switch
          checked={switchChecked}
          color={TU.brand}
          style={{ marginLeft: '20rpx' }}
          onChange={(e: { detail: { value: boolean } }) => onSwitchChange?.(e.detail.value)}
        />
      )}
      {arrow === 'right' && !isSwitch && (
        <Text style={{ color: TU.text4, marginLeft: '12rpx', fontSize: '28rpx' }}>›</Text>
      )}
    </View>
  );
}
