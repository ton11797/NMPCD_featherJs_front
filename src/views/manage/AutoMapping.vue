<template>
  <div id="top">
      <CCard>
      <CCardHeader>
        <CIcon name="cil-drop" />Auto Mapping Data
      </CCardHeader>
      <CCardBody>

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
    }
  }
};
</script>