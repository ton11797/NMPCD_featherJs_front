<template>
  <div id="top">
    <CCard>
      <CCardHeader>
        <CIcon name="cil-drop" />Schema view
      </CCardHeader>
      <CCardBody>
        <graphD3 :data="data" />
        <CRow>
          <!-- {{window.width}} -->
        </CRow>
      </CCardBody>
    </CCard>
    <span></span>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-drop" />Schema link management
      </CCardHeader>
      <CCardBody>
        <CTabs>
              <CTab title="Create link" active>
                <br/>
                <CAlert show color="danger" v-if="Alert!==''">{{Alert}}</CAlert>
                <CSelect id="seletType" label="Schema" @update:value="changeSchema1" placeholder="Please select" :options="data.nodes" />
                <CSelect id="seletType" label="Schema" @update:value="changeSchema2" placeholder="Please select" :options="data.nodes" />
                <CButtonGroup class="float-right">
                  <CButton color="info" @click="createMetaLink">Create</CButton>
                </CButtonGroup>
              </CTab>
              <CTab title="Edit link">
                <!-- 2. Lo rem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore -->
              </CTab>
            </CTabs>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import _ from "lodash";
import api from "@/API";
import graphD3 from "@/components/graphD3";
export default {
  name: "SchemaLinkManagement",
  components: { graphD3 },
  data() {
    return {
        data: {
        nodes: [],
        links: []
      },
      createLink:{
          schema1:"",
          schema2:"",
        },
      Alert:""
    };
  },
  computed: {
    versionUUID() {
      return this.$store.getters.getVersion.uuid;
    },
    Items() {
      return this.Create.fields;
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
    changeSchema1(e){
      this.createLink.schema1=e
    },
    changeSchema2(e){
      this.createLink.schema2=e
    },
    async createMetaLink(){
      const request = {
            "node1":this.createLink.schema1,
            "node2":this.createLink.schema2,
            "version":this.versionUUID
        }
        try {
          const respond = (await api.link.createMetaLink(request))
          .data;
          console.log(respond)
          this.Alert = ""
        } catch (error) {
          this.Alert = error.response.data.message
        }
        this.fetchData();
    },
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