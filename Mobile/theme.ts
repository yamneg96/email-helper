export const THEME = {
  light: {
    background: 'hsl(210 40% 98%)', // slate-50
    foreground: 'hsl(222 47% 11%)', // slate-900
    card: 'hsl(0 0% 100%)', // white
    cardForeground: 'hsl(222 47% 11%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(222 47% 11%)',
    primary: 'hsl(221 83% 53%)', // blue-600
    primaryForeground: 'hsl(210 40% 98%)',
    secondary: 'hsl(210 40% 96%)',
    secondaryForeground: 'hsl(222 47% 11%)',
    destructive: 'hsl(0 84% 60%)',
    destructiveForeground: 'hsl(210 40% 98%)',
    muted: 'hsl(210 40% 96%)',
    mutedForeground: 'hsl(215 16% 47%)',
    accent: 'hsl(210 40% 96%)',
    accentForeground: 'hsl(222 47% 11%)',
    border: 'hsl(214 32% 91%)',
    input: 'hsl(214 32% 91%)',
    ring: 'hsl(221 83% 53%)',
    radius: 12, // 0.75rem
  },
  dark: {
    background: 'hsl(222 47% 5%)', // slate-950
    foreground: 'hsl(210 40% 98%)', // slate-50
    card: 'hsl(222 47% 11%)', // slate-900
    cardForeground: 'hsl(210 40% 98%)',
    popover: 'hsl(222 47% 11%)',
    popoverForeground: 'hsl(210 40% 98%)',
    primary: 'hsl(217 91% 60%)', // blue-500
    primaryForeground: 'hsl(222 47% 11%)',
    secondary: 'hsl(217 32% 17%)',
    secondaryForeground: 'hsl(210 40% 98%)',
    destructive: 'hsl(0 62% 30%)',
    destructiveForeground: 'hsl(210 40% 98%)',
    muted: 'hsl(217 32% 17%)',
    mutedForeground: 'hsl(215 20% 65%)',
    accent: 'hsl(217 32% 17%)',
    accentForeground: 'hsl(210 40% 98%)',
    border: 'hsl(217 32% 17%)',
    input: 'hsl(217 32% 17%)',
    ring: 'hsl(217 91% 60%)',
    radius: 12, // 0.75rem
  },
};

export const NAV_THEME = {
  colors: {
    background: THEME.light.background,
    card: THEME.light.card,
    text: THEME.light.foreground,
    border: THEME.light.border,
    primary: THEME.light.primary,
  },
};
