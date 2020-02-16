<template>
    <div>
      <CCard >
      <CCardHeader>
        <CIcon name="cil-drop" />Data Detail
      </CCardHeader>
      <CCardBody>
          <showDetail :datas="dataDetail"/>
      </CCardBody>
    </CCard>
    <CCard >
      <CCardHeader>
        <CIcon name="cil-drop" />Data Relation
      </CCardHeader>
      <CCardBody>
        <h1 v-if="currentRelationDataLength ===0">No relate data</h1>
        <div v-if="currentRelationDataLength !==0">
          <div v-for="(el,index) in Object.keys(currentRelationData)" v-bind:key="index">
            <CDataTable :items="currentRelationData[el]" :fields="nodes[el].fieldArray" pagination>
          <template #show_details="item">
            <td>
                <router-link :to="`/manage/data/${el}/${item.item._uuid}`">
                <CIcon name="cil-options" />
                </router-link>
            </td>
          </template>
        </CDataTable>
          </div>
          
        </div>
      </CCardBody>
    </CCard>
    </div>
</template>
<script>
import api from "@/API";
import showDetail from '../../components/showDetail'
export default {
  name: 'DataDetail',
  components: {
    showDetail
  },
  data() {
    return {
        nodes:{},
        respond:{},
        data:{},
        dataDetail:[],
        dataRelation:[],
        currentRelation:{},
        currentRelationData:{},
        currentRelationDataLength:0,
        loading:true,
    }
  },
  computed: {
    versionUUID() {
      return this.$store.getters.getVersion.uuid;
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    async versionUUID(newCount, oldCount) {
      await this.fetchData();
    },
    '$route.params.uuid': function (){
      this.fetchData();
    },
  },
  beforeMount() {
    this.fetchData();
  },
  methods:{
      async fetchData(){
        this.loading = true
          try {
            const respond = (await api.schema.getSchemaVersion(this.versionUUID))
            .data;
            this.respond = respond;
            this.nodes= {}
            this.respond= {}
            this.data= {}
            this.dataDetail= []
            this.dataRelation= []
            this.currentRelation= {}
            this.currentRelationData= {}
            this.currentRelationDataLength= 0
            await Object.keys(respond.result.schema).forEach(async el => {
                let ell = {};
                ell.schemaName = el;
                ell.id = el;
                ell.lable = el;
                ell.value = el;
                ell.name = el;
                ell.field = respond.result.schema[el];
                ell.fieldArray =  respond.result.schema[el].map( elll=>{
                  return  {
                    key: elll.fieldName.toLowerCase(),
                    label: elll.fieldName
                  };
                })
                ell.fieldArray.push({
                  key: "show_details",
                  label: "",
                  _style: "width:1%",
                  sorter: false,
                  filter: false
                });
                this.nodes[el] = ell
            });
            const request1 = {
                schemaName: this.$route.params.schema,
                versionUUID: this.versionUUID,
                condition:{_uuid:this.$route.params.uuid},
                like:{}
            };
            this.data = (await api.data.searchData(request1)).data.rows[0];
            this.dataDetail = [{field:"UUID",value:this.data._uuid}]
            await this.nodes[this.$route.params.schema].field.forEach(async el=>{
                this.dataDetail.push({
                    field:el.fieldName,
                    value:this.data[el.fieldName.toLowerCase()]
                })
            })
            const request2 = {
                schemaName: this.$route.params.schema,
                uuid: this.data._uuid,
            };
            this.dataRelation = (await api.data.searchRelation(request2)).data
            let versionSelect = '_' + this.versionUUID.replace(/-/g,"")
            const currentRelationTmp = await this.dataRelation.filter(async el=>{
              for(let i = 0;i<el.startLable.length;i++){
                if(el.startLable[i] === versionSelect){
                  return true;
                }
              }
              return false
            })
            this.currentRelation = {}
            await currentRelationTmp.forEach(async el=>{
              let key = ""
              for(let i = 0;i<el.endLable.length;i++){
                if(el.endLable[i] !== versionSelect && el.endLable[i] !== '_data' && el.endLable[i][0] === '_'){
                  key = el.endLable[i].replace("_","")
                }
              }
              if(this.currentRelation[key] === undefined){
                this.currentRelation[key] = [el.end.uuid]
              }else{
                this.currentRelation[key].push(el.end.uuid)
              }
              
            })
            await Object.keys(this.currentRelation).forEach(async elKey=>{
              for(let i = 0;i<this.currentRelation[elKey].length;i++){
                
                const request3 = {
                  schemaName: elKey,
                  versionUUID: this.versionUUID,
                  condition:{_uuid:this.currentRelation[elKey][i]},
                  like:{}
                };
                const respondData = (await api.data.searchData(request3)).data.rows[0];
                console.log(respondData)
                if(this.currentRelationData[elKey] === undefined){
                  this.currentRelationData[elKey] = [respondData]
                }else{
                  this.currentRelationData[elKey].push(respondData)
                }
              }
              console.log(this.currentRelationData)
              this.currentRelationDataLength = Object.keys(this.currentRelationData).length
            })
        // eslint-disable-next-line no-empty
        } catch (error) {}
        
      }
  }
}
</script>