<!-- FavoritesList.vue -->
<template>
  <div class="video-list">
    <h2 class="page-title">我的文案</h2>
    
    <!-- 视频列表 -->
    <div v-loading="loading" class="video-list-container">
      <div v-if="videoList.length > 0" class="video-rows">
        <VideoCardRow
          v-for="video in videoList"
          :key="video.id"
          :video="video"
          @favorite="handleFavorite"
          @save="handleSave"
          @delete="handleDelete"
          class="video-row-item"
          :isMyCopyPage="true"
        />
      </div>
      <el-empty v-else description="暂无收藏内容" />
    </div>

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
import { ref, reactive, onMounted, computed, provide, nextTick } from 'vue'
import VideoCardRow from '@/components/VideoCardRow.vue'
import { getVideoList, deleteVideo, getCollectedVideos, deleteVideoCopywriting } from '@/api/video'
import { ElMessageBox, ElMessage } from 'element-plus'

// 提供全局视频播放状态
const currentlyPlaying = reactive({ videoId: null })
provide('currentlyPlaying', currentlyPlaying)

// 加载状态
const loading = ref(false)

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10) // 行式布局每页展示10条
const total = ref(0)

// 视频列表数据
const videoList = ref([])

// 获取收藏的视频列表
const fetchFavoritesList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      // isFavorite: true // 只获取收藏的视频
    }
    
    const response = await getCollectedVideos(params)
    // const response = null
    
    if (response && response.records) {
      videoList.value = []
      nextTick(() => {
        videoList.value = response.records.map(video => {
          return {
            ...video,
          formattedTopic: formatTopicForHTML(video.topic),
          isFavorite: true, // 确保标记为收藏状态
          originalScript: video.content
          }
        })
      })
      total.value = response.total || 0
    } else {
      videoList.value = []
      total.value = 0
    }

    // 处理空数据情况
    if (videoList.value.length === 0 && currentPage.value > 1) {
      currentPage.value = 1
      fetchFavoritesList()
    }
  } catch (error) {
    console.error('获取收藏列表失败', error)
    ElMessage.error('获取收藏列表失败')
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
const handleFavorite = (video) => {
  // 从列表中移除
  videoList.value = videoList.value.filter(item => item.id !== video.id)
  total.value--
  if (videoList.value.length === 0 && total.value > 0) {
    fetchFavoritesList()
  }
  ElMessage.success('已取消收藏')
}

// 保存视频
const handleSave = (video) => {
  const index = videoList.value.findIndex(item => item.id === video.id)
  if (index !== -1) {
    videoList.value[index].title = video.title
    videoList.value[index].originalScript = video.content
  }
}

// 删除视频
const handleDelete = (video) => {
  ElMessageBox.confirm('确认删除该视频吗？此操作不可恢复。', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    'lock-scroll': false,
    type: 'warning'
  }).then(async () => {
    try {
      await deleteVideoCopywriting(video.id, false)
      ElMessage.success('删除成功')
      // 从列表中移除
      videoList.value = videoList.value.filter(item => item.id !== video.id)
      total.value--
      if (videoList.value.length === 0 && total.value > 0) {
        fetchFavoritesList()
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 处理分页
const handlePageChange = (page) => {
  currentPage.value = page
  fetchFavoritesList()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchFavoritesList()
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
  border-left: 4px solid #409EFF;
  padding-left: 10px;
}

.video-list-container {
  width: 100%;
  overflow-x: hidden;
  min-height: 400px;
}

.video-rows {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.video-row-item {
  width: 100%;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
  width: 100%;
}

@media screen and (max-width: 900px) {
  .video-list {
    padding: 0 10px;
  }
}
</style> 