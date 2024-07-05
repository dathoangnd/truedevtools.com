const encodeBase64 = (text: string) => {
  return window.btoa(text)
}

export default encodeBase64