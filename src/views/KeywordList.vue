<template>
  <div class="keyword-list-container">
    <!-- 操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="openAddDialog">
        <img src="@/assets/img/add.svg" style="width: 16px; height: 16px; margin-right: 5px;" />新增关键词
      </el-button>
      
      <!-- <div class="search-box">
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
      </div> -->
    </div>
    
    <!-- 关键词表格 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="keywordList"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column fixed prop="content" label="关键词" min-width="130" show-overflow-tooltip />
        <!-- <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeTagType(scope.row.type)">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="userId" label="创建用户" width="120" show-overflow-tooltip /> -->
        <el-table-column prop="expiryDays" label="查询时效(天)" width="120" align="center" />
        <!-- <el-table-column prop="count" label="出现次数" width="100" align="center" /> -->
        <el-table-column prop="likeCount" label="点赞数" width="100" align="center" />
        <el-table-column prop="commentCount" label="评论数" width="100" align="center" />
        <el-table-column prop="favoriteCount" label="收藏数" width="100" align="center" />
        <el-table-column prop="shareCount" label="分享数" width="100" align="center" />
        <el-table-column prop="createTime" label="创建时间" min-width="160" show-overflow-tooltip>
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditDialog(scope.row)">编辑</el-button>
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
      :title="isEdit ? '编辑关键词' : '新增关键词'"
      width="500px"
      :lock-scroll="false"
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
        <el-form-item label="查询时效(天)" prop="expiryDays">
          <el-input-number
            v-model="keywordForm.expiryDays"
            :min="1"
            :max="365"
            placeholder="天数"
          />
        </el-form-item>
        <el-form-item label="点赞数 >" type="number" prop="likeCount">
          <el-input-number v-model="keywordForm.likeCount" :min="0" :step="5" :max="1000000" />
        </el-form-item>
        <el-form-item label="评论数 >" type="number" prop="commentCount">
          <el-input-number v-model="keywordForm.commentCount" :min="0" :step="5" :max="1000000" />
        </el-form-item>
        <el-form-item label="收藏数 >" type="number" prop="favoriteCount">
          <el-input-number v-model="keywordForm.favoriteCount" :min="0" :step="5" :max="1000000" />
        </el-form-item>
        <el-form-item label="分享数 >" type="number" prop="shareCount">
          <el-input-number v-model="keywordForm.shareCount" :min="0" :step="5" :max="1000000" />
        </el-form-item>
        <!-- <el-form-item label="类型" prop="type">
          <el-select v-model="keywordForm.type" placeholder="请选择类型" style="width: 100%">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
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
import { ElMessage } from 'element-plus'
// import { Plus } from '@element-plus/icons-vue'
import { getKeywordList, addKeyword, deleteKeyword, updateKeyword, getKeywordGroupsList } from '@/api/keyword'

// 搜索关键词
const searchKeyword = ref('')

// 加载状态
const loading = ref(false)
const submitLoading = ref(false)

// 关键词表单对话框
const dialogVisible = ref(false)
const isEdit = ref(false)
const keywordFormRef = ref(null)
const keywordForm = reactive({
  id: '',
  content: '',
  likeCount: 0,
  commentCount: 0,
  favoriteCount: 0,
  shareCount: 0,
  expiryDays: 1
})

// 表单验证规则
const keywordRules = {
  content: [
    { required: true, message: '请输入关键词', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
  ],
  likeCount: [
    { required: false, message: '请输入点赞数阈值', trigger: 'blur' },
    { type: 'number', min: 0, max: 1000000, message: '点赞数在 0 到 1000000 之间', trigger: 'blur' }
  ],
  commentCount: [
    { required: false, message: '请输入评论数阈值', trigger: 'blur' },
    { type: 'number', min: 0, max: 1000000, message: '评论数在 0 到 1000000 之间', trigger: 'blur' }
  ],
  favoriteCount: [
    { required: false, message: '请输入收藏数阈值', trigger: 'blur' },
    { type: 'number', min: 0, max: 1000000, message: '收藏数在 0 到 1000000 之间', trigger: 'blur' }
  ],
  shareCount: [
    { required: false, message: '请输入分享数阈值', trigger: 'blur' },
    { type: 'number', min: 0, max: 1000000, message: '分享数在 0 到 1000000 之间', trigger: 'blur' }
  ],
  expiryDays: [
    { required: true, message: '请输入查询时效(天)', trigger: 'blur' },
    { type: 'number', min: 1, max: 30, message: '时效天数在 1 到 30 之间', trigger: 'blur' }
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
    
    const response = await getKeywordGroupsList()
    
    // 根据实际接口返回格式进行适配
    if (response && response.groups.length>0) {
      keywordList.value = response.groups[0].keywords
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
  isEdit.value = false
  keywordForm.id = ''
  keywordForm.content = ''
  keywordForm.likeCount = 50
  keywordForm.commentCount = 50
  keywordForm.favoriteCount = 50
  keywordForm.shareCount = 50
  keywordForm.expiryDays = 1
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (row) => {
  isEdit.value = true
  keywordForm.id = row.id
  keywordForm.content = row.content
  keywordForm.likeCount = row.likeCount
  keywordForm.commentCount = row.commentCount
  keywordForm.favoriteCount = row.favoriteCount
  keywordForm.shareCount = row.shareCount
  keywordForm.expiryDays = row.expiryDays
  dialogVisible.value = true
}

// 提交关键词（新增或编辑）
const submitKeyword = () => {
  if (!keywordFormRef.value) return
  
  keywordFormRef.value.validate((valid) => {
    if (!valid) return
    
    submitLoading.value = true
    
    // 根据isEdit判断是新增还是编辑
    const request = isEdit.value
      ? updateKeyword(keywordForm)
      : addKeyword(keywordForm)
    
    request
      .then(() => {
        ElMessage.success(isEdit.value ? '编辑关键词成功' : '新增关键词成功')
        dialogVisible.value = false
        fetchKeywordList() // 刷新数据
      })
      .catch((error) => {
        console.error(isEdit.value ? '编辑关键词失败' : '新增关键词失败', error)
        ElMessage.error(isEdit.value ? '编辑关键词失败' : '新增关键词失败')
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

:deep(.el-form-item__label){
  width: 120px !important ;
}
</style>