import axios from 'axios'

axios.defaults.baseURL = 'http://10.1.1.139:3030'
axios.defaults.withCredentials = true
let token ="test"
const api = {
    schema:{},
    version:{
        getVersion :async()=>{
            console.log(token)
            return await axios.get('/versionControl/get-version')
        },
        changeState :async(uuid,status)=>{
            return await axios.post('/versionControl/change-status',{versionUUID:uuid,status})
        }
        ,
        createVersion :async(versionName,refVersion)=>{
            if(refVersion===undefined){
                return await axios.post('/versionControl/new-version',{versionName})
            }else{
                return await axios.post('/versionControl/new-version',{versionName,refVersion})
            }
        }
    },
    link:{},
    confirm:{},
    data:{},
    user:{
        login :async(email,password)=>{
            console.log(token)
            let request = {
                strategy: "local",
                email: email,
                password: password
            }
            const respond = await axios.post('/authentication',request)
            // eslint-disable-next-line require-atomic-updates
            axios.defaults.headers.common['Authorization'] = respond.data.accessToken;
            return respond
        }
    },
    system:{}
}
export default api
