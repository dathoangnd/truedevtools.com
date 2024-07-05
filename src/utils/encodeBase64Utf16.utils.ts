const encodeBase64Utf16 = (text: string) => {
	const codeUnits = new Uint16Array(text.length)
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = text.charCodeAt(i)
  }
  return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)))
}

export default encodeBase64Utf16