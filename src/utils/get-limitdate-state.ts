export const getLimitDateState = (limitDate: Date | null) => {
  if (!limitDate) return 777;
  const now = new Date();
  const diffTime = limitDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
