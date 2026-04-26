# contestwork-1 教学竞赛系统
后端技术栈：Go + Gin + GORM + MySQL + Redis
接口基础地址：http://localhost:8080

## 统一返回格式
contestwork-1 教学竞赛系统接口文档
后端地址：http://localhost:8080
统一返回格式：
json
{
  "code": 1,
  "msg": "success",
  "data": {}
}
code=1 表示成功，code=0 表示失败。
一、用户模块
1. 用户登录
请求方式：POST
接口地址：/login
请求体（JSON）：
json
{
  "username": "string",
  "password": "string",
  "role": "string" // 可选：admin / teacher / reviewer
}
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "name": "管理员",
    "role": "admin"
  }
}
2. 用户注册
请求方式：POST
接口地址：/register
请求体（JSON）：
json
{
  "username": "string",
  "password": "string",
  "name": "string",
  "role": "string"
}
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "注册成功"
}
3. 获取所有用户（管理员）
请求方式：GET
接口地址：/admin/user
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "role": "admin"
    }
  ]
}
二、竞赛模块
1. 获取竞赛列表
请求方式：GET
接口地址：/contest/list
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "title": "青年教师教学竞赛",
      "time": "2026-05-01 ~ 2026-06-01",
      "status": "报名中"
    }
  ]
}
2. 获取竞赛详情
请求方式：GET
接口地址：/contest/detail/:id
参数：id 竞赛 ID（路径参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": {
    "id": 1,
    "title": "青年教师教学竞赛",
    "time": "2026-05-01 ~ 2026-06-01",
    "status": "报名中"
  }
}
三、报名模块
1. 教师提交报名
请求方式：POST
接口地址：/signup/add
请求体（JSON）：
json
{
  "contestTitle": "string",
  "teacherName": "string",
  "unit": "string",
  "phone": "string",
  "courseName": "string",
  "grade": "string",
  "desc": "string"
}
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "报名成功"
}
2. 获取所有报名记录
请求方式：GET
接口地址：/signup/list
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "contestTitle": "青年教师教学竞赛",
      "teacherName": "张三",
      "unit": "计算机学院",
      "courseName": "数据结构",
      "score": 85
    }
  ]
}
四、评审模块
1. 评委提交评分
请求方式：POST
接口地址：/review/add
请求体（JSON）：
json
{
  "contestTitle": "string",
  "teacherName": "string",
  "courseName": "string",
  "score": 90,
  "comment": "string"
}
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "评分成功"
}
2. 获取所有评审记录
请求方式：GET
接口地址：/review/list
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "contestTitle": "青年教师教学竞赛",
      "teacherName": "张三",
      "courseName": "数据结构",
      "score": 85,
      "comment": "表现优秀"
    }
  ]
}
五、获奖模块
1. 添加获奖信息（管理员）
请求方式：POST
接口地址：/award/add
请求体（JSON）：
json
{
  "teacher": "string",
  "title": "string",
  "award": "一等奖"
}
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "添加成功"
}
2. 获取获奖公示列表
请求方式：GET
接口地址：/award/list
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "teacher": "张三",
      "title": "青年教师教学竞赛",
      "award": "一等奖"
    }
  ]
}
