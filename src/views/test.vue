<template>
  <CCard>
    <CCardHeader>
      <slot name="header">
        <CIcon name="cil-grid"/> {{caption}}
      </slot>
    </CCardHeader>
    <CCardBody>
        <searchCriteria :data="searchCriteriaData"/>
    </CCardBody>
  </CCard>
</template>
<script>
import searchCriteria from '../components/searchCriteria'
export default {
  name: 'testing',
  components: {searchCriteria},
    data () {
    return {
        chipData:{
            color:"primary",
            shape:"pill",
            value:"teasdfadsfdsafsdst"
        },
        searchCriteriaData:{
            fields:["a","b","c"]
        }
    }
    }
}
</script>