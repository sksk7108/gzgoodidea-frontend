<!-- VideoList.vue -->
<template>
  <div class="video-list">
    <!-- 筛选区域 -->
    <el-card class="filter-section">
      <div class="filter-header">
        <div class="source-label">热门标签：</div>
        <el-button type="text" @click="resetFilter">清空筛选</el-button>
      </div>
      
      <!-- 标签云 -->
      <div class="tag-cloud">
        <el-tag
          v-for="tag in tagOptions"
          :key="tag.value"
          :type="selectedTag === tag.value ? 'primary' : 'info'"
          class="tag-item"
          @click="selectTag(tag.value)"
          :effect="selectedTag === tag.value ? 'dark' : 'plain'"
        >
          {{ tag.label }}
        </el-tag>
      </div>
      
      <!-- 视频来源 -->
      <div class="source-filter">
        <div class="source-label">视频来源：</div>
        <div class="source-items">
          <div 
            v-for="source in sourceOptions" 
            :key="source.value"
            class="source-item"
            :class="{ 'active': filterForm.source === source.value }"
            @click="selectSource(source.value)"
          >
            <img 
              v-if="source.png_src && source.value" 
              :src="source.png_src" 
              class="source-icon"
              style="width: 16px; height: 16px;"
            />
            <span>{{ source.label }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 视频列表 -->
    <div v-loading="loading" class="video-grid-container">
      <div v-if="videoList.length > 0" class="masonry-grid">
        <VideoCard
          v-for="video in videoList"
          :key="video.id"
          :video="video"
          @approve="handleApprove"
          @reject="handleReject"
          @delete="handleDelete"
          class="masonry-item"
        />
      </div>
      <el-empty v-else description="暂无数据" />
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
import { ref, reactive, onMounted } from 'vue'
import VideoCard from '@/components/VideoCard.vue'
import { getVideoList, getVideosByTag, getVideosBySource, auditVideoStatus, deleteVideo } from '@/api/video'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getKeywordList } from '@/api/keyword'
// 加载状态
const loading = ref(false)

// 选中的标签
const selectedTag = ref('')

// 筛选表单
const filterForm = reactive({
  source: ''
})

// 标签选项
const tagOptions = ref([])

// 分页数据
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)

// 视频列表数据
const videoList = ref([])

// 视频来源选项
const sourceOptions = [
  {
    label: '全部来源',
    value: '',
  },
  {
    label: '抖音',
    value: '抖音',
    png_src: '/douyin.png'
  },
  {
    label: '视频号',
    value: '视频号',
    png_src: '/shipinhao.png'
  },
  {
    label: '快手',
    value: '快手',
    png_src: '/kuaishou.png'
  },
  {
    label: '小红书',
    value: '小红书',
    png_src: '/xiaohongshu.png'
  },
  {
    label: 'B站',
    value: 'B站',
    png_src: '/bilibili.png'
  }
]

function formatTopicForHTML(topic) {
  if (!topic) return [];
  // 按#分割字符串成数组,过滤掉空字符串
  return topic.split('#').filter(item => item).map(item => '#'+item);
}

// 初始化数据
const fetchVideoList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      keywords: selectedTag.value,
      hotSource: filterForm.source
    }
    
    console.log('请求参数:', params)
    
    // 直接使用 getVideoList 方法，不再区分不同接口
    const response = await getVideoList(params)
    // console.log('接口返回数据:', response)
    
    // 根据实际接口返回格式进行适配
    if (response && response.records) {
      videoList.value = response.records || []
      total.value = response.total || 0
      videoList.value = response.records.map(video => ({
        ...video,
        formattedTopic: formatTopicForHTML(video.topic), // 格式化后的 topic
      }));
      console.log(videoList.value)
    } else {
      // 兼容其它数据格式
      videoList.value = Array.isArray(response) ? response : (response?.items || [])
      total.value = response?.total || (Array.isArray(response) ? response.length : 0)
    }

    // 处理空数据情况
    if (videoList.value.length === 0 && currentPage.value > 1) {
      currentPage.value = 1  // 如果当前页没有数据，回到第一页
      fetchVideoList()
    }
  } catch (error) {
    console.error('获取视频列表失败', error)
    ElMessage.error('获取视频列表失败')
    videoList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 获取标签选项
const fetchTagOptions = async () => {
  const response = await getKeywordList()
  tagOptions.value = response.map(tag => ({
    label: tag.content,
    value: tag.content
  }))
  tagOptions.value.unshift({
    label: '全部',
    value: ''
  })
}

// 组件挂载时获取数据
onMounted(() => {
  fetchVideoList()
  fetchTagOptions()
})

// 选择标签（单选）
const selectTag = (tagValue) => {
  // 如果点击已选中的标签，则取消选择
  if (selectedTag.value === tagValue) {
    selectedTag.value = ''
  } else {
    selectedTag.value = tagValue
  }
  currentPage.value = 1
  fetchVideoList()
}

// 选择来源
const selectSource = (sourceValue) => {
  filterForm.source = sourceValue
  currentPage.value = 1
  fetchVideoList()
}

// 重置筛选
const resetFilter = () => {
  selectedTag.value = ''
  filterForm.source = ''
  currentPage.value = 1
  fetchVideoList()
}

// 处理分页
const handlePageChange = (page) => {
  currentPage.value = page
  fetchVideoList()
}

// 通过视频
const handleApprove = (video) => {
  ElMessageBox.confirm('确认通过该视频吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }).then(async () => {
    try {
      await auditVideoStatus(video.id, { status: 1 })
      ElMessage.success('操作成功')
      fetchVideoList() // 刷新数据
    } catch (error) {
      ElMessage.error('操作失败')
    }
  }).catch(() => {})
}

// 拒绝视频
const handleReject = (video) => {
  ElMessageBox.prompt('请输入拒绝原因', '拒绝视频', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /\S+/,
    inputErrorMessage: '请输入拒绝原因'
  }).then(async ({ value }) => {
    try {
      await auditVideoStatus(video.id, { status: 2 })
      ElMessage.success('操作成功')
      fetchVideoList() // 刷新数据
    } catch (error) {
      ElMessage.error('操作失败')
    }
  }).catch(() => {})
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
      fetchVideoList() // 刷新数据
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}
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

.filter-section {
  margin-bottom: 20px;
  width: 100%;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.tag-item {
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.tag-item:hover {
  transform: translateY(-2px);
}

.source-filter {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.source-label {
  white-space: nowrap;
  font-size: 14px;
  color: #606266;
  margin-right: 10px;
}

.source-items {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.source-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  transition: all 0.2s;
}

.source-item:hover {
  color: #409EFF;
  background-color: #f0f7ff;
}

.source-item.active {
  color: #409EFF;
  background-color: #ecf5ff;
}

.source-icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.video-grid-container {
  width: 100%;
  overflow-x: hidden;
  min-height: 400px;
}

.masonry-grid {
  columns: 5;
  column-gap: 20px;
  width: 100%;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 20px;
  min-width: 380px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 20px;
  width: 100%;
}

@media screen and (max-width: 2000px) {
  .masonry-grid {
    columns: 4;
  }
}

@media screen and (max-width: 1600px) {
  .masonry-grid {
    columns: 3;
  }
}

@media screen and (max-width: 1200px) {
  .masonry-grid {
    columns: 2;
  }
}

@media screen and (max-width: 900px) {
  .masonry-grid {
    columns: 1;
  }
  
  .video-list {
    padding: 0 10px;
  }
}
</style>    