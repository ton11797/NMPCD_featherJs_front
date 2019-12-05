<template>
  <div>
    <CCard ref="card">
      <CCardHeader>
        <CIcon name="cil-drop"/> Version view
      </CCardHeader>
      <CCardBody>
        <CRow>
          <graphD3 :data='data' :Width='600' />
        </CRow>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import graphD3 from '@/components/graphD3'
export default {
  name: 'VersionManagement',
  components:{graphD3},
  data(){
    return{
      data:{
        Width:600,
         nodes: [
        { id: 1, name: 'my awesome node 1'},
        { id: 2, name: 'my node 2'},
        { id: 3, name:'orange node', _color: 'orange' },
        { id: 4, _color: '#4466ff'},
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 }
      ],
      links: [
        { sid: 1, tid: 2 },
        { sid: 2, tid: 8 },
        { sid: 3, tid: 4,  _svgAttrs:{'stroke-width':8,opacity:1},name:'custom link' },
        { sid: 4, tid: 5 },
        { sid: 5, tid: 6 },
        { sid: 7, tid: 8 },
        { sid: 5, tid: 8 },
        { sid: 3, tid: 8 },
        { sid: 7, tid: 9 }
      ]
      }
    }
  },
  beforeMount(){

  },
  computed:{
    
  },
  methods: {

  }
}
</script>
