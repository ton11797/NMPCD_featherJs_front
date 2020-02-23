<template>
  <div id="top">
    <span></span>
    <CAlert show color="danger" class="text-center">Danger zone</CAlert>
    <CCard accent-color="danger" >
      <CCardHeader>
        <CIcon name="cil-drop" />System management
      </CCardHeader>
    </CCard>
    <CRow>
      <CCol sm="6">
        <CCard accent-color="danger" >
      <CCardHeader>
        <CIcon name="cil-drop" />Confirmation management config
      </CCardHeader>
      <CCardBody>
                
              </CCardBody>
    </CCard>
      </CCol>
      <CCol sm="6">
        <CCard accent-color="danger" >
      <CCardHeader>
        <CIcon name="cil-drop" />System reset
      </CCardHeader>
      <CCardBody>
                
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
  name: "SchemaLinkManagement",
  data() {
    return {
        confirmationRequire:"",
        rejectThreshold:"",
        confirmationSubmit:"",
        allowInsertConfirm:""

    };
  },
  beforeMount() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const respond = (await api.schema.getSchemaVersion(this.versionUUID))
          .data;
        this.data.nodes = Object.keys(respond.result.schema).map(el => {
           let ell = {}
            ell.schemaName = el
            ell.id =el
            ell.lable = el;
            ell.value = el;
            ell.name = el;
            return ell;
        });
      // this.keyMap =_.cloneDeep(this.keyMap)
        this.data.links = respond.relation.map(el => {
            el.sid = el.start;
            el.tid = el.end;
            return el;
        });
        console.log(respond)
      } catch (error) {}
    }
  }
};
</script>