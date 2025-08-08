export const normalizeString = (str: string) =>
  str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
