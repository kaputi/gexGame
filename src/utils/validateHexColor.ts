export const validateHexColor = (color: string): boolean =>
  /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(color);
