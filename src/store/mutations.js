// https://vuex.vuejs.org/en/mutations.html

export default {
  updateToken: (state, payload) => {
    state.token = payload
  },
  updateSidebar: (state, payload) => {
    state.sidebar = payload
  },
  updateVersion: (state, payload) => {
    state.version = payload
  }
}
