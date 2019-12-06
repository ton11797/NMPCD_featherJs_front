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
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/users" exact>
          Users
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink>
          Settings
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
                <CDropdownItem>Current version</CDropdownItem>
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
      <TheHeaderDropdownAccnt/>
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
      this.$store.commit('updateVersion', version)
    },
    getBadge(status){
      return status === 'current' ? 'success'
              : status === 'draft' ? 'warning': 'danger'
    },
    async fetchData(){
      console.log("fetchData")
       this.respond = (await api.version.getVersion()).data.result
       this.versions = this.respond.version.filter(el=>{
         return el.status === 'draft'?true:el.status === 'current'?true:false
       })
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
    }
  },
  watch: {
    versionData (newCount, oldCount) {
      console.log("change version",newCount)
    }
  }
}
</script>
