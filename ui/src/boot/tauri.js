import Tauri from '../statics/tauri'
const tauri = new Tauri()

export default async ({ Vue }) => {
  Vue.prototype.$tauri = tauri

  // placing these here because otherwise the import complains
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
}

export {
  tauri
}
