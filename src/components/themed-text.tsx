import { StyleSheet, Text, type TextProps } from 'react-native';

import { Font, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextType =
  | 'default'
  | 'display'
  | 'titleL'
  | 'titleM'
  | 'body'
  | 'caption'
  | 'monoMeta'
  | 'monoTag'
  | 'title' // legacy → display
  | 'subtitle' // legacy → titleL
  | 'small' // legacy → caption
  | 'smallBold' // legacy → caption (bold)
  | 'defaultSemiBold' // legacy → body (semibold)
  | 'link'
  | 'linkPrimary'
  | 'code';

export type ThemedTextProps = TextProps & {
  type?: ThemedTextType;
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const color =
    type === 'linkPrimary' && themeColor === undefined ? theme.route : theme[themeColor ?? 'text'];

  return <Text style={[{ color }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  display: {
    fontFamily: Font.sans['800'],
    fontSize: 26,
    lineHeight: 26 * 1.1,
    letterSpacing: -0.8,
  },
  titleL: {
    fontFamily: Font.sans['800'],
    fontSize: 20,
    lineHeight: 20 * 1.2,
    letterSpacing: -0.4,
  },
  titleM: {
    fontFamily: Font.sans['700'],
    fontSize: 16,
    lineHeight: 16 * 1.2,
    letterSpacing: -0.2,
  },
  default: { fontFamily: Font.sans['500'], fontSize: 14, lineHeight: 14 * 1.5 },
  body: { fontFamily: Font.sans['500'], fontSize: 14, lineHeight: 14 * 1.5 },
  caption: { fontFamily: Font.sans['500'], fontSize: 12, lineHeight: 12 * 1.4 },
  monoMeta: { fontFamily: Font.mono['500'], fontSize: 12 },
  monoTag: {
    fontFamily: Font.mono['600'],
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  link: { fontFamily: Font.sans['600'], fontSize: 14 },
  linkPrimary: { fontFamily: Font.sans['600'], fontSize: 14 },
  code: { fontFamily: Font.mono['500'], fontSize: 12 },
  // legacy aliases
  title: { fontFamily: Font.sans['800'], fontSize: 26, lineHeight: 26 * 1.1, letterSpacing: -0.8 },
  subtitle: { fontFamily: Font.sans['800'], fontSize: 20, lineHeight: 20 * 1.2, letterSpacing: -0.4 },
  small: { fontFamily: Font.sans['500'], fontSize: 12, lineHeight: 12 * 1.4 },
  smallBold: { fontFamily: Font.sans['700'], fontSize: 12, lineHeight: 12 * 1.4 },
  defaultSemiBold: { fontFamily: Font.sans['600'], fontSize: 14, lineHeight: 14 * 1.5 },
});
