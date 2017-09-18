// let start start()
// ...
// end(start)
export let start = () => new Date().getTime()

export let end = (...args) => {
  if (args.length === 0) console.error('没有初始时间')
  else if (args.length === 1) console.warn((new Date().getTime() - args[ 0 ]) + 'ms')
  else console.warn(args[ 1 ] + ':' + (new Date().getTime() - args[ 0 ]) + 'ms')
}
