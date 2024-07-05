const convertDecimalToBase = (decimal: number, base: number) => {
  if (decimal === 0) {
    return '0'
  } else if (base < 2) {
    throw new Error('Invalid base')
  } else {
    let convertedString = ''
    while (decimal > 0) {
      const remainder = decimal % base
      convertedString = remainder + convertedString
      decimal = Math.floor(decimal / base)
    }

    return convertedString
  }
}

export default convertDecimalToBase