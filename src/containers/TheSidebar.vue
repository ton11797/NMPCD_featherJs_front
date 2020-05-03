<template>
  <CSidebar 
    fixed 
    :minimize="minimize"
    :show.sync="show"
  >
    <CSidebarBrand 
      :imgFull="{ width: 118, height: 46, alt: 'Logo', src: 'img/brand/coreui-base-white.svg'}"
      :imgMinimized="{ width: 118, height: 46, alt: 'Logo', src: 'img/brand/coreui-signet-white.svg'}"
      
    />
    <CRenderFunction flat :content-to-render="navShow"/>
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="minimize = !minimize"
    />
  </CSidebar>
</template>

<script>
import nav from './_nav'

export default {
  name: 'TheSidebar',
  data () {
    return {
      minimize: false,
      nav,
      navShow:[],
      show: 'responsive'
    }
  },
  beforeMount(){
    this.navShow = JSON.parse(JSON.stringify(nav))
    // let token = this.$store.getters.getToken
    if(this.token === null){
      this.navShow[0]._children = this.navShow[0]._children.filter(el=>{return el.requireAuth === undefined})
    }
  },
  mounted () {
    this.$root.$on('toggle-sidebar', () => {
      const sidebarOpened = this.show === true || this.show === 'responsive'
      this.show = sidebarOpened ? false : 'responsive'
      this.$store.commit('updateSidebar', sidebarOpened ? false : true)
    })
    this.$root.$on('toggle-sidebar-mobile', () => {
      const sidebarClosed = this.show === 'responsive' || this.show === false
      this.show = sidebarClosed ? true : 'responsive'
      this.$store.commit('updateSidebar', sidebarOpened ? false : true)
    })
  },
  computed: {
    token () {
      return this.$store.getters.getToken
    }
  },
  watch: {
    token (newCount, oldCount) {
      this.navShow = JSON.parse(JSON.stringify(nav))
      this.navShow[0]._children = this.navShow[0]._children.filter(el=>{return el.requireAuth === undefined})
    }
  }
}
</script>
