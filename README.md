# 教学竞赛系统后端

## 项目简介

教学竞赛系统是一个基于 Go 语言开发的后端服务，用于管理教学竞赛的报名、评审、获奖等全流程。系统支持多角色用户（管理员、教师、评审专家），提供完整的竞赛管理功能。

## 技术栈

### 后端
- **语言**: Go 1.25
- **Web框架**: Gin
- **ORM**: GORM
- **数据库**: MySQL
- **API文档**: Swagger

### 前端
- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite
- **UI组件**: shadcn/ui
- **样式**: Tailwind CSS
- **HTTP客户端**: Axios

## 项目结构

```
contestwork-1/
├── api/
│   └── handler/          # 控制器层，处理HTTP请求
├── config/               # 配置文件（MySQL）
├── dao/                  # 数据访问层
├── docs/                 # Swagger文档
├── middleware/           # 中间件（CORS等）
├── model/
│   ├── dto/             # 数据传输对象
│   └── entity/          # 实体模型
├── pkg/
│   ├── constant/        # 常量定义
│   └── resp/            # 统一响应格式
├── router/              # 路由配置
├── service/             # 业务逻辑层
├── uploads/             # 上传文件存储目录
├── backups/             # 数据库备份目录
├── 11/contestForStu/    # 前端项目（React + TypeScript）
├── go.mod
├── go.sum
└── main.go              # 程序入口
```

## 快速开始

### 1. 安装依赖

```bash
go mod download
```

### 2. 配置数据库

修改 `config/mysql.go` 中的配置信息

### 3. 运行项目

```bash
go run main.go
```

服务将在 `http://localhost:8080` 启动

### 4. 运行前端

```bash
cd 11/contestForStu
npm install
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

### 5. 访问API文档

浏览器访问：`http://localhost:8080/swagger/index.html`

## API文档

### 基础信息

- **基础URL**: `http://localhost:8080`
- **统一成功返回格式**:
```json
{
  "code": 1,
  "msg": "success",
  "data": {}
}
```
- **统一失败返回格式**:
```json
{
  "code": 0,
  "msg": "错误信息"
}
```

---

## API功能列表

### 用户管理
- `POST /login` - 登录
- `POST /register` - 注册
- `GET /admin/user` - 用户列表
- `GET /admin/user/:id` - 用户详情
- `PUT /admin/user` - 更新用户
- `DELETE /admin/user/:id` - 删除用户

### 竞赛管理
- `GET /contest/list` - 竞赛列表
- `GET /contest/detail/:id` - 竞赛详情
- `POST /contest/add` - 创建竞赛
- `PUT /contest/update` - 更新竞赛
- `DELETE /contest/delete/:id` - 删除竞赛
- `GET /contest/search` - 按关键词搜索竞赛

### 报名管理
- `POST /signup/add` - 报名
- `GET /signup/list` - 报名列表
- `GET /signup/detail/:id` - 报名详情
- `PUT /signup/update` - 更新报名
- `DELETE /signup/delete/:id` - 删除报名

### 附件管理
- `POST /attachment/upload` - 单文件上传
- `POST /attachment/upload-multiple` - 多文件上传
- `GET /attachment/list` - 获取报名附件列表
- `GET /attachment/download/:id` - 下载附件
- `DELETE /attachment/delete/:id` - 删除附件

### 评审管理
- `POST /review/add` - 添加评审
- `GET /review/list` - 评审列表
- `PUT /review/update` - 更新评审
- `DELETE /review/delete/:id` - 删除评审

### 盲审机制
- `POST /blind-review/assign` - 随机分配盲审任务
- `GET /blind-review/list` - 获取评审员盲审任务
- `GET /blind-review/detail/:id` - 获取盲审详情（隐藏教师信息）
- `POST /blind-review/submit` - 提交盲审评分
- `GET /blind-review/progress` - 查询盲审进度
- `DELETE /blind-review/delete/:id` - 删除盲审任务

### 获奖管理
- `POST /award/add` - 添加获奖
- `GET /award/list` - 获奖列表
- `PUT /award/update` - 更新获奖
- `DELETE /award/delete/:id` - 删除获奖

### 统计功能
- `GET /statistics/contest` - 竞赛统计
- `GET /statistics/teacher` - 教师统计
- `GET /statistics/overall` - 整体统计

### 进度查询
- `GET /progress/review` - 查询竞赛评审进度
- `GET /progress/contests` - 查询所有竞赛评审进度
- `GET /progress/teacher` - 查询教师报名评审进度

### 打印功能
- `GET /print/signup` - 打印单个报名信息
- `GET /print/signup-list` - 打印竞赛报名名单汇总

### 个人中心
- `GET /personal/center` - 个人中心页面（教师查看报名、评审、获奖记录）

### 数据备份
- `POST /backup/create` - 创建数据库备份
- `GET /backup/list` - 获取备份文件列表
- `GET /backup/download` - 下载备份文件
- `DELETE /backup/delete` - 删除备份文件
- `POST /backup/restore` - 恢复数据库

### 作品查重
- `POST /plagiarism/create` - 创建查重任务
- `GET /plagiarism/list` - 获取查重任务列表
- `GET /plagiarism/detail/:id` - 获取查重详情
- `GET /plagiarism/results` - 获取查重结果（相似度详情）
- `POST /plagiarism/run/:id` - 执行查重

---

## API请求示例

本节提供所有需要请求体的API接口的详细请求示例，包括JSON格式的请求体和Query参数说明。

### 用户管理

#### POST /login - 登录
```json
{
  "username": "admin",
  "password": "123456"
}
```

#### POST /register - 注册
```json
{
  "username": "teacher01",
  "password": "123456",
  "name": "张老师",
  "role": "teacher"
}
```

#### PUT /admin/user - 更新用户
```json
{
  "id": 1,
  "name": "新姓名",
  "role": "teacher"
}
```

#### PUT /admin/user/password - 修改密码
```json
{
  "id": 1,
  "password": "newpassword"
}
```

### 竞赛管理

#### POST /contest/add - 创建竞赛
```json
{
  "title": "2024年度教学竞赛",
  "time": "2024-05-01",
  "status": "进行中"
}
```

#### PUT /contest/update - 更新竞赛
```json
{
  "id": 1,
  "title": "2024年度教学竞赛",
  "time": "2024-05-01",
  "status": "已结束"
}
```

#### GET /contest/search - 按关键词搜索竞赛
```
Query参数: keyword=教学
```

### 报名管理

#### POST /signup/add - 报名
```json
{
  "contest_title": "2024年度教学竞赛",
  "teacher_name": "张老师",
  "unit": "数学学院",
  "phone": "13800138000",
  "course_name": "高等数学",
  "grade": "大三",
  "desc": "教学方案设计..."
}
```

#### PUT /signup/update - 更新报名
```json
{
  "id": 1,
  "course_name": "线性代数",
  "grade": "大二",
  "desc": "更新后的设计简介"
}
```

### 附件管理

#### POST /attachment/upload - 单文件上传
```
Content-Type: multipart/form-data
参数:
- file: 文件
- signup_id: 报名ID
```

#### POST /attachment/upload-multiple - 多文件上传
```
Content-Type: multipart/form-data
参数:
- files: 文件列表
- signup_id: 报名ID
```

#### GET /attachment/list - 获取附件列表
```
Query参数: signup_id=1
```

### 评审管理

#### POST /review/add - 添加评审
```json
{
  "contest_title": "2024年度教学竞赛",
  "signup_id": 1,
  "teacher_name": "张老师",
  "reviewer_name": "李教授",
  "score": 85,
  "comment": "教学设计合理"
}
```

#### PUT /review/update - 更新评审
```json
{
  "id": 1,
  "score": 90,
  "comment": "修改后的评语"
}
```

### 盲审机制

#### POST /blind-review/assign - 分配盲审任务
```json
{
  "contest_title": "2024年度教学竞赛",
  "reviewer_ids": [2, 3, 4]
}
```

#### GET /blind-review/list - 获取评审员盲审任务
```
Query参数: reviewer_id=2&contest_title=2024年度教学竞赛
```

#### POST /blind-review/submit - 提交盲审评分
```json
{
  "id": 1,
  "score": 88,
  "comment": "内容详实，设计合理"
}
```

#### GET /blind-review/progress - 查询盲审进度
```
Query参数: contest_title=2024年度教学竞赛
```

#### DELETE /blind-review/delete/:id - 删除盲审任务
```
路径参数: id=1
```

### 获奖管理

#### POST /award/add - 添加获奖
```json
{
  "contest_title": "2024年度教学竞赛",
  "teacher_name": "张老师",
  "title": "一等奖",
  "time": "2024-06-01"
}
```

#### PUT /award/update - 更新获奖
```json
{
  "id": 1,
  "title": "特等奖",
  "time": "2024-06-01"
}
```

### 统计功能

#### GET /statistics/contest - 竞赛统计
```
Query参数: contest_title=2024年度教学竞赛
```

#### GET /statistics/teacher - 教师统计
```
Query参数: teacher_name=张老师
```

### 进度查询

#### GET /progress/review - 查询竞赛评审进度
```
Query参数: contest_title=2024年度教学竞赛
```

#### GET /progress/teacher - 查询教师报名评审进度
```
Query参数: teacher_name=张老师
```

### 打印功能

#### GET /print/signup - 打印报名信息
```
Query参数: id=1
```

#### GET /print/signup-list - 打印报名名单
```
Query参数: contest_title=2024年度教学竞赛
```

### 数据备份

#### GET /backup/download - 下载备份
```
Query参数: filename=backup_20240501_120000.sql
```

#### DELETE /backup/delete - 删除备份
```
Query参数: filename=backup_20240501_120000.sql
```

#### POST /backup/restore - 恢复数据库
```
Query参数: filename=backup_20240501_120000.sql
```

### 作品查重

#### POST /plagiarism/create - 创建查重任务
```json
{
  "signup_id": 1,
  "contest_title": "2024年度教学竞赛"
}
```

#### GET /plagiarism/list - 获取查重列表
```
Query参数: contest_title=2024年度教学竞赛
```

#### GET /plagiarism/results - 获取查重结果
```
Query参数: check_id=1
```

---

## 数据库表结构

### users 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| username | varchar | 账号 |
| password | varchar | 密码 |
| name | varchar | 姓名 |
| role | varchar | 角色(admin/teacher/reviewer) |

### contests 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| title | varchar | 竞赛名称 |
| time | varchar | 时间 |
| status | varchar | 状态(进行中/已结束) |

### signups 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| contest_title | varchar | 竞赛名 |
| teacher_name | varchar | 教师名 |
| unit | varchar | 单位 |
| phone | varchar | 电话 |
| course_name | varchar | 课程名 |
| grade | varchar | 年级 |
| desc | text | 设计简介 |
| time | varchar | 报名时间 |

### attachments 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| signup_id | int | 关联报名ID |
| filename | varchar | 存储文件名 |
| original_name | varchar | 原始文件名 |
| file_path | varchar | 文件路径 |
| file_size | bigint | 文件大小 |
| file_type | varchar | 文件类型 |
| upload_time | datetime | 上传时间 |

### blind_reviews 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| contest_title | varchar | 竞赛名称 |
| signup_id | int | 报名ID |
| reviewer_id | int | 评审员ID |
| reviewer_name | varchar | 评审员姓名 |
| assigned_at | datetime | 分配时间 |
| reviewed | tinyint | 是否已评审 |
| score | int | 评分 |
| comment | text | 评语 |
| reviewed_at | datetime | 评审时间 |

### plagiarism_checks 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| signup_id | int | 报名ID |
| contest_title | varchar | 竞赛名称 |
| check_time | datetime | 查重时间 |
| similarity | double | 最高相似度 |
| status | varchar | 状态(pending/completed) |
| report | text | 查重报告 |

### plagiarism_results 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| check_id | int | 查重记录ID |
| target_signup_id | int | 对比报名ID |
| similarity | double | 相似度 |

---

## 开发说明

### 新增文件清单

```
backend/
├── model/entity/
│   ├── attachment.go      # 附件实体
│   ├── blind_review.go    # 盲审实体
│   └── plagiarism.go      # 查重实体
├── dao/
│   ├── attachment_dao.go  # 附件数据访问
│   └── blind_review_dao.go # 盲审数据访问
├── service/
│   ├── attachment_service.go # 附件服务
│   ├── blind_review_service.go # 盲审服务
│   └── plagiarism_service.go # 查重服务
└── api/handler/
    ├── attachment_handler.go   # 附件接口
    ├── print_handler.go        # 打印接口
    ├── progress_handler.go     # 进度查询接口
    ├── blind_review_handler.go # 盲审接口
    ├── personal_handler.go     # 个人中心接口
    ├── backup_handler.go       # 数据备份接口
    └── plagiarism_handler.go   # 作品查重接口
```

### 注意事项

1. 上传文件存储在 `./uploads` 目录下
2. 盲审机制会随机打乱报名顺序后分配给评审员
3. 盲审时隐藏教师姓名和单位信息，确保评审公正性（完全盲审）
4. 所有接口支持 CORS 跨域访问
5. 数据备份文件存储在 `./backups` 目录下
6. 个人中心支持教师查看自己的报名、评审任务和获奖记录
7. 支持的附件格式：doc, docx, pdf, txt, rtf, xls, xlsx, csv, ppt, pptx, jpg, jpeg, png, gif, bmp, svg, zip, rar, 7z, json, xml, md
8. 附件大小限制：50MB
9. 前端默认使用 Mock 数据，可在 `src/config/env.ts` 中配置 `USE_MOCKS = false` 切换到真实 API

---

## 许可证

MIT License
