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
        >
          <el-menu-item index="/videos">视频列表</el-menu-item>
          <el-menu-item index="/keywords">关键词列表</el-menu-item>
          <el-menu-item index="/favorites">我的收藏</el-menu-item>
          <el-menu-item index="/saved">已保存</el-menu-item>
          <!-- 隐藏AI话术配置 -->
          <!-- <el-menu-item index="/ai-config">AI话术配置</el-menu-item> -->
        </el-menu>
        
        <!-- 用户信息和退出按钮 -->
        <div class="user-actions">
          <span class="username">{{ userStore.username }}</span>
          <el-button type="text" @click="handleLogout">退出登录</el-button>
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
}

.logo-img {
  width: 30px;
  height: 30px;
  margin-right: 3px;
}

.user-actions {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.username {
  margin-right: 10px;
  font-size: 14px;
  color: #606266;
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
</style> 