<template>
  <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="justify-content-center">
      <CCol md="8">
        <CCardGroup>
          <CCard class="p-4">
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
          <CCard
            color="primary"
            text-color="white"
            class="text-center py-5 d-md-down-none"
            style="width:44%"
            body-wrapper
          >
            <h2>Sign up</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <CButton
              :disabled="false"
              color="primary"
              class="active mt-3"
            >
              Register Now!
            </CButton>
          </CCard>
        </CCardGroup>
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
