<template>
  <div class="matrix-container">
    <div class="header-section">
      <div class="title-section">
        <h2>矩阵管理</h2>
        <span class="subtitle">管理您的矩阵配置，包括人设、文案风格和特殊要求</span>
      </div>
      <el-button 
        type="primary" 
        :icon="Plus" 
        @click="handleAdd"
      >新增矩阵</el-button>
    </div>

    <!-- 搜索区域 -->

    <!-- 矩阵卡片列表 -->
    <div v-loading="loading" class="matrix-list-container">
      <template v-if="filteredMatrixList.length > 0">
        <div class="matrix-card-list">
          <matrix-card
            v-for="matrix in filteredMatrixList" 
            :key="matrix.id" 
            :matrix="matrix"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </template>
      <el-empty v-else description="暂无矩阵数据" />
    </div>

    <!-- 分页控件 -->
    <div class="pagination-container" v-if="filteredMatrixList.length > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[8, 16, 24, 32]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 矩阵表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formTitle"
      fullscreen
      class="edit-dialog"
      :lock-scroll="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="resetForm"
      @submit.native.prevent
    >
      <el-form
        ref="matrixFormRef"
        :model="matrixForm"
        :rules="formRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item class="matrix-name" label="矩阵名称" prop="name">
          <el-input v-model="matrixForm.name" placeholder="请输入矩阵名称" @keyup.enter.stop="submitForm" />
        </el-form-item>
        <el-form-item label="人设" prop="personConfig">
          <el-input
            v-model="matrixForm.personConfig"
            type="textarea"
            placeholder="请描述矩阵的人设特点"
          />
        </el-form-item>
        <el-form-item label="文案风格" prop="contentStyle">
          <el-input
            v-model="matrixForm.contentStyle"
            type="textarea"
            placeholder="请描述矩阵的文案风格"
          />
        </el-form-item>
        <el-form-item label="特殊要求" prop="specialRequests">
          <el-input
            v-model="matrixForm.specialRequests"
            type="textarea"
            placeholder="请输入特殊要求，如输出格式等"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">
            {{ isEdit ? '更新' : '创建' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import MatrixCard from '@/components/Matrix/MatrixCard.vue'
import { 
  getMatrixList, 
  getMatrixDetail, 
  createMatrix, 
  updateMatrix, 
  deleteMatrix
} from '@/api/matrix'

// 状态变量
const loading = ref(false)
const submitLoading = ref(false)
const matrixList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(8)
const searchKeyword = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentId = ref(null)

// 表单相关
const matrixFormRef = ref(null)
const matrixForm = reactive({
  name: '',
  personConfig: '',
  contentStyle: '',
  specialRequests: ''
})

// 表单校验规则
const formRules = {
  name: [
    { required: true, message: '请输入矩阵名称', trigger: 'blur' },
    { max: 50, message: '名称长度不能超过50个字符', trigger: 'blur' }
  ],
  personConfig: [
    { required: true, message: '请输入人设描述', trigger: 'blur' }
  ],
  contentStyle: [
    { required: true, message: '请输入文案风格', trigger: 'blur' }
  ]
}

const formTitle = computed(() => isEdit.value ? '编辑矩阵' : '新增矩阵')

// 过滤后的矩阵列表
const filteredMatrixList = computed(() => {
  if (!searchKeyword.value) {
    return matrixList.value;
  }
  
  return matrixList.value.filter(matrix => 
    matrix.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});

// 生命周期钩子
onMounted(() => {
  fetchMatrixList()
})

// 获取矩阵列表
const fetchMatrixList = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    }
    const res = await getMatrixList(params)
    console.log(res)
    matrixList.value = res.records || []
    total.value = res.total || 0
  } catch (error) {
    ElMessage.error('获取矩阵列表失败')
    console.error('获取矩阵列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理新增矩阵
const handleAdd = () => {
  isEdit.value = false
  currentId.value = null
  resetForm()
  dialogVisible.value = true
}

// 处理编辑矩阵
const handleEdit = async (matrix) => {
  isEdit.value = true
  currentId.value = matrix.id
  dialogVisible.value = true
  
  try {
    const matrixData = await getMatrixDetail(matrix.id)
    
    matrixForm.name = matrixData.name
    matrixForm.personConfig = matrixData.personConfig
    matrixForm.contentStyle = matrixData.contentStyle
    matrixForm.specialRequests = matrixData.specialRequests || ''
  } catch (error) {
    ElMessage.error('获取矩阵详情失败')
    console.error('获取矩阵详情失败:', error)
  }
}

// 处理删除矩阵
const handleDelete = (matrix) => {
  ElMessageBox.confirm(
    `确定要删除矩阵 "${matrix.name}" 吗？此操作不可恢复`,
    '确认删除',
    {
      type: 'warning',
      'lock-scroll': false,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }
  ).then(async () => {
    try {
      await deleteMatrix(matrix.id)
      ElMessage.success('删除成功')
      fetchMatrixList()
    } catch (error) {
      ElMessage.error('删除失败')
      console.error('删除矩阵失败:', error)
    }
  }).catch(() => {
    // 用户取消删除，不做处理
  })
}

// 提交表单
const submitForm = async () => {
  if (!matrixFormRef.value) return
  
  await matrixFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitLoading.value = true
    try {
      const formData = {
        name: matrixForm.name,
        personConfig: matrixForm.personConfig,
        contentStyle: matrixForm.contentStyle,
        specialRequests: matrixForm.specialRequests
      }
      
      if (isEdit.value) {
        await updateMatrix(currentId.value, formData)
        ElMessage.success('更新成功')
      } else {
        await createMatrix(formData)
        ElMessage.success('创建成功')
      }
      
      dialogVisible.value = false
      fetchMatrixList()
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
      console.error(isEdit.value ? '更新矩阵失败:' : '创建矩阵失败:', error)
    } finally {
      submitLoading.value = false
    }
  })
}

// 重置表单
const resetForm = () => {
  if (matrixFormRef.value) {
    matrixFormRef.value.resetFields()
  }
  matrixForm.name = ''
  matrixForm.personConfig = ''
  matrixForm.contentStyle = ''
  matrixForm.specialRequests = ''
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchMatrixList()
}

// 处理每页显示数量变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  fetchMatrixList()
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchMatrixList()
}
</script>

<style scoped>
.matrix-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title-section {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.title-section h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.subtitle {
  margin-top: 5px;
  font-size: 14px;
  color: #909399;
}

.filter-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.search-input {
  width: 300px;
}

.matrix-list-container {
  min-height: 400px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

.matrix-card-list {
  /* display: grid;
  grid-template-columns: repeat(auto-fill, minmax(460px, 1fr)); */
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

:deep(.edit-dialog){
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

:deep(.el-dialog__body){
  flex: 3;
  max-height: 650px;
  overflow: hidden;
}

:deep(.el-dialog__body .el-form){
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
}

:deep(.el-dialog__body .matrix-name){
  height: auto !important;
}

:deep(.el-dialog__body .el-form .el-form-item){
  height: 100%;
}

:deep(.el-dialog__body .el-form .el-textarea),
:deep(.el-dialog__body .el-form .el-textarea__inner)
{
  height: 100%;
}


@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-input {
    width: 100%;
  }
  
  .matrix-card-list {
    grid-template-columns: 1fr;
  }
}
</style> 