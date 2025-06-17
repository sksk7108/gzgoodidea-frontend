<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>抱歉，页面不存在</h2>
      <p>您访问的页面不存在或已被删除</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.not-found-content {
  text-align: center;
  padding: 20px;
  max-width: 100%;
}

.not-found-content h1 {
  font-size: 120px;
  margin: 0;
  color: #409EFF;
}

.not-found-content h2 {
  font-size: 30px;
  margin: 20px 0;
  color: #303133;
}

.not-found-content p {
  font-size: 16px;
  margin-bottom: 30px;
  color: #606266;
}

@media screen and (max-width: 768px) {
  .not-found-content h1 {
    font-size: 80px;
  }
  
  .not-found-content h2 {
    font-size: 24px;
  }
  
  .not-found-content p {
    font-size: 14px;
  }
}
</style> 