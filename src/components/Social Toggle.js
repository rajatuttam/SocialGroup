import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';

const TOGGLE_WIDTH = 220;
const PILL_WIDTH = 110;
const TOGGLE_HEIGHT = 44;
const SPRING_CONFIG = {
  damping: 18,
  stiffness: 200,
  mass: 0.8,
};

/**
 * SocialToggle
 * Props:
 *   active: 'igram' | 'twitter'
 *   onToggle: (val: 'igram' | 'twitter') => void
 */
export default function SocialToggle({ active, onToggle }) {
  const translateX = useSharedValue(active === 'igram' ? 0 : PILL_WIDTH);

  useEffect(() => {
    translateX.value = withSpring(
      active === 'igram' ? 0 : PILL_WIDTH,
      SPRING_CONFIG
    );
  }, [active]);

  // Background of the entire pill track
  const progress = useDerivedValue(() => translateX.value / PILL_WIDTH);

  // Animated pill (white sliding capsule)
  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // IGRAM text colour: white when active (left), black when inactive
  const igramTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ['#000000', '#ffffff']),
    fontWeight: '800',
  }));

  // TWITTER text colour: white when active (right), black when inactive
  const twitterTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ['#ffffff', '#000000']),
    fontWeight: '800',
  }));

  return (
    <View style={styles.track}>
      {/* Sliding white pill */}
      <Animated.View style={[styles.pill, pillStyle]} pointerEvents="none" />

      {/* IGRAM button */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onToggle('igram')}
        activeOpacity={0.85}
      >
        <Animated.Text style={[styles.label, igramTextStyle]}>
          IGRAM
        </Animated.Text>
      </TouchableOpacity>

      {/* TWITTER button */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onToggle('twitter')}
        activeOpacity={0.85}
      >
        <Animated.Text style={[styles.label, twitterTextStyle]}>
          TWITTER
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    backgroundColor: '#000000',
    borderRadius: TOGGLE_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  pill: {
    position: 'absolute',
    width: PILL_WIDTH,
    height: TOGGLE_HEIGHT,
    backgroundColor: '#ffffff',
    borderRadius: TOGGLE_HEIGHT / 2,
    // subtle shadow to lift pill
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  tabButton: {
    width: PILL_WIDTH,
    height: TOGGLE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontSize: 12,
    letterSpacing: 1,
  },
});
    
