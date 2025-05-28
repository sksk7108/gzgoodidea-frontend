<!-- VideoCardRow.vue -->
<template>
  <el-card class="video-card-row" :body-style="{ padding: '0' }">
    <div class="row-layout">
      <!-- 视频预览区域 -->
      <div class="video-preview" ref="videoPlayerRef">
        <template v-if="!video.videoUrl">
          <div class="video-placeholder">
            <div class="placeholder-text">暂无视频</div>
          </div>
        </template>
        <template v-else-if="!video.originalVideo || video.hotSource === '抖音'" >
          <div class="video-placeholder douyin-placeholder">
            <div class="douyin-link-container">
              <svg class="douyin-icon" viewBox="0 0 1024 1024" width="40" height="40">
                <path d="M937.1 423.4c-92 0-165.9-71.5-172.6-161.5h-86.2v455c0 47.8-38.8 86.5-86.5 86.5-47.8 0-86.5-38.8-86.5-86.5s38.8-86.5 86.5-86.5c9.4 0 18.8 1.6 27.5 4.7V546c-9.1-1.2-18.1-1.9-27.5-1.9-105.6 0-191.1 85.5-191.1 191.1S486.2 926.2 591.8 926.2c105.6 0 191.1-85.5 191.1-191.1V453.7c31.5 22.1 69.6 35.1 111 35.1V423.4h43.2-0.1z m0 0" fill="#ff0050"></path>
                <path d="M778.7 423.4v65.4c-41.3 0-79.5-13-111-35.1v281.6c0 105.6-85.5 191.1-191.1 191.1-105.6 0-191.1-85.5-191.1-191.1S371.1 544 476.7 544c9.4 0 18.3 0.6 27.5 1.9v89.1c-8.7-3.1-18.1-4.7-27.5-4.7-47.8 0-86.5 38.8-86.5 86.5s38.8 86.5 86.5 86.5c47.8 0 86.5-38.8 86.5-86.5V261.9h86.2c6.8 90.1 80.6 161.5 172.6 161.5h-43.2z" fill="#000000"></path>
              </svg>
              <div class="douyin-info">
                <span class="douyin-tip">访问原链接查看视频</span>
                <a @click.stop="handleDouyinLinkClick" target="_blank" class="douyin-original-link">
                  <svg t="1747032562788" class="link-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15974" width="16" height="16">
                    <path d="M574 665.4c-3.1-3.1-8.2-3.1-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8c-3.1-3.1-8.2-3.1-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zM832.6 191.4c-84.6-84.6-221.5-84.6-306 0L410.4 307.6c-3.1 3.1-3.1 8.2 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.4 562.7c-3.1 3.1-3.1 8.2 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5-0.1-306.2z" fill="#ffffff" p-id="15975"></path>
                    <path d="M610.1 372.3c-3.1-3.1-8.2-3.1-11.3 0L372.3 598.7c-3.1 3.1-3.1 8.2 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z" fill="#ffffff" p-id="15976"></path>
                  </svg>
                  {{ formatUrl(video.originalVideo || video.videoUrl) }}
                </a>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="!shouldLoadVideo" class="video-placeholder lazy-load-placeholder" @click="shouldLoadVideo = true">
            <div class="lazy-load-container">
              <svg t="1747032341381" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12951" width="48" height="48">
                <path d="M239.056896 261.30432 120.561664 261.30432c-27.394048 0-49.60256 22.208512-49.60256 49.60256L70.959104 738.03776c0 27.396096 22.208512 49.60256 49.60256 49.60256l118.495232 0L239.056896 261.30432z" fill="#e6e6e6" p-id="12952"></path>
                <path d="M249.296896 261.30432l0 526.336L751.616 787.64032l0-526.336L249.296896 261.30432zM425.263104 643.508224l0.210944-238.073856 150.962176 119.216128L425.263104 643.508224z" fill="#e6e6e6" p-id="12953"></path>
                <path d="M761.856 261.30432l118.493184 0c27.396096 0 49.604608 22.208512 49.604608 49.60256L929.953792 738.03776c0 27.396096-22.208512 49.60256-49.604608 49.60256L761.856 787.64032 761.856 261.30432z" fill="#e6e6e6" p-id="12954"></path>
              </svg>
              <div class="lazy-load-text">
                <span>点击加载视频</span>
              </div>
            </div>
          </div>
          <video 
            v-if="shouldLoadVideo"
            ref="videoRef"
            controls
            preload="metadata" 
            crossorigin="anonymous"
            @error="handleVideoError"
            @canplay="videoLoaded = true"
            @loadeddata="handleVideoLoaded"
            @stalled="handleVideoStalled"
            @waiting="handleVideoWaiting"
            @play="handleVideoPlay"
            @pause="handleVideoPause"
            v-show="videoLoaded && !videoError"
            :src="videoUrl"
          >
            您的浏览器不支持视频播放
          </video>
          <div v-if="videoError" class="video-error">
            <div class="error-text">
              <p>视频加载失败</p>
              <el-button type="primary" size="small" @click="retryVideo">重试</el-button>
            </div>
          </div>
          <!-- 加载中状态 -->
          <div v-if="shouldLoadVideo && !videoLoaded && !videoError" class="video-loading">
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

      <!-- 视频内容区域 -->
      <div class="video-content">
        <div class="video-header">
          <h3 class="video-title">{{ video.title }}</h3>
          <div class="video-meta">
            <span class="source">{{ video.hotSource }}</span>
            <div class="videolink">
              <a @click.stop="handleDouyinLinkClick" target="_blank" class="original-link">
                <svg t="1747962731701" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5478" width="16" height="16"><path d="M62.296463 576.23471l64.234709-64.23471 85.676565 85.646279-42.853425 42.853425a121.140424 121.140424 0 0 0 0 171.292559l42.853425 42.853425a121.140424 121.140424 0 0 0 171.292559 0l214.145983-214.145984a121.140424 121.140424 0 0 0 0-171.322844l-42.823139-42.823139a120.080445 120.080445 0 0 0-24.440081-18.413345l88.705075-88.67479 85.64628 85.64628a211.995741 211.995741 0 0 1 0 299.822548l-256.969124 256.969123a211.995741 211.995741 0 0 1-299.822548 0l-85.646279-85.646279a211.995741 211.995741 0 0 1 0-299.822548z" fill="#E13455" p-id="5479"></path><path d="M961.703537 447.76529l-64.234709 64.23471-85.676565-85.646279 42.853425-42.853425a121.140424 121.140424 0 0 0 0-171.292559l-42.853425-42.853425a121.140424 121.140424 0 0 0-171.292559 0l-214.145983 214.145984a121.140424 121.140424 0 0 0 0 171.322844l42.823139 42.823139a120.080445 120.080445 0 0 0 24.440081 18.413345L404.911866 704.734414l-85.64628-85.64628a211.995741 211.995741 0 0 1 0-299.822548l256.969124-256.969123a211.995741 211.995741 0 0 1 299.822548 0l85.646279 85.646279a211.995741 211.995741 0 0 1 0 299.822548z" fill="#409eff" p-id="5480"></path></svg>
                <span>查看原视频</span>
              </a>
            </div>
            <span class="time">{{ video.publishTime }}</span>
            <!-- 视频统计数据 -->
            <div class="video-stats" v-if="!isMyCopyPage">
              <span class="stat-item">
                <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
                  <path d="M512 896l-57.6-51.2c-198.4-177.6-329.6-297.6-329.6-444.8 0-119.466667 93.866667-211.2 213.333333-211.2 68.266667 0 132.266667 32 174.933334 81.066667C554.666667 221.866667 618.666667 189.866667 686.933333 189.866667c119.466667 0 213.333333 93.866667 213.333334 211.2 0 147.2-131.2 267.2-329.6 444.8L512 896z" fill="#d81e06"/>
                </svg>
                {{ video.likeCount }}
              </span>
              <span class="stat-item">
                <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
                  <path d="M511.9 827.5L610.7 726l17.4-17.9h209v-472H187.3v472.1h208.4l17.4 17.9 98.8 101.4m0 77.9c-4.1 0-8.3-1.6-11.5-4.9L370.7 767.3H166.6c-21.2 0-38.4-17.6-38.4-39.3V216.4c0-21.7 17.2-39.3 38.4-39.3h691.2c21.2 0 38.4 17.6 38.4 39.3V728c0 21.7-17.2 39.3-38.4 39.3H653L523.3 900.5c-3.2 3.2-7.3 4.9-11.4 4.9z" fill="#1296db"/>
                  <path d="M334.9 433c27.2 0 49.3 22 49.3 49.2 0 27.2-22 49.2-49.3 49.2-27.2 0-49.2-22-49.2-49.2 0-27.1 22.1-49.2 49.2-49.2zM512.2 433c27.2 0 49.2 22 49.2 49.2 0 27.2-22 49.2-49.2 49.2-27.2 0-49.2-22-49.2-49.2 0-27.1 22-49.2 49.2-49.2zM689.4 433c27.2 0 49.2 22 49.2 49.2 0 27.2-22 49.2-49.2 49.2-27.2 0-49.3-22-49.3-49.2 0.1-27.1 22.1-49.2 49.3-49.2z" fill="#1296db"/>
                </svg>
                {{ video.commentCount }}
              </span>
              <span class="stat-item">
                <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
                  <path d="M919.272727 416.581818L607.418182 79.127273c-11.636364-11.636364-32.581818-11.636364-44.218182 0-6.981818 6.981818-9.309091 16.290909-9.309091 25.6v181.527272c-258.327273 0-465.454545 207.127273-465.454545 463.127273 0 62.836364 13.963636 125.672727 39.563636 183.854546 37.236364-193.163636 221.090909-339.781818 425.890909-339.781819v181.527273c-2.327273 9.309091 2.327273 18.618182 9.309091 25.6 4.654545 6.981818 13.963636 9.309091 23.272727 9.309091s18.618182-4.654545 23.272728-11.636364L919.272727 465.454545c6.981818-6.981818 9.309091-13.963636 9.309091-23.272727s-4.654545-18.618182-9.309091-25.6z" fill="#707070"/>
                </svg>
                {{ video.shareCount }}
              </span>
              <span class="stat-item">
                <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
                  <path d="M249.027212 1024a81.085086 81.085086 0 0 1-47.614289-15.359448 82.461037 82.461037 0 0 1-34.302767-81.917056l40.958528-251.894948a31.99885 31.99885 0 0 0-8.703687-27.647006L23.755308 466.452037a83.932984 83.932984 0 0 1-19.455301-84.988946 82.301042 82.301042 0 0 1 65.917631-55.805994L307.905096 289.306403a31.198879 31.198879 0 0 0 24.063135-17.919356l104.956229-223.351973a82.90902 82.90902 0 0 1 150.394595 0l104.540243 223.351973a31.99885 31.99885 0 0 0 24.063135 17.919356l237.463466 36.350694a83.453001 83.453001 0 0 1 46.590326 140.79494l-175.609689 180.729505a32.606828 32.606828 0 0 0-8.703687 27.647006l40.958528 251.894948a83.804988 83.804988 0 0 1-34.302767 81.917056 81.853058 81.853058 0 0 1-88.060836 4.607834l-206.712571-114.683878a32.670826 32.670826 0 0 0-30.718896 0l-207.352548 115.19586a87.964839 87.964839 0 0 1-40.446547 10.239632z" fill="#FEB432"/>
                </svg>
                {{ video.favoriteCount }}
              </span>
            </div>
            
          </div>
        </div>
        
        <div class="video-info-container">
          

          <!-- 标签和关键词 -->
          <div class="video-tags-wrapper">
            <div class="video-keywords" v-if="video.keywords">
              <span class="label">关键词：</span>
              <el-tag size="small" type="warning" class="keyword">
                {{ video.keywords }}
              </el-tag>
            </div>
            <div class="video-tags" v-if="video.formattedTopic && video.formattedTopic.length">
              <span class="label">标签：</span>
              <el-tag v-for="tag in video.formattedTopic" size="small" type="primary" class="tag">
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <!-- 视频话术 -->
          <div class="script-container" v-if="video.originalScript">
            <div class="script-header">
              <span class="label">文案：</span>
            </div>
            <template v-if="!isConvenientEditing">
              <p class="script-content"  @click="showConvinientInput" >{{ video.originalScript }}</p>
            </template>
            <template v-else>
              <div class="script-input-wrapper">
                <el-input class="script-input" v-model="editForm.originalScript" type="textarea" resize="none"></el-input>
                <div class="script-input-footer">
                <el-button type="success" size="small" @click="fullScreenEdit">全屏编辑</el-button>
                <el-button type="primary" size="small" :loading="saveLoading" @click="saveScript">
                  {{ isMyCopyPage ? '保存' : '保存到我的文案' }}
                </el-button>
                <el-button type="default" size="small" @click="closeConvinientInput">关闭</el-button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 操作区域 -->
      <div class="video-actions">
        <el-button type="primary" size="default" v-if="!isMyCopyPage" :loading="addVideoCopywritingLoading" @click="addToVideoCopywriting">
          <svg t="1747967687511" style="margin-right: 5px;" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6469" width="24" height="24"><path d="M836.19 61c32.253 0.552 56.81 27.921 56.81 60v367.634h-72V133.001H203V890.06l315.94-0.047 0.01 72-330.155 0.048h-0.98c-32.258-0.553-56.815-27.922-56.815-60V120.029C131.502 88.05 156.383 61 188.79 61zM806 578v153.999L960 732v74l-154-0.001V960h-74V805.999L578 806v-74l154-0.001V578h74z" fill="#f3f3f3" p-id="6470" data-spm-anchor-id="a313x.search_index.0.i2.285d3a81wIaUKc" class="selected"></path><path d="M759.596 252.404v80.193h-495v-80.193z" fill="#e6e6e6" p-id="6471" data-spm-anchor-id="a313x.search_index.0.i3.285d3a81wIaUKc" class=""></path></svg>
          收藏文案
        </el-button>

<!--        <el-button type="primary" size="default" v-if="isMyCopyPage" @click="handleFavorite" :loading="favoriteLoading">-->
<!--          <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16" style="margin-right: 5px;">-->
<!--            <path d="M249.027212 1024a81.085086 81.085086 0 0 1-47.614289-15.359448 82.461037 82.461037 0 0 1-34.302767-81.917056l40.958528-251.894948a31.99885 31.99885 0 0 0-8.703687-27.647006L23.755308 466.452037a83.932984 83.932984 0 0 1-19.455301-84.988946 82.301042 82.301042 0 0 1 65.917631-55.805994L307.905096 289.306403a31.198879 31.198879 0 0 0 24.063135-17.919356l104.956229-223.351973a82.90902 82.90902 0 0 1 150.394595 0l104.540243 223.351973a31.99885 31.99885 0 0 0 24.063135 17.919356l237.463466 36.350694a83.453001 83.453001 0 0 1 46.590326 140.79494l-175.609689 180.729505a32.606828 32.606828 0 0 0-8.703687 27.647006l40.958528 251.894948a83.804988 83.804988 0 0 1-34.302767 81.917056 81.853058 81.853058 0 0 1-88.060836 4.607834l-206.712571-114.683878a32.670826 32.670826 0 0 0-30.718896 0l-207.352548 115.19586a87.964839 87.964839 0 0 1-40.446547 10.239632z" :fill="video.isFavorite? '#FEB432':'#f0f0f0'" p-id="5560"></path>-->
<!--          </svg>-->
<!--          {{ video.isFavorite ? '已收藏' : '收藏' }}-->
<!--        </el-button>-->

        <el-button type="success" size="default" v-if="isMyCopyPage" style="margin: 0;" @click="showScriptCompare">
          <svg t="1747358039462" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4628" width="15" height="15" style="margin-right: 5px;">
            <path d="M343.795 676.7l217.37-61.723-155.264-154.295-62.106 216.017z m580.56-422.687L769.087 99.71l-341.584 339.46 155.264 154.3L924.35 254.014h0.005z m-45.25 571.432c0 53.635-43.474 97.108-97.108 97.108H199.272c-53.64 0-97.129-43.473-97.129-97.108V242.722c0-53.635 43.483-97.123 97.129-97.123h388.474l97.128-97.119H166.896C77.503 48.48 5.03 120.953 5.03 210.34v647.476c0 89.392 72.478 161.86 161.866 161.86h647.467c89.396 0 161.875-72.468 161.875-161.86V339.843l-97.133 97.124v388.478h0.005-0.005z m117.402-701.053l-97.034-96.436c-16.081-15.978-43.02-15.116-60.173 1.925l-46.577 46.293 155.264 154.294 46.581-46.289c17.154-17.034 18.02-43.813 1.94-59.787z m0 0" p-id="4629" fill="#e6e6e6"></path></svg>
          编辑
        </el-button>

        <el-button type="danger" size="default" v-if="isMyCopyPage" style="margin: 0;" @click="delVideoCopywriting" :loading="delVideoCopywritingLoading">
          <svg t="1747969008115" style="margin-right: 5px;" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8170" width="16" height="16"><path d="M382.320274 405.357714v384a20.626286 20.626286 0 0 1-21.577143 21.284572H317.44256a20.626286 20.626286 0 0 1-21.577143-21.357715v-384a20.626286 20.626286 0 0 1 21.577143-21.284571h43.154286a20.626286 20.626286 0 0 1 21.577143 21.357714h0.073142z m172.909715 0v384a20.626286 20.626286 0 0 1-21.650286 21.284572h-43.154286a20.626286 20.626286 0 0 1-21.577143-21.357715v-384a20.626286 20.626286 0 0 1 21.577143-21.284571h43.154286a20.626286 20.626286 0 0 1 21.577143 21.357714z m172.909714 0v384a20.626286 20.626286 0 0 1-21.650286 21.284572h-43.154286a20.626286 20.626286 0 0 1-21.577142-21.357715l-0.073143-384a20.626286 20.626286 0 0 1 21.577143-21.284571h43.227428a20.626286 20.626286 0 0 1 21.577143 21.357714z m86.381714 482.669715V256H209.483703v631.954286a74.825143 74.825143 0 0 0 14.482286 45.056c3.364571 3.803429 5.778286 5.632 7.094857 5.632h561.883428c1.316571 0 3.657143-1.828571 7.094857-5.632a74.825143 74.825143 0 0 0 14.555429-44.982857zM360.743131 170.642286h302.518858l-32.402286-77.970286a19.017143 19.017143 0 0 0-11.483429-7.314286H405.287131a19.017143 19.017143 0 0 0-11.483428 7.314286l-33.060572 77.970286zM987.431131 192v42.642286a20.626286 20.626286 0 0 1-21.577142 21.357714h-64.877715v631.954286c0 36.937143-10.532571 68.754286-31.744 95.744-21.211429 26.843429-46.592 40.301714-76.288 40.301714H231.060846c-29.696 0-55.149714-13.019429-76.288-38.985143-21.211429-26.038857-31.744-57.490286-31.744-94.354286V256H58.151131A20.626286 20.626286 0 0 1 36.573989 234.642286v-42.642286a20.626286 20.626286 0 0 1 21.577142-21.357714h208.676572L314.151131 59.318857c6.729143-16.457143 18.870857-30.427429 36.425143-41.984 17.554286-11.556571 35.401143-17.334857 53.394286-17.334857h216.064c17.993143 0 35.84 5.778286 53.394286 17.334857 17.554286 11.556571 29.696 25.6 36.425143 41.984l47.323428 111.323429h208.676572a20.626286 20.626286 0 0 1 21.577142 21.357714z" fill="#f3f3f3" p-id="8171"></path></svg>
          删除
        </el-button>


       <el-button v-if="!isMyCopyPage" type="danger" size="small" style="margin: 0;" @click="handleDelete">删除</el-button>
      </div>
    </div>

    <!-- 话术弹窗 -->
    <el-dialog
      v-model="compareDialogVisible"
      width="95%"
      fullscreen
      append-to-body
      :lock-scroll="false"
      :show-close="true"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      class="script-dialog"
      top="5vh"
      destroy-on-close
    >
      <template #header>
        <div class="script-dialog-header">
          <div class="script-header-title">
            <span style="min-width: 48px;">标题：</span>
            <template v-if="isEditing">
              <el-input 
                v-model="editForm.title" 
                placeholder="请输入标题"
                class="edit-title-input"
              ></el-input>
            </template>
            <template v-else>
              <h2>{{ video.title }}</h2>
            </template>
          </div>
        </div>
      </template>
      
      <div class="script-content-container">
        <div class="script-label">
          <span>文案：</span>
        </div>
        <div class="script-content-wrapper">
          <template v-if="isEditing">
            <el-input 
              type="textarea" 
              v-model="editForm.originalScript" 
              placeholder="请输入文案"
              :rows="16"
              class="edit-script-textarea"
              resize="none"
            ></el-input>
          </template>
          <template v-else>
            <div class="script-text">{{ video.originalScript || '暂无内容' }}</div>
          </template>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <template v-if="isEditing">
            <el-button type="primary" style="margin-right: 10px;" :loading="saveLoading" @click="saveScript">
              {{ isMyCopyPage? '保存':'保存到我的文案' }}
            </el-button>
            <el-button @click="cancelEdit">关闭</el-button>
          </template>
          <template v-else>
            <el-button type="primary" @click="startEdit">编辑</el-button>
            <el-button @click="compareDialogVisible = false">关闭</el-button>
          </template>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { toggleVideoFavorite, addVideoCopywriting, updateVideoCopywriting } from '@/api/video'

// 定义props
const props = defineProps({
  video: {
    type: Object,
    required: true
  },
  isMyCopyPage: {
    type: Boolean,
    default: false
  }
})

// 视频相关状态
const videoRef = ref(null)
const videoPlayerRef = ref(null)
const videoLoaded = ref(false)
const videoError = ref(false)
const loadAttempts = ref(0)
const errorMessage = ref('未知错误')
const loadingStatus = ref('')
const loadingTimer = ref(null)
const loadingTimeout = ref(null)
const isVideoVisible = ref(false)
const shouldLoadVideo = ref(false)
const visibilityObserver = ref(null)
const videoSizeInKB = ref(0)

// 网络状态检测
const isOffline = ref(false)

// 检测视频是否是小于20KB的抖音视频
const isSmallDouyinVideo = computed(() => {
  return props.video.hotSource === '抖音' &&
         (videoSizeInKB.value > 0 && videoSizeInKB.value < 20)
})

// 全局视频控制
const currentlyPlaying = inject('currentlyPlaying', { videoId: null })

// 视频URL和MIME类型处理
const videoUrl = computed(() => {
  if (!props.video.originalVideo || !shouldLoadVideo.value) return ''
  if (props.video.hotSource === '抖音') {
    return props.video.videoUrl
  } else {
    return `/api/videos/file/${props.video.originalVideo}`
  }
})

// 获取视频MIME类型
const getVideoMimeType = computed(() => {
  if (!props.video.originalVideo) return ''
  const ext = getFileExtension(props.video.originalVideo)
  switch (ext.toLowerCase()) {
    case 'mp4': return 'video/mp4'
    case 'webm': return 'video/webm'
    case 'ogv': return 'video/ogg'
    default: return 'video/mp4' // 默认MP4类型
  }
})

// 视频跳转处理
const handleDouyinLinkClick = () => {
  window.open(props.video.videoUrl, '_blank', 'noreferrer')
}

// 视频播放处理
const handleVideoPlay = () => {
  if (videoRef.value && videoRef.value.paused === false) {
    // 如果有其他正在播放的视频，暂停它
    if (currentlyPlaying.videoId && currentlyPlaying.videoId !== props.video.id) {
      window.dispatchEvent(new CustomEvent('pauseOtherVideos', {
        detail: { exceptId: props.video.id }
      }))
    }
    // 更新当前播放的视频ID
    currentlyPlaying.videoId = props.video.id
  }
}

// 格式化URL显示
const formatUrl = (url) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
  } catch (e) {
    return url;
  }
}


// 视频暂停处理
const handleVideoPause = () => {
  if (currentlyPlaying.videoId === props.video.id) {
    currentlyPlaying.videoId = null
  }
}

// 暂停视频
const pauseVideo = () => {
  if (videoRef.value && !videoRef.value.paused) {
    videoRef.value.pause()
  }
}

// 处理视频可见性变化
const handleVisibilityChange = (entries) => {
  const [entry] = entries
  isVideoVisible.value = entry.isIntersecting

  // 如果视频进入可视区域且还未加载，则开始加载
  if (isVideoVisible.value && !shouldLoadVideo.value) {
    console.log('视频进入可视区域，开始加载:', props.video.title)
    // 可以设置一个短暂延迟，避免快速滚动时加载太多视频
    setTimeout(() => {
      if (isVideoVisible.value) { // 再次检查是否仍然可见
        shouldLoadVideo.value = true
      }
    }, 200)
  }

  // 如果视频不可见且正在播放，则暂停
  if (!isVideoVisible.value && videoRef.value && !videoRef.value.paused) {
    pauseVideo()
  }
}

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
      }, 15000) // 15秒超时
    }
  }, 500)
}

const getFileExtension = (filename) => {
  if (!filename || typeof filename !== 'string') return ''
  const lastDotIndex = filename.lastIndexOf('.')
  return lastDotIndex === -1 ? '' : filename.slice(lastDotIndex + 1).toLowerCase()
}

// 收藏和编辑状态
const isFavorite = ref(false)
const isConvenientEditing = ref(false)
const favoriteLoading = ref(false)
const addVideoCopywritingLoading = ref(false)
const delVideoCopywritingLoading = ref(false)
const compareDialogVisible = ref(false)
const isEditing = ref(true)
const saveLoading = ref(false)
const editForm = ref({
  title: '',
  originalScript: ''
})

// 打开话术对比弹窗
const showScriptCompare = () => {
  compareDialogVisible.value = true
  editForm.value = {
    title: props.video.title || '',
    originalScript: props.video.originalScript || ''
  }
  isEditing.value = true
}

// 显示便捷编辑
const showConvinientInput = () => {
  editForm.value = {
    title: props.video.title || '',
    originalScript: props.video.originalScript || ''
  }
  isConvenientEditing.value = true
}

// 关闭便捷编辑
const closeConvinientInput = () => {
  isConvenientEditing.value = false
}

// 全屏编辑
const fullScreenEdit = () => {
  compareDialogVisible.value = true
}

// 保存更改
const saveScript = () => {
  saveEdits()
  compareDialogVisible.value = false
  isConvenientEditing.value = false
}


// 开始编辑
const startEdit = () => {
  editForm.value = {
    title: props.video.title || '',
    originalScript: props.video.originalScript || ''
  }
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  compareDialogVisible.value = false
}

// 保存编辑
const saveEdits = async () => {
  saveLoading.value = true
  try {
    // 构建保存的数据
    let saveData = {
      isCollected: true,
      title: editForm.value.title,
      content: editForm.value.originalScript
    }
    if (!props.isMyCopyPage){
      saveData.videoId = props.video.id
      await addVideoCopywriting(saveData)
      ElMessage.success('已保存到我的文案')
    } else {
      saveData = { id:props.video.id, videoId: props.video.videoId, ...saveData }
      await updateVideoCopywriting(saveData)
      ElMessage.success('保存成功')
    }

    // 通知父组件更新
    emit('save', saveData)
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    saveLoading.value = false
  }
}


// 定义事件
const emit = defineEmits(['favorite', 'delete'])

const handleDelete = () => emit('delete', props.video)

// 添加到我的文案
const addToVideoCopywriting = async () => {
  addVideoCopywritingLoading.value = true
  try {

    const saveData = {
      videoId: props.video.id,
      isCollected: true,
      title: props.video.title,
      content: props.video.originalScript
    }
    await addVideoCopywriting(saveData)
    ElMessage.success('添加到我的文案成功')
  } catch (error) {
    ElMessage.error('添加到我的文案失败')
  } finally {
    addVideoCopywritingLoading.value = false
  }
}

// 删除我的文案
const delVideoCopywriting = () => emit('delete', props.video)

// 处理收藏事件
const handleFavorite = async () => {
  favoriteLoading.value = true
  try {
    props.video.isFavorite = props.video.isFavorite?props.video.isFavorite:false
    if(props.video.isFavorite){
      ElMessageBox.confirm('确定要取消收藏吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        'lock-scroll': false,
        type: 'warning',
      }).then(async () => {
        await toggleVideoFavorite(String(props.video.id), !props.video.isFavorite)
        props.video.isFavorite = !props.video.isFavorite
        ElMessage.success(props.video.isFavorite ? '收藏成功' : '已取消收藏')
      }).catch(() => {
        ElMessage.info('取消操作')
      })
    }else{
      await toggleVideoFavorite(String(props.video.id), !props.video.isFavorite)
      props.video.isFavorite = !props.video.isFavorite
      ElMessage.success(props.video.isFavorite ? '收藏成功' : '已取消收藏')
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    ElMessage.error('操作失败，请重试')
    } finally {
      favoriteLoading.value = false
    }
}

// 监听shouldLoadVideo变化
watch(shouldLoadVideo, (newVal) => {
  if (newVal && videoRef.value) {
    // 当决定加载视频时，重置状态
    videoLoaded.value = false
    videoError.value = false
    // 给Vue一些时间更新DOM
    nextTick(() => {
      if (videoRef.value) {
        // 手动触发视频加载
        videoRef.value.load()
      }
    })
  }
})

// 组件挂载时初始化
onMounted(() => {
  // 添加网络状态监听
  window.addEventListener('online', handleNetworkChange)
  window.addEventListener('offline', handleNetworkChange)

  // 初始化网络状态
  handleNetworkChange()

  // 添加全局视频暂停事件监听
  window.addEventListener('pauseOtherVideos', (event) => {
    if (event.detail.exceptId !== props.video.id && videoRef.value && !videoRef.value.paused) {
      videoRef.value.pause()
    }
  })

  // 视频加载超时检测 - 只有当决定加载视频时才设置
  watch(shouldLoadVideo, (newVal) => {
    if (newVal && props.video.originalVideo) {
      clearTimeout(loadingTimeout.value) // 清除现有定时器
      loadingTimeout.value = setTimeout(() => {
        if (!videoLoaded.value && !videoError.value) {
          console.warn('视频加载超时')
          videoError.value = true
          errorMessage.value = '加载超时'
        }
      }, 15000) // 15秒超时
    }
  })

  // 初始化IntersectionObserver观察视频是否在可视区域内
  nextTick(() => {
    if (videoPlayerRef.value) {
      visibilityObserver.value = new IntersectionObserver(handleVisibilityChange, {
        root: null, // 使用视口作为根
        threshold: 0.3, // 当30%的视频可见时触发回调
        rootMargin: '100px' // 提前100px开始加载
      });

      visibilityObserver.value.observe(videoPlayerRef.value);
    }
  });
})

onUnmounted(() => {
  window.removeEventListener('pauseOtherVideos', () => {})
  if (currentlyPlaying.videoId === props.video.id) {
    currentlyPlaying.videoId = null
  }

  clearTimeout(loadingTimer.value)
  clearTimeout(loadingTimeout.value)

  // 移除事件监听
  window.removeEventListener('online', handleNetworkChange)
  window.removeEventListener('offline', handleNetworkChange)

  // 清理IntersectionObserver
  if (visibilityObserver.value) {
    visibilityObserver.value.disconnect()
  }

  // 如果当前视频是正在播放的视频，清除该状态
  if (currentlyPlaying.videoId === props.video.id) {
    currentlyPlaying.videoId = null
  }
})
</script>

<style scoped>
.video-card-row {
  width: 100%;
  margin-bottom: 16px;
  transition: transform 0.2s ease;
}

.video-card-row:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.row-layout {
  display: flex;
  width: 100%;
  height: 380px;
}

/* 视频预览区域 */
.video-preview {
  min-width: 300px;
  height: 100%;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  background-color: #565656;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-preview video {
  width: 300px;
  max-height: 380px;
}

/* 视频内容区域 */
.video-content {
  flex: 1;
  padding: 16px;
  min-width: 0; /* 确保flex子项可以正确缩小 */
  display: flex;
  flex-direction: column;
}

.video-header {
  margin-bottom: 10px;
}

.video-title {
  margin: 0 0 6px 0;
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
}

.source {
  background-color: #f4f4f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.time {
  white-space: nowrap;
}

.video-info-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/*视频加载*/
.video-loading {
    /*background-color: rgba(0, 0, 0, 0.5);*/
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
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
    color: #b7babf;
}

.error-actions {
    display: flex;
    gap: 8px;
}

/* 视频统计数据 */
.video-stats {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 13px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 标签和关键词 */
.video-tags-wrapper {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.video-tags, .video-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  max-height: 68px;
  overflow: hidden;
} 

.label {
  font-weight: bold;
  color: #505050;
  font-size: 13px;
  white-space: nowrap;
}

.tag, .keyword {
  margin: 0;
}

/* 话术对比弹窗样式 */
.script-dialog :deep(.el-dialog__body) {
    padding: 0 20px;
}

.script-dialog :deep(.el-dialog__header) {
    padding: 15px 20px;
    margin-right: 0;
    border-bottom: 1px solid #ebeef5;
}

.script-dialog :deep(.el-dialog__footer) {
    padding: 10px 20px 15px;
    border-top: 1px solid #ebeef5;
}

.script-dialog-header {
    width: 100%;
    padding: 10px 20px;
}

.script-header-title {
    display: flex;
    flex-direction: column;
    width: 100%;
    /* background-color: #f5f5f5; */
    border-radius: 10px;
    gap: 10px;
    
}

.script-header-title h2 {
    margin: 0;
    font-size: 20px;
    line-height: 1.4;
    color: #303133;
    font-weight: 600;
    min-width: 100px;
    padding: 1px 10px;
}

.script-header-title span {
    font-weight: 600;
    color: #303133;
    font-size: 15px;
}
.script-content-container {
    padding: 15px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.script-label {
    font-weight: 600;
    color: #303133;
    font-size: 15px;
}

.script-content-wrapper {
    background-color: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    padding: 0;
    overflow: hidden;
    max-height: 510px;
}

.script-text {
    padding: 12px 15px;
    color: #606266;
    font-size: 14px;
    line-height: 1.7;
    white-space: pre-wrap;
    max-height: 520px;
    overflow-y: auto;
}

/* 视频话术 */
.script-container {
  display: flex;
  flex-direction: row;
  background-color: #fafafa;
  cursor: pointer;
}

.script-content {
  margin: 0;
  color: #424346;
  font-size: 15px;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 9;
  -webkit-box-orient: vertical;
  border-radius: 10px;
  transition: background-color 0.2s ease;
  padding: 5px;
  border: 1px solid #e3e6ed;
}

.script-content:hover {
  background-color: #f2f2f2;
}

.script-input-wrapper {
  max-height: 230px;
  width: 100%;
  height: 180px;
  border: none;
  outline: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.script-input {
  width: 100%;
  /* height: 100%; */
  border: none;
  outline: none;
}

.script-input-footer {
  padding: 10px 15px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 10px;
  box-sizing: border-box;
}

/* 操作区域 */
.video-actions {
  width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 16px 16px 16px 0;
  gap: 8px;
}

/* .video-actions :deep(.el-button) {
  width: 100%;
} */

/* 占位符和错误状态 */
.video-placeholder,
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
  background-color: #565656;
  color: #fff;
}

.placeholder-text {
  font-size: 14px;
  color: #909399;
}

.douyin-placeholder {
  background: linear-gradient(135deg, #FE2C55 0%, #25F4EE 100%);
}

.douyin-link-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
}

.douyin-icon {
  width: 40px;
  height: 40px;
}

.douyin-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}

.douyin-tip {
  color: #ffffff;
  font-size: 12px;
}

.douyin-original-link {
  color: #ffffff;
  text-decoration: none;
  background-color: rgba(254, 44, 85, 0.8);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  max-width: 200px;
  max-height: 40px;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}

.original-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409eff;
  text-decoration: none;
  background-color: rgb(216.8,235.6,255);
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  min-width: 80px;
}

.error-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

/* 响应式调整 */
@media screen and (max-width: 1150px) {
    .script-content{
        -webkit-line-clamp: 8;
    }
}

@media screen and (max-width: 1000px) {
  .video-meta{
    flex-direction: row;
    align-items: start;
    overflow: hidden;
  }
  .script-content{
      -webkit-line-clamp: 6;
  }
}

@media screen and (max-width: 768px) {
  .row-layout {
    flex-direction: column;
    height: auto;
  }

  .video-meta{
    flex-direction: row;
    align-items: center;
  }
  .script-content{
      -webkit-line-clamp: 8;
  }
  
  .video-preview {
    width: 100%;
    height: 380px;
  }

  .video-preview video {
    max-width: 100%;
    width: auto;
    max-height: 380px;
  }
  
  .video-actions {
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
    padding: 0 16px 16px;
    box-sizing: border-box;
  }

  .video-meta{
      gap: 1px;
  }
}

@media screen and (max-width: 450px) {
    .video-meta{
        flex-direction: column;
        align-items: start;
    }
}

.script-input-wrapper :deep(.el-textarea__inner) {
  font-family: inherit;
  font-size: 16px;
  line-height: 1.8;
  min-height: 180px !important;
  height: 100% !important;
}

.edit-title-input :deep(.el-input__inner) {
    font-size: 20px;
    font-weight: bold;
}

.edit-script-textarea {
    width: 100%;
    height: 100%;
}

.edit-script-textarea :deep(.el-textarea__inner) {
    font-family: inherit;
    font-size: 16px;
    line-height: 1.8;
    min-height: 400px;
}

/* 视频加载中状态和懒加载占位符 */
.lazy-load-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lazy-load-placeholder:hover {
  background-color: #424242;
}

.lazy-load-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.2);
}

.lazy-load-text {
  color: white;
  font-size: 14px;
}
</style> 