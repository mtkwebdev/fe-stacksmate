import Vue from 'vue'

const notify = {
  info (note: { title: any; text: any }) {
    Vue.notify({
      duration: 6000,
      type: 'success',
      group: 'artwork-actions',
      title: note.title,
      text: note.text
    })
  },
  warn (note: { title: any; text: any }) {
    Vue.notify({
      duration: 6000,
      type: 'warn',
      group: 'artwork-actions',
      title: note.title,
      text: note.text
    })
  },
  error (note: { title: any; text: any }) {
    Vue.notify({
      duration: 6000,
      type: 'error',
      group: 'artwork-actions',
      title: note.title,
      text: note.text
    })
  }
}

export default notify
