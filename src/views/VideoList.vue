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
              v-if="source.icon && source.value" 
              :src="source.icon" 
              class="source-icon"
            />
            <span>{{ source.label }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 视频列表 -->
    <div class="video-grid-container">
      <div class="masonry-grid">
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
    </div>

    <!-- 分页 -->
    <div class="pagination">
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
import { ref, reactive } from 'vue'
import VideoCard from '@/components/VideoCard.vue'

// 选中的标签
const selectedTag = ref('')

// 筛选表单
const filterForm = reactive({
  source: ''
})

// 标签选项
const tagOptions = [
  { label: '全部', value: '' },
  { label: '热门', value: 'hot' },
  { label: '搞笑', value: 'funny' },
  { label: '美食', value: 'food' },
  { label: '旅游', value: 'travel' },
  { label: '时尚', value: 'fashion' },
  { label: '美妆', value: 'beauty' },
  { label: '知识', value: 'knowledge' },
  { label: '音乐', value: 'music' },
  { label: '舞蹈', value: 'dance' },
  { label: '宠物', value: 'pet' },
  { label: '游戏', value: 'game' },
  { label: '体育', value: 'sports' },
  { label: '育儿', value: 'parenting' },
  { label: '科技', value: 'tech' },
  { label: '健身', value: 'fitness' }
]

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 视频列表数据
const videoList = ref([
  {
    id: 1,
    title: '示例视频标题',
    videoUrl: 'http://ai.gzgoodidea.com/api/videos/file/original/c70885ea-23b9-48ea-8d65-2022d7f3f1cd.mp4',
    likes: 1000,
    comments: 100,
    shares: 50,
    favorites: 200,
    tags: ['热门', '搞笑'],
    keywords: ['关键词1', '关键词2'],
    source: '抖音',
    originalScript: '我們重新演藝了中國的國水，讓他打造了一個經驗的結果。讓現在的年輕人，換一個角度，重新審視中國的川中文化，(WOW)。',
    modifiedScript: '我們重新演藝了中國的國水，讓他打造了一個經驗的結果。讓現在的年輕人，換一個角度，重新審視中國的川中文化，(WOW)。',
    publishTime: '2024-03-20 12:00:00'
  },
  // 添加更多测试数据
  {
    id: 2,
    title: '示例视频标题2',
    videoUrl: 'https://example.com/video2.mp4',
    likes: 2000,
    comments: 200,
    shares: 100,
    favorites: 300,
    tags: ['热门', '生活'],
    keywords: ['关键词3', '关键词4'],
    source: '快手',
    originalScript: '这是原始话术内容2...',
    modifiedScript: '这是AI改写后的话术内容2...',
    publishTime: '2024-03-21 12:00:00'
  },
  // 添加更多测试数据用于展示布局效果
  {
    id: 3,
    title: '示例视频标题3',
    videoUrl: 'https://example.com/video3.mp4',
    likes: 3000,
    comments: 300,
    shares: 150,
    favorites: 400,
    tags: ['热门', '美食'],
    keywords: ['关键词5', '关键词6'],
    source: '小红书',
    originalScript: '这是原始话术内容3...',
    modifiedScript: '这是AI改写后的话术内容3...',
    publishTime: '2024-03-22 12:00:00'
  },
  {
    id: 4,
    title: '示例视频标题4',
    videoUrl: 'https://example.com/video4.mp4',
    likes: 4000,
    comments: 400,
    shares: 200,
    favorites: 500,
    tags: ['热门', '旅游'],
    keywords: ['关键词7', '关键词8'],
    source: '抖音',
    originalScript: '这是原始话术内容4...',
    modifiedScript: '这是AI改写后的话术内容4...',
    publishTime: '2024-03-23 12:00:00'
  },
  {
    id: 5,
    title: '示例视频标题5',
    videoUrl: 'https://example.com/video5.mp4',
    likes: 5000,
    comments: 500,
    shares: 250,
    favorites: 600,
    tags: ['热门', '时尚'],
    keywords: ['关键词9', '关键词10'],
    source: '快手',
    originalScript: '这是原始话术内容5...',
    modifiedScript: '这是AI改写后的话术内容5...',
    publishTime: '2024-03-24 12:00:00'
  },
  {
    id: 6,
    title: '示例视频标题6',
    videoUrl: 'https://example.com/video5.mp4',
    likes: 5000,
    comments: 500,
    shares: 250,
    favorites: 600,
    tags: ['热门', '时尚'],
    keywords: ['关键词9', '关键词10'],
    source: '快手',
    originalScript: '这是原始话术内容5...',
    modifiedScript: '这是AI改写后的话术内容5...',
    publishTime: '2024-03-24 12:00:00'
  }
])

// 视频来源选项
const sourceOptions = [
  {
    label: '全部来源',
    value: '',
  },
  {
    label: '抖音',
    value: 'douyin',
    icon: 'https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico'
  },
  {
    label: '快手',
    value: 'kuaishou',
    icon: 'https://static.yximgs.com/udata/pkg/fe/widgets_header_logo.4e8554cd.png'
  },
  {
    label: '小红书',
    value: 'xiaohongshu',
    icon: 'https://ci.xiaohongshu.com/favicon.ico'
  },
  {
    label: 'B站',
    value: 'bilibili',
    icon: 'https://www.bilibili.com/favicon.ico'
  }
]

// 选择标签（单选）
const selectTag = (tagValue) => {
  // 如果点击已选中的标签，则取消选择
  if (selectedTag.value === tagValue) {
    selectedTag.value = ''
  } else {
    selectedTag.value = tagValue
  }
  applyFilters()
}

// 选择来源
const selectSource = (sourceValue) => {
  filterForm.source = sourceValue
  applyFilters()
}

// 应用筛选
const applyFilters = () => {
  console.log('应用筛选：', {
    tag: selectedTag.value,
    source: filterForm.source
  })
  
  // TODO: 根据筛选条件获取数据
}

// 重置筛选
const resetFilter = () => {
  selectedTag.value = ''
  filterForm.source = ''
  applyFilters()
}

// 处理分页
const handlePageChange = (page) => {
  currentPage.value = page
  // TODO: 加载对应页码的数据
}

// 视频操作
const handleApprove = (video) => {
  console.log('通过视频：', video)
}

const handleReject = (video) => {
  console.log('拒绝视频：', video)
}

const handleDelete = (video) => {
  console.log('删除视频：', video)
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