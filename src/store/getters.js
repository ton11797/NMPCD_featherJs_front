// https://vuex.vuejs.org/en/getters.html

export default {
  getToken: state => {
    return state.token
  },
  getSidebar: state => {
    return state.sidebar
  },
  getVersion: state => {
    return state.version
  },
  getUser: state => {
    return state.user
  }
}
