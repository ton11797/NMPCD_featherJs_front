// https://vuex.vuejs.org/en/mutations.html
import axios from 'axios'
export default {
  updateToken: (state, payload) => {
    state.token = payload
    localStorage.token = payload
    axios.defaults.headers.common['Authorization'] = payload;
  },
  updateSidebar: (state, payload) => {
    state.sidebar = payload
  },
  updateVersion: (state, payload) => {
    state.version = payload
  }
}
