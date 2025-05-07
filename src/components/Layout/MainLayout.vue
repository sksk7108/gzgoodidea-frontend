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
          :default-active="activeMenu"
        >
          <el-menu-item index="/videos">视频列表</el-menu-item>
          <el-menu-item index="/keywords">关键词列表</el-menu-item>
          <el-menu-item index="/ai-config">AI话术配置</el-menu-item>
        </el-menu>
      </el-header>
      <el-main class="main-container">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = computed(() => route.path)
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