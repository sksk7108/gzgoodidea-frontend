<!-- VideoList.vue -->
<template>
  <div class="video-list">
    <!-- 筛选区域 -->
    <el-card class="filter-section">
      <el-form :model="filterForm" inline>
        <el-form-item label="关键词">
          <el-input v-model="filterForm.keyword" placeholder="请输入关键词"></el-input>
        </el-form-item>
        <el-form-item label="视频来源">
          <el-select
            v-model="filterForm.source"
            placeholder="请选择视频来源"
            style="width: 180px"
            clearable
          >
            <el-option
              v-for="item in sourceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <div style="display: flex; align-items: center;">
                <img
                  v-if="item.icon"
                  :src="item.icon"
                  style="width: 16px; height: 16px; margin-right: 8px"
                />
                <span>{{ item.label }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
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

// 筛选表单
const filterForm = reactive({
  keyword: '',
  source: ''
})

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 视频列表数据
const videoList = ref([
  {
    id: 1,
    title: '示例视频标题',
    videoUrl: 'https://example.com/video.mp4',
    likes: 1000,
    comments: 100,
    shares: 50,
    favorites: 200,
    tags: ['热门', '搞笑'],
    keywords: ['关键词1', '关键词2'],
    source: '抖音',
    originalScript: '这是原始话术内容...',
    modifiedScript: '这是AI改写后的话术内容...，这是AI改写后的话术内容...，这是AI改写后的话术内容...',
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

// 处理筛选
const handleFilter = () => {
  // TODO: 实现筛选逻辑
  console.log('筛选条件：', filterForm)
}

// 重置筛选
const resetFilter = () => {
  filterForm.keyword = ''
  filterForm.source = ''
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

:deep(.el-select-dropdown__item) {
  padding: 0 12px;
  height: 40px;
  line-height: 40px;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}
</style>    