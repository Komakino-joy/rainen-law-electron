import { suffixKeys, suffixMap } from "~/constants/addressSuffixMap";

export default function updateAddressSuffix(str: string) {
  return suffixKeys.reduce((result, suffix) => {
    const regex = new RegExp(`\\b${suffix}\\b`, "gi");
    const replaced = result.replace(
      regex,
      (suff) => suffixMap[suff.toLowerCase() as keyof typeof suffixMap] || suff
    );
    return replaced.replace(/\.{2,}/g, ".");
  }, str);
}
