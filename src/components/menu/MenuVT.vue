<template>
    <img :src="props.companyConfig.logo" class="logo-img">
    <div class="logo" :style="{fontSize: props.companyConfig?.name?.length<8 ? '20px' : '18px'}">
        {{ props.companyConfig?.name || '爆米热点' }}</div>
    <el-menu
        mode="horizontal"
        :router="true"
        :ellipsis="false"
        :default-active="activeMenu"
        class="menu"
    >
        <el-menu-item v-for="item in props.companyConfig.menu" :index="item.path">{{ item.name }}</el-menu-item>
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
  margin-right: 6px;
}

@media screen and (max-width: 1100px) {

  .menu{
    max-width: 600px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
  }
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
