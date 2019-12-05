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
          :items="data.nodes"
          :fields="fields"
        >
        <!-- <template #status="{item}">
          <td>
            <CBadge :color="getBadge(item.status)">{{item.status}}</CBadge>
          </td>
        </template> -->
      </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import api from '@/API'
import graphD3 from '@/components/graphD3'
export default {
  name: 'VersionManagement',
  components:{graphD3},
  data(){
    return{
      keyMap:{},
      items:[],
      respond:{
        "version": [
            {
                "changeDate": "12/5/2019, 11:01:53 PM",
                "versionName": "V1_test701",
                "uuid": "8df9bc90-1778-11ea-ac9a-a5e235070e44",
                "createDate": "12/5/2019, 11:01:53 PM",
                "status": "draft"
            },
            {
                "changeDate": "12/4/2019, 5:58:17 PM",
                "versionName": "V0_test533",
                "uuid": "fa0d4810-1684-11ea-bdc8-03cedcd02ff3",
                "createDate": "12/4/2019, 5:58:17 PM",
                "status": "draft"
            },
            {
                "changeDate": "12/4/2019, 5:58:17 PM",
                "versionName": "V2_testRef533",
                "uuid": "fa16e500-1684-11ea-bdc8-03cedcd02ff3",
                "createDate": "12/4/2019, 5:58:17 PM",
                "status": "draft"
            },
            {
                "changeDate": "12/4/2019, 2:26:52 PM",
                "versionName": "V1_test533",
                "uuid": "70e1cbf0-1667-11ea-bdc8-03cedcd02ff3",
                "createDate": "12/4/2019, 2:26:52 PM",
                "status": "draft"
            }
        ],
        "relation": [
            {
                "start": "70e1cbf0-1667-11ea-bdc8-03cedcd02ff3",
                "end": "fa16e500-1684-11ea-bdc8-03cedcd02ff3"
            }
        ]
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
    async fetchData(){
      this.respond = (await api.version.getVersion()).data.result
      // console.log(this.respond)
      this.data.nodes = this.respond.version.map(el=>{
        this.keyMap[el.uuid] = el
        el.id = el.uuid
        el.name = el.versionName
        return el
      })
      this.data.links = this.respond.relation.map(el=>{
        this.keyMap[el.end].ref = el.start
        el.sid = el.start
        el.tid = el.end
        return el
      })
    }
  }
}
</script>
