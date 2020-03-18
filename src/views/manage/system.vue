<template>
  <div id="top">
    <span></span>
    <CAlert show color="danger" class="text-center">Danger zone</CAlert>
    <CCard accent-color="danger">
      <CCardHeader>
        <CIcon name="cil-drop" />System management
      </CCardHeader>
    </CCard>
    <CRow>
      <CCol sm="6">
        <CCard accent-color="danger">
          <CCardHeader>
            <CIcon name="cil-drop" />Confirmation management config
          </CCardHeader>
          <CCardBody class="text-center" v-if="!loading">
            <CRow>
              <CCol sm="2" />
              <CCol class="text-left" sm="4">
                <label>Allow insert without confirm</label>
                <br />
                <label>Allow mapping without confirm</label>
              </CCol>
              <CCol class="text-left" sm="4">
                <CSwitch class="mx-1" color="primary" variant="3d" :checked="respond.confirmation.allowInsertWithoutConfirm" @update:checked="(val) => respond.confirmation.allowInsertWithoutConfirm=val" v-bind="labelIcon" />
                <br />
                <CSwitch class="mx-1" color="primary" variant="3d" :checked="respond.confirmation.allowMappingWithoutConfirm" @update:checked="(val) => respond.confirmation.allowMappingWithoutConfirm=val" v-bind="labelIcon" />
              </CCol>
            </CRow>
            <br />
            <CRow>
              <CCol sm="2" />
              <CCol class="text-center" sm="7">
                <CInput label="Accept-require" v-model="respond.confirmation.confirmationRequire" type="number" horizontal />
                <CInput label="Reject-require" v-model="respond.confirmation.rejectThreshold" type="number" horizontal />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm="6">
        <CCard accent-color="danger">
          <CCardHeader>
            <CIcon name="cil-drop" />System reset
          </CCardHeader>
          <CCardBody class="text-center">
            <CButton color="danger">Reset all database</CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import _ from "lodash";
import api from "@/API";
export default {
  name: "SystemManagement",
  data() {
    return {
      loading:true,
      respond:{},
      labelIcon: {
        labelOn: "\u2713",
        labelOff: "\u2715"
      }
    };
  },
  beforeMount() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.respond = (await api.system.getConfig()).data
        console.log(respond)
      } catch (error) {}
      this.loading = false
    },
    async updateConfig(){
      try {
        this.respond = (await api.system.updateConfig(this.respond)).data
        console.log(respond)
      } catch (error) {}
    },
    async resetDatabase(){
      try {
        this.respond = (await api.system.resetDatabase()).data
        console.log(respond)
      } catch (error) {}
    }
  }
};
</script>