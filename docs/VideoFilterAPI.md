# 视频筛选功能接口文档

本文档描述了视频列表的筛选、排序相关接口的需求，用于前后端对接开发。

## 1. 获取视频列表接口

### 接口描述

该接口用于获取视频列表数据，支持多种筛选条件和排序方式。

### 请求方法

- **GET** /api/videos

### 请求参数


| 参数名    | 类型    | 必填 | 描述                                                                                                                                     |
| --------- | ------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| pageNum   | Integer | 是   | 当前页码，从1开始                                                                                                                        |
| pageSize  | Integer | 是   | 每页显示数量                                                                                                                             |
| keywords  | String  | 否   | 标签关键词，多个标签以逗号分隔                                                                                                           |
| hotSource | String  | 否   | 视频来源，可选值：'视频号'、'抖音'等                                                                                                     |
| sortBy    | String  | 否   | 排序字段，可选值：'createTime'(发布时间)、'likesCount'(点赞数)、'commentsCount'(评论数)、'sharesCount'(分享数)、'favoritesCount'(收藏数) |
| sortOrder | String  | 否   | 排序方式，可选值：'asc'(升序)、'desc'(降序)，默认为'desc'                                                                                |

### 请求示例

```
GET /api/videos?pageNum=1&pageSize=9&keywords=美食,旅游&hotSource=抖音&sortBy=likesCount&sortOrder=desc
```

### 响应参数


| 参数名  | 类型    | 描述         |
| ------- | ------- | ------------ |
| total   | Integer | 总记录数     |
| records | Array   | 视频列表数据 |

#### records 中的视频对象结构


| 参数名         | 类型    | 描述                                |
| -------------- | ------- | ----------------------------------- |
| id             | String  | 视频ID                              |
| title          | String  | 视频标题                            |
| cover          | String  | 视频封面URL                         |
| url            | String  | 视频URL                             |
| topic          | String  | 视频话题，多个话题以#分隔           |
| hotSource      | String  | 视频来源，如"抖音"、"视频号"        |
| likesCount     | Integer | 点赞数                              |
| commentsCount  | Integer | 评论数                              |
| sharesCount    | Integer | 分享数                              |
| favoritesCount | Integer | 收藏数                              |
| createTime     | String  | 创建时间，格式：yyyy-MM-dd HH:mm:ss |
| status         | Integer | 状态：0-待审核, 1-已通过, 2-已拒绝  |

### 响应示例

```json
{
  "total": 100,
  "records": [
    {
      "id": "1234567890",
      "title": "这是一个视频标题",
      "cover": "https://example.com/cover.jpg",
      "url": "https://example.com/video.mp4",
      "topic": "#美食#旅游#探店",
      "hotSource": "抖音",
      "likesCount": 1500,
      "commentsCount": 200,
      "sharesCount": 50,
      "favoritesCount": 100,
      "createTime": "2023-11-01 12:30:45",
      "status": 1
    },
    {
      "id": "1234567891",
      "title": "另一个视频标题",
      "cover": "https://example.com/cover2.jpg",
      "url": "https://example.com/video2.mp4",
      "topic": "#美食#烹饪",
      "hotSource": "视频号",
      "likesCount": 1200,
      "commentsCount": 150,
      "sharesCount": 30,
      "favoritesCount": 80,
      "createTime": "2023-10-28 15:20:10",
      "status": 1
    }
  ]
}
```

## 2. 获取标签列表接口

### 接口描述

该接口用于获取所有标签，用于标签筛选。

### 请求方法

- **GET** /api/keywords

### 请求参数

无

### 响应参数

返回标签对象数组


| 参数名  | 类型   | 描述     |
| ------- | ------ | -------- |
| id      | String | 标签ID   |
| content | String | 标签内容 |

### 响应示例

```json
[
  {
    "id": "1",
    "content": "美食"
  },
  {
    "id": "2",
    "content": "旅游"
  },
  {
    "id": "3",
    "content": "探店"
  }
]
```

## 3. 视频审核接口

### 接口描述

该接口用于审核视频（通过或拒绝）。

### 请求方法

- **PUT** /api/videos/{id}/audit

### 请求参数


| 参数名 | 类型    | 必填 | 描述                     |
| ------ | ------- | ---- | ------------------------ |
| id     | String  | 是   | 视频ID (URL路径参数)     |
| status | Integer | 是   | 审核状态：1-通过, 2-拒绝 |

### 请求示例

```
PUT /api/videos/1234567890/audit
Content-Type: application/json

{
  "status": 1
}
```

### 响应参数

成功返回：

```json
{
  "code": 200,
  "message": "操作成功"
}
```

## 4. 删除视频接口

### 接口描述

该接口用于删除视频。

### 请求方法

- **DELETE** /api/videos/{id}

### 请求参数


| 参数名 | 类型   | 必填 | 描述                 |
| ------ | ------ | ---- | -------------------- |
| id     | String | 是   | 视频ID (URL路径参数) |

### 请求示例

```
DELETE /api/videos/1234567890
```

### 响应参数

成功返回：

```json
{
  "code": 200,
  "message": "删除成功"
}
```

## 开发建议

1. **多标签筛选实现**：

   - 后端接收到以逗号分隔的标签字符串后，应当将其拆分并使用 `OR` 条件进行查询
   - 示例SQL：`WHERE tag LIKE '%标签1%' OR tag LIKE '%标签2%'`
2. **排序功能实现**：

   - 对于排序字段，需判断是否传入 `sortBy` 参数
   - 若传入，则使用对应字段排序；若未传入，则使用默认排序（如按创建时间降序）
   - 排序方向根据 `sortOrder` 参数决定（asc/desc）
3. **性能优化**：

   - 为排序和筛选字段创建适当的索引
   - 考虑数据量大时的分页查询优化
   - 可以考虑缓存热门标签数据
4. **数据完整性**：

   - 确保返回的视频数据包含所有前端需要展示的字段
   - 对于可能为null的字段，提供默认值
