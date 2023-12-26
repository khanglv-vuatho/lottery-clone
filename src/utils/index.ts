interface ArrayItem {
  [key: string]: any
}

export const mapOrder = <T extends ArrayItem>(
  originalArray: T[],
  orderArray: any[],
  key: string,
): T[] => {
  if (!originalArray || !orderArray || !key) return []

  const clonedArray = [...originalArray]
  const orderedArray = clonedArray.sort((a, b) => {
    return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key])
  })

  return orderedArray
}

export const mergePairs = (arr: any) => {
  return arr.reduce((result: any, current: any, index: any, array: any) => {
    if (index % 2 === 0) {
      result.push(current + (array[index + 1] || ''))
    }
    return result
  }, [])
}
