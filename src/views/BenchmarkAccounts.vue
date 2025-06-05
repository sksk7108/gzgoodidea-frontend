<template>
  <div class="benchmark-accounts-container">
    <div class="page-header">
      <h2 class="page-title">对标账号管理</h2>
      <el-button type="primary" @click="handleAddAccount">
        <el-icon><Plus /></el-icon>新增对标账号
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="accountList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="name" label="账号名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="account_id" label="账号ID" min-width="120" show-overflow-tooltip />
      <el-table-column prop="platform" label="所属平台" width="100" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.platform === 0 ? 'danger' : 'primary'">
            {{ scope.row.platform === 0 ? '抖音' : '视频号' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="crawl" label="爬取时间" width="180" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            <el-icon><Edit /></el-icon>编辑
          </el-button>
          <!-- <el-button type="primary" link @click="handleCrawl(scope.row)">
            <el-icon><Download /></el-icon>爬取
          </el-button> -->
          <el-popconfirm
            title="确定要删除该对标账号吗？"
            @confirm="handleDelete(scope.row)"
            confirm-button-text="确定"
            cancel-button-text="取消"
          >
            <template #reference>
              <el-button type="danger" size="small">
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑对标账号' : '新增对标账号'"
      width="500px"
      :lock-scroll="false"
      center
      @close="resetForm"
    >
      <el-form
        ref="accountFormRef"
        :model="accountForm"
        :rules="accountRules"
        label-width="100px"
      >
        <el-form-item label="账号名称" prop="name">
          <el-input v-model="accountForm.name" placeholder="请输入账号名称" />
        </el-form-item>
        <el-form-item label="账号ID" prop="account_id">
          <el-input v-model="accountForm.account_id" placeholder="请输入账号ID" />
        </el-form-item>
        <el-form-item label="所属平台" prop="platform">
          <el-select v-model="accountForm.platform" placeholder="请选择平台" style="width: 100%">
            <el-option :value="0" label="抖音" />
            <el-option :value="1" label="视频号" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete, Download } from '@element-plus/icons-vue'
import { 
  getBenchmarkAccounts, 
  addBenchmarkAccount, 
  updateBenchmarkAccount, 
  deleteBenchmarkAccount,
  crawlBenchmarkAccount
} from '@/api/benchmark-accounts'

// 搜索表单
const searchForm = reactive({
  name: '',
  platform: ''
})

// 账号表单
const accountForm = reactive({
  id: '',
  name: '',
  account_id: '',
  platform: 0,
  crawl: '',
  createTime: ''
})

// 表单校验规则
const accountRules = {
  name: [
    { required: true, message: '请输入账号名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  account_id: [
    { required: true, message: '请输入账号ID', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  platform: [
    { required: true, message: '请选择所属平台', trigger: 'change' }
  ]
}

// 状态变量
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const accountFormRef = ref(null)

// 分页相关
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 模拟数据
const accountList = ref([
  {
    id: '1',
    name: '抖音官方',
    account_id: 'douyin_official',
    platform: 0,
    crawl: '2023-08-15 10:30:00',
    createTime: '2023-08-01 08:00:00'
  },
  {
    id: '2',
    name: '视频号小助手',
    account_id: 'channels_helper',
    platform: 1,
    crawl: '2023-08-14 14:20:00',
    createTime: '2023-08-02 09:15:00'
  }
])

// 获取数据列表
const fetchData = async () => {
  loading.value = true
  try {
    // 调用API获取数据
    const res = await getBenchmarkAccounts({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      name: searchForm.name,
      platform: searchForm.platform
    })
    
    // 如果后端返回的数据结构与前端不一致，需要进行转换
    accountList.value = res.data.list || []
    pagination.total = res.data.total || 0
    loading.value = false
  } catch (error) {
    console.error('获取对标账号列表失败:', error)
    ElMessage.error('获取对标账号列表失败')
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.platform = ''
  pagination.currentPage = 1
  fetchData()
}

// 分页大小变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchData()
}

// 页码变化
const handleCurrentChange = (val) => {
  pagination.currentPage = val
  fetchData()
}

// 新增账号
const handleAddAccount = () => {
  isEdit.value = false
  dialogVisible.value = true
}

// 编辑账号
const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(accountForm, row)
  dialogVisible.value = true
}

// 删除账号
const handleDelete = async (row) => {
  try {
    // 调用API删除数据
    await deleteBenchmarkAccount(row.id)
    ElMessage.success('删除成功')
    fetchData() // 重新获取数据
  } catch (error) {
    console.error('删除对标账号失败:', error)
    ElMessage.error('删除对标账号失败')
  }
}

// 爬取账号数据
const handleCrawl = async (row) => {
  try {
    // 调用API触发爬取
    await crawlBenchmarkAccount(row.id)
    ElMessage.success(`已开始爬取账号"${row.name}"的数据`)
  } catch (error) {
    console.error('触发爬取失败:', error)
    ElMessage.error('触发爬取失败')
  }
}

// 提交表单
const submitForm = async () => {
  if (!accountFormRef.value) return
  
  await accountFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    
    try {
      if (isEdit.value) {
        // 编辑模式
        await updateBenchmarkAccount(accountForm.id, {
          name: accountForm.name,
          account_id: accountForm.account_id,
          platform: accountForm.platform
        })
        ElMessage.success('更新成功')
      } else {
        // 新增模式
        await addBenchmarkAccount({
          name: accountForm.name,
          account_id: accountForm.account_id,
          platform: accountForm.platform
        })
        ElMessage.success('新增成功')
      }
      
      dialogVisible.value = false
      fetchData() // 重新获取数据
    } catch (error) {
      console.error('保存对标账号失败:', error)
      ElMessage.error('保存对标账号失败')
    } finally {
      submitting.value = false
    }
  })
}

// 重置表单
const resetForm = () => {
  if (accountFormRef.value) {
    accountFormRef.value.resetFields()
  }
  accountForm.id = ''
  accountForm.name = ''
  accountForm.account_id = ''
  accountForm.platform = 0
  accountForm.crawl = ''
  accountForm.createTime = ''
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.benchmark-accounts-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.search-container {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media screen and (max-width: 768px) {
  .search-form {
    flex-direction: column;
  }
  
  .el-form-item {
    margin-right: 0 !important;
  }
}
</style> 