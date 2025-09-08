const pick = <T extends Record<string, unknown>, k extends keyof T>(
  obj: T,
  keys: k[]
) => {
  const filter: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwn(obj, key)) {
      filter[key] = obj[key];
    }
  }
  return filter;
};

export default pick;
