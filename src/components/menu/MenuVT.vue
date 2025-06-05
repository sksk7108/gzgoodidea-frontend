<template>
    <img src="@/assets/img/logo.png" class="logo-img">
    <div class="logo">
        {{ companyConfig?.name || '爆米热点' }}</div>
    <el-menu
        mode="horizontal"
        :router="true"
        :ellipsis="false"
        :default-active="activeMenu"
        class="menu"
    >
        <el-menu-item :index="`/keywords`">我的关键词</el-menu-item>
        <el-menu-item :index="`/index`">视频列表</el-menu-item>
        <el-menu-item :index="`/favorites`">我的收藏</el-menu-item>
        <el-menu-item :index="`/benchmark-accounts`">对标账号</el-menu-item>
        <el-menu-item :index="`/matrix`">矩阵管理</el-menu-item>
        <!-- <el-menu-item :index="`/copywriting`">智能文案</el-menu-item> -->
        <!-- 隐藏AI话术配置 -->
        <!-- <el-menu-item :index="`/ai-config`">AI话术配置</el-menu-item> -->
    </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
    companyConfig: {
        type: Object,
        default: () => ({})
    }
})

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>
<style scoped>
.menu {
  min-width: 200px;
  overflow: scroll;
  transition: all 0.3s linear;
}

.menu::-webkit-scrollbar{
  display: none;
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

@media screen and (max-width: 900px) {
  .logo {
    font-size: 16px;
    margin-right: 10px;
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
}
@media screen and (max-width: 600px) {


  .menu{
    max-width: 300px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
  }
}
</style>
