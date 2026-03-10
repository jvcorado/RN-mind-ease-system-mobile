import { Text } from 'react-native';
import Animated from 'react-native-reanimated';

import { useAppearance } from '@/contexts/AppearanceContext';

export function HelloWave() {
  const { disableAnimations } = useAppearance();

  if (disableAnimations) {
    return (
      <Text style={{ fontSize: 28, lineHeight: 32, marginTop: -6 }}>
        👋
      </Text>
    );
  }

  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      👋
    </Animated.Text>
  );
}
