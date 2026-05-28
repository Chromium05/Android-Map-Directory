import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'display'
    | 'titleL'
    | 'titleM'
    | 'body'
    | 'caption'
    | 'monoMeta'
    | 'monoTag'
    | 'title' // legacy support
    | 'subtitle' // legacy support
    | 'small' // legacy support
    | 'smallBold' // legacy support
    | 'link'
    | 'linkPrimary'
    | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'], fontFamily: Fonts.sans },
        type === 'default' && styles.body,
        type === 'display' && styles.display,
        type === 'titleL' && styles.titleL,
        type === 'titleM' && styles.titleM,
        type === 'body' && styles.body,
        type === 'caption' && styles.caption,
        type === 'monoMeta' && [styles.monoMeta, { fontFamily: Fonts.mono }],
        type === 'monoTag' && [styles.monoTag, { fontFamily: Fonts.mono }],
        type === 'title' && styles.display, // map to display
        type === 'subtitle' && styles.titleL, // map to titleL
        type === 'small' && styles.caption, // map to caption
        type === 'smallBold' && [styles.caption, { fontWeight: '700' }],
        type === 'link' && styles.link,
        type === 'linkPrimary' && [styles.link, { color: theme.route }],
        type === 'code' && [styles.code, { fontFamily: Fonts.mono }],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  display: {
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 26 * 1.05,
    letterSpacing: -0.8,
  },
  titleL: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 20 * 1.2,
    letterSpacing: -0.4,
  },
  titleM: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 16 * 1.2,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14 * 1.5,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 12 * 1.4,
  },
  monoMeta: {
    fontSize: 12,
    fontWeight: '500',
  },
  monoTag: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
  },
  code: {
    fontSize: 12,
    fontWeight: Platform.select({ android: '700', ios: '500' }),
  },
});
