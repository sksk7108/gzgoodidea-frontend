<!-- AIConfig.vue -->
<template>
  <div class="ai-config">
    <!-- 配置类型切换 -->
    <div class="config-tabs">
      <el-radio-group v-model="activeConfig" size="large">
        <el-radio-button label="prompt">提示词配置</el-radio-button>
        <el-radio-button label="knowledge">知识库配置</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 提示词配置 -->
    <el-card v-if="activeConfig === 'prompt'" class="config-card">
      <template #header>
        <div class="card-header">
          <h2>提示词配置</h2>
        </div>
      </template>
      
      <div class="config-content">
        <el-form :model="promptForm">
          <el-form-item label="AI提示词">
            <el-input
              v-model="promptForm.prompt"
              type="textarea"
              :rows="15"
              placeholder="请输入AI提示词，用于指导AI生成话术"
            />
          </el-form-item>
        </el-form>

        <div class="actions">
          <el-button type="primary" @click="handleSavePrompt">保存配置</el-button>
          <el-button @click="handleResetPrompt">重置</el-button>
        </div>
      </div>
    </el-card>

    <!-- 知识库配置 -->
    <el-card v-if="activeConfig === 'knowledge'" class="config-card">
      <template #header>
        <div class="card-header">
          <h2>知识库配置</h2>
        </div>
      </template>
      
      <div class="config-content">
        <el-form :model="knowledgeForm">
          <el-form-item label="知识库内容">
            <el-input
              v-model="knowledgeForm.content"
              type="textarea"
              :rows="15"
              placeholder="请输入知识库内容"
            />
          </el-form-item>
        </el-form>

        <div class="actions">
          <el-button type="primary" @click="handleSaveKnowledge">保存配置</el-button>
          <el-button @click="handleResetKnowledge">重置</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getPrompt, savePrompt, getKnowledge, saveKnowledge } from '@/api/aiConfig.js'
// 当前激活的配置类型
const activeConfig = ref('prompt')

// 提示词表单数据
const promptForm = reactive({
  prompt: ''
})

// 知识库表单数据
const knowledgeForm = reactive({
  content: ''
})

// 获取提示词
const getPromptData = async () => {
  const res = await getPrompt()
  
  promptForm.prompt = res
}

// 获取知识库
const getKnowledgeData = async () => {
  const res = await getKnowledge()
  knowledgeForm.content = res
}


// 提示词相关方法
const handleSavePrompt = async () => {
  if (!promptForm.prompt.trim()) {
    ElMessage.warning('请输入提示词内容')
    return
  }
  await savePrompt({content: promptForm.prompt})
  ElMessage.success('提示词配置保存成功')
}

const handleResetPrompt = () => {
  promptForm.prompt = ''
}


// 知识库相关方法
const handleSaveKnowledge = async () => {
  if (!knowledgeForm.content.trim()) {
    ElMessage.warning('请输入知识库内容')
    return
  }
  await saveKnowledge(knowledgeForm)
  ElMessage.success('知识库配置保存成功')

}

const handleResetKnowledge = () => {
  knowledgeForm.content = ''
}

// 初始化
onMounted(() => {
  getPromptData()
  getKnowledgeData()
})
</script>

<style scoped>
.ai-config {
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.config-tabs {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.config-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-content {
  padding: 0;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}

:deep(.el-input__textarea) {
  font-size: 14px;
}

:deep(.el-card__header) {
  padding-bottom: 0;
  padding-top: 0;
}
</style> 