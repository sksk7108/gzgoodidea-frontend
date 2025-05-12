<template>
  <div class="keyword-list-container">
    <!-- 操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="openAddDialog">
        <img src="@/assets/img/add.svg" style="width: 16px; height: 16px; margin-right: 5px;" />新增关键词
      </el-button>
      
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索关键词"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
    </div>
    
    <!-- 关键词表格 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="keywordList"
        border
        style="width: 100%"
        row-key="id"
      >
        <el-table-column prop="content" label="关键词" min-width="150" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeTagType(scope.row.type)">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="创建用户" width="120" show-overflow-tooltip />
        <el-table-column prop="expiryDays" label="查询时效(天)" width="120" align="center" />
        <el-table-column prop="count" label="出现次数" width="100" align="center" />
        <el-table-column prop="likeCount" label="点赞数" width="100" align="center" />
        <el-table-column prop="commentCount" label="评论数" width="100" align="center" />
        <el-table-column prop="favoriteCount" label="收藏数" width="100" align="center" />
        <el-table-column prop="shareCount" label="分享数" width="100" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="180" show-overflow-tooltip>
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-popconfirm
              title="确定删除此关键词吗？"
              @confirm="handleDelete(scope.row)"
            >
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -- 暂时不分页 -->
      <!-- <div class="pagination-container">
        <el-pagination
          v-if="total > 0"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div> -->
    </el-card>
    
    <!-- 新增关键词对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="新增关键词"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="keywordFormRef"
        :model="keywordForm"
        :rules="keywordRules"
        label-width="100px"
      >
        <el-form-item label="关键词" prop="content">
          <el-input v-model="keywordForm.content" placeholder="请输入关键词" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="keywordForm.type" placeholder="请选择类型" style="width: 100%">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="查询时效" prop="expiryDays">
          <el-input-number
            v-model="keywordForm.expiryDays"
            :min="1"
            :max="365"
            placeholder="天数"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="submitKeyword">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { Plus } from '@element-plus/icons-vue'
import { getKeywordList, addKeyword, deleteKeyword } from '@/api/keyword'

// 搜索关键词
const searchKeyword = ref('')

// 加载状态
const loading = ref(false)
const submitLoading = ref(false)

// 关键词表单对话框
const dialogVisible = ref(false)
const keywordFormRef = ref(null)
const keywordForm = reactive({
  content: '',
  type: '',
  expiryDays: 5
})

// 表单验证规则
const keywordRules = {
  content: [
    { required: true, message: '请输入关键词', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择类型', trigger: 'change' }
  ],
  expiryDays: [
    { required: true, message: '请输入查询时效', trigger: 'blur' },
    { type: 'number', min: 1, max: 365, message: '时效天数在 1 到 365 之间', trigger: 'blur' }
  ]
}

// 类型选项
const typeOptions = ref([
  { label: '系统', value: '系统' },
  { label: '临时', value: '临时' },
])

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 关键词列表数据
const keywordList = ref([])

// 获取类型标签样式
const getTypeTagType = (type) => {
  const typeMap = {
    '系统': 'success',
    '临时': 'primary',
  }
  return typeMap[type] || ''
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
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

// 获取关键词列表
const fetchKeywordList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      content: searchKeyword.value
    }
    
    const response = await getKeywordList(params)
    
    // 根据实际接口返回格式进行适配
    if (response && response.records) {
      keywordList.value = response.records
      total.value = response.total || 0
    } else {
      keywordList.value = Array.isArray(response) ? response : (response?.items || [])
      total.value = response?.total || (Array.isArray(response) ? response.length : 0)
    }
  } catch (error) {
    console.error('获取关键词列表失败', error)
    ElMessage.error('获取关键词列表失败')
    keywordList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}


// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchKeywordList()
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchKeywordList()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchKeywordList()
}

// 打开新增对话框
const openAddDialog = () => {
  keywordForm.content = ''
  keywordForm.type = ''
  keywordForm.expiryDays = 5
  dialogVisible.value = true
  // 延迟重置表单验证状态
  setTimeout(() => {
    keywordFormRef.value?.resetFields()
  }, 0)
}

// 提交新增关键词
const submitKeyword = () => {
  if (!keywordFormRef.value) return
  
  keywordFormRef.value.validate((valid) => {
    if (!valid) return
    
    submitLoading.value = true
    addKeyword(keywordForm)
      .then(() => {
        ElMessage.success('新增关键词成功')
        dialogVisible.value = false
        fetchKeywordList() // 刷新数据
      })
      .catch((error) => {
        console.error('新增关键词失败', error)
        ElMessage.error('新增关键词失败')
      })
      .finally(() => {
        submitLoading.value = false
      })
  })
}

// 删除关键词
const handleDelete = async (row) => {
  try {
    await deleteKeyword(row.id)
    ElMessage.success('删除成功')
    if (keywordList.value.length === 1 && currentPage.value > 1) {
      // 如果删除后当前页没有数据了，回到上一页
      currentPage.value--
    }
    fetchKeywordList() // 刷新数据
  } catch (error) {
    console.error('删除关键词失败', error)
    ElMessage.error('删除失败')
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchKeywordList()
})
</script>

<style scoped>
.keyword-list-container {
  padding: 20px;
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-box {
  width: 300px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table) {
  --el-table-header-bg-color: #f5f7fa;
}

:deep(.el-table__header-wrapper th) {
  font-weight: 600;
  color: #333;
}

:deep(.el-table__row) {
  transition: background-color 0.3s;
}

:deep(.el-table__row:hover) {
  background-color: #f0f7ff !important;
}
</style>