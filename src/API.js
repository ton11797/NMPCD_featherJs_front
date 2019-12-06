import axios from 'axios'

axios.defaults.baseURL = 'http://10.1.1.139:3030'
axios.defaults.withCredentials = true
const api = {
    schema:{},
    version:{
        getVersion :async()=>{
            return await axios.get('/versionControl/get-version')
        }
    },
    link:{},
    confirm:{},
    data:{},
    user:{
        login :async(email,password)=>{
            let request = {
                strategy: "local",
                email: email,
                password: password
            }
            return await axios.post('/authentication',request)
        }
    },
    system:{}
}
export default api
