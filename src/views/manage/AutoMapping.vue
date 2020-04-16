<template>
  <div id="top">
    <CModal
      title="Confirm data"
      color="warning"
      size="xl"
      :show.sync="Modal"
    >
     
       <div slot="body-wrapper" class="text-center">
         <CDataTable
              class="mb-0 table-outline"
              hover
              :items="[itemSelected]"
              :fields="tableFields"
              head-color="light"
              no-sorting
            >
            <td slot="Sourece" slot-scope="{item}">
              {{item.detail.node1}}
            </td>
            <td slot="Destination" slot-scope="{item}">
              {{item.detail.node2}}
            </td>
            <td slot="FieldMap" slot-scope="{item}">
              {{item.detail.fieldMap}}

            </td>
            <td slot="RelateCount" slot-scope="{item}">
              {{item.detail.relateCount}}

            </td>
            <td slot="status" slot-scope="{item}">
              {{item.detail.status===0?'Finish':item.detail.status===1?'Linked':item.detail.status===2?'Move to confirm':'Error'}}

            </td>
            <td slot="runData" slot-scope="{item}">
              {{new Date(item.detail.timeStart).toLocaleString()}}

            </td>
            <td slot="runTime" slot-scope="{item}">
              {{Math.ceil((Math.floor((item.detail.timeEnd-item.detail.timeStart)/1000))/60)}} minutes
            </td>
            <td slot="action">
                
            </td>
        </CDataTable>
        <hr>
       <CRow>
         <CCol sm="4">
      </CCol>
      <CCol sm="5">
        <CButton color="info" @click="act(1,itemSelected._id)" >Link data</CButton>
        <CButton color="info" @click="act(2,itemSelected._id)" >Move to confirm</CButton>
        <CButton color="info" @click="act(3,itemSelected._id)" >Remove</CButton>
      </CCol>
      <CCol sm="4">
      </CCol>
     </CRow>
     <hr>
       </div>
      <footer slot="footer">
        <CButton color="info" @click="Modal=false" >close</CButton>
      </footer>
    </CModal>
      <CCard>
      <CCardHeader>
        <CIcon name="cil-drop" />Auto Mapping Data
      </CCardHeader>
      <CCardBody>
        <div v-if="!running && !selected">
          <CSelect
            ref="Select source Schema"
            :key="componentKey"
            label="Select source Schema "
            @update:value="selectSchemaSource"
            placeholder="Please select"
            :options="data.nodes"
          />
          <CSelect
            ref="Select destination Schema"
            :key="componentKey2"
            label="Select destination Schema"
            @update:value="selectSchemaDestination"
            placeholder="Please select"
            :options="relatedSchema"
          />
          <CButton color="success" @click="selectSchema">Select</CButton>
        </div>
        <div v-if="selected">
          <h3>Schema {{schemaS}} -----> Schema {{schemaD}}</h3>
          <CSelect
            ref="Select field"
            :key="componentKey3"
            label="Select field"
            @update:value="selectField"
            placeholder="Please select"
            :options="matchField"
          />
          <CButton color="success" @click="autoMapping">Run auto mapping</CButton>
        </div>
        <h1 v-if="running">Auto Mapping running</h1>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-drop" />Auto Mapping Result
      </CCardHeader>
      <CCardBody>
        <CDataTable
              class="mb-0 table-outline"
              hover
              :items="autoResult"
              :fields="tableFields"
              head-color="light"
              no-sorting
            >
            <td slot="Sourece" slot-scope="{item}">
              {{item.detail.node1}}
            </td>
            <td slot="Destination" slot-scope="{item}">
              {{item.detail.node2}}
            </td>
            <td slot="FieldMap" slot-scope="{item}">
              {{item.detail.fieldMap}}

            </td>
            <td slot="RelateCount" slot-scope="{item}">
              {{item.detail.relateCount}}

            </td>
            <td slot="status" slot-scope="{item}">
              {{item.detail.status===0?'Finish':item.detail.status===1?'Linked':item.detail.status===2?'Move to confirm':'Error'}}

            </td>
            <td slot="runData" slot-scope="{item}">
              {{new Date(item.detail.timeStart).toLocaleString()}}

            </td>
            <td slot="runTime" slot-scope="{item}">
              {{Math.ceil((Math.floor((item.detail.timeEnd-item.detail.timeStart)/1000))/60)}} minutes
            </td>
            <td slot="action" slot-scope="{item}">
                <CButton v-if="item.detail.status===0" color="info" @click="showAction(item)">Action</CButton>
            </td>

        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import _ from "lodash";
import api from "@/API";
export default {
  name: "AutoMappingData",
  data() {
    return {
      componentKey: 0,
      componentKey2: 0,
      componentKey3: 0,
      data: {
        nodes: []
      },
      respond:{},
      fieldsArray:[],
      fields:[],
      schemaS:"",
      schemaD:"",
      relatedSchema:[],
      config:{},
      running:false,
      selected:false,
      matchField:[],
      selectedField:"",
      autoResult:[],
      tableFields: [
        { key: 'versionName', label: 'Version'},
        { key: 'Sourece', label: 'Sourece'},
        { key: 'Destination', label: 'Destination'},
        { key: 'FieldMap', label: 'Field Map'},
        { key: 'RelateCount', label: 'Relate Count'},
        { key: 'status', label: 'Status'},
        { key: 'runData', label: 'Run date'},
        { key: 'runTime', label: 'Run Time'},
        { key: 'action', label: ''},
      ],
      Modal:false,
      itemSelected:{}
    };
  },
  beforeMount() {
    this.fetchData();
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
      this.componentKey += 1;
      this.schema = "";
      this.items = [];
      this.fields = [];
    }
  },
  beforeMount() {
    this.fetchData();
  },
  methods: {
    async act(action,_id){
      if(!confirm("Confirm")){
        return ''
      }
      try {
        await api.auto.act({action,_id})
      } catch (error) {
        
      }
      await this.fetchData();
      this.Modal=false
    },
    async showAction(item){
      this.Modal = true
      this.itemSelected = item
    },
    async autoMapping(){
      if(!confirm("Confirm")){
        return ''
      }
      const request = {
        versionUUID:this.versionUUID,
        node1:this.schemaS,
        node2:this.schemaD,
        fieldMap:this.selectedField
      }
      this.selected = false
      this.running = true
      try {
        await api.auto.mapping(request)
      } catch (error) {}
      this.fetchData();
    },
    selectField(e){
      this.selectedField = e
      console.log(e)
    },
    async selectSchema(){
      this.matchField = []
      let c = 0
      console.log(this.respond.result.schema[this.schemaS])
      for(let i=0;i<this.respond.result.schema[this.schemaS].length;i++){
        for(let j=0;j<this.respond.result.schema[this.schemaD].length;j++){
          if(this.respond.result.schema[this.schemaS][i].fieldName === this.respond.result.schema[this.schemaD][j].fieldName){
            if(c===0){
              this.selectedField = this.respond.result.schema[this.schemaS][i].fieldName
              c= 1
            }
            this.matchField.push(this.respond.result.schema[this.schemaS][i].fieldName)
          }
        }
      }
      this.selected = true
    },
    async selectSchemaDestination(e) {
      this.schemaD = e;
    },
    async selectSchemaSource(e) {
      this.relatedSchema = []
      let i =0
      this.respond.relation.forEach(el => {
        if(el.start === e){
          if(i==0){
            this.schemaD = el.end
            i = 1
          } 
          this.relatedSchema.push(el.end)
        }
        if(el.end === e){
          if(i==0){
            this.schemaD = el.start
            i = 1
          } 
          this.relatedSchema.push(el.start)
        }
      });
      this.schemaS = e;
    },
    async fetchData() {
      try {
        this.config = (await api.system.getConfig()).data
        this.autoResult = (await api.auto.getMapping(this.versionUUID)).data
        this.autoResult.sort((a, b) => a.detail.status - b.detail.status);
        this.running = this.config.autoMapping.running
        const respond = (await api.schema.getSchemaVersion(this.versionUUID))
          .data;
        this.respond = respond;
        this.data.nodes = Object.keys(respond.result.schema).map(el => {
          let ell = {};
          ell.schemaName = el;
          ell.id = el;
          ell.lable = el;
          ell.value = el;
          ell.name = el;
          ell.field = respond.result.schema[el];
          return ell;
        });
      } catch (error) {}

    },
  }
};
</script>