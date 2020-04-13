<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-drop" />Confirmation Management
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
          <template #_approved="{item}">
            <td>
                {{item._approved+'/3' }}
            </td>
          </template>
          <template #_status="{item}">
            <td>
                {{item._status===0?'Wait':item._status===1?'Approved':'Reject'}}
            </td>
          </template>
          <template #_action="{item}">
            <td>
                {{item._action===0?'New':item._action===1?'Edit':'Remove'}}
            </td>
          </template>
          <template #show_details="{item}">
            <td>
                <CButton color="info" @click="selectData(item)">Select</CButton>
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
  name: "ConfirmDataManagement",
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
      fieldResult:[],
      Alert: "",
      schema: "",
      componentKey: 0,
      mode: 0,
      respond: {},
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
    selectData(item){
      console.log(item)
    },
    applyFilter(filter){
      this.filterCriteria = filter
      this.fetchItems()
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
        key: "_approved",
        label: "Approved",
        _style: "width:1%",
        sorter: false,
        filter: false
      });
      this.fields.push({
        key: "_status",
        label: "Status",
        _style: "width:1%",
        sorter: false,
        filter: false
      });
      this.fields.push({
        key: "_action",
        label: "Action",
        _style: "width:1%",
        sorter: false,
        filter: false
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
    async fetchItems() {
      const request = {
        versionUUID: this.versionUUID,
        type:0,
        condition:{},
        like:{},
        filter:{
          schemaName:this.schema
        }
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
      const respond = (await api.confirm.confirmgGet(request)).data[0];
      this.items = respond.rows;
      console.log(respond);
    }
  }
};
</script>

<style>
</style>