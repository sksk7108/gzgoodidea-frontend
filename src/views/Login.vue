<!-- Login.vue -->
<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-container">
<!--        <img src="@/assets/img/logo.png" class="logo-img">-->
        <svg t="1746521955524" class="login-img" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7568" xmlns:xlink="http://www.w3.org/1999/xlink" width="48" height="48"><path d="M776 685.11c0 131.74-120.31 217.78-268.72 217.78s-268.67-77.11-268.67-205.78c0-50.07 10.34-94.3 67.78-163.56 101.42-122.27 73.86-250.92 73.86-250.92 64.2 15.82 182 92.21 207.76 280.5 47.52-50.89 26.1-197.42 26.1-197.42S776 454.44 776 685.11z" fill="#E9F1FF" p-id="7569"></path><path d="M515.41 965.26c-104.06 0-199.4-28.71-268.47-80.82-36.46-27.52-64.95-60.79-84.67-98.9C141.52 745.44 131 700.91 131 653.2c0-44.48 4.82-79.87 15.64-114.74 13.63-43.91 36.83-85.76 70.94-128 29.36-36.32 52.39-75.33 68.44-116a392.82 392.82 0 0 0 25.13-100c6.49-57.08-2.46-95.93-2.86-97.62A31.87 31.87 0 0 1 345 57.66c30.52 5.5 62.56 17.67 92.65 35.19 33.65 19.59 64.66 45.45 92.18 76.87 30.72 35.06 56.55 76.54 76.78 123.29a575.92 575.92 0 0 1 21.19 57.36c1-11.8 1.7-24.9 1.91-39.42a773.61 773.61 0 0 0-5.94-104.28 32 32 0 0 1 49.66-30.93c2.35 1.6 58.2 39.95 113.87 114.69a572.72 572.72 0 0 1 77.3 141.11 558.54 558.54 0 0 1 35.22 196.66c0 104.19-39.81 191.35-115.14 252-34.65 27.92-75.91 49.42-122.63 63.89-45.26 14.06-94.59 21.17-146.64 21.17zM377 133.84a421.82 421.82 0 0 1-1.93 64.61A456.31 456.31 0 0 1 346.36 316c-18.48 47.44-45.06 92.78-79 134.76C207.3 525 195 585.4 195 653.2c0 73.18 31.29 135.48 90.49 180.15 58 43.79 139.68 67.91 229.92 67.91 45.62 0 88.59-6.15 127.71-18.26 39-12.07 73.08-29.76 101.4-52.58a237.28 237.28 0 0 0 66.65-84.24c16.36-34.78 24.65-74.48 24.65-118a494.92 494.92 0 0 0-30.61-172.76 508.47 508.47 0 0 0-67.79-124.83 532 532 0 0 0-44-52.21c0.3 10.37 0.43 21.32 0.28 32.6-1.12 85.63-17.5 146.63-48.69 181.29a32 32 0 0 1-55.51-17.22c-7.61-57.67-21.62-110.37-41.64-156.65-17.59-40.63-39.85-76.48-66.18-106.53-30.74-35.09-67.35-62.17-104.68-78.03z" fill="#319fda" p-id="7570"></path><path d="M498.47 790.07a32 32 0 0 1-32 32c-93.29 0-147.19-42.14-176-77.49-30.68-37.66-39.51-74.91-40.42-79a32 32 0 1 1 62.49-13.77c0.68 2.64 7.72 28.91 29.13 54.28 29.1 34.48 71.07 52 124.76 52a32 32 0 0 1 32.04 31.98z" fill="#319fda" p-id="7571"></path></svg>
        <h2 class="logo-text">爆米热点</h2>
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
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

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
  // 简单表单验证
  if (!loginForm.account) {
    return ElMessage.warning('请输入用户名')
  }
  if (!loginForm.password) {
    return ElMessage.warning('请输入密码')
  }
  
  try {
    loading.value = true
    await userStore.login(loginForm)
    ElMessage.success('登录成功')
    router.push('/videos')
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 100vw;
  background-color: #f5f7fa;
  background: linear-gradient(0deg, rgba(164, 116, 81, 1.000) 0.000%, rgba(156, 152, 129, 1.000) 16.667%, rgba(115, 160, 157, 1.000) 33.333%,
  rgba(59, 137, 154, 1.000) 50.000%, rgba(9, 91, 121, 1.000) 66.667%, rgba(0, 40, 71, 1.000) 83.333%, rgb(1, 3, 59) 100.000%)
  }

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
    font-weight: 400;
    color: #344d3e;
}

.login-form input,
.login-form button {
    margin: 6px 0;
    height: 46px;
    background-color: rgba(255, 255, 255, .2);
    border: none;
    border-radius: 4px;
    padding: 0 14px;
    color: #3d5245;
}

.login-form input:focus,
.login-form button:focus {
    outline: none;
    border: 1px solid #3d5245;
}

.login-form input::placeholder {
    color: #3d5245;
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
  background-color: #667683;
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
  color: #3d5245;
  cursor: pointer;
}

.login-form button {
    position: relative;
    margin-top: 22px;
    background-color: rgba(57, 88, 69, .4);
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
    background-color: rgba(12, 88, 38, 0.67);
}

.login-form button::before,
.login-form button::after {
    content: '';
    display: block;
    width: 80px;
    height: 100%;
    background-color: rgba(179, 255, 210, .5);
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
    background-color: rgba(179, 255, 210, .3);
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
  width: 400px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.logo-img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  font-size: 24px;
  color: #f0f0f0;
  margin: 0;
}

</style> 