<template>
  <div>
    <CRow>
      <CCol sm="5">
        <CSelect
          label="Filter field"
          @update:value="changeField"
          placeholder="Please select"
          :key="componentKey"
          :options="data"
        />
      </CCol>
      <CCol sm="5">
        <CInput label="Criteria" v-model="Criteria" />
      </CCol>
      <CCol sm="2">
        <div style="height:30px;"><br></div>
        <CButtonGroup class="float-right">
            <CButton color="info" @click="matchAdd">Add match filter</CButton>
            <CButton color="secondary" @click="likeAdd">Add like filter</CButton>
        </CButtonGroup>
      </CCol>
    </CRow>
    <div v-if="showDetail" class="text-center">
        Search Criteria : {{criteriaText}}
    </div>
    <br>
    <div class="text-center">
    <CButtonGroup v-if="showDetail" >
        <CButton color="info" @click="Apply">Apply filter</CButton>
        <CButton color="secondary" @click="Clear">Clear filter</CButton>
    </CButtonGroup>
    </div>
  </div>
</template>
<script>
export default {
  name: "searchCriteria",
  props: { data: Array },
  data() {
    return {
        Field:"",
        Criteria:"",
        Detail:{},
        criteriaText:"",
        showDetail:false,
        componentKey:0
    };
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    async data(newCount, oldCount) {
        this.componentKey +=1
        this.Criteria =""
        this.Detail = {}
        this.showDetail = false
        this.criteriaTextGen()
    }
  },
  methods:{
      Apply(){
          this.$emit('applyFilter',this.Detail)
      },
      Clear(){
          this.Detail={}
          this.showDetail = false
          this.criteriaTextGen()
          this.$emit('applyFilter',this.Detail)
      },
      matchAdd(){
          if(this.Field ==="")return
          this.Detail[this.Field]={field:this.Field,criteria:this.Criteria,filter:"match"}
          this.criteriaTextGen()
          this.showDetail = true
      },
      likeAdd(){
          if(this.Field ==="")return
          this.Detail[this.Field]={field:this.Field,criteria:this.Criteria,filter:"like"}
          this.criteriaTextGen()
          this.showDetail = true

      },
      criteriaTextGen(){
          this.criteriaText = ""
          Object.keys(this.Detail).map((el,index)=>{
              this.criteriaText += `[ Field: ${this.Detail[el].field} ${this.Detail[el].filter} "${this.Detail[el].criteria}" ]`
              if(Object.keys(this.Detail).length-1 !== index){
                  this.criteriaText += " and "
              }
          })
      },
      changeField(value){
      this.Field = value
    },
  }
};
</script>
<style>
.detail_Criteria {
    width:250px;
    align-items: center;
}
</style>