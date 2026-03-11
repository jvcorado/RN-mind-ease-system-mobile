export const CONTRAST_PALETTE = {
  primary: "#3FA692",
  primaryDark: "#0f766e",
  primaryLight: "#E3F2EE",
} as const;

export const CONTRAST_PALETTE_MUTED = {
  primary: "#6B9B8E",
  primaryDark: "#4A7C6F",
  primaryLight: "#E2EBE8",
} as const;

export type ContrastPalette = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
};
