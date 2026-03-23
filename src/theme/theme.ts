export const colors = {
  background: '#0a0a0a',
  surface: '#141414',
  card: '#1a1a1a',
  border: '#2a2a2a',
  grayText: '#888888',
  lightText: '#cccccc',
  whiteText: '#f0f0f0',
  gold: '#c8a84e',
  goldDim: '#a08030',
  goldGlow: 'rgba(200, 168, 78, 0.15)',
  green: '#27ae60',
  red: '#c8102e',
  blue: '#3b82f6',
};

export const fonts = {
  header: 'BebasNeue-Regular',
  body: 'Barlow-Regular',
  bodyMedium: 'Barlow-Medium',
  bodySemiBold: 'Barlow-SemiBold',
  bodyBold: 'Barlow-Bold',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  header: {
    fontFamily: fonts.header,
    textTransform: 'uppercase' as const,
    letterSpacing: 2.5,
    color: colors.whiteText,
  },
  body: {
    fontFamily: fonts.body,
    color: colors.lightText,
  },
  label: {
    fontFamily: fonts.header,
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
    color: colors.grayText,
  },
};
