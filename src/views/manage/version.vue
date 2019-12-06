<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-drop"/> Version view
      </CCardHeader>
      <CCardBody>
        <graphD3 :data='data'/>
        <CRow>
          <!-- {{window.width}} -->
        </CRow>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-drop"/> Version List
      </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="dataTable.nodes"
          :fields="fields"
        >
        <template #status="{item}">
          <td>
            <CBadge :color="getBadge(item.status)">{{item.status.charAt(0).toUpperCase() + item.status.slice(1) }}</CBadge>
          </td>
        </template>
        <template #ref="{item}">
          <td>
            {{keyMap[item.ref]!==undefined?keyMap[item.ref].versionName:'-'}}
          </td>
        </template>
      </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import _ from 'lodash';
import api from '@/API'
import graphD3 from '@/components/graphD3'
export default {
  name: 'VersionManagement',
  components:{graphD3},
  data(){
    return{
      keyMap:{},
      items:[],
      respond:{},
      dataTable:{
        nodes:[]
      },
      data:{
        nodes:[],
        links:[]
      },
      fields:[
        {key:"uuid",label:"Unique id"},
        {key:"versionName",label:"Version Name"},
        {key:"status",label:"Status"},
        {key:"ref",label:"Reference"},
        {key:"createDate",label:"Create Date"},
      ]
    }
  },
  beforeMount(){
    this.fetchData()
  },
  computed:{

  },
  methods: {
    getBadge(status){
      return status === 'current' ? 'success'
        : status === 'draft' ? 'secondary'
          : status === 'final' ? 'primary'
            : status === 'remove' ? 'danger' : 'dark'
    },
    async fetchData(){
      this.respond = (await api.version.getVersion()).data.result
      // console.log(this.respond)
      this.data.nodes = this.respond.version.map(el=>{
        this.keyMap[el.uuid] = el
        el.id = el.uuid
        if(el.status ==="current" ){
          el._color = '#2eb85c'
        }else if(el.status ==="remove"){
          el._color = '#e55353'
        }
        el.name = el.versionName
        return el
      })
      // this.keyMap =_.cloneDeep(this.keyMap)
      this.data.links = this.respond.relation.map(el=>{
        this.keyMap[el.end].ref = el.start
        el.sid = el.start
        el.tid = el.end
        return el
      })
      this.dataTable =_.cloneDeep(this.data)
      this.keyMap =_.cloneDeep(this.keyMap)
      
    }
  }
}
</script>
