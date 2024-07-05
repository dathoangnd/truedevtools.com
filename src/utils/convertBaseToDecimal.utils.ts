const convertBaseToDecimal = (baseString: string, base: number) => {
  if (base < 2) {
    throw new Error('Invalid base')
  }

  let decimalValue = 0
  let power = baseString.length - 1

  for (const digit of baseString.toUpperCase()) {
    let value: number

    if (/[0-9]/.test(digit)) {
      value = parseInt(digit)
    } else if (/[A-F]/.test(digit) && base > 10) {
      value = digit.charCodeAt(0) - 55
    } else {
      throw new Error(`Invalid character '${digit}' in base ${base}`)
    }

    // Check if the value is within the valid range for the base
    if (value >= base) {
      throw new Error(`Invalid character '${digit}' in base ${base}`)
    }

    // Add the digit's contribution to the decimal value
    decimalValue += value * (base**power)
    power--
  }

  return decimalValue
}

export default convertBaseToDecimal