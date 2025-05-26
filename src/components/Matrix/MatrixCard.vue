<template>
  <el-card 
    class="matrix-card"
    :body-style="{ padding: '0px' }"
    shadow="hover"
  >
    <div class="matrix-card-header">
      <div class="matrix-name">{{ matrix.name }}</div>
      <div class="matrix-actions">
        <el-button 
          type="primary" 
          :icon="Edit"
          size="default"
          @click.stop="handleEdit"
        >编辑</el-button>
        <el-button 
          type="danger" 
          :icon="Delete"
          size="default"
          @click.stop="handleDelete"
        >删除</el-button>
      </div>
    </div>
    <div class="matrix-card-content">
      <div class="matrix-info-item" @click="showDetailDialog('personConfig', '人设')">
        <div class="info-label">
          人设
        </div>
        <div class="info-value">{{ matrix.personConfig }}</div>
      </div>
      <div class="matrix-info-item" @click="showDetailDialog('contentStyle', '文案风格')">
        <div class="info-label">
          文案风格
        </div>
        <div class="info-value">{{ matrix.contentStyle }}</div>
      </div>
      <div class="matrix-info-item" @click="showDetailDialog('specialRequests', '特殊要求')">
        <div class="info-label">
          特殊要求
        </div>
        <div class="info-value">{{ matrix.specialRequests || '无' }}</div>
      </div>
    </div>
    <div class="matrix-card-footer">
      <span class="created-time">创建时间: {{ formatDate(matrix.createTime) }}</span>
    </div>
  </el-card>

  <!-- 内容详情弹窗 -->
  <el-dialog
    v-model="detailDialogVisible"
    :title="detailDialogTitle"
    width="600px"
    :close-on-click-modal="true"
    destroy-on-close
    center
    :lock-scroll="false"
  >
    <div class="detail-content">
      <pre>{{ detailContent }}</pre>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { defineProps, defineEmits, ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  matrix: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

// 详情弹窗相关
const detailDialogVisible = ref(false)
const detailDialogTitle = ref('')
const detailContent = ref('')

// 显示详情弹窗
const showDetailDialog = (field, title) => {
  detailDialogTitle.value = `${title}`
  detailContent.value = props.matrix[field] || '暂无内容'
  detailDialogVisible.value = true
}

// 复制内容
const copyContent = () => {
  navigator.clipboard.writeText(detailContent.value).then(() => {
    ElMessage.success('内容已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

const handleEdit = () => {
  emit('edit', props.matrix)
}

const handleDelete = () => {
  emit('delete', props.matrix)
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '暂无数据'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.matrix-card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  height: 65vh;
  max-height: 620px;
}

.matrix-card:hover {
  transform: translateY(-5px);
}

.matrix-card-header {
  background-color: #f5f7fa;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}

.matrix-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-left: 12px;
}

.matrix-actions {
  display: flex;
  gap: 8px;
}

.matrix-card-content {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 71%;
}

.matrix-card-content>div{
  flex: 1;
}

.matrix-info-item {
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 6px;
  background-color: #f9f9f9;
  border: 1px solid #ebeef5;
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.matrix-info-item:hover {
  background-color: #ecf5ff;
  border-color: #d9ecff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.info-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 600;
  color: #606266;
  width: 80px;
}

.click-hint {
  font-size: 10px;
  padding: 0 5px;
  height: 18px;
  line-height: 16px;
  opacity: 0.7;
}

.matrix-info-item:hover .click-hint {
  opacity: 1;
}

.info-value {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  word-break: break-word;
  max-height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  background-color: #fff;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  flex: 1;
}

.matrix-card-footer {
  padding: 10px 15px;
  background-color: #f5f7fa;
  border-top: 1px solid #ebeef5;
}

.created-time {
  font-size: 12px;
  color: #909399;
}

:deep(.el-card__body){
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.detail-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.detail-content pre {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  margin: 0;
  line-height: 1.8;
}
</style> 