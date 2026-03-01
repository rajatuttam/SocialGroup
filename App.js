import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import SocialToggle from './src/components/SocialToggle';

const URLS = {
  igram: 'https://www.instagram.com',
  twitter: 'https://www.x.com',
};

export default function App() {
  const [active, setActive] = useState('igram');

  // WebView opacity fade on switch
  const opacity = useSharedValue(1);
  const webviewRef = useRef(null);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleToggle = (val) => {
    if (val === active) return;

    // Fade out → switch → fade in
    opacity.value = withTiming(0, { duration: 180, easing: Easing.out(Easing.quad) }, () => {
      // After fade out, switch source and fade in
      opacity.value = withTiming(1, { duration: 220, easing: Easing.in(Easing.quad) });
    });

    // Small delay to let fade start before re-render
    setTimeout(() => setActive(val), 150);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#888888" />

      {/* WebView area */}
      <Animated.View style={[styles.webviewContainer, fadeStyle]}>
        <WebView
          ref={webviewRef}
          source={{ uri: URLS[active] }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          // Hide the ugly default loading bar colour
          renderLoading={() => <View style={styles.loadingPlaceholder} />}
        />
      </Animated.View>

      {/* Bottom toggle bar */}
      <View style={styles.toggleBar}>
        <SocialToggle active={active} onToggle={handleToggle} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#888888',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#888888',
  },
  webview: {
    flex: 1,
    backgroundColor: '#888888',
  },
  loadingPlaceholder: {
    flex: 1,
    backgroundColor: '#888888',
  },
  toggleBar: {
    height: 96,
    backgroundColor: '#888888',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 8 : 0,
  },
});
