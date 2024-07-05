const decodeBase64 = (base64: string) => {
  return window.atob(base64)
}

export default decodeBase64