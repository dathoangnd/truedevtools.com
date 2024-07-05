const getTextRowCol = (text: string, index: number) => {
  if (index < 0 || index > text.length) return null

  const lines = text.split('\n')
  let row = 0
  let col = 0

  for (const line of lines) {
    if (col + line.length > index) {
      col = index - col
      break
    }
    col += line.length + 1
    row++
  }
  return { row: row + 1, col: col + 1 }
}

export default getTextRowCol