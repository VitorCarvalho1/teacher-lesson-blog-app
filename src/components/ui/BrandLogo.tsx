import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  to?: string;
};

export default function BrandLogo({
  size = 'md',
  showTagline = true,
  to,
}: BrandLogoProps) {
  const router = useRouter();
  const { colors } = useTheme();

  const imgSize = size === 'lg' ? 68 : size === 'sm' ? 32 : 40;

  const content = (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo-codice.png')}
        style={{ width: imgSize, height: imgSize, borderRadius: 8 }}
        resizeMode="contain"
      />
      <View style={styles.identity}>
        <Text
          style={[
            styles.name,
            {
              color: colors.text,
              fontSize: size === 'lg' ? 22 : size === 'sm' ? 15 : 18,
            },
          ]}
        >
          Portal Acadêmico
        </Text>
        {showTagline ? (
          <Text
            style={[
              styles.tagline,
              {
                color: colors.textMuted,
                fontSize: size === 'lg' ? 13 : size === 'sm' ? 10 : 11,
              },
            ]}
          >
            Full Stack Development
          </Text>
        ) : null}
      </View>
    </View>
  );

  if (to) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(to as any)}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  identity: {
    justifyContent: 'center',
  },
  name: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  tagline: {
    fontWeight: '500',
    marginTop: 1,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
