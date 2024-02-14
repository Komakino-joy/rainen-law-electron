export default function convertNullsToStrings(obj: object) {
  return Object.keys(obj).reduce((acc: object, key: string) => {
    acc[key] = obj[key] ?? '';
    return acc;
  }, {});
}
