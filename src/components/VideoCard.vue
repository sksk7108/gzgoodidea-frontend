<!-- VideoCard.vue -->
<template>
  <el-card class="video-card" :body-style="{ padding: '0' }">
    <div class="video-player">
      <template v-if="!video.originalVideo">
        <div class="video-placeholder">
          <div class="placeholder-text">暂无视频</div>
        </div>
      </template>
      <template v-else>
        <video 
          ref="videoRef"
          controls
          preload="metadata" 
          crossorigin="anonymous"
          @error="handleVideoError"
          @loadeddata="handleVideoLoaded"
          @stalled="handleVideoStalled"
          @waiting="handleVideoWaiting"
          @canplay="videoLoaded = true"
          v-show="videoLoaded && !videoError"
        >
          <!-- 动态生成source标签 -->
          <source :src="videoUrl" :type="getVideoMimeType">
          您的浏览器不支持视频播放
        </video>
        <!-- 加载中状态 -->
        <div v-if="!videoLoaded && !videoError" class="video-loading">
          <el-icon class="loading-icon"><Loading /></el-icon>
          <span>视频加载中... {{ loadingStatus }}</span>
        </div>
        <!-- 加载错误状态 -->
        <div v-if="videoError" class="video-error">
          <el-icon class="error-icon" v-if="isOffline">
            <svg t="1747032166788" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10727" width="24" height="24"><path d="M953.437043 74.621715l-4.031877-4.031877a242.744566 242.744566 0 0 0-342.325516 0L388.974329 288.759157a242.744566 242.744566 0 0 0 0 342.261518l4.031877 4.031877c7.807761 7.871759 16.127506 14.911543 24.767241 21.439343l79.805556-79.805556a130.683998 130.683998 0 0 1-26.1112-20.095385l-4.031876-4.031876a131.195982 131.195982 0 0 1 0-185.402322L685.477249 149.115433a131.195982 131.195982 0 0 1 185.402322 0l4.031877 4.031877a131.25998 131.25998 0 0 1 0 185.402322L776.290468 437.106614a338.549632 338.549632 0 0 1 24.511249 132.347946l152.635326-152.571327a242.744566 242.744566 0 0 0 0-342.325516zM631.078915 388.916089a240.056648 240.056648 0 0 0-24.703243-21.439343L526.506118 447.3463c9.279716 5.503831 18.111445 12.159628 26.1112 20.095385l4.031876 4.031876a131.195982 131.195982 0 0 1 0 185.402322L338.607872 874.853208a131.195982 131.195982 0 0 1-185.402322 0l-4.031877-4.031877a131.25998 131.25998 0 0 1 0-185.402322L247.794653 586.862027a338.549632 338.549632 0 0 1-24.511249-132.347946L70.648078 607.02141a242.744566 242.744566 0 0 0 0 342.325516l4.031877 4.031877a242.808564 242.808564 0 0 0 342.325516 0l218.105321-218.105321a242.744566 242.744566 0 0 0 0-342.325516l-4.031877-4.031877z" fill="#e6e6e6" p-id="10728"></path></svg>
          </el-icon>
          <el-icon class="error-icon" v-else>
            <svg t="1747032341381" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12951" width="24" height="24"><path d="M239.056896 261.30432 120.561664 261.30432c-27.394048 0-49.60256 22.208512-49.60256 49.60256L70.959104 738.03776c0 27.396096 22.208512 49.60256 49.60256 49.60256l118.495232 0L239.056896 261.30432z" fill="#e6e6e6" p-id="12952"></path><path d="M249.296896 261.30432l0 526.336L751.616 787.64032l0-526.336L249.296896 261.30432zM425.263104 643.508224l0.210944-238.073856 150.962176 119.216128L425.263104 643.508224z" fill="#e6e6e6" p-id="12953"></path><path d="M761.856 261.30432l118.493184 0c27.396096 0 49.604608 22.208512 49.604608 49.60256L929.953792 738.03776c0 27.396096-22.208512 49.60256-49.604608 49.60256L761.856 787.64032 761.856 261.30432z" fill="#e6e6e6" p-id="12954"></path></svg>
          </el-icon>
          <div class="error-text">
            <p>视频加载失败: {{ errorMessage }}</p>
            <div class="error-actions">
              <el-button type="primary" size="small" @click="retryVideo">
                <svg style="margin-right: 5px;" t="1747030901194" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9680" width="16" height="16"><path d="M955.072 120.768a18.752 18.752 0 0 0-26.496-1.152l-87.424 77.248C696.704 52.928 472.32 22.464 293.76 122.496 115.328 222.528 27.072 428.288 78.528 624.256c51.456 196.096 229.888 333.696 435.2 335.744 205.248 2.048 386.432-132.032 441.856-327.04 1.536-5.056 1.28-10.56 1.28-16.064a57.92 57.92 0 0 0-16.384-62.08 59.904 59.904 0 0 0-64.128-9.92 58.432 58.432 0 0 0-34.944 54.08c-39.04 142.336-169.664 241.344-319.168 241.92-149.504 0.512-280.96-97.6-321.024-239.616a325.44 325.44 0 0 1 149.312-368.704 335.488 335.488 0 0 1 400 44.416l-89.92 79.36a18.176 18.176 0 0 0-5.44 19.968 18.56 18.56 0 0 0 16.832 12.352l267.52 29.888a18.88 18.88 0 0 0 20.032-17.664l0.192-266.56a18.432 18.432 0 0 0-4.608-13.632v0.064z" p-id="9681" fill="#e6e6e6"></path></svg>
                 重试
              </el-button>

            </div>
          </div>
        </div>
      </template>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
// import { Loading, VideoPlay, Connection, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义props
const props = defineProps({
  video: {
    type: Object,
    required: true
  }
})

// 视频相关状态
const videoRef = ref(null)
const videoLoaded = ref(false)
const videoError = ref(false)
const loadAttempts = ref(0)
const errorMessage = ref('未知错误')
const loadingStatus = ref('')
const loadingTimer = ref(null)
const loadingTimeout = ref(null)

// 网络状态检测
const isOffline = ref(false)
const networkQuality = ref('unknown')

// 视频URL和MIME类型处理
const videoUrl = computed(() => {
  if (!props.video.originalVideo) return ''
  // 添加时间戳参数，防止缓存问题
  const timestamp = new Date().getTime()
  return `/api/api/videos/file/${props.video.originalVideo}`
})

// 获取视频MIME类型
const getVideoMimeType = computed(() => {
  if (!props.video.originalVideo) return ''
  const ext = getFileExtension(props.video.originalVideo)
  switch (ext.toLowerCase()) {
    case 'mp4': return 'video/mp4'
    case 'webm': return 'video/webm'
    case 'ogv': return 'video/ogg'
    case 'avi': return 'video/x-msvideo'
    case 'mov': return 'video/quicktime'
    case 'wmv': return 'video/x-ms-wmv'
    case 'flv': return 'video/x-flv'
    case 'mkv': return 'video/x-matroska'
    case 'ts': return 'video/mp2t'
    case '3gp': return 'video/3gpp'
    case 'm3u8': return 'application/x-mpegURL'
    default: return 'video/mp4' // 默认MP4类型
  }
})

// 检查视频是否可以播放
const canPlayVideo = computed(() => {
  if (!videoRef.value || !props.video.originalVideo) return false
  const ext = getFileExtension(props.video.originalVideo).toLowerCase()
  
  // 检查浏览器是否支持该格式
  if (ext === 'mp4' && !videoRef.value.canPlayType('video/mp4')) return false
  if (ext === 'webm' && !videoRef.value.canPlayType('video/webm')) return false
  if (ext === 'ogv' && !videoRef.value.canPlayType('video/ogg')) return false
  
  return true
})

// 视频错误处理
const handleVideoError = (e) => {
  console.error('视频加载错误:', e)
  videoError.value = true
  videoLoaded.value = false
  
  // 记录详细错误信息
  if (e.target && e.target.error) {
    console.error('错误代码:', e.target.error.code)
    console.error('错误消息:', e.target.error.message)
    
    // 设置用户友好的错误信息
    switch(e.target.error.code) {
      case 1:
        errorMessage.value = '加载被终止'
        break
      case 2:
        errorMessage.value = '网络错误'
        break
      case 3:
        errorMessage.value = '解码错误'
        break
      case 4:
        errorMessage.value = '视频格式不支持'
        break
      default:
        errorMessage.value = '未知错误'
    }
  } else {
    errorMessage.value = '加载失败'
  }
}

// 视频加载成功处理
const handleVideoLoaded = () => {
  videoLoaded.value = true
  videoError.value = false
  clearTimeout(loadingTimeout.value)
  console.log('视频加载成功')
}

// 视频加载停滞处理
const handleVideoStalled = () => {
  console.warn('视频加载停滞')
  loadingStatus.value = '加载停滞...'
  
  // 如果停滞超过10秒，尝试自动重试
  clearTimeout(loadingTimer.value)
  loadingTimer.value = setTimeout(() => {
    if (!videoLoaded.value && !videoError.value) {
      console.warn('加载停滞超时，自动重试')
      retryVideo()
    }
  }, 10000)
}

// 视频等待处理
const handleVideoWaiting = () => {
  console.log('视频加载等待中...')
  loadingStatus.value = '缓冲中...'
}

// 重试加载视频
const retryVideo = () => {
  if (loadAttempts.value >= 3) {
    ElMessage.warning('视频加载失败次数过多，请稍后再试')
    return
  }
  
  videoError.value = false
  videoLoaded.value = false
  loadAttempts.value++
  loadingStatus.value = `重试第${loadAttempts.value}次...`
  
  // 清除所有计时器
  clearTimeout(loadingTimer.value)
  clearTimeout(loadingTimeout.value)
  
  // 给浏览器一些时间重新加载
  setTimeout(() => {
    if (videoRef.value) {
      videoRef.value.load()
      
      // 设置新的加载超时
      loadingTimeout.value = setTimeout(() => {
        if (!videoLoaded.value && !videoError.value) {
          console.warn('视频加载超时')
          videoError.value = true
          errorMessage.value = '加载超时'
        }
      }, 20000) // 20秒超时
    }
  }, 500)
}

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

// 检测网络变化
const handleNetworkChange = () => {
  isOffline.value = !navigator.onLine
  if (isOffline.value) {
    console.warn('网络已断开')
    if (videoRef.value && !videoLoaded.value) {
      videoError.value = true
      errorMessage.value = '网络已断开'
    }
  } else {
    console.log('网络已连接')
    // 如果重新连接且视频之前加载失败，尝试重新加载
    if (videoError.value && errorMessage.value === '网络已断开') {
      retryVideo()
    }
  }
}

// 检测网络质量
const checkNetworkQuality = async () => {
  try {
    const startTime = Date.now()
    const response = await fetch('/api/ping', { method: 'HEAD' })
    const endTime = Date.now()
    
    if (response.ok) {
      const latency = endTime - startTime
      
      if (latency < 300) {
        networkQuality.value = 'good'
      } else if (latency < 1000) {
        networkQuality.value = 'average'
      } else {
        networkQuality.value = 'poor'
        console.warn(`网络延迟高: ${latency}ms`)
      }
    }
  } catch (error) {
    console.error('网络质量检测失败:', error)
    networkQuality.value = 'poor'
  }
}

// 智能重试
const smartRetry = () => {
  // 等待3秒检测网络，然后决定如何处理
  loadingStatus.value = '正在检测网络...'
  
  setTimeout(async () => {
    await checkNetworkQuality()
    
    if (isOffline.value) {
      ElMessageBox.alert('网络已断开，请检查网络连接后重试', '网络错误', {
        confirmButtonText: '重试',
        callback: (action) => {
          if (action === 'confirm') {
            retryVideo()
          }
        }
      })
    } else if (networkQuality.value === 'poor') {
      ElMessageBox.confirm('网络状况不佳，视频可能加载缓慢。是否使用低质量模式?', '网络提示', {
        confirmButtonText: '低质量模式',
        cancelButtonText: '继续尝试',
        type: 'warning'
      }).then(() => {
        // 切换到低质量模式
        if (videoRef.value) {
          videoRef.value.setAttribute('preload', 'none')
          videoRef.value.setAttribute('playsinline', 'true')
          videoRef.value.setAttribute('controlsList', 'nodownload')
          retryVideo()
        }
      }).catch(() => {
        retryVideo()
      })
    } else {
      retryVideo()
    }
  }, 3000)
}

// 组件挂载时初始化
onMounted(() => {
  // 添加网络状态监听
  window.addEventListener('online', handleNetworkChange)
  window.addEventListener('offline', handleNetworkChange)
  
  // 初始化检查网络状态
  handleNetworkChange()
  
  // 视频加载超时检测
  if (props.video.originalVideo) {
    loadingTimeout.value = setTimeout(() => {
      if (!videoLoaded.value && !videoError.value) {
        console.warn('视频加载超时')
        videoError.value = true
        errorMessage.value = '加载超时'
      }
    }, 20000) // 20秒超时
  }
})

// 组件卸载时清理
onUnmounted(() => {
  clearTimeout(loadingTimer.value)
  clearTimeout(loadingTimeout.value)
  
  // 移除事件监听
  window.removeEventListener('online', handleNetworkChange)
  window.removeEventListener('offline', handleNetworkChange)
})
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

/* 添加新样式 */
.video-placeholder,
.video-loading,
.video-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color:rgb(39, 39, 39);
}

.placeholder-text {
  font-size: 16px;
  color: #909399;
}

.video-loading {
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
}

.loading-icon {
  font-size: 24px;
  animation: spin 1.5s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.video-error {
  background-color: rgba(0, 0, 0, 0.3);
}

.error-icon {
  font-size: 40px;
  color: #909399;
  margin-bottom: 16px;
}

.error-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.error-text p {
  margin: 0;
  color: #606266;
}

.error-actions {
  display: flex;
  gap: 8px;
}
</style> 