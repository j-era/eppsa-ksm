export function getCookie(item) {
  const value = document.cookie.match(`(^|;)\\s*${item}\\s*=\\s*([^;]+)`)
  return value ? value.pop() : ""
}

export function setCookie(item, value) {
  document.cookie = `${item}=${value}`
}
