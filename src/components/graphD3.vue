<template>
    <div>
        <d3-network @node-click='clickNode' :net-nodes="data.nodes" :net-links="data.links" :options="options" />
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
          force: 3000,
          size:{ h:400},
          nodeSize: this.nodeSize,
          nodeLabels: true,
          linkLabels:true,
          canvas: this.canvas
        }
      }
    },
    methods: {
      clickNode(e,n){
        console.log(e)
        console.log(n)
      }
    },
}
</script>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>