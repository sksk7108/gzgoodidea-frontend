<!-- MainLayout.vue -->
<template>
  <div class="main-layout">
    <el-container>
      <el-header class="header">
        <img src="@/assets/img/logo.png" class="logo-img">
        <div class="logo">
            爆米热点</div>
        <el-menu
          mode="horizontal"
          :router="true"
          :ellipsis="false"
          :default-active="activeMenu"
          class="menu"
        >
          <el-menu-item index="/videos">视频列表</el-menu-item>
          <el-menu-item index="/keywords">关键词列表</el-menu-item>
           <el-menu-item index="/favorites">我的收藏</el-menu-item>
          <el-menu-item index="/saved">保存的文案</el-menu-item>
          <!-- 隐藏AI话术配置 -->
          <!-- <el-menu-item index="/ai-config">AI话术配置</el-menu-item> -->
        </el-menu>
        
        <!-- 用户信息和退出按钮 -->
        <div class="user-actions">
          <div class="user-info">
            <el-avatar :size="32" class="user-avatar">
              <svg viewBox="0 0 1024 1024" width="32" height="32">
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#e6e6e6"></path>
                <path d="M512 336c-63.6 0-115.2 51.6-115.2 115.2S448.4 566.4 512 566.4 627.2 514.8 627.2 451.2 575.6 336 512 336z" fill="#e6e6e6"></path>
                <path d="M693.6 627.2c-23.4-36.5-55.3-66.8-93.6-88.1 25.7-19.5 42.4-50.4 42.4-85.3 0-59.4-48.2-107.6-107.6-107.6s-107.6 48.2-107.6 107.6c0 34.9 16.7 65.9 42.4 85.3-38.3 21.3-70.2 51.6-93.6 88.1C344.8 574.2 328 533.4 328 489.6c0-101.4 82.2-183.6 183.6-183.6s183.6 82.2 183.6 183.6c0 43.8-16.8 84.6-46.8 124.8z" fill="#e6e6e6"></path>
                <path d="M512 704c-128 0-240-64-240-192h72c0 48 96 120 168 120s168-72 168-120h72c0 128-112 192-240 192z" fill="#e6e6e6"></path>
              </svg>
            </el-avatar>
            <div class="user-details">
              <!-- <span class="welcome-text">欢迎您</span> -->
              <span class="username">{{ userStore.account }}</span>
            </div>
          </div>
          <el-divider direction="vertical" />
          <el-button type="text" @click="handleLogout" class="logout-button">退出登录</el-button>
        </div>
      </el-header>
      <el-main class="main-container">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const activeMenu = computed(() => route.path)

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await userStore.logout()
      ElMessage.success('已退出登录')
      router.push('/login')
    } catch (error) {
      ElMessage.error('退出登录失败')
    }
  }).catch(() => {
    // 点击取消按钮，不做任何操作
  })
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  width: 100%;
}

.el-container {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin-right: 40px;
  color: #409EFF;
  transition: all 0.3s ease;
}

.logo-img {
  width: 30px;
  height: 30px;
  margin-right: 3px;
}

.menu {
  min-width: 200px;
  overflow: scroll;
  transition: all 0.3s ease;
}

.menu::-webkit-scrollbar{
  display: none;
}

.user-actions {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  background-color: #409EFF;
}

.user-details {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 1.2;
}

.welcome-text {
  color: #909399;
  font-size: 12px;
}

.username {
  color: #303133;
  font-weight: 500;
}

.logout-button {
  margin-left: 10px;
  color: #F56C6C;
  font-weight: 500;
}

.logout-button:hover {
  color: #f78989;
}

.main-container {
  padding: 20px;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
  width: 100%;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

:deep(.el-menu) {
  flex: 1;
  border: none;
}

@media screen and (max-width: 2000px) {
 
}

@media screen and (max-width: 1600px) {
  
}

@media screen and (max-width: 1200px) {
}

@media screen and (max-width: 900px) {
  .logo {
    font-size: 16px;
    margin-right: 10px;
  }
  .username {
    font-size: 10px;
  }
  .menu{
    max-width: 400px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
  }
}
@media screen and (max-width: 600px) {
  .logo {
    display: none;
  }
  .username {
    display: none;
  }
  .menu{
    max-width: 300px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
  }
}
</style> 
