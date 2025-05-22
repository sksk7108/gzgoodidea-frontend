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
import { getVideoList, deleteVideo, toggleVideoFavorite } from '@/api/video'
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

// 格式化topic为HTML
function formatTopicForHTML(topic) {
  if (!topic) return [];
  // 按#分割字符串成数组,过滤掉空字符串
  return topic.split('#').filter(item => item).map(item => '#'+item);
}

// 处理视频收藏
const handleFavorite = async (video) => {
  try {
    await toggleVideoFavorite(video.id, video.isFavorite)
    
    // 更新本地视频列表数据
    const index = videoList.value.findIndex(item => item.id === video.id)
    if (index !== -1) {
      videoList.value[index] = { ...videoList.value[index], ...video }
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
  }
}

// 处理视频保存
const handleSave = (video) => {
  // 更新本地视频列表数据
  const index = videoList.value.findIndex(item => item.id === video.id)
  if (index !== -1) {
    videoList.value[index] = { ...videoList.value[index], ...video }
    // 格式化topic
    videoList.value[index].formattedTopic = formatTopicForHTML(video.topic)
  }
}

// 删除视频
const handleDelete = (video) => {
  ElMessageBox.confirm('确认删除该视频吗？此操作不可恢复。', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteVideo(video.id)
      ElMessage.success('删除成功')
      // 从列表中移除
      videoList.value = videoList.value.filter(item => item.id !== video.id)
      total.value--
      if (videoList.value.length === 0 && total.value > 0) {
        fetchSavedList()
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
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