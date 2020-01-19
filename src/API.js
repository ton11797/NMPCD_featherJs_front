import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:3030'
axios.defaults.withCredentials = true
let token ="test"
const api = {
    schema:{
        getSchemaVersion:async(versionUUID)=>{
            return await axios.get(`/schema/${versionUUID}`)
        },
        editSchema:async(data)=>{
            return await axios.post(`/schema`,data)
        }
    },
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
    link:{
        createMetaLink :async(request)=>{
            return await axios.post('/link/meta-link',request)
        }
    },
    confirm:{},
    data:{
        searchData:async(request)=>{
            return await axios.post('/data/search-data',request)
        },
        insertData:async(request)=>{
            return await axios.post('/data/insert',request)
            
        },
        insertConfirm:async(request)=>{
            return await axios.post('/data/insert-confirm',request)
        }
    },
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
