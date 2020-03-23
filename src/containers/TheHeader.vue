<template>
  <CHeader fixed with-subheader light>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      v-c-emit-root-event:toggle-sidebar-mobile
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      v-c-emit-root-event:toggle-sidebar
    />
    <CHeaderBrand
      class="mx-auto d-lg-none" 
      src="img/brand/coreui-vue-logo.svg"
      width="190"
      height="46"
      alt="CoreUI Logo"
    />
    <CHeaderNav class="d-md-down-none mr-auto">
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">
          Dashboard
        </CHeaderNavLink>
      </CHeaderNavItem>
    </CHeaderNav>
    <CHeaderNav class="mr-4">
      <CHeaderNavItem class="d-md-down-none mx-2">
        <h2><CBadge :color="getBadge(versionData.status)">Version: {{versionData.versionName}}</CBadge></h2>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
         <CDropdown 
                toggler-text="Change version" 
                class="m-2"
                color="success"
              >
                <CDropdownItem @click="changeVersion('current')">Current version</CDropdownItem>
                <CDropdownDivider/>
                <CDropdownItem v-for="(el,index) in versions" v-bind:key="index" @click="changeVersion(versions[index])">{{versions[index].versionName}}</CDropdownItem>
                <CDropdownDivider/>
                <CDropdownItem @click="fetchData">Reload version</CDropdownItem>
              </CDropdown>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-bell"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-list"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-envelope-open"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CButton  v-if="token===null" variant="outline" color="info" to="/pages/login">login</CButton>
      <TheHeaderDropdownAccnt v-if="token!==null"/>
    </CHeaderNav>
    <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0"/>
    </CSubheader>
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
import api from '@/API'
export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt
  },
  data(){
    return{
      versions:[],
      respond:{}
    }
  },
  async beforeMount(){
    await this.fetchData()
    console.log(this.$store.getters.getVersion)
  },
  methods:{
    changeVersion(version){
      if(version ==="current"){
        let current = this.respond.version.find(el=>{ return el.status === 'current'})
        console.log(current)
        if(current === undefined){
          this.$store.commit('updateVersion', {versionName:"!!!! Error",status:"error"})
        }else{
          this.$store.commit('updateVersion', current)
        }
        
      }else{
        this.$store.commit('updateVersion', version)
      }
    },
    getBadge(status){
      return status === 'current' ? 'success'
              : status === 'draft' ? 'warning'
              : status === 'final' ? 'primary' : 'danger'
    },
    async fetchData(){
      console.log("fetchData")
       this.respond = (await api.version.getVersion()).data.result
       this.versions = this.respond.version.filter(el=>{
         return el.status === 'draft'?true:el.status === 'current'?true:el.status === 'final'?true:false
       })
       this.changeVersion("current")
    }
  },
  computed: {
    versionData() {
      console.log(this.$store.getters.getVersion.versionName)
      if(this.$store.getters.getVersion.versionName === undefined){
        return {versionName:"!!!! Error",status:"error"}
      }else{
        return this.$store.getters.getVersion
      }
    },
    token () {
      return this.$store.getters.getToken
    }
  },
  watch: {
    versionData (newCount, oldCount) {
      console.log("change version",newCount)
    },
    token (newCount, oldCount) {
      this.navShow = JSON.parse(JSON.stringify(nav))
      this.navShow[0]._children = this.navShow[0]._children.filter(el=>{return el.requireAuth === undefined})
    }
  }
}
</script>
