import axios from 'axios'

axios.defaults.baseURL = '//127.0.0.1:3000'
axios.defaults.withCredentials = true
const api = {
    schema:{},
    version:{},
    link:{},
    confirm:{},
    data:{},
    user:{},
    system:{}
}
export default api
