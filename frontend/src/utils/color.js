export async function getRandomColor (str) {
  let buffer = new TextEncoder('utf-8').encode(str)
  let hash = await crypto.subtle.digest('SHA-256', buffer)
  return '#' + new DataView(hash).getUint32(0).toString(16).slice(0, 6)
  // return '#' + ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6)
}
