export const keyBy = <T>(collection: T[], keys: keyof T | (keyof T)[]): Record<string, any> => {
  // Ensure keys is always an array
  keys = Array.isArray(keys) ? keys : [keys];

  if (keys.length === 0) {
    return collection[0];
  }

  const key = keys[0];
  const restKeys = keys.slice(1);

  const grouped = collection.reduce((result, item) => {
    const keyValue = String(item[key]);

    if (!result[keyValue]) {
      result[keyValue] = [];
    }
    result[keyValue].push(item);

    return result;
  }, {} as Record<string, any>);

  Object.keys(grouped).forEach(group => {
    grouped[group] = keyBy(grouped[group], restKeys);
  });

  return grouped;
}