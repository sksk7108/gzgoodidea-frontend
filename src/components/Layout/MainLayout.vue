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
          <el-menu-item index="/favorites">我的文案</el-menu-item>
          <el-menu-item index="/keywords">我的关键词</el-menu-item>
          <!-- <el-menu-item index="/copywriting">智能文案</el-menu-item> -->
          <el-menu-item index="/matrix">矩阵管理</el-menu-item>
          <!-- 隐藏AI话术配置 -->
          <!-- <el-menu-item index="/ai-config">AI话术配置</el-menu-item> -->
        </el-menu>
        
        <!-- 用户信息和退出按钮 -->
        <div class="user-actions">
          <div class="user-info">
            <el-avatar :size="40" class="user-avatar">
              <svg viewBox="0 0 1024 1024" width="40" height="40">
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#e6e6e6"></path>
                <path d="M512 336c-63.6 0-115.2 51.6-115.2 115.2S448.4 566.4 512 566.4 627.2 514.8 627.2 451.2 575.6 336 512 336z" fill="#e6e6e6"></path>
                <path d="M693.6 627.2c-23.4-36.5-55.3-66.8-93.6-88.1 25.7-19.5 42.4-50.4 42.4-85.3 0-59.4-48.2-107.6-107.6-107.6s-107.6 48.2-107.6 107.6c0 34.9 16.7 65.9 42.4 85.3-38.3 21.3-70.2 51.6-93.6 88.1C344.8 574.2 328 533.4 328 489.6c0-101.4 82.2-183.6 183.6-183.6s183.6 82.2 183.6 183.6c0 43.8-16.8 84.6-46.8 124.8z" fill="#e6e6e6"></path>
                <path d="M512 704c-128 0-240-64-240-192h72c0 48 96 120 168 120s168-72 168-120h72c0 128-112 192-240 192z" fill="#e6e6e6"></path>
              </svg>
            </el-avatar>
            <div class="user-details">
              <div class="company-info">
                <el-tag size="small" type="primary" class="role">公司</el-tag>
                <!-- <svg t="1747814888647" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6305" width="16" height="16"><path d="M859.6 204H603.9v-37c0-54.4-44.2-98.6-98.6-98.6H164.4c-54.4 0-98.6 44.2-98.6 98.6v788.6h892.3v-653c0.1-54.4-44.1-98.6-98.5-98.6zM538.2 889.9H131.5V167c0-18.1 14.7-32.9 32.9-32.9h340.9c18.1 0 32.9 14.7 32.9 32.9v722.9z m354.3 0H603.9V269.7h255.7c18.1 0 32.9 14.7 32.9 32.9v587.3z" fill="#0061b2" p-id="6306"></path><path d="M439.6 936.6h-64v-212c0-8.8-7.2-16-16-16h-64c-8.8 0-16 7.2-16 16v212h-64v-228c0-35.3 28.7-64 64-64h96c35.3 0 64 28.7 64 64v228zM395.6 337.6h-136c-17.6 0-32-14.4-32-32s14.4-32 32-32h136c17.6 0 32 14.4 32 32s-14.4 32-32 32zM395.6 488.8h-136c-17.6 0-32-14.4-32-32s14.4-32 32-32h136c17.6 0 32 14.4 32 32s-14.4 32-32 32zM796.7 481.3h-96c-17.6 0-32-14.4-32-32s14.4-32 32-32h96c17.6 0 32 14.4 32 32s-14.4 32-32 32zM800.2 608h-96c-17.6 0-32-14.4-32-32s14.4-32 32-32h96c17.6 0 32 14.4 32 32s-14.4 32-32 32zM800.2 729.5h-96c-17.6 0-32-14.4-32-32s14.4-32 32-32h96c17.6 0 32 14.4 32 32s-14.4 32-32 32z" fill="#0061b2" p-id="6307"></path></svg> -->
                <span class="company-name">{{ userStore.company || '无忧传媒' }}</span>
              </div>
              <div class="user-name-container">
                <el-tag size="small" type="success" class="role">{{ userStore.role || '员工' }}</el-tag>
                <span class="username">{{ userStore.account }}</span>
              </div>
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
  transition: all 0.3s linear;
}

.menu::-webkit-scrollbar{
  display: none;
}

.user-actions {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user-actions:hover {
  background-color: #f5f7fa;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  background-color: #409EFF;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.user-details {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 1.2;
  gap: 4px;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.company-name {
  color: #303133;
  font-weight: 600;
  font-size: 14px;
}

.role {
  font-size: 10px;
  padding: 0 4px;
  height: 18px;
  line-height: 16px;
}

.user-name-container {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
  font-size: 12px;
}

.username {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.logout-button {
  margin-left: 10px;
  color: #F56C6C;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-button:hover {
  color: #f78989;
  background-color: rgba(245, 108, 108, 0.1);
  border-radius: 4px;
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
    font-size: 13px;
  }
  .company-name {
    max-width: 100px;
  }
  .menu{
    max-width: 400px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
  }
}
@media screen and (max-width: 700px){
    .logo {
        display: none;
    }
    .company-info, .user-name-container {
      display: none;
    }
}
@media screen and (max-width: 600px) {
  .username {
    display: none;
  }
  .role {
    display: none;
  }
  .menu{
    max-width: 300px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
  }
}
</style> 
