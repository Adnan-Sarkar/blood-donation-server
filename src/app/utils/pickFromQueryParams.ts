const pickFromQueryParams = <T extends Record<string, any>, K extends keyof T>(
  query: T,
  keys: K[]
) => {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    if (query && query[key]) {
      finalObj[key] = query[key];
    }
  }

  return finalObj;
};

export default pickFromQueryParams;
