<template>
  <div id="top">
    <CCard>
      <CCardHeader>
        <CIcon name="cil-drop" />Version view
      </CCardHeader>
      <CCardBody>
        <graphD3 :data="data" />
        <CRow>
          <!-- {{window.width}} -->
        </CRow>
      </CCardBody>
    </CCard>
    <span></span>
    <CCard v-if="showChange">
      <CCardHeader>
        <CIcon name="cil-drop" />Change Status
      </CCardHeader>
      <CCardBody>
        <div class="bd-example">
          <CAlert show color="danger" v-if="Alert!==''">{{Alert}}</CAlert>
          <dl class="row">
            <dt class="col-sm-3">UUID</dt>
            <dd class="col-sm-9">{{Change.uuid}}</dd>
            <dt class="col-sm-3">Version Name</dt>
            <dd class="col-sm-9">{{Change.versionName}}</dd>
            <dt class="col-sm-3">Reference Version</dt>
            <dd class="col-sm-9">{{keyMap[Change.ref]!==undefined?keyMap[Change.ref].versionName:'-'}}</dd>
            <dt class="col-sm-3">Status</dt>
            <dd class="col-sm-9"><CBadge :color="getBadge(Change.status)">{{Change.status.charAt(0).toUpperCase() + Change.status.slice(1) }}</CBadge></dd>
            <dt class="col-sm-3">Create Date</dt>
            <dd class="col-sm-9">{{Change.createDate}}</dd>
            <dt class="col-sm-3">Change Date</dt>
            <dd class="col-sm-9">{{Change.changeDate}}</dd>
          </dl>
        </div>
        <CSelect v-if="Change.status !== 'remove'" label="Change status to" @update:value="ChangeNew" :value="Change.status.charAt(0).toUpperCase()+ Change.status.slice(1)" :options="['Draft','Current','Final','Remove']"/>
        <CButtonGroup class="float-right">
            <CButton color="info" v-if="Change.status !== 'remove'" @click="changeStatusAPI">Save</CButton>
            <CButton color="secondary" @click="showChange=false;Alert=''">Cancel</CButton>
        </CButtonGroup>
      </CCardBody>
    </CCard>
    <CCard v-if="showCreate">
      <CCardHeader>
        <CIcon name="cil-drop" />Create Version
      </CCardHeader>
      <CCardBody>
        <CAlert show color="danger" v-if="Alert!==''">{{Alert}}</CAlert>
        <CForm :isValid="atest">
            <CInput
              label="Version name"
              placeholder="Version name"
              :is-valid="validator"
              v-model="Create.versionName"
            />
            <CSelect label="Reference" @update:value="changeRef" :options="[{value:'none'},...(dataTable.nodes)]"/>
            <CButtonGroup class="float-right">
              <CButton color="info" @click="createVersionAPI">Create</CButton>
              <CButton color="secondary" @click="showCreate=false;Alert=''">Cancel</CButton>
            </CButtonGroup>
        </CForm>
          </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-drop" />Version List
      </CCardHeader>
      <CCardBody>
            <CButton color="success" class="float-right" @click="changeCreate" >Create new version</CButton>
        <br>
        <br>
        <br>
        <CDataTable :items="dataTable.nodes" :fields="fields">
          <template #status="{item}">
            <td>
              <CBadge :color="getBadge(item.status)">{{item.status.charAt(0).toUpperCase() + item.status.slice(1) }}</CBadge>
            </td>
          </template>
          <template #ref="{item}">
            <td>{{keyMap[item.ref]!==undefined?keyMap[item.ref].versionName:'-'}}</td>
          </template>
          <template #action="{item}">
            <td>
              <CButton
                block
                variant="outline"
                color="warning"
                @click="changeStatus(item)"
              >Change status</CButton>
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
import graphD3 from "@/components/graphD3";
export default {
  name: "VersionManagement",
  components: { graphD3 },
  data() {
    return {
      atest:false,
      newStatus:"Current",
      Alert:"",
      showChange: false,
      Change: {},
      showCreate: false,
      Create: {
        versionName:"",
        ref:'none'
      },
      keyMap: {},
      items: [],
      respond: {},
      dataTable: {
        nodes: []
      },
      data: {
        nodes: [],
        links: []
      },
      fields: [
        { key: "uuid", label: "Unique id" },
        { key: "versionName", label: "Version Name" },
        { key: "status", label: "Status" },
        { key: "ref", label: "Reference" },
        { key: "createDate", label: "Create Date" },
        { key: "changeDate", label: "Change Date" },
        { key: "action", label: "Action" }
      ]
    };
  },
  beforeMount() {
    this.fetchData();
  },
  computed: {},
  methods: {
    validator (val) {
      return val ? val.length >= 4 : false
    },
    ChangeNew(value){
      this.newStatus = value.toLowerCase()
    },
    changeRef(value){
      this.Create.ref = value
    },
    changeStatus(object) {
      window.scrollTo(0, 400);
      this.showChange = true;
      this.Change = object;
    },
    changeCreate() {
      window.scrollTo(0, 400);
      this.Create= {
        versionName:"",
        ref:'none'
      }
      this.showCreate = true;
    },
    getBadge(status) {
      return status === "current"
        ? "success"
        : status === "draft"
        ? "secondary"
        : status === "final"
        ? "primary"
        : status === "remove"
        ? "danger"
        : "dark";
    },
    async createVersionAPI(){
        if(this.Create.versionName.length <4){
          this.Alert="invalid version name"
          return ""
          }
        try {
          if(this.Create.ref ==='none'){
            await api.version.createVersion(this.Create.versionName,undefined)
          }else{
            let refVersion = this.dataTable.nodes.find(el=>{return el.versionName === this.Create.ref})
            await api.version.createVersion(this.Create.versionName,refVersion.uuid)
          }
          // await api.version.createVersion(this.Change.uuid,this.newStatus.toLowerCase())
          this.showCreate = false
          this.Alert = ""
          this.Create = {
            versionName:"",
            ref:'none'
          }
        } catch (error) {
          this.Alert = error.response.data.message
        }
        this.fetchData();
    },
    async changeStatusAPI(){
        try {
          await api.version.changeState(this.Change.uuid,this.newStatus.toLowerCase())
          this.showChange = false
          this.Alert = ""
        } catch (error) {
          this.Alert = error.response.data.message
        }
        this.fetchData();
    },
    async fetchData() {
      this.respond = (await api.version.getVersion()).data.result;
      // console.log(this.respond)
      this.data.nodes = this.respond.version.map(el => {
        this.keyMap[el.uuid] = el;
        el.id = el.uuid;
        el.value = `${el.versionName}`;
        // el.value = `${el.versionName} (${el.uuid})`;
        el.lable = el.versionName;
        if (el.status === "current") {
          el._color = "#2eb85c";
        } else if (el.status === "remove") {
          el._color = "#e55353";
        }
        el.name = el.versionName;
        return el;
      });
      // this.keyMap =_.cloneDeep(this.keyMap)
      this.data.links = this.respond.relation.map(el => {
        this.keyMap[el.end].ref = el.start;
        el.sid = el.start;
        el.tid = el.end;
        return el;
      });
      this.dataTable = _.cloneDeep(this.data);
      this.keyMap = _.cloneDeep(this.keyMap);
    }
  }
};
</script>
