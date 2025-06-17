<!-- SavedList.vue -->
<template>
  <div class="video-list">
    <h2 class="page-title">智能文案</h2>

    <!-- 分页 -->
    <div class="pagination" v-if="total > 0">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

// 加载状态
const loading = ref(false)

// 分页数据
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)

// 视频列表数据
const videoList = ref([])

// 获取已保存的视频列表
const fetchSavedList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      isEdited: true // 只获取已编辑保存的视频
    }
    
    // const response = await getVideoList(params)
    const response = null

    if (response && response.records) {
      videoList.value = response.records.map(video => ({
        ...video,
        formattedTopic: formatTopicForHTML(video.topic),
      }))
      total.value = response.total || 0
      
      // 读取收藏状态
      videoList.value.forEach(video => {
        video.isFavorite = localStorage.getItem(`favorite_${video.id}`) === 'true'
      })
    } else {
      videoList.value = []
      total.value = 0
    }

    // 处理空数据情况
    if (videoList.value.length === 0 && currentPage.value > 1) {
      currentPage.value = 1
      fetchSavedList()
    }
  } catch (error) {
    console.error('获取保存列表失败', error)
    ElMessage.error('获取保存列表失败')
    videoList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}



// 处理分页
const handlePageChange = (page) => {
  currentPage.value = page
  fetchSavedList()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchSavedList()
})
</script>

<style scoped>
.video-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}

.page-title {
  font-size: 22px;
  font-weight: bold;
  margin: 20px 0;
  border-left: 4px solid #67C23A;
  padding-left: 10px;
}

.video-grid-container {
  width: 100%;
  overflow-x: hidden;
  min-height: 400px;
}


.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
  width: 100%;
}

</style> 