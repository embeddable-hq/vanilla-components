


export function truncateString(label) {
  const maxChars = 15;
  if (label.length > maxChars) {
      return label.substring(0, maxChars) + '...';
  } else {
      return label;
  }
}