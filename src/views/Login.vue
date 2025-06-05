<!-- Login.vue -->
<template>
  <div class="login-container">
    <!-- 背景视频 -->
<!--    <div class="video-background">
      <video
              src="@/assets/video/bg1.mp4"
              autoplay
              loop
              muted
              @error="handleVideoErr"
      ></video>
    </div>-->
    <div class="login-card">
      <div class="logo-container">
       <img :src="config.logo" class="logo-img">
        <h2 class="logo-text">{{ config.name }}</h2>
      </div>
      <div class="login-form">
        <h2>登录</h2>
        <input 
          type="text" 
          v-model="loginForm.account" 
          name="account" 
          placeholder="请输入用户名"
          @keyup.enter="handleLogin"
        >
        <input 
          type="password" 
          v-model="loginForm.password" 
          name="password" 
          data="passwordtype" 
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
        <div class="remember-me">
          <input 
            type="checkbox" 
            id="remember-me" 
            v-model="loginForm.remember"
            hidden
          >
          <label for="remember-me" class="custom-checkbox"></label>
          <label for="remember-me">记住密码</label>
        </div>
        <button @click="handleLogin" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
// import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores'
import { companyConfig } from '@/config/company-config'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)

const companyId = ref(route.params.loginCompanyId)
const config = ref(companyConfig[companyId.value || '1001'])

// 登录表单
const loginForm = reactive({
  account: '',
  password: '',
  remember: false
})

// 登录验证规则
const loginRules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 处理背景视频加载错误
const handleVideoErr = () => {

}

// 载入记住的用户名和密码
onMounted(() => {
  const rememberedLogin = userStore.getRememberedLogin()
  if (rememberedLogin.account) {
    loginForm.account = rememberedLogin.account
    loginForm.remember = rememberedLogin.remember
    
    if (rememberedLogin.remember && rememberedLogin.password) {
      loginForm.password = rememberedLogin.password
    }
  }
})

// 登录处理
const handleLogin = async () => {
  console.log(typeof companyId.value)
  // 简单表单验证
  if (!loginForm.account) {
    return ElMessage.warning('请输入用户名')
  }
  if(loginForm.account.length < 3 || loginForm.account.length > 20){
    return ElMessage.warning('用户名长度在 3 到 20 个字符')
  }
  if (!loginForm.password) {
    return ElMessage.warning('请输入密码')
  }
  if(loginForm.password.length < 8 || loginForm.password.length > 30){
    return ElMessage.warning('密码长度在 8 到 30 个字符')
  }
  
  try {
    loading.value = true
    await userStore.login(companyId.value,loginForm)
    ElMessage.success('登录成功')
    router.push(`/`)
  } catch (error) {
    console.log(error)
    ElMessage.error(error.msg || '登录失败')
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.login-container {
  --login-panel-font-color: #38c9ce;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 100vw;
  background-color: rgba(59, 137, 154, 1.000);
  background-image: url("@/assets/img/bg1.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
 /* background: linear-gradient(0deg, rgba(164, 116, 81, 1.000) 0.000%, rgba(156, 152, 129, 1.000) 16.667%, rgba(115, 160, 157, 1.000) 33.333%,
  rgba(59, 137, 154, 1.000) 50.000%, rgba(9, 91, 121, 1.000) 66.667%, rgba(0, 40, 71, 1.000) 83.333%, rgb(1, 3, 59) 100.000%)
*/  }

/*.video-background{*/
/*  position: absolute;*/
/*  top: 0;*/
/*  left: 0;*/
/*  width: 100%;*/
/*  height: 100%;*/
/*  z-index: 0;*/
/*}*/

.login-form {
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  z-index: 1;
  /* background: inherit; */
  border-radius: 18px;
  overflow: hidden;
}

.login-card::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    width: calc(100% + 20px);
    /* + 两边各有一个空格  否则 无效*/
    height: calc(100% + 20px);
    /* background: inherit; */
    /* box-shadow: 0 0 0 200px rgba(255, 255, 255, .2) inset; */
    z-index: -1;
    filter: blur(6px);
    overflow: hidden;
}

.login-form h2 {
    font-size: 18px;
    font-weight: 550;
    color: var(--login-panel-font-color);
}

.login-form input,
.login-form button {
    margin: 6px 0;
    font-size: 15px;
    height: 46px;
    background-color: rgba(255, 255, 255, .2);
    border: 1px solid #ffffff00;
    border-radius: 4px;
    padding: 0 14px;
    color: var(--login-panel-font-color);
}

.login-form input:focus,
.login-form button:focus {
    outline: none;
    border: 1px solid #8fbbad;
}

.login-form input::placeholder {
    color: #8fbbad;
}

.remember-me {
  display: flex;
  align-items: center;
  margin: 6px 0;
  text-align: left;
}

.remember-me .custom-checkbox {
  width: 16px;
  height: 16px;
  margin: 0 8px 0 0;
  background-color: #e0e0e0;
  cursor: pointer;
  border: 1px solid #707070;
  border-radius: 2px;
  display: inline-block;
  margin-right: 8px;
  position: relative;
  transition: background-color 0.2s;
}

.remember-me input[type="checkbox"]:checked + .custom-checkbox {
  background-color: #79add1;
  border-color: #515e69;
}

.remember-me input[type="checkbox"]:checked + .custom-checkbox::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 0px;
  width: 5px;
  height: 11px;
  border: solid #fff;
  border-radius: 1px;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

.remember-me label {
  font-size: 14px;
  color: var(--login-panel-font-color);
  cursor: pointer;
}

.login-form button {
    position: relative;
    margin-top: 22px;
    background-color: rgba(93, 128, 137, .4);
    color: #ffffff;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.4s;
}

.login-form button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-form button:hover:not(:disabled) {
    background-color: rgba(27, 130, 134, 0.67);
}

.login-form button::before,
.login-form button::after {
    content: '';
    display: block;
    width: 80px;
    height: 100%;
    background-color: rgba(179, 255, 241, 0.5);
    opacity: 0.5;
    position: absolute;
    left: 0;
    top: 0;
    transform: skewX(-15deg);
    filter: blur(30px);
    overflow: hidden;
    transform: translateX(-100px);
}

.login-form button::after {
    width: 40px;
    background-color: rgba(179, 255, 232, 0.3);
    left: 60px;
    filter: blur(5px);
    opacity: 0;
}

.login-form button:hover:not(:disabled)::before {
    transition: all 1s;
    transform: translateX(320px);
    opacity: 0.7;
}

.login-form button:hover:not(:disabled)::after {
    transition: all 1s;
    transform: translateX(320px);
    opacity: 1;
}



/* ----------------- */
.login-card {
  width: 420px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(5px);
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.logo-img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.logo-text {
  font-size: 24px;
  color: #f0f0f0;
  margin: 0;
}

</style> 