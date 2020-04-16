<template>
  <div id="top">
      <CCard>
      <CCardHeader>
        <CIcon name="cil-drop" />User Management
      </CCardHeader>
      <CCardBody>
          <CDataTable
              class="mb-0 table-outline"
              hover
              :items="userList"
              :fields="tableFields"
              head-color="light"
              no-sorting
            >
            <td slot="createdAt" slot-scope="{item}">
              {{new Date(item.createdAt).toLocaleString()}}

            </td>
            <td slot="updatedAt" slot-scope="{item}">
                {{new Date(item.updatedAt).toLocaleString()}}
            </td>
        </CDataTable>
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
        userList:[],
        tableFields: [
        { key: 'id', label: 'Id'},
        { key: 'email', label: 'Email'},
        { key: 'createdAt', label: 'createdAt'},
        { key: 'updatedAt', label: 'updatedAt'}
      ],
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
    }
  },
  beforeMount() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
        try {
            this.userList = (await api.user.getUser()).data.data
            console.log(this.userList)
        } catch (error) {
            
        }
    },
  }
};
</script>