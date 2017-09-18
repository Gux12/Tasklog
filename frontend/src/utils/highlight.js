export let highlight = function (string, locations = [ { start: 0, end: 0 } ], color = 'red') {
  try {
    if (typeof string === 'string' && Array.isArray(locations)) {
      let rawHtml = ''
      let posArray = Array.apply(null, Array(string.length)).map(() => 0)
      for (let location of locations) {
        if (location.start >= 0 && location.start <= location.end && location.end <= string.length) {
          for (let i = location.start; i <= location.end; i++) posArray[ i ] = 1
        }
      }
      for (let i = 0; i < string.length; i++) {
        rawHtml = !posArray[ i ] ? rawHtml + '<span>' + string[ i ] + '</span>' : rawHtml + '<span style="color:' + color + '">' + string[ i ] + '</span>'
      }
      return rawHtml
    }
  } catch (e) {
    console.error(e)
  }
}
