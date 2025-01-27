import axios from 'axios'

axios.defaults.baseURL = process.env.NODE_ENV === 'production'?'http://nmpcd.devinice.com:3030':'http://127.0.0.1:3030'
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
        },
        createDataLink :async(request)=>{
            return await axios.post('/link/data-link',request)
        }
    },
    confirm:{
        confirmGet :async(request)=>{
            return await axios.post('/confirm/confirm-get',request)
        },
        confirmGetLink :async(para)=>{
            return await axios.get('/confirm/confirm-link?'+para)
        },
        confirmData :async(request)=>{
            return await axios.post('/confirm/confirm-data',request)
        },
        confirmDataLink :async(request)=>{
            return await axios.post('/confirm/confirm-link',request)
        }
    },
    data:{
        searchData:async(request)=>{
            return await axios.post('/data/search-data',request)
        },
        searchRelation:async(request)=>{
            return await axios.post('/data/search-relate',request)
        },
        insertData:async(request)=>{
            return await axios.post('/data/insert',request)
            
        },
        insertConfirm:async(request)=>{
            return await axios.post('/data/insert-confirm',request)
        },
        insertFile:async(request)=>{
            return await axios.post('/data/insert-file',request)
        },
        editData:async(request)=>{
            return await axios.post('/data/edit-data',request)
        }
    },
    user:{
        login :async(email,password)=>{
            let request = {
                strategy: "local",
                email: email,
                password: password
            }
            const respond = await axios.post('/authentication',request)
            // eslint-disable-next-line require-atomic-updates
            axios.defaults.headers.common['Authorization'] = respond.data.accessToken;
            return respond
        },
        getUser:async()=>{
            const respond = await axios.get('/users')
            return respond
        }
    },
    system:{
        getConfig :async()=>{
            const respond = await axios.get('/systemManage/config')
            return respond
        },
        updateConfig :async(newConfig)=>{
            const respond = await axios.post('/systemManage/config',newConfig)
            return respond
        },
        resetDatabase :async()=>{
            const respond = await axios.post('/systemManage/reset',{})
            return respond
        }
    },
    search:{
        sd_search:async(request)=>{
            return await axios.post('/search/sd-relate',request)
        }
    },
    auto:{
        mapping:async(request)=>{
            return await axios.post('/auto/mapping',request)
        },
        getMapping:async(version)=>{
            return await axios.get(`/auto/mapping?version=${version}`)
        },
        act:async(request)=>{
            return await axios.post(`/auto/act`,request)
        }
    },
    dashboard:{
        update:async(request)=>{
            return await axios.post('/dashboard/update',request)
        }
    }
}
export default api
