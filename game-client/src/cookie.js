// https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript#25490531
export function getCookie(item) {
  const value = document.cookie.match(`(^|;)\\s*${item}\\s*=\\s*([^;]+)`)
  return value ? value.pop() : ""
}

export function setCookie(item, value) {
  document.cookie = `${item}=${value}`
}
