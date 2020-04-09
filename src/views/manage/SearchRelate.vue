<template>
  <div>
      <CCard>
      <CCardHeader>
        <CIcon name="cil-drop" />Search relate data
      </CCardHeader>
      <CCardBody>
          <h1 v-if="Object.keys(sourceData).length === 0">Select source data</h1>
          <h3 v-if="Object.keys(sourceData).length !== 0">Schema {{sourceData.schema}}</h3>
          <showDetail v-if="Object.keys(sourceData).length !== 0" :datas="sourceDataDetail"/>
          <CButton  v-if="Object.keys(sourceData).length !== 0 && mode === 0" color="info" @click="confirm()">confirm</CButton>
          <div  v-if="mode === 1">
              <hr>
              <h3>Select destination schema</h3>
              <CSelect
                ref="selectSchema"
                :key="componentKey"
                label="Schema"
                @update:value="selectSchemaDestination"
                placeholder="Please select"
                :options="data.nodes.filter(el=>{return el.schemaName !== sourceData.schema})"
                />
          </div>
      </CCardBody>
      </CCard>
    <CCard v-if="mode ==0">
      <CCardHeader>
        <CIcon name="cil-drop" />Select data
      </CCardHeader>
      <CCardBody>
        <CButtonGroup class="float-right">
        <CButton color="info" @click="showfilter=!showfilter;filterCriteria={};fetchItems()">{{showfilter?"Show":"Hide"}} filter</CButton>
        </CButtonGroup>
        <br />
        <CSelect
          ref="selectSchema"
          :key="componentKey"
          label="Schema"
          @update:value="selectSchema"
          placeholder="Please select"
          :options="data.nodes"
        />
        <searchCriteria v-if="!showfilter" :data="fieldsArray" @applyFilter="applyFilter"/>
        <br>
        <CDataTable v-if="items!==[] && schema !==''" :items="items" :fields="fields" pagination>
          <template #show_details="item">
            <td>
                <CButton color="info" @click="selectData(item)">Select</CButton>
                <!-- <router-link :to="`/manage/data/${schema}/${item.item._uuid}`">
                <CIcon name="cil-options" />
                </router-link> -->
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import _ from "lodash";
import api from "@/API";
import axios from "axios";
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import showDetail from '../../components/showDetail'
import searchCriteria from '../../components/searchCriteria'
export default {
  name: "DataManagement",
  components: {
    PulseLoader,showDetail,searchCriteria
  },
  data() {
    return {
      filterCriteria:{},
      showfilter:false,
      data: {
        nodes: []
      },
      updateTable: 0,
      items: [],
      fields: [],
      fieldsArray: [],
      Alert: "",
      schema: "",
      componentKey: 0,
      mode: 0,
      respond: {},
      sourceData:{},
      sourceDataDetail:[]
    };
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
      this.Import = {
        schema: "",
        fields: [],
        tableFields: {},
        item: {}
      };
      this.Importitems = [];
    }
  },
  beforeMount() {
    this.fetchData();
  },
  methods: {
    selectSchemaDestination(e){
        console.log(e)
    },
    confirm(){
        this.mode = 1
        console.log("test")
    },
    selectData(data){
        this.sourceData ={
            item:data.item,
            schema:this.schema
        }
        this.sourceDataDetail = this.fieldsArray.map(element => {
            return {field:element,value:this.sourceData.item[element.toLowerCase()]}
        });
    },
    applyFilter(filter){
      this.filterCriteria = filter
      this.fetchItems()
    },
    async fetchData() {
      try {
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
    async selectSchema(e) {
      this.filterCriteria = {}
      this.schema = e;
      this.fieldsArray = []
      this.fields = this.respond.result.schema[e].map(el => {
        let field = {
          key: el.fieldName.toLowerCase(),
          label: el.fieldName
        };
        this.fieldsArray.push(el.fieldName)
        return field;
      });
      this.fields.push({
        key: "show_details",
        label: "",
        _style: "width:1%",
        sorter: false,
        filter: false
      });
      await this.fetchItems();
    },
    async fetchItems() {
      let request = {
        schemaName: this.schema,
        versionUUID: this.versionUUID,
        condition:{},
        like:{}
      };
      if(this.filterCriteria !== {}){
        Object.keys(this.filterCriteria).map(el=>{
          if(this.filterCriteria[el].filter ==="match"){
            request.condition[this.filterCriteria[el].field] = this.filterCriteria[el].criteria
          }else{
            request.like[this.filterCriteria[el].field] = this.filterCriteria[el].criteria
          }
        })
      }
      const respond = (await api.data.searchData(request)).data;
      this.items = respond.rows;
      console.log(respond);
    }
  }
};
</script>

<style>
</style>