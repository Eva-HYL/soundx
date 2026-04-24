import Taro from '@tarojs/taro';

interface SafeArea {
  /** Status bar height in px (logical pixels used by WeChat WXSS). */
  statusBarHeight: number;
  /** Home-indicator / bottom safe-area inset in px. 0 on devices without one. */
  safeAreaBottom: number;
}

let _cached: SafeArea | null = null;

function getSafeArea(): SafeArea {
  if (_cached) return _cached;
  try {
    const sys = Taro.getSystemInfoSync();
    _cached = {
      statusBarHeight: sys.statusBarHeight ?? 44,
      safeAreaBottom: sys.safeArea ? Math.max(0, sys.screenHeight - sys.safeArea.bottom) : 0,
    };
  } catch {
    _cached = { statusBarHeight: 44, safeAreaBottom: 0 };
  }
  return _cached;
}

/**
 * Returns device safe-area insets (cached after first call).
 *
 * Values are in **px** — compatible with WeChat WXSS inline-style `px` units.
 * On a 375 px wide screen, 1 px == 2 rpx.
 *
 * Usage:
 * ```tsx
 * const { statusBarHeight, safeAreaBottom } = useSafeArea();
 * <View style={{ height: `${statusBarHeight}px` }} />
 * ```
 */
export function useSafeArea(): SafeArea {
  return getSafeArea();
}
