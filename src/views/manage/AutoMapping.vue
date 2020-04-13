<template>
  <div id="top">
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
      selectedField:""
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
    async autoMapping(){
      const request = {
        versionUUID:this.versionUUID,
        node1:this.schemaS,
        node2:this.schemaD,
        fieldMap:this.selectedField
      }
      try {
        this.respond = (await api.auto.mapping(request)).data
        console.log(respond)
      } catch (error) {}
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