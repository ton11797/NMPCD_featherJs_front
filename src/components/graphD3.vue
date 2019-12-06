<template>
    <div>
        <d3-network @node-click='clickNode' :net-nodes="data.nodes" :net-links="data.links" :options="options"/>
          <!-- <CButtonGroup class="float-right">
            <CButton color="secondary">One</CButton>
            <CButton color="secondary">Two</CButton>
            <CButton color="secondary">Three</CButton>
            <CButton color="secondary">Four</CButton>
            <CButton color="secondary" class="d-sm-down-none">Five</CButton>
        </CButtonGroup> -->
        </div>
</template>

<script>
import D3Network from 'vue-d3-network'
export default {
    name:"Chart",
    props: ['data','Width'],
    components: {
      D3Network
    },
    data(){
        return{
          nodeSize:50,
          canvas:false
        }
    },
    computed:{
      options(){
        return{
          force: 1500,
          size:{ h:400},
          nodeSize: this.nodeSize,
          nodeLabels: true,
          // linkLabels:true,
          canvas: this.canvas
        }
      }
    },
    methods: {
      clickNode(e,n){
        if(n.pinned === true){
          n.pinned = false
          n.fx = null
          n.fy = null
        }else{
          n.pinned = true
          n.fx = n.x
          n.fy = n.y
        }
        
      }
    },
}
</script>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>