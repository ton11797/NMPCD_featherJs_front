<template>
  <div>
    <CModal
      title="Confirm data"
      color="warning"
      size="xl"
      :show.sync="Modal"
    >
      <showDetail :datas="dataDetail"/>
      <hr/>
      <div class="text-center">
      <h1>Approve:{{confirmSelect._approved}} ---- Reject:{{confirmSelect._count-confirmSelect._approved}}</h1>
      <CDataTable :items="userList" :fields="[{key: 'email',label: 'Email'},{key: 'action',label: 'Result'}]" pagination>
        <template #action="{item}">
            <td>
                {{item.action===0?'Approved':'Rejected'}}
            </td>
          </template>
      </CDataTable>
      </div>
      <div style="text-align:center;">
        <CButtonGroup>
        <CButton v-if='confirmSelect.selected !=0' color="success" @click="submitConfirm(0)">{{confirmSelect.selected == undefined?'Approve':'Change to Approve'}}</CButton>
        <CButton v-if='confirmSelect.selected!=1' color="danger" @click="submitConfirm(1)">{{confirmSelect.selected == undefined?'Reject':'Change to Reject'}}</CButton>
        </CButtonGroup>
      </div>
        
      <footer slot="footer">
        <CButton color="info" @click="Modal=false" >close</CButton>
      </footer>
    </CModal>
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
        <CDataTable v-if="items!==[] && schema !==''" :items="items" :fields="fields" :key="componentKey2" pagination>
          <template #_approved="{item}">
            <td>
                {{item._approved }}
            </td>
          </template>
          <template #_count="{item}">
            <td>
                {{item._count-item._approved }}
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
      Modal:false,
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
      componentKey2: 0,
      mode: 0,
      respond: {},
      confirmSelect:{},
      userList:[],
      dataDetail:[],
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
    }
  },
  beforeMount() {
    this.fetchData();
  },
  methods: {
    async submitConfirm(action){
      const request = {
        versionUUID:"537eca50-57ca-11ea-892f-69ef0d1b8520",
        confirmId:this.confirmSelect._id,
        schemaName:this.schema,
        action:action
      }
      try {
        const respond = (await api.confirm.confirmData(request))
          .data;
      } catch (error) {}
      this.Modal = false
      await this.fetchItems()
    },
    selectData(item){
      this.Modal = true
      this.confirmSelect = {}
      this.confirmSelect = item
      this.userList = Object.keys(item._user).map(el=>{
        if(this.$store.getters.getUser.email === item._user[el].email){
          this.confirmSelect.selected = item._user[el].action
        }
        return {
          userId:el,
          email:item._user[el].email,
          action:item._user[el].action,
          _classes:item._user[el].action===0?"table-success":"table-danger"
        }
      })
      this.dataDetail = []
      this.fieldsArray.map(el=>{
            this.dataDetail.push({field:el,value:item[el.toLowerCase()]})
      })
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
        key: "_count",
        label: "Reject",
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
      const respond = (await api.confirm.confirmGet(request)).data[0];
      this.items = respond.rows;
      console.log(respond);
    }
  }
};
</script>

<style>
</style>