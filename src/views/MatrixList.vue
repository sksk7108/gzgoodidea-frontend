<template>
  <div class="matrix-container">
    <div class="header-section">
      <div class="title-section">
        <h2>矩阵管理</h2>
        <span class="subtitle">管理您的矩阵配置，包括人设、文案风格和关联账号</span>
      </div>
      <el-button 
        type="primary" 
        :icon="Plus" 
        @click="handleAdd"
      >新增矩阵</el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="输入矩阵名称搜索"
        :prefix-icon="Search"
        clearable
        @input="handleSearch"
      />
    </div>

    <!-- 矩阵列表 -->
    <el-table
      v-loading="loading"
      :data="matrixList"
      style="width: 100%"
      border
      row-key="id"
    >
      <el-table-column prop="name" label="矩阵名称" min-width="120" />
      <el-table-column prop="persona" label="人设" min-width="150" show-overflow-tooltip />
      <el-table-column prop="style" label="文案风格" min-width="150" show-overflow-tooltip />
      <el-table-column label="关联账号" min-width="200">
        <template #default="scope">
          <el-tag
            v-for="account in scope.row.accounts"
            :key="account.id"
            class="account-tag"
            type="info"
            effect="plain"
          >
            {{ account.name }}
          </el-tag>
          <el-tag v-if="!scope.row.accounts || scope.row.accounts.length === 0" type="info">
            暂无关联账号
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="180">
        <template #default="scope">
          {{ formatDate(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button 
            type="primary" 
            link 
            :icon="Edit" 
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button 
            type="danger" 
            link 
            :icon="Delete" 
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
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
      width="650px"
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form
        ref="matrixFormRef"
        :model="matrixForm"
        :rules="formRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="矩阵名称" prop="name">
          <el-input v-model="matrixForm.name" placeholder="请输入矩阵名称" />
        </el-form-item>
        <el-form-item label="人设" prop="persona">
          <el-input
            v-model="matrixForm.persona"
            type="textarea"
            :rows="3"
            placeholder="请描述矩阵的人设特点"
          />
        </el-form-item>
        <el-form-item label="文案风格" prop="style">
          <el-input
            v-model="matrixForm.style"
            type="textarea"
            :rows="3"
            placeholder="请描述矩阵的文案风格"
          />
        </el-form-item>
        <el-form-item label="关联账号" prop="accounts">
          <el-select
            v-model="matrixForm.accounts"
            multiple
            collapse-tags
            collapse-tags-tooltip
            style="width: 100%"
            placeholder="请选择关联账号"
          >
            <el-option
              v-for="item in accountOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
import { 
  getMatrixList, 
  getMatrixDetail, 
  createMatrix, 
  updateMatrix, 
  deleteMatrix,
  getAccountsList
} from '@/api/matrix'
import { Edit, Delete, Plus, Search } from '@element-plus/icons-vue'

// 状态变量
const loading = ref(false)
const submitLoading = ref(false)
const matrixList = ref([])
const accountOptions = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchKeyword = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentId = ref(null)

// 表单相关
const matrixFormRef = ref(null)
const matrixForm = reactive({
  name: '',
  persona: '',
  style: '',
  accounts: []
})

// 表单校验规则
const formRules = {
  name: [
    { required: true, message: '请输入矩阵名称', trigger: 'blur' },
    { max: 50, message: '名称长度不能超过50个字符', trigger: 'blur' }
  ],
  persona: [
    { required: true, message: '请输入人设描述', trigger: 'blur' }
  ],
  style: [
    { required: true, message: '请输入文案风格', trigger: 'blur' }
  ]
}

const formTitle = computed(() => isEdit.value ? '编辑矩阵' : '新增矩阵')

// 生命周期钩子
onMounted(() => {
  fetchMatrixList()
  fetchAccountOptions()
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
    matrixList.value = res.data.list || []
    total.value = res.data.total || 0
  } catch (error) {
    ElMessage.error('获取矩阵列表失败')
    console.error('获取矩阵列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取账号选项
const fetchAccountOptions = async () => {
  try {
    const res = await getAccountsList()
    accountOptions.value = res.data || []
  } catch (error) {
    ElMessage.error('获取账号列表失败')
    console.error('获取账号列表失败:', error)
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
const handleEdit = async (row) => {
  isEdit.value = true
  currentId.value = row.id
  dialogVisible.value = true
  
  try {
    const res = await getMatrixDetail(row.id)
    const matrixData = res.data
    
    matrixForm.name = matrixData.name
    matrixForm.persona = matrixData.persona
    matrixForm.style = matrixData.style
    matrixForm.accounts = matrixData.accounts ? matrixData.accounts.map(acc => acc.id) : []
  } catch (error) {
    ElMessage.error('获取矩阵详情失败')
    console.error('获取矩阵详情失败:', error)
  }
}

// 处理删除矩阵
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除矩阵 "${row.name}" 吗？此操作不可恢复`,
    '确认删除',
    {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }
  ).then(async () => {
    try {
      await deleteMatrix(row.id)
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
        persona: matrixForm.persona,
        style: matrixForm.style,
        accounts: matrixForm.accounts
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
  matrixForm.persona = ''
  matrixForm.style = ''
  matrixForm.accounts = []
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

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '暂无数据'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
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

.search-section {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
}

.search-section .el-input {
  width: 300px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.account-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

:deep(.el-tag) {
  margin: 2px;
}

@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .search-section .el-input {
    width: 100%;
  }
}
</style> 