export const keyBy = (collection: Record<string, any>, iteratee: (entity: any) => void ) => {
  const result = new Map();

  for (const entity of collection) {
    const key = iteratee(entity);

    result.set(key, entity);
  }

  return Object.fromEntries(result);
}