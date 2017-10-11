let Client = require('ssh2-sftp-client')
let fs = require('fs')
let path = require('path')
let sftp = new Client()

let REMOTE_PATH = './frontend/tasklog'
let LOCAL_PATH = '../dist'

let run = async () => {
  await sftp.connect({
    host: '45.32.165.38',
    port: 22,
    username: 'guxiang',
    password: 'gx199492.'
  })
  console.log('connect success!')
  try {
    await sftp.rmdir(REMOTE_PATH, true)
    console.log('delete dir success!')
  } catch (e) {
    console.log('no dir to delete!')
  }
  await uploadDir(path.join(__dirname, LOCAL_PATH), '', REMOTE_PATH)
  console.log('upload dir success!')
}

async function uploadDir (localPath, addPath, remotePath) {
  await sftp.mkdir(path.join(remotePath, addPath))
  // console.log(path.join(remotePath, addPath))
  fs.readdir(path.join(localPath, addPath), function (err, files) {
    if (err) {
      console.error(err)
      return
    }
    for (let file of files) {
      fs.stat(path.join(localPath, addPath, file), async function (err, stats) {
        if (err) throw err
        if (stats.isFile()) {
          await sftp.put(path.join(localPath, addPath, file), path.join(remotePath, addPath, file))
          console.log(path.join(remotePath, addPath, file))
        } else {
          uploadDir(localPath, path.join(addPath, file), remotePath)
        }
      })
    }
  })
}

run()
