<!-- VideoCard.vue -->
<template>
  <el-card class="video-card" :body-style="{ padding: '0' }">
    <div class="video-player">
      <video v-if="!video.originalVideo" controls></video>
      <video v-else :src="`/api/videos/file/${video.originalVideo}`" controls
             preload="metadata" crossorigin="anonymous">
        <!-- 根据文件扩展名添加不同类型的source标签 -->
        <source :src="`/api/videos/file/${video.originalVideo}`" type="video/mp4"
                v-if="getFileExtension(video.originalVideo) === 'mp4'">
        <source :src="`/api/videos/file/${video.originalVideo}`" type="video/x-msvideo"
                v-if="getFileExtension(video.originalVideo) === 'avi'">
        <source :src="`/api/videos/file/${video.originalVideo}`" type="video/quicktime"
                v-if="getFileExtension(video.originalVideo) === 'mov'">
        <source :src="`/api/videos/file/${video.originalVideo}`" type="video/webm"
                v-if="getFileExtension(video.originalVideo) === 'webm'">
        <source :src="`/api/videos/file/${video.originalVideo}`" type="video/x-ms-wmv"
                v-if="getFileExtension(video.originalVideo) === 'wmv'">
        <source :src="`/api/videos/file/${video.originalVideo}`" type="video/x-flv"
                v-if="getFileExtension(video.originalVideo) === 'flv'">
        您的浏览器不支持视频播放
      </video>

    </div>

    <div class="video-content">
      <div class="video-info">
        <div class="video-header">
          <h3 class="video-title">{{ video.title }}</h3>
          <div class="video-meta">
            <span class="source">{{ video.hotSource }}</span>
            <span class="time">{{ video.importTime }}</span>
          </div>
        </div>
        <div class="video-stats">
          <span class="stat-item">
            <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
              <path d="M512 896l-57.6-51.2c-198.4-177.6-329.6-297.6-329.6-444.8 0-119.466667 93.866667-211.2 213.333333-211.2 68.266667 0 132.266667 32 174.933334 81.066667C554.666667 221.866667 618.666667 189.866667 686.933333 189.866667c119.466667 0 213.333333 93.866667 213.333334 211.2 0 147.2-131.2 267.2-329.6 444.8L512 896z" fill="#d81e06"/>
            </svg>
            {{ video.likeCount }}
          </span>
          <span class="stat-item">
            <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
              <path d="M511.9 827.5L610.7 726l17.4-17.9h209v-472H187.3v472.1h208.4l17.4 17.9 98.8 101.4m0 77.9c-4.1 0-8.3-1.6-11.5-4.9L370.7 767.3H166.6c-21.2 0-38.4-17.6-38.4-39.3V216.4c0-21.7 17.2-39.3 38.4-39.3h691.2c21.2 0 38.4 17.6 38.4 39.3V728c0 21.7-17.2 39.3-38.4 39.3H653L523.3 900.5c-3.2 3.2-7.3 4.9-11.4 4.9z" fill="#1296db" p-id="2733"></path><path d="M334.9 433c27.2 0 49.3 22 49.3 49.2 0 27.2-22 49.2-49.3 49.2-27.2 0-49.2-22-49.2-49.2 0-27.1 22.1-49.2 49.2-49.2zM512.2 433c27.2 0 49.2 22 49.2 49.2 0 27.2-22 49.2-49.2 49.2-27.2 0-49.2-22-49.2-49.2 0-27.1 22-49.2 49.2-49.2zM689.4 433c27.2 0 49.2 22 49.2 49.2 0 27.2-22 49.2-49.2 49.2-27.2 0-49.3-22-49.3-49.2 0.1-27.1 22.1-49.2 49.3-49.2z" fill="#1296db" p-id="2734"></path>
            </svg>
            {{ video.commentCount }}
          </span>
          <span class="stat-item">
            <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
                <path d="M919.272727 416.581818L607.418182 79.127273c-11.636364-11.636364-32.581818-11.636364-44.218182 0-6.981818 6.981818-9.309091 16.290909-9.309091 25.6v181.527272c-258.327273 0-465.454545 207.127273-465.454545 463.127273 0 62.836364 13.963636 125.672727 39.563636 183.854546 37.236364-193.163636 221.090909-339.781818 425.890909-339.781819v181.527273c-2.327273 9.309091 2.327273 18.618182 9.309091 25.6 4.654545 6.981818 13.963636 9.309091 23.272727 9.309091s18.618182-4.654545 23.272728-11.636364L919.272727 465.454545c6.981818-6.981818 9.309091-13.963636 9.309091-23.272727s-4.654545-18.618182-9.309091-25.6z" p-id="4280" fill="#707070"></path>
            </svg>
            {{ video.shareCount }}
          </span>
          <span class="stat-item">
            <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
                <path d="M249.027212 1024a81.085086 81.085086 0 0 1-47.614289-15.359448 82.461037 82.461037 0 0 1-34.302767-81.917056l40.958528-251.894948a31.99885 31.99885 0 0 0-8.703687-27.647006L23.755308 466.452037a83.932984 83.932984 0 0 1-19.455301-84.988946 82.301042 82.301042 0 0 1 65.917631-55.805994L307.905096 289.306403a31.198879 31.198879 0 0 0 24.063135-17.919356l104.956229-223.351973a82.90902 82.90902 0 0 1 150.394595 0l104.540243 223.351973a31.99885 31.99885 0 0 0 24.063135 17.919356l237.463466 36.350694a83.453001 83.453001 0 0 1 46.590326 140.79494l-175.609689 180.729505a32.606828 32.606828 0 0 0-8.703687 27.647006l40.958528 251.894948a83.804988 83.804988 0 0 1-34.302767 81.917056 81.853058 81.853058 0 0 1-88.060836 4.607834l-206.712571-114.683878a32.670826 32.670826 0 0 0-30.718896 0l-207.352548 115.19586a87.964839 87.964839 0 0 1-40.446547 10.239632z" fill="#FEB432" p-id="5560"></path>
            </svg>
            {{ video.favoriteCount }}
          </span>
        </div>
        <div class="video-tags">
            <span class="label">标签：</span>
            <el-tag v-for="tag in video.formattedTopic" size="small" type="primary" class="tag">
                {{ tag }}
            </el-tag>
        </div>
        <div class="video-keywords">
          <span class="label">关键词：</span>
          <el-tag size="small" type="warning" class="keyword">
            {{ video.keywords }}
          </el-tag>
        </div>
        <div class="scripts-container">
          <div class="script-card original" @click="showScriptCompare">
            <div class="script-header">
              <span class="label">原视频话术</span>
              <svg class="expand-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 3.5L10.5 8L6.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p class="script-content">{{ video.originalScript }}</p>
          </div>
          <div class="script-card modified" @click="showScriptCompare">
            <div class="script-header">
              <span class="label">改写后话术</span>
              <svg class="expand-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 3.5L10.5 8L6.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p class="script-content">{{ video.editedScript }}</p>
          </div>
        </div>
      </div>
      <div class="video-actions">
        <template v-if="video.auditStatus === 0">
          <el-button type="success" size="small" @click="handleApprove">通过</el-button>
          <el-button type="warning" size="small" @click="handleReject">拒绝</el-button>
        </template>
        <template v-else-if="video.auditStatus === 1">
          <el-tag type="success" size="medium">已通过</el-tag>
          <el-button type="danger" size="small" @click="handleDelete">删除</el-button>
        </template>
        <template v-else-if="video.auditStatus === 2">
          <el-tag type="danger" size="medium">已拒绝</el-tag>
          <el-button type="danger" size="small" @click="handleDelete">删除</el-button>
        </template>
      </div>
    </div>

    <!-- 话术对比弹窗 -->
    <el-dialog
      v-model="compareDialogVisible"
      width="95%"
      fullscreen
      append-to-body
      :show-close="false"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="script-compare-dialog"
    >
      <div class="script-compare-container">
        <div class="script-compare-header">
          <div class="script-header-title">
            <h2>{{ video.title }}</h2>
            <p class="script-header-info">来源: {{ video.hotSource }} | 发布时间: {{ video.importTime }}</p>
          </div>
          <el-button type="primary" plain @click="compareDialogVisible = false">关闭</el-button>
        </div>
        <div class="script-compare-content">
          <div class="script-column original-script">
            <div class="script-column-header">
              <h3>原视频话术</h3>
            </div>
            <div class="script-column-content">
              <pre>{{ video.originalScript || '暂无内容' }}</pre>
            </div>
          </div>
          <div class="script-column edited-script">
            <div class="script-column-header">
              <h3>改写后话术</h3>
            </div>
            <div class="script-column-content">
              <pre>{{ video.editedScript || '暂无内容' }}</pre>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

// 定义props
const props = defineProps({
  video: {
    type: Object,
    required: true
  }
})

// 话术对比弹窗
const compareDialogVisible = ref(false)

// 打开话术对比弹窗
const showScriptCompare = () => {
  compareDialogVisible.value = true
}

const getFileExtension = (filename) => {
    if (!filename || typeof filename !== 'string') return ''
    const lastDotIndex = filename.lastIndexOf('.')
    return lastDotIndex === -1 ? '' : filename.slice(lastDotIndex + 1).toLowerCase()
}

// 定义事件
const emit = defineEmits(['approve', 'reject', 'delete'])

// 处理操作事件
const handleApprove = () => emit('approve', props.video)
const handleReject = () => emit('reject', props.video)
const handleDelete = () => emit('delete', props.video)
</script>

<style scoped>
.video-card {
  width: 100%;
  margin-bottom: 0;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
}

.video-player {
  width: 100%;
  position: relative;
  padding-top: 56.25%;
  overflow: hidden;
  
  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.video-content {
  padding: 16px;
}

.video-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.video-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.video-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.video-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #999;

  .source {
    background-color: #f4f4f5;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .time {
    white-space: nowrap;
  }
}

.video-stats {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 13px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  
  .icon {
    color: #666;
  }
}

.video-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.video-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.label {
  font-weight: bold;
  color: #666;
  font-size: 14px;
}

.scripts-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.script-card {
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: #f8f9fa;
    border-color: #dcdfe6;
    
    .expand-icon {
      opacity: 1;
      transform: translateX(3px);
    }
  }
  
  &.original {
    background-color: #fafafa;
    
    .script-header .label {
      color: #606266;
    }
  }
  
  &.modified {
    background-color: #f0f9eb;
    
    .script-header .label {
      color: #67c23a;
    }
  }
}

.script-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  .expand-icon {
    opacity: 0.5;
    transition: all 0.3s;
  }
}

.script-content {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.video-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

:deep(.el-tag) {
  margin: 0;
}

/* 话术对比弹窗样式 */
.script-compare-dialog :deep(.el-dialog__body) {
  padding: 0;
  height: 100%;
}

.script-compare-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa;
}

.script-compare-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.script-header-title {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.script-header-title h2 {
  margin: 0;
  font-size: 20px;
  line-height: 1.4;
}

.script-header-info {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.script-compare-content {
  display: flex;
  flex: 1;
  padding: 24px;
  gap: 24px;
  height: calc(100vh - 100px);
  overflow: hidden;
}

.script-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.script-column-header {
  padding: 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.script-column-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.script-column-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.script-column-content pre {
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.8;
  color: #606266;
  margin: 0;
}

.original-script .script-column-header {
  background-color: #f2f6fc;
}

.edited-script .script-column-header {
  background-color: #f0f9eb;
}

.edited-script .script-column-header h3 {
  color: #67c23a;
}
</style> 