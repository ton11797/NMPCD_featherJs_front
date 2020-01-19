<template>
  <div id="top">
    <CCard v-if="showForm !== 0">
      <CCardHeader>
        <CIcon name="cil-drop" />
        {{showForm===1?"Create schema":"Edit schema"}}
      </CCardHeader>
      <CCardBody>
        <CAlert show color="danger" v-if="Alert!==''">{{Alert}}</CAlert>
        <CForm>
          <CInput
            label="Schema name"
            placeholder="Schema name"
            v-model="Create.schemaName"
            :disabled="showForm===2"
          />
          <hr />
          <CCard>
            <CCardHeader>Add field</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm="5">
                  <CInput label="Field name" placeholder="Field name" v-model="fieldAdd.fieldName"/>
                </CCol>
                <CCol sm="5">
                  <CSelect id="seletType" label="Data type" @update:value="changeType" placeholder="Please select" :options="[{value:'varchar'}]" />
                </CCol>
                <CCol sm="2">
                  <CInput
                    label="Length"
                    placeholder="Length"
                    type="number"
                    v-model="fieldAdd.length"
                  />
                </CCol>
              </CRow>
              <CButton class="float-right" color="info" @click="addField">Add</CButton>
              <br>
              <br>
              <CDataTable ref="vuetable" :items="Items" :fields="fieldsCreate">
                  <template #action="item">
            <td>
                <CLink class="card-header-action btn-close" @click="removeField(item)">
                  <CIcon name="cil-x-circle"/>
                </CLink>
            </td>
          </template>
                  
              </CDataTable>
            </CCardBody>
          </CCard>
          <CButtonGroup class="float-right">
            <CButton color="info" @click="schemaCreateUpdate">{{showForm===1?"Create":"Edit"}}</CButton>
            <CButton color="secondary" @click="showForm=0;Alert=''">Cancel</CButton>
          </CButtonGroup>
        </CForm>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-drop" />Schema
      </CCardHeader>
      <CCardBody>
        <CButton color="success" class="float-right" @click="createSchema">Create new schema</CButton>
        <br />
        <br />
        <br />
        <CDataTable :items="dataTable" :fields="fields">
          <template #schemaName="{item}">
            <td :style="{ width:'120px' }">{{item.schemaName}}</td>
          </template>
          <template #fields="{item}">
            <td>
              <span v-for="(fieldName,index) in item.fields" v-bind:key="index">
                <CBadge color="success">{{item.fields[index].fieldName}}</CBadge>
                {{" "}}
              </span>
            </td>
          </template>
          <template #action="{item}">
            <td>
              <CButton
                block
                variant="outline"
                color="warning"
                @click="editSchema(item)"
                :style="{ width:'180px' }"
              >Edit schema</CButton>
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
  name: "SchemaManagement",
  data() {
    return {
      tableReload:false,
      selected:"",
      dataTable: [],
      Alert: "",
      showForm: 0, //0=notshow 1=create 2=edit
      fieldAdd:{
          fieldName:"",
          type:"",
          length:""
      },
      Create: {
        schemaName: "",
        fields: []
      },
      fieldsCreate: [
        { key: "fieldName", label: "Field name" },
        { key: "type", label: "Data type" },
        { key: "action", label: "Action" }
      ],
      fields: [
        { key: "schemaName", label: "Schema name" },
        { key: "fields", label: "Fields list" },
        { key: "action", label: "Action" }
      ]
    };
  },
  beforeMount() {
    this.fetchData();
  },
  methods: {
    removeField(item){
        if(this.showForm ===2){
            if(this.Create.fields[item.index]._classes !== undefined){
                delete this.Create.fields[item.index]._classes
                delete this.Create.fields[item.index].delete
            }else{
                this.Create.fields[item.index]._classes="table-danger"
                this.Create.fields[item.index].delete = true
            }
            this.Create.fields = [...this.Create.fields]
        }else{
            this.Create.fields.splice(item.index, 1);
        }
        this.$refs.vuetable.$forceUpdate()
    },
    addField(){
        if(this.fieldAdd.fieldName === "" || this.fieldAdd.type==="" || this.fieldAdd.length ==="" || this.fieldAdd === 0)return ""
        if(this.Create.fields.find(el=>{ return el.fieldName === this.fieldAdd.fieldName}) !== undefined){
            this.Alert = "Field name dupicate"
            return ""
        }else{
            this.Alert = ""

        }
        console.log(this.Create.fields.find(el=>{el.fieldName === this.fieldAdd.fieldName}))
        this.Create.fields.push({new:true,fieldName:this.fieldAdd.fieldName,type:this.fieldAdd.type +"("+this.fieldAdd.length+")"})
        this.fieldAdd.fieldName=""
    },
    changeType(value){
      this.fieldAdd.type = value
    },
    async schemaCreateUpdate() {
        let template = {
            versionUUID:this.versionUUID,
            schemaName:this.Create.schemaName,
            action:"create",
            fieldName:"",
            type:""
        }
        let countDelete = 0
        let request = this.Create.fields.map(el=>{
            if(el.delete !== undefined){
                template.action="delete"
                countDelete++
                template.send = true
            }
            if(el.new)template.send = true
            template.fieldName = el.fieldName
            template.type = el.type
            return _.cloneDeep(template);
        })
        if(countDelete === this.Create.fields.length){
            this.Alert = "You can't remove all field"
            return ""
        }
        let result = []
        for(let i =0;i<request.length;i++){
            if(!request[i].send)continue
            try {
                result[i] = await api.schema.editSchema(request[i])
            } catch (error) {
                result[i]= error
            }
        }
        this.Alert = ""
        await this.fetchData()
        this.showForm = 0
        this.Create = {
            schemaName: "",
            fields: []
        }
    },
    createSchema() {
        this.Create = {
            schemaName: "",
            fields: []
        }
      this.showForm = 1;
      window.scrollTo(0, 0);
    },
    editSchema(item) {
      this.showForm = 2;
      window.scrollTo(0, 0);
      this.Create.schemaName = item.schemaName
      this.Create.fields =  _.cloneDeep(item.fields)
      console.log(item)
    },
    async fetchData() {
      try {
        const respond = (await api.schema.getSchemaVersion(this.versionUUID))
          .data.result;
        this.dataTable = Object.keys(respond.schema).map(el => {
          return {
            schemaName: el,
            fields: respond.schema[el]
          };
        });
      } catch (error) {}
    }
  },
  computed: {
    versionUUID() {
      return this.$store.getters.getVersion.uuid;
    },
    Items() {
    return this.Create.fields;
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    async versionUUID(newCount, oldCount) {
      await this.fetchData();
    }
  }
};
</script>
