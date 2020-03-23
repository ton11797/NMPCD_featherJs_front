<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-drop" />Data link
      </CCardHeader>
      <CCardBody>
        <CAlert show color="danger" v-if="Alert!==''">{{Alert}}</CAlert>
        <h3 v-if="!ASelected && !selected">Select Data source</h3>
        <h3 v-if="ASelected && !selected">Select Data destination from schema {{schemaB}}</h3>
        <CRow class="form-group" v-if="ASelected">
          <CCol sm="6">
            <CCard>
              <CCardHeader>Data source</CCardHeader>
              <CCardBody>
                <showDetail :datas="dataDetailA"/>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm="6" v-if="selected">
            <CCard>
              <CCardHeader>Data destination</CCardHeader>
              <CCardBody>
                <showDetail :datas="dataDetailB"/>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CButtonGroup  class="float-right" v-if="selected">
          <CButton color="info" @click="linkData" >Link</CButton>
          <CButton color="secondary" @click="cancelLink">Cancel</CButton>
        </CButtonGroup>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-drop" />Select schema data
      </CCardHeader>
      <CCardBody>
        <CButtonGroup class="float-right">
          <CButton
            color="info"
            @click="showfilter=!showfilter;filterCriteria={};fetchItems()"
          >{{showfilter?"Show":"Hide"}} filter</CButton>
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
        <searchCriteria v-if="!showfilter" :data="fieldsArray" @applyFilter="applyFilter" />
        <br />
        <CDataTable v-if="items!==[] && schema !==''" :items="items" :fields="fields" pagination>
          <template #action_button="item">
            <td>
              <CButtonGroup>
                <CButton color="info" @click="selectA(schema,item.item)">Source</CButton>
                <CButton
                  color="info"
                  v-if="ASelected &&  schemaB.includes(schema)"
                  @click="selectB(schema,item.item)"
                >Destination</CButton>
                <router-link :to="`/manage/data/${schema}/${item.item._uuid}`">
                  <CButton color="secondary">Detail</CButton>
                </router-link>
              </CButtonGroup>
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
import searchCriteria from "../../components/searchCriteria";
import showDetail from '../../components/showDetail'
export default {
  name: "DataManagement",
  components: {
    searchCriteria,
    showDetail
  },
  data() {
    return {
      A: {},
      dataDetailA:[],
      dataDetailB:[],
      B: {},
      schemaB: [],
      selected: false,
      ASelected: false,
      filterCriteria: {},
      showfilter: false,
      data: {
        nodes: []
      },
      items: [],
      fields: [],
      fieldsArray: [],
      Alert: "",
      schema: "",
      componentKey: 0,
      respond: {}
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
      this.clear()
    }
  },
  beforeMount() {
    this.fetchData();
  },
  methods: {
    cancelLink(){
      this.A= {}
      this.dataDetailA=[]
      this.dataDetailB=[]
      this.B= {}
      this.schemaB= []
      this.selected= false
      this.ASelected= false
      this.Alert= ""
    },
    clear(){
      this.A = {}
        this.B = {}
        this.schemaB = [];
        this.ASelected = false;
        this.selected = false
    },
    async linkData(){
      if(!confirm("Confirm")){
        return ''
      }
      const request = {
        node1:this.A.schema,
        node2:this.B.schema,
        uuid1:this.A.uuid,
        uuid2:this.B.uuid,
        version:this.versionUUID
      }
      try {
        await api.link.createDataLink(request)
        this.clear()
      } catch (error) {
        this.Alert = error
      }
    },
    selectA(schema, item) {
      this.A.schema = schema;
      this.A.uuid = item._uuid;
      this.ASelected = true;
      this.schemaB = [];
      this.respond.relation.forEach(element => {
        if (element.end === schema) {
          this.schemaB.push(element.start);
        }
        if (element.start === schema) {
          this.schemaB.push(element.end);
        }
      });
      this.dataDetailA = [{field:"UUID",value:item._uuid}]
      this.respond.result.schema[schema].forEach(async el=>{
        this.dataDetailA.push({
            field:el.fieldName,
            value:item[el.fieldName.toLowerCase()]
        })
    })
          window.scrollTo(0, 0);

    },
    selectB(schema, item) {
      if (this.schemaB.includes(schema)) {
        this.selected = true;
        this.B.schema = schema;
        this.B.uuid = item._uuid;
        this.dataDetailB = [{field:"UUID",value:item._uuid}]
      this.respond.result.schema[schema].forEach(async el=>{
        this.dataDetailB.push({
            field:el.fieldName,
            value:item[el.fieldName.toLowerCase()]
        })
    })
      }
          window.scrollTo(0, 0);
    },
    applyFilter(filter) {
      this.filterCriteria = filter;
      this.fetchItems();
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
      this.filterCriteria = {};
      this.schema = e;
      this.fieldsArray = [];
      this.fields = this.respond.result.schema[e].map(el => {
        let field = {
          key: el.fieldName.toLowerCase(),
          label: el.fieldName
        };
        this.fieldsArray.push(el.fieldName);
        return field;
      });
      this.fields.push({
        key: "action_button",
        label: "",
        _style: "width:250px",
        sorter: false,
        filter: false
      });
      await this.fetchItems();
    },
    async fetchItems() {
      let request = {
        schemaName: this.schema,
        versionUUID: this.versionUUID,
        condition: {},
        like: {}
      };
      if (this.filterCriteria !== {}) {
        Object.keys(this.filterCriteria).map(el => {
          if (this.filterCriteria[el].filter === "match") {
            request.condition[
              this.filterCriteria[el].field
            ] = this.filterCriteria[el].criteria;
          } else {
            request.like[this.filterCriteria[el].field] = this.filterCriteria[
              el
            ].criteria;
          }
        });
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