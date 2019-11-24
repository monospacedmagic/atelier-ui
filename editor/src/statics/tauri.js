/*
document.querySelector('body').addEventListener('click', function (e) {
  let target = e.target
  while (target != null) {
    if (target.matches ? target.matches('a') : target.msMatchesSelector('a')) {
      tauri.open(target.href)
      break
    }
    target = target.parentElement
  }
}, true)

document.addEventListener('DOMContentLoaded', function () {
  tauri.invoke({ cmd: 'init' })
})
*/
function s4 () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

const uid = function () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
}

// const __reject = new Promise((resolve, reject) => { reject })

const tauri = {
  invoke (args) {
    // console.log(args)
    Object.freeze(args)
    window.external.invoke(JSON.stringify(args))
  },

  addEventListener (evt, handler, once = false) {
    this.invoke({
      cmd: 'addEventListener',
      evt,
      handler: this.transformCallback(handler, once),
      once
    })
  },

  emit (evt, payload) {
    this.invoke({
      cmd: 'emit',
      event: evt,
      payload
    })
  },

  transformCallback (callback, once = true) {
    const identifier = Object.freeze(uid())
    window[identifier] = (result) => {
      if (once) {
        delete window[identifier]
      }
      return callback && callback(result)
    }
    return identifier
  },

  promisified (args) {
    return new Promise((resolve, reject) => {
      this.invoke({
        callback: this.transformCallback(resolve),
        error: this.transformCallback(reject),
        ...args
      })
    })
  },

  readTextFile (path) {
    Object.freeze(path)
    return this.promisified({ cmd: 'readTextFile', path })
  },

  readBinaryFile (path) {
    Object.freeze(path)
    return this.promisified({ cmd: 'readBinaryFile', path })
  },

  writeFile (cfg) {
    Object.freeze(cfg)
    this.invoke({ cmd: 'writeFile', file: cfg.file, contents: cfg.contents })
  },

  listFiles (path) {
    Object.freeze(path)
    return this.promisified({ cmd: 'listFiles', path })
  },

  listDirs (path) {
    Object.freeze(path)
    return this.promisified({ cmd: 'listDirs', path })
  },

  setTitle (title) {
    Object.freeze(title)
    this.invoke({ cmd: 'setTitle', title })
  },

  open (uri) {
    Object.freeze(uri)
    this.invoke({ cmd: 'open', uri })
  },

  execute (command, args) {
    Object.freeze(command)
    if (typeof args === 'string' || typeof args === 'object') {
      Object.freeze(args)
    }
    return this.promisified({ cmd: 'execute', command, args: typeof (args) === 'string' ? [args] : args })
  },

  bridge (command, payload) {
    Object.freeze(command)
    if (typeof payload === 'string' || typeof payload === 'object') {
      Object.freeze(payload)
    }
    return this.promisified({ cmd: 'bridge', command, payload: typeof (payload) === 'object' ? [payload] : payload })
  }
}

export default tauri
