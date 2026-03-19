import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

const imgLogo = 'https://www.figma.com/api/mcp/asset/c1f5c28d-fe64-441b-aba9-8a7bd07bdf71';

export function HomeLogo({ showLogoIcon = true, showLogoText = true }: { showLogoIcon?: boolean; showLogoText?: boolean }) {
  return (
    <View style={styles.container}>
      {showLogoIcon && (
        <View style={styles.iconContainer}>
          <Image source={{ uri: imgLogo }} style={styles.icon} contentFit="contain" />
        </View>
      )}
      {showLogoText && <Text style={styles.text}>Lettuce</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 32,
  },
  text: {
    fontSize: 29,
    fontWeight: '600',
    lineHeight: 29,
    color: '#9cad50',
  },
});

