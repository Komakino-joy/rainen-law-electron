export default function uniqueLabelValuePairs (labelValuePair: any) {
  return labelValuePair.filter((obj: any, index: any, self: any) =>
            index === self.findIndex((t:any) => (
              t.label === obj.label && t.value === obj.value
            ))
          )
}