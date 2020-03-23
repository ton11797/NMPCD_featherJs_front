<template>
  <div>
    <CCard v-if="importData == 1">
      <CCardHeader>
        <CIcon name="cil-drop" />Manage schema data
      </CCardHeader>
      <CCardBody>
        <CTabs>
          <CTab title="Import data" active>
            <br />
            <CSelect
              :key="componentKey"
              label="Schema"
              @update:value="selectImportSchema"
              placeholder="Please select"
              :options="data.nodes"
            />

            <div v-if="Import.schema !== ''">
              <hr />
              <CInput
                v-for="(el,index) in Import.fields"
                v-bind:key="index"
                :label="Import.fields[index].label"
                v-model="Import.item[Import.fields[index].key]"
                :placeholder="Import.fields[index].label"
              />
              <CButton class="float-right" color="info" @click="addData">Add</CButton>
              <br />
              <br />
              <CDataTable :items="Importitems" :fields="Import.tableFields" pagination>
                <template #show_details="item">
                  <td>
                    <CLink class="card-header-action btn-close" @click="removeRow(item)">
                      <CIcon name="cil-x-circle" />
                    </CLink>
                  </td>
                </template>
              </CDataTable>
              <br />
              <CButtonGroup class="float-right">
                <CButton color="info" @click="submitImport">Import</CButton>
                <CButton
                  color="secondary"
                  @click="importData=0;Alert='';selectImportSchema('')"
                >Cancel</CButton>
              </CButtonGroup>
            </div>
          </CTab>
          <CTab title="Import from file">
            <br />
            <PulseLoader class="text-center" v-if="fileUpload === 1|fileUpload === 3"/>
            <CAlert show color="danger" v-if="Alert!==''">{{Alert}}</CAlert>
            <div v-if="fileUpload===0" class="large-6 medium-6 small-6 text-center">
              <label>
                File
                <input type="file" accept=".xlsx" id="file" ref="file" v-on:change="handleFileUpload()" />
              </label>
              <button v-on:click="submitFile()">Submit</button>
            </div>
            <showDetail :datas="fileUploadDetail"/>
            <CButtonGroup v-if="fileUpload===2" class="float-right">
              <CButton color="info" @click="submitFileData">Submit data</CButton>
              <CButton color="secondary" @click="cancelFileData">Cancel</CButton>
            </CButtonGroup>
          </CTab>
        </CTabs>
      </CCardBody>
    </CCard>
    <CCard v-if="mode ==0">
      <CCardHeader>
        <CIcon name="cil-drop" />View schema data
      </CCardHeader>
      <CCardBody>
        <CButtonGroup class="float-right">
        <CButton color="info" @click="showfilter=!showfilter;filterCriteria={};fetchItems()">{{showfilter?"Show":"Hide"}} filter</CButton>
        <CButton color="success" @click="showImport">Import data</CButton>
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
                <router-link :to="`/manage/data/${schema}/${item.item._uuid}`">
                <CIcon name="cil-options" />
                </router-link>
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
import XLSX from 'xlsx'
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
      Import: {
        schema: "",
        fields: [],
        tableFields: {},
        item: {},
        items: []
      },
      Importitems: [],
      updateTable: 0,
      items: [],
      fields: [],
      fieldsArray: [],
      Alert: "",
      schema: "",
      componentKey: 0,
      mode: 0,
      importData: 0,
      respond: {},
      fileUpload:0,
      fileUploadName:"",
      fileUploadDetail:[],
      fileDetail:{}
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
    applyFilter(filter){
      this.filterCriteria = filter
      this.fetchItems()
    },
    async submitFileData(){
      const request = {
        fileName:this.fileUploadName,
        importTo:this.fileDetail.importTo,
        versionUUID:this.versionUUID
      }
      this.fileUpload=3
      const respond = await api.data.insertFile(request)
      this.fileUpload=4
      console.log(respond)
      this.cancelFileData()
    },
    cancelFileData(){
      this.fileUpload=0,
      this.fileUploadName="",
      this.fileUploadDetail=[],
      this.fileDetail={}
    },
    async submitFile() {
      this.Alert= ""
      let formData = new FormData();
      formData.append("files", this.file);
      this.fileUpload=1
      const reader = new FileReader();
      reader.onload = e => {
        const workbook = XLSX.read(e.target.result, {type:'buffer'});
        this.fileDetail.importTo=workbook.SheetNames[0]
        this.fileDetail.rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]).length
      };
      reader.readAsArrayBuffer(this.file)
      await axios
        .post("/data/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then((res)=>{
          if (res.data.length ===0){
            this.Alert ="Upload error"
            this.fileUpload=0
          }else{
            this.fileUploadDetail.push({field:"Filename",value:res.data[0].orignalName})
            this.fileUploadDetail.push({field:"Fileuploaded",value:res.data[0].fileName})
            this.fileUploadDetail.push({field:"Rows count",value:this.fileDetail.rows})
            this.fileUploadDetail.push({field:"Insert To",value: this.fileDetail.importTo})
            this.fileUploadDetail.push({field:"Version",value:this.$store.getters.getVersion.versionName})
            this.fileUploadName = res.data[0].fileName
            this.fileUpload=2
          }
        })
        .catch((res)=>{
          console.log("FAILURE!!");
          console.log(res);
        });
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    async submitImport() {
      const requests = this.Importitems.map(el => {
        let request = {
          versionUUID: this.versionUUID,
          schemaName: this.Import.schema,
          value: el
        };
        return request;
      });
      try {
        const respond = (await api.data.insertData(requests)).data;
        console.log(respond);
        this.selectImportSchema("");
        this.importData = 0;
        this.Alert = "";
        await this.fetchItems();
      } catch (error) {}
      this.Import = {
        schema: "",
        fields: [],
        tableFields: {},
        item: {},
        items: []
      };
      this.Importitems = [];
      
    },
    removeRow(item) {
      this.Importitems.splice(item.index, 1);
      this.updateTable += 1;
    },
    addData() {
      this.Importitems.push(this.Import.item);
      this.Import.item = {};
      this.updateTable += 1;
    },
    showImport() {
      this.importData = 1;
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
    async selectImportSchema(e) {
      this.Import = {
        schema: "",
        fields: [],
        tableFields: {},
        item: {},
        items: []
      };
      if (e === ""){
        this.Importitems = [];
        return ""
      }
      this.Import.schema = e;
      this.Import.fields = this.respond.result.schema[e].map(el => {
        let field = {
          key: el.fieldName.toLowerCase(),
          label: el.fieldName
        };
        return field;
      });
      this.Import.tableFields = _.cloneDeep(this.Import.fields);
      this.Import.tableFields.push({
        key: "show_details",
        label: "",
        _style: "width:1%",
        sorter: false,
        filter: false
      });
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