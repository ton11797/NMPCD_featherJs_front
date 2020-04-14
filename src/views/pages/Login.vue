<template>
  <CContainer class="align-items-center" >
    <div style="height: 250px;"></div>
    <CRow class="justify-content-center" style="height: 200px;">
      <CCol md="8">
      <CCard>
            <CCardBody>
              <CForm>
                <h1>Login</h1>
                <p class="text-muted">Sign In to your account</p>
                <CInput
                  v-model="email"
                  placeholder="Username"
                  autocomplete="username email"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>
                <CInput
                  v-model="password"
                  placeholder="Password"
                  type="password"
                  autocomplete="curent-password"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CRow>
                  <CCol col="6">
                    <CButton color="primary" class="px-4" @click="login">Login</CButton>
                  </CCol>
                  <CCol col="6" class="text-right">
                    <CButton color="link" class="px-0">Forgot password?</CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
            <footer>
              <h6 v-if="alert!==''" class="text-danger">Username or password is incorrect</h6>
            </footer>
          </CCard>
          </CCol>
    </CRow>
  </CContainer>
</template>

<script>
import api from '@/API'
export default {
  name: 'Login',
  beforeCreate(){
    let token = this.$store.getters.getToken
    if(token !== null){
      this.$router.push('/')
    }
  },
  data(){
    return{
      email:"",
      password:"",
      respond:{},
      alert:""
    }
  },
  methods:{
    async login(){
      try {
        this.respond = (await api.user.login(this.email,this.password)).data
        this.$store.commit('updateToken', this.respond.accessToken)
        this.$store.commit('userData', this.respond.user)
        this.alert = ""
        this.$router.push('/')
      } catch (error) {
        console.log(error)
        this.alert = true
        if(error.response.status===401){
          this.alert = "Username or password is incorrect"
        }else{
          this.alert = error.response.statusText
        }
      }
    }
  }
}
</script>
