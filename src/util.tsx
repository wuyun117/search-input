export const countIndex = (index: number, totalNum: number, action: string): number => {
  if (totalNum === 0) return index;
  if (index === -1 && action === 'up') return totalNum - 1;
  if (index === 0 && action === 'up' ) return totalNum - 1;
  if (index === -1 && action === 'down') return 0;
  if (index === totalNum - 1 && action === 'down') return 0;
  if (index < totalNum && action === 'up') return index - 1;
  if (index < totalNum && action === 'down') return index + 1;
  return index;
}