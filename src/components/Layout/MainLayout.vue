<!-- MainLayout.vue -->
<template>
  <div class="main-layout">
    <el-container>
      <el-header class="header">
        <component :is="menuComponent" :companyConfig="currentCompanyConfig"></component>
        
        <!-- 用户信息和退出按钮 -->
        <div class="user-actions">
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="40" class="user-avatar"> 
                <div class="avatar-img" v-if="userStore.avatar">
                  <img :src="avatarUrl" style="width: 100%;height: 100%;" alt="用户头像">
                </div>
                <svg t="1748311421152" v-else class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6195" width="48" height="48"><path d="M512 85.333333C276.48 85.333333 85.333333 276.48 85.333333 512s191.146667 426.666667 426.666667 426.666667 426.666667-191.146667 426.666667-426.666667S747.52 85.333333 512 85.333333zM301.653333 779.946667c18.346667-38.4 130.133333-75.946667 210.346667-75.946667s192.426667 37.546667 210.346667 75.946667A336.768 336.768 0 0 1 512 853.333333c-79.36 0-152.32-27.306667-210.346667-73.386666z m481.706667-61.866667c-61.013333-74.24-209.066667-99.413333-271.36-99.413333s-210.346667 25.173333-271.36 99.413333A339.2 339.2 0 0 1 170.666667 512c0-188.16 153.173333-341.333333 341.333333-341.333333s341.333333 153.173333 341.333333 341.333333c0 77.653333-26.453333 148.906667-69.973333 206.08zM512 256c-82.773333 0-149.333333 66.56-149.333333 149.333333S429.226667 554.666667 512 554.666667s149.333333-66.56 149.333333-149.333334S594.773333 256 512 256z m0 213.333333c-35.413333 0-64-28.586667-64-64S476.586667 341.333333 512 341.333333s64 28.586667 64 64S547.413333 469.333333 512 469.333333z" fill="#e6e6e6" p-id="6196"></path></svg>
              </el-avatar>
              <div class="user-details">
                <div class="company-info">
                  <el-tag size="small" type="primary" class="role">公司</el-tag>
                  <span class="company-name">{{ userStore.company || '暂无关联公司' }}</span>
                </div>
                <div class="user-name-container">
                  <el-tag size="small" type="success" class="role">员工</el-tag>
                  <span class="username">{{ userStore.username? userStore.username : userStore.account }}</span>
                </div>
              </div>
              <el-icon class="dropdown-icon"><arrow-down /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>修改用户信息
                </el-dropdown-item>
                <!-- <el-dropdown-item command="password">
                  <el-icon><Lock /></el-icon>修改密码
                </el-dropdown-item> -->
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-container">
        <router-view></router-view>
      </el-main>
    </el-container>

    <!-- 修改用户信息对话框 -->
    <el-dialog  
      v-model="profileDialogVisible" 
      title="修改用户信息" 
      width="400px" 
      :lock-scroll="false"
      center
      @close="handleProfileDialogClose"
    >
      <el-form :model="profileForm" label-width="80px" :rules="profileRules" ref="profileFormRef">
        <el-form-item label="头像" prop="avatar">
          <div class="avatar-uploader">
            <el-avatar :size="80" class="preview-avatar">
              <img v-if="avatarPreview" :src="avatarPreview" style="width: 100%; height: 100%;" alt="用户头像">
              <img v-else-if="avatarUrl" :src="avatarUrl" style="width: 100%; height: 100%;" alt="用户头像">
              <el-icon v-else><UserFilled /></el-icon>
            </el-avatar>
            <el-upload
              class="avatar-upload"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleAvatarChange"
              accept="image/jpeg,image/png,image/gif"
            >
              <el-button type="primary" size="small">选择头像</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="profileForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="profileDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProfile" :loading="profileSubmitting">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 图片裁剪对话框 -->
    <el-dialog v-model="cropperVisible" title="裁剪头像" width="500px" lock-scroll="false" center destroy-on-close>
      <div class="cropper-container">
        <Cropper
          v-if="cropperImage"
          class="cropper"
          :src="cropperImage"
          :stencil-props="{
            aspectRatio: 1
          }"
          :default-size="{
            width: '80%',
            height: '80%'
          }"
          image-restriction="stencil"
          @ready="onReady"
          @change="onChange"
          ref="cropperRef"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cropperVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmCrop">确认裁剪</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="passwordDialogVisible" :lock-scroll="false" title="修改密码" width="400px" center>
      <el-form :model="passwordForm" label-width="100px" :rules="passwordRules" ref="passwordFormRef">
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入当前密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请确认新密码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPassword" :loading="passwordSubmitting">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { ArrowDown, User, SwitchButton, UserFilled } from '@element-plus/icons-vue'
import { updateUserProfile, updatePassword } from '@/api/auth'
import { getRememberCompanyId } from '@/utils/auth'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { patternConfig } from '@/config/patternConfig.js'
import MenuVT from '@/components/menu/MenuVT.vue'
import MenuWy1002 from '@/components/menu/Menu-wy1002.vue'

const router = useRouter()
const userStore = useUserStore()

// 对话框状态
const profileDialogVisible = ref(false)
const passwordDialogVisible = ref(false)
const profileSubmitting = ref(false)
const passwordSubmitting = ref(false)
const cropperVisible = ref(false)

// 表单引用
const profileFormRef = ref(null)
const passwordFormRef = ref(null)
const cropperRef = ref(null)

// 头像预览
const avatarPreview = ref('')
const avatarFile = ref(null)
const avatarUrl = computed(() => {
  return '/api/employee/avatar/' + userStore.avatar
})
const cropperImage = ref('')
const coordinates = ref(null)


// 公司配置
const currentCompanyConfig = computed(() => {
  const companyId = userStore.companyId || 'VT-10002'
  return patternConfig[companyId] || patternConfig['VT-10002']
})

// 根据公司配置动态选择菜单组件
const menuComponent = computed(() => {
  const componentName = currentCompanyConfig.value.menuComponent || 'MenuVT'
  const components = {
    'MenuVT': MenuVT,
    'MenuWy1002': MenuWy1002
  }
  return components[componentName] || MenuVT
})

// 个人资料表单
const profileForm = reactive({
  username: '',
  avatar: ''
})

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单校验规则
const profileRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      showProfileDialog()
      break
    case 'password':
      showPasswordDialog()
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 显示个人资料对话框
const showProfileDialog = () => {
  // 初始化表单数据
  profileForm.username = userStore.username || userStore.account
  profileForm.avatar = ''
  
  // 清除之前的预览
  if (avatarPreview.value && avatarPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }
  avatarPreview.value = ''
  avatarFile.value = null
  cropperImage.value = ''
  coordinates.value = null
  
  profileDialogVisible.value = true
}

// 处理对话框关闭
const handleProfileDialogClose = () => {
  // 清理资源
  if (avatarPreview.value && avatarPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }
  avatarPreview.value = ''
  avatarFile.value = null
  cropperImage.value = ''
  coordinates.value = null
  profileDialogVisible.value = false
}

// 显示修改密码对话框
const showPasswordDialog = () => {
  // 重置表单
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  
  passwordDialogVisible.value = true
}

// 处理头像变更
const handleAvatarChange = (file) => {
  // 首先检查文件类型
  const isImage = file.raw.type.indexOf('image/') !== -1
  const isJPG = file.raw.type === 'image/jpeg'
  const isPNG = file.raw.type === 'image/png'
  const isGIF = file.raw.type === 'image/gif'
  
  if (!isImage || (!isJPG && !isPNG && !isGIF)) {
    ElMessage.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
    return
  }
  
  // 检查文件大小
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return
  }
  
  // 读取图片，准备裁剪
  const reader = new FileReader()
  reader.onload = (e) => {
    cropperImage.value = e.target.result
    cropperVisible.value = true
  }
  reader.readAsDataURL(file.raw)
}

// 裁剪变化
const onChange = ({ coordinates: coords }) => {
  coordinates.value = coords
  console.log(coordinates.value)
}

// 裁剪准备
const onReady = () => {
  const cropper = cropperRef.value
  if (!cropper) return
  const imageSize = cropper.imageSize
  if (!imageSize) return

  const cropWidth = imageSize.width * 0.8
  const cropHeight = imageSize.height * 0.8
  const left = (imageSize.width - cropWidth) / 2
  const top = (imageSize.height - cropHeight) / 2

  cropper.setCoordinates({
    left,
    top,
    width: cropWidth,
    height: cropHeight,
  })
}

// 确认裁剪
const confirmCrop = () => {
  if (!cropperRef.value || !coordinates.value) return
  
  // 获取裁剪后的图像
  const { canvas } = cropperRef.value.getResult()
  
  // 将裁剪后的图像转换为 blob 并设置预览
  canvas.toBlob((blob) => {
    // 创建带有时间戳的文件名，避免缓存问题
    const filename = `avatar_${Date.now()}.png`
    avatarFile.value = new File([blob], filename, { type: 'image/png' })
    
    // 设置预览图像
    avatarPreview.value = URL.createObjectURL(blob)
    
    // 关闭裁剪对话框
    cropperVisible.value = false
  }, 'image/png')
}

// 提交个人资料表单
const submitProfile = async () => {
  if (!profileFormRef.value) return
  await profileFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    profileSubmitting.value = true
    
    try {
      // 创建表单数据
      const formData = new FormData()
      formData.append('employeeName', profileForm.username)
      
      if (avatarFile.value) {
        formData.append('file', avatarFile.value)
      }
      
      // 调用API更新用户信息
      const response = await updateUserProfile(formData)
      
      // 更新用户信息
      const updatedUserInfo = {
        ...userStore.userInfo,
        employeeName: profileForm.username,
        avatar: response || userStore.avatar
      }

      console.log('updatedUserInfo', updatedUserInfo)
      
      userStore.setUserInfo(updatedUserInfo)
      
      // 释放 blob URL
      if (avatarPreview.value && avatarPreview.value.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview.value)
      }
      
      ElMessage.success('个人资料更新成功')
      profileDialogVisible.value = false
    } catch (error) {
      console.error('更新个人资料失败:', error)
      ElMessage.error('更新个人资料失败')
    } finally {
      profileSubmitting.value = false
    }
  })
}

// 提交密码表单
const submitPassword = async () => {
  ElMessage.warning('功能暂未开放')
  return
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    passwordSubmitting.value = true
    
    try {
      // 调用API修改密码
      await updatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      })
      
      ElMessage.success('密码修改成功')
      passwordDialogVisible.value = false
    } catch (error) {
      console.error('修改密码失败:', error)
      ElMessage.error(error.response?.data?.message || '修改密码失败')
    } finally {
      passwordSubmitting.value = false
    }
  })
}

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    'lock-scroll': false,
    type: 'warning',
  }).then(async () => {
    try {
      await userStore.logout()
      ElMessage.success('已退出登录')
      router.push(`/login/${getRememberCompanyId() || 'VT-10001'}`)
    } catch (error) {
      ElMessage.error('退出登录失败')
    }
  }).catch(() => {
    // 点击取消按钮，不做任何操作
  })
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  width: 100%;
}

.el-container {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin-right: 40px;
  color: #409EFF;
  transition: all 0.3s ease;
}

.logo-img {
  width: 30px;
  height: 30px;
  margin-right: 3px;
}



.user-actions {
  display: flex;
  align-items: center;
  margin-left: auto;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.user-actions:hover {
  background-color: #eff2f7;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  background-color: #409EFF;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
  transition: transform 0.3s ease;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.user-avatar:hover {
  transform: scale(1.1);
}

.user-details {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 1.2;
  gap: 4px;
  transition: all 0.3s ease;
}


.company-info {
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}


.company-name {
  color: #303133;
  font-weight: 600;
  font-size: 14px;
}

.role {
  font-size: 10px;
  padding: 0 4px;
  height: 18px;
  line-height: 16px;
}

.user-name-container {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
  font-size: 12px;
}

.username {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
  display: inline-block;
}

.dropdown-icon {
  font-size: 12px;
  color: #909399;
  margin-left: 5px;
}

.main-container {
  padding: 20px;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
  width: 100%;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

:deep(.el-menu) {
  flex: 1;
  border: none;
}

/* 头像上传相关样式 */
.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.preview-avatar {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-upload {
  text-align: center;
}

/* 裁剪组件相关样式 */
.cropper-container {
  height: 400px;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cropper {
  height: 100%;
  width: 100%;
}

/* 对话框底部样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 下拉菜单项样式 */
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 5px;
  font-size: 16px;
}

@media screen and (max-width: 2000px) {
 
}

@media screen and (max-width: 1600px) {
}

@media screen and (max-width: 1200px) {
}

@media screen and (max-width: 900px) {
  .logo {
    font-size: 16px;
    margin-right: 10px;
  }
  .username {
    font-size: 13px;
  }
  .company-name {
    max-width: 100px;
  }
  .menu{
    max-width: 400px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
  }
}
@media screen and (max-width: 700px){
    .logo {
        display: none;
    }
    .company-info, .user-name-container {
      display: none;
    }
}
@media screen and (max-width: 600px) {
  .username {
    display: none;
  }
  .role {
    display: none;
  }
  .menu{
    max-width: 300px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
  }
}

@keyframes blink {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}
</style> 
