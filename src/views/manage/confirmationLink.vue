<template>
  <div>
    <CModal title="Confirm data link" color="warning" size="xl" :show.sync="Modal">
      <CRow>
        <CCol sm="6">
          <showDetail :datas="dataDetail1" />
        </CCol>
        <CCol sm="6">
          <showDetail :datas="dataDetail2" />
        </CCol>
      </CRow>

      <hr />
      <div class="text-center">
        <h1>Approve:{{confirmSelect._approved}} ---- Reject:{{confirmSelect._count-confirmSelect._approved}}</h1>
        <CDataTable
          v-if="items!==[]"
          :items="[confirmSelect]"
          :fields="fields"
          :key="componentKey2"
          pagination
        >
          <template #_approved="{item}">
            <td>{{item._approved }}</td>
          </template>
          <template #_count="{item}">
            <td>{{item._count-item._approved }}</td>
          </template>
          <template #_status="{item}">
            <td>{{item._status===0?'Wait':item._status===1?'Approved':'Reject'}}</td>
          </template>
          <template #_action="{item}">
            <td>{{item._action===0?'New':item._action===1?'Edit':'Remove'}}</td>
          </template>
          <template #action="{}">
            <td></td>
          </template>
        </CDataTable>
      </div>
      <div style="text-align:center;">
        <CButtonGroup v-if="confirmSelect._status ===0">
          <CButton
            v-if="confirmSelect.selected !=0"
            color="success"
            @click="submitConfirm(0)"
          >{{confirmSelect.selected == undefined?'Approve':'Change to Approve'}}</CButton>
          <CButton
            v-if="confirmSelect.selected!=1"
            color="danger"
            @click="submitConfirm(1)"
          >{{confirmSelect.selected == undefined?'Reject':'Change to Reject'}}</CButton>
        </CButtonGroup>
      </div>

      <footer slot="footer">
        <CButton color="info" @click="Modal=false">close</CButton>
      </footer>
    </CModal>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-drop" />Confirmation Data Link
      </CCardHeader>
      <CCardBody>
        <CButtonGroup class="float-right"></CButtonGroup>
        <br />
        <CDataTable
          v-if="items!==[]"
          :items="items"
          :fields="fields"
          :key="componentKey2"
          pagination
        >
          <template #_approved="{item}">
            <td>{{item._approved }}</td>
          </template>
          <template #_count="{item}">
            <td>{{item._count-item._approved }}</td>
          </template>
          <template #_status="{item}">
            <td>{{item._status===0?'Wait':item._status===1?'Approved':'Reject'}}</td>
          </template>
          <template #_action="{item}">
            <td>{{item._action===0?'New':item._action===1?'Edit':'Remove'}}</td>
          </template>
          <template #action="{item}">
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
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import showDetail from "../../components/showDetail";
import searchCriteria from "../../components/searchCriteria";
export default {
  name: "ConfirmDataManagement",
  components: {
    PulseLoader,
    showDetail,
    searchCriteria
  },
  data() {
    return {
      Modal: false,
      filterCriteria: {},
      showfilter: false,
      data: {
        nodes: []
      },
      items: [],
      fields: [
        {
          key: "_id",
          label: "Id",
          _style: "width:1%",
          sorter: true,
          filter: false
        },
        {
          key: "_node1",
          label: "Source",
          _style: "width:1%",
          sorter: true,
          filter: false
        },
        {
          key: "_node2",
          label: "Destination",
          _style: "width:1%",
          sorter: true,
          filter: false
        },
        {
          key: "_approved",
          label: "Approved",
          _style: "width:1%",
          sorter: true,
          filter: false
        },
        {
          key: "_count",
          label: "Reject",
          _style: "width:1%",
          sorter: true,
          filter: false
        },
        {
          key: "_status",
          label: "Status",
          _style: "width:1%",
          sorter: true,
          filter: false
        },
        {
          key: "_action",
          label: "Action",
          _style: "width:1%",
          sorter: true,
          filter: false
        },
        {
          key: "action",
          label: "",
          _style: "width:1%",
          sorter: false,
          filter: false
        }
      ],
      Alert: "",
      schema: "",
      componentKey: 0,
      componentKey2: 0,
      respond: {},
      confirmSelect: {},
      userList: [],
      dataDetail1: [],
      dataDetail2: []
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
    }
  },
  beforeMount() {
    this.fetchData();
  },
  methods: {
    async submitConfirm(action) {
      this.Modal = false;
      const request = {
            confirmId:this.confirmSelect._id,
            action:action
        }
      try {
        const respond = (await api.confirm.confirmDataLink(request)).data;
      } catch (error) {}
      this.Modal = false;
      await this.fetchData();
    },
    async selectData(item) {
      this.Modal = true;
      this.confirmSelect = item;
      let request1 = {
        schemaName: item._node1,
        versionUUID: this.versionUUID,
        condition: { _uuid: item._uuid1 },
        like: {}
      };
      let request2 = {
        schemaName: item._node2,
        versionUUID: this.versionUUID,
        condition: { _uuid: item._uuid2 },
        like: {}
      };
      try {
        const data1 = (await api.data.searchData(request1)).data.rows[0];
        const data2 = (await api.data.searchData(request2)).data.rows[0];
        this.dataDetail1 = [{ field: "UUID", value: item._uuid1 }];
        this.respond.result.schema[item._node1].forEach(async el => {
          this.dataDetail1.push({
            field: el.fieldName,
            value: data1[el.fieldName.toLowerCase()]
          });
        });
        this.dataDetail2 = [{ field: "UUID", value: item._uuid1 }];
        this.respond.result.schema[item._node2].forEach(async el => {
          this.dataDetail2.push({
            field: el.fieldName,
            value: data2[el.fieldName.toLowerCase()]
          });
        });
      } catch (error) {
        console.log(error);
      }
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
        const para = `_version=${this.versionUUID}`;
        this.items = (await api.confirm.confirmGetLink(para)).data;
        console.log(this.items);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style>
</style>