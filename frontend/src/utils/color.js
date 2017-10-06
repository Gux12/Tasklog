export async function getRandomColor (str) {
  let buffer = new TextEncoder('utf-8').encode(str)
  let crypto = window.crypto || window.msCrypto
  if (crypto) {
    let hash = await crypto.subtle.digest('SHA-256', buffer)
    return '#' + new DataView(hash).getUint32(0).toString(16).slice(0, 6)
  } else {
    return '#000000'
  }
}
