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
              <br>
              <CButtonGroup class="float-right">
            <CButton color="info" @click="submitImport">Import</CButton>
            <CButton color="secondary" @click="importData=0;Alert='';selectImportSchema('')">Cancel</CButton>
          </CButtonGroup>
            </div>
          </CTab>
          <CTab
            title="Import from file"
          >2. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore</CTab>
        </CTabs>
      </CCardBody>
    </CCard>
    <CCard v-if="mode ==0">
      <CCardHeader>
        <CIcon name="cil-drop" />View schema data
      </CCardHeader>
      <CCardBody>
        <CButton color="success" class="float-right" @click="showImport">Import data</CButton>
        <br />
        <CSelect
          ref="selectSchema"
          :key="componentKey"
          label="Schema"
          @update:value="selectSchema"
          placeholder="Please select"
          :options="data.nodes"
        />
        <CDataTable v-if="items!==[] && schema !==''" :items="items" :fields="fields" pagination>
          <template #show_details="item">
            <td>
              <CLink class="card-header-action btn-close" @click="removeRow(item)">
                <CIcon name="cil-x-circle" />
              </CLink>
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
export default {
  name: "DataManagement",
  data() {
    return {
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
      Importitems:[],
      updateTable:0,
      items: [],
      fields: [],
      Alert: "",
      schema: "",
      componentKey: 0,
      mode: 0,
      importData: 0,
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
      this.Import = {
        schema: "",
        fields: [],
        tableFields: {},
        item: {}
      };
      this.Importitems=[];
    }
  },
  beforeMount() {
    this.fetchData();
  },
  methods: {
    async submitImport(){
        const requests = this.Importitems.map(el=>{
            let request ={
                versionUUID:this.versionUUID,
                schemaName:this.Import.schema,
                value:el
            }
            return request;
        })
        try {
        const respond = (await api.data.insertData(requests))
          .data;
        console.log(respond)
        this.selectImportSchema('')
        this.importData=0
        this.Alert=''
        await this.fetchItems()
      } catch (error) {}
    },
    removeRow(item) {
      this.Importitems.splice(item.index, 1);
      this.updateTable +=1
    },
    addData() {
      this.Importitems.push(this.Import.item);
      this.Import.item = {};
      this.updateTable +=1
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
      if(e === '')return ''
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
      this.schema = e;
      this.fields = this.respond.result.schema[e].map(el => {
        let field = {
          key: el.fieldName.toLowerCase(),
          label: el.fieldName
        };
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
        versionUUID: this.versionUUID
      };
      const respond = (await api.data.searchData(request)).data;
      this.items = respond.rows;
      console.log(respond);
    }
  }
};
</script>

<style>
</style>