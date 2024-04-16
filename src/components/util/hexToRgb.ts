

export default function hexToRgb(hex: string, opacity: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  const BASE_16 = 16;

  return result
    ? `rgba(${parseInt(result[1], BASE_16)}, ${parseInt(result[2], BASE_16)}, ${parseInt(
        result[3], BASE_16)}, ${opacity || 1})`
    : '';
}
