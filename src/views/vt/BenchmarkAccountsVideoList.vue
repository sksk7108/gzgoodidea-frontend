<!-- VideoList.vue -->
<template>
    <div class="video-list">
      <!-- 筛选区域 -->
      <el-card class="filter-section">
        <div class="filter-header">
          <div class="source-label">对标账号：</div>
          <el-button type="text" @click="resetFilter">清空筛选</el-button>
        </div>
        <!-- 对标账号选择 -->
        <div class="account-filter">
          <div class="account-items">
            <div
             class="account-item"
              v-for="item in benchmarkAccounts"
              :key="item.videoAccountId"
              :class="{ 'active': filterForm.videoAccountId === item.videoAccountId }" 
              @click="selectAccount(item.videoAccountId)">
              <span>{{ item.videoAccountName }}</span>
            </div>
          </div>
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
        
        <!-- 时间筛选 -->
        <div class="time-filter">
          <div class="source-label">时间范围：</div>
          <div class="time-items">
            <div 
              v-for="timeOption in timeOptions" 
              :key="timeOption.value"
              class="time-item"
              :class="{ 'active': filterForm.timeRange === timeOption.value }"
              @click="selectTimeRange(timeOption.value)"
            >
              <span>{{ timeOption.label }}</span>
            </div>
          </div>
        </div>
        
        <!-- 排序功能 -->
        <div class="sort-filter">
          <div class="source-label">排序方式：</div>
          <div class="sort-items">
            <div 
              v-for="sortOption in sortOptions" 
              :key="sortOption.value"
              class="sort-item"
              :class="{ 'active': filterForm.sortBy === sortOption.value }"
              @click="selectSortOption(sortOption.value)"
            >
              <span>{{ sortOption.label }}</span>
            </div>
          </div>
        </div>
      </el-card>
  
      <!-- 视频列表 -->
      <div v-loading="loading" class="video-list-container">
        <div v-if="videoList.length > 0" class="video-rows">
          <VideoCardRow
            v-for="video in videoList"
            :key="video.id"
            :video="video"
            @favorite="handleFavorite"
            :isMyCopyPage="false"
            @delete="handleDelete"
            class="video-row-item"
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
  import { ref, reactive, onMounted, computed, provide, nextTick } from 'vue'
  import VideoCardRow from '@/components/VideoCardRow.vue'
  import { getVideoList, auditVideoStatus, deleteVideo } from '@/api/video.js'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { getKeywordList, getKeywordGroupsList } from '@/api/keyword.js'
  import { getBenchmarkAccounts } from '@/api/benchmark-accounts.js'
  import { Search, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
  
  // 提供全局视频播放状态
  const currentlyPlaying = reactive({ videoId: null })
  provide('currentlyPlaying', currentlyPlaying)
  
  // 加载状态
  const loading = ref(false)
  
  // 标签搜索关键字
  const tagSearchKeyword = ref('')
  
  // 选中的标签（多选）
  const selectedTags = ref([])
  
  // 标签展开收起状态
  const isTagExpanded = ref(false)
  const maxTagsToShow = 30 // 未展开时最多显示的标签数量
  
  // 筛选表单
  const filterForm = reactive({
    source: '',
    sortBy: '',
    sortOrder: 'desc', // 默认降序排序
    timeRange: '', // 时间范围筛选
    videoAccountId: 'all' // 对标账号筛选
  })
  
  // 标签选项
  const tagOptions = ref([])
  
  // 过滤后的标签选项
  const filteredTagOptions = computed(() => {
    if (!tagSearchKeyword.value) {
      return tagOptions.value
    }
    return tagOptions.value.filter(tag => 
      tag.label.toLowerCase().includes(tagSearchKeyword.value.toLowerCase())
    )
  })
  
  // 显示的标签（考虑展开/收起状态）
  const displayedTags = computed(() => {
    if (isTagExpanded.value || filteredTagOptions.value.length <= maxTagsToShow) {
      return filteredTagOptions.value
    } else {
      return filteredTagOptions.value.slice(0, maxTagsToShow)
    }
  })
  
  // 切换标签展开状态
  const toggleTagExpand = () => {
    isTagExpanded.value = !isTagExpanded.value
  }
  
  // 时间筛选选项
  const timeOptions = [
    {
      label: '全部时间',
      value: '',
    },
    {
      label: '一天内',
      value: '1',
    },
    {
      label: '七天内',
      value: '7',
    },
    {
      label: '一个月内',
      value: '30',
    },
    {
      label: '半年内',
      value: '180',
    }
  ]
  
  // 排序选项
  const sortOptions = [
    {
      label: '发布时间',
      value: ''
    },
    {
      label: '点赞数',
      value: 'likeCount'
    },
    {
      label: '评论数',
      value: 'commentCount'
    },
    {
      label: '分享数',
      value: 'shareCount'
    },
    {
      label: '收藏数',
      value: 'favoriteCount'
    }
  ]
  
  // 分页数据
  const currentPage = ref(1)
  const pageSize = ref(10) // 行排式布局每页显示10条
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
      label: '视频号',
      value: '视频号',
      png_src: '/shipinhao.png'
    },
    {
      label: '抖音',
      value: '抖音',
      png_src: '/douyin.png'
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
        // keywords: selectedTags.value.join(','), // 用逗号连接多个标签
        hotSource: filterForm.source,
        sortBy: filterForm.sortBy, // 排序字段
        sortOrder: filterForm.sortOrder, // 排序顺序
        timeRange: filterForm.timeRange, // 时间范围筛选
        videoAccountId: filterForm.videoAccountId // 对标账号筛选
      }
      
      console.log('请求参数:', params)
      
      // 直接使用 getVideoList 方法，不再区分不同接口
      const response = await getVideoList(params)
      // console.log('接口返回数据:', response)
      
      // 根据实际接口返回格式进行适配
      if (response && response.records) {
        videoList.value = []  // 先清空列表，避免直接替换导致滚动位置突变
        nextTick(() => {
          videoList.value = response.records || []
          total.value = response.total || 0
          videoList.value = response.records.map(video => ({
            ...video,
            formattedTopic: formatTopicForHTML(video.topic), // 格式化后的 topic
          }));
          
          // 处理空数据情况
          if (videoList.value.length === 0 && currentPage.value > 1) {
            currentPage.value = 1  // 如果当前页没有数据，回到第一页
            fetchVideoList()
          }
        })
      } else {
        // 兼容其它数据格式
        videoList.value = []
        nextTick(() => {
          videoList.value = Array.isArray(response) ? response : (response?.items || [])
          total.value = response?.total || (Array.isArray(response) ? response.length : 0)
        })
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

  // 获取对标账号列表
  const benchmarkAccounts = ref([])
  const fetchBenchmarkAccountList = async () => {
    try {
      const response = await getBenchmarkAccounts()
      if (response && response.records) {
        benchmarkAccounts.value = [
          {
            videoAccountId: 'all',
            videoAccountName: '全部'
          },
          ...response.records
        ]
      }
    } catch (error) {
      console.error('获取对标账号列表失败', error)
      ElMessage.error('获取对标账号列表失败')
    }
  }

  
  // 获取标签选项
  const fetchTagOptions = async () => {
    let keywordList = null
    const response = await getKeywordGroupsList()
    if (response && response.groups) {
      keywordList = response.groups[0]?.keywords
    }
    if (keywordList){
      tagOptions.value = keywordList.map(tag => ({
        label: tag.content,
        value: tag.content
      }))
    }
    tagOptions.value.unshift({
      label: '全部',
      value: ''
    })
  }
  
  // 组件挂载时获取数据
  onMounted(() => {
    fetchVideoList()
    // fetchTagOptions()
    fetchBenchmarkAccountList()
  })
  
  // 过滤标签
  const filterTags = () => {
    // 计算属性已处理标签过滤
    isTagExpanded.value = false // 重置展开状态
  }
  
  // 选择标签（多选）
  const selectTag = (tagValue) => {
    // 如果是"全部"标签，清空所有选择
    if (tagValue === '') {
      selectedTags.value = []
    } else {
      // 如果已选中，则取消选择
      const index = selectedTags.value.indexOf(tagValue)
      if (index > -1) {
        selectedTags.value.splice(index, 1)
      } else {
        // 否则添加到选中数组
        selectedTags.value.push(tagValue)
      }
    }
    currentPage.value = 1
    fetchVideoList()
  }
  
  // 移除选中的标签
  const removeTag = (tag) => {
    const index = selectedTags.value.indexOf(tag)
    if (index > -1) {
      selectedTags.value.splice(index, 1)
      currentPage.value = 1
      fetchVideoList()
    }
  }
  
  // 选择来源
  const selectSource = (sourceValue) => {
    filterForm.source = sourceValue
    currentPage.value = 1
    fetchVideoList()
  }
  
  // 选择时间范围
  const selectTimeRange = (timeValue) => {
    filterForm.timeRange = timeValue
    currentPage.value = 1
    fetchVideoList()
  }
  
  // 选择排序方式
  const selectSortOption = (sortValue) => {
    // 如果点击已选中的排序方式，则清除排序
    if (filterForm.sortBy === sortValue) {
      filterForm.sortBy = ''
    } else {
      filterForm.sortBy = sortValue
    }
    currentPage.value = 1
    fetchVideoList()
  }
  
  // 重置筛选
  const resetFilter = () => {
    selectedTags.value = []
    tagSearchKeyword.value = ''
    filterForm.videoAccountId = 'all'
    filterForm.source = ''
    filterForm.timeRange = ''
    filterForm.sortBy = 'createTime'
    filterForm.sortOrder = 'desc'
    isTagExpanded.value = false
    currentPage.value = 1
    fetchVideoList()
  }
  
  // 处理分页
  const handlePageChange = (page) => {
    currentPage.value = page
    fetchVideoList()
  }
  
  // 处理视频收藏
  const handleFavorite = (video) => {
    // 更新本地视频列表数据
    const index = videoList.value.findIndex(item => item.id === video.id)
    if (index !== -1) {
      videoList.value[index] = { ...videoList.value[index], ...video }
    }
  }
  
  // 处理视频保存
  const handleSave = (video) => {
    // 更新本地视频列表数据
    const index = videoList.value.findIndex(item => item.id === video.videoId)
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
    align-items: center;
  }
  
  .filter-section {
    margin-bottom: 20px;
    width: 99%;
  }
  
  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .tag-search {
    margin-bottom: 15px;
  }
  
  .tag-search-input {
    width: 100%;
  }
  
  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
    transition: max-height 0.3s ease;
  }
  
  .tag-expand-btn {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
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
  
  .selected-tags {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
  }
  
  .selected-tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .selected-tag {
    margin-right: 5px;
  }
  
  .source-filter, .sort-filter, .time-filter {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .source-label {
    white-space: nowrap;
    font-size: 14px;
    color: #606266;
    margin-right: 10px;
    min-width: 70px;
  }
  
  .source-items, .sort-items, .time-items {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .source-item, .sort-item, .time-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 6px 14px;
    border-radius: 4px;
    font-size: 14px;
    color: #606266;
    transition: all 0.2s;
    border: 1px solid #ebeef5;
  }
  
  .source-item:hover, .sort-item:hover, .time-item:hover {
    color: #409EFF;
    background-color: #f0f7ff;
    border-color: #c6e2ff;
  }
  
  .source-item.active, .sort-item.active, .time-item.active {
    color: #409EFF;
    background-color: #ecf5ff;
    border-color: #b3d8ff;
  }
  
  .source-icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
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
    justify-content: center;
    align-items: center;
  }
  
  .video-row-item {
    width: 99%;
    border-radius: 10px;
  }
  
  .video-row-item:hover {
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
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
  
  .account-filter {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .account-items {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .account-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 6px 14px;
    border-radius: 4px;
    font-size: 14px;
    color: #606266;
    transition: all 0.2s;
    border: 1px solid #ebeef5;
  }
  
  .account-item:hover {
    color: #409EFF;
    background-color: #f0f7ff;
    border-color: #c6e2ff;
  }
  
  .account-item.active {
    color: #409EFF;
    background-color: #ecf5ff;
    border-color: #b3d8ff;
  }
  </style>    