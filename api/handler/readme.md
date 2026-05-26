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
      "ID": 1,
      "Username": "admin",
      "Password": "123456",
      "Role": "admin",
      "Name": "管理员"
    }
  ]
}

4. 获取用户详情
请求方式：GET
接口地址：/admin/user/:id
参数：id 用户 ID（路径参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": {
    "ID": 1,
    "Username": "admin",
    "Password": "123456",
    "Role": "admin",
    "Name": "管理员"
  }
}

5. 更新用户信息
请求方式：PUT
接口地址：/admin/user
请求体（JSON）：
json
{
  "ID": 1,
  "Username": "string",
  "Password": "string",
  "Role": "string",
  "Name": "string"
}
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "更新成功"
}

6. 删除用户
请求方式：DELETE
接口地址：/admin/user/:id
参数：id 用户 ID（路径参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "删除成功"
}

7. 修改密码
请求方式：PUT
接口地址：/admin/user/password
请求体（JSON）：
json
{
  "id": 1,
  "old_pwd": "string",
  "new_pwd": "string"
}
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "密码修改成功"
}

8. 按角色查询用户
请求方式：GET
接口地址：/admin/user/role?role=xxx
参数：role 用户角色（查询参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "ID": 2,
      "Username": "teacher1",
      "Role": "teacher",
      "Name": "教师1"
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
      "ID": 1,
      "Title": "青年教师教学竞赛",
      "Time": "2026-05-01 ~ 2026-06-01",
      "Status": "进行中"
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
    "ID": 1,
    "Title": "青年教师教学竞赛",
    "Time": "2026-05-01 ~ 2026-06-01",
    "Status": "进行中"
  }
}

3. 创建竞赛
请求方式：POST
接口地址：/contest/add
请求体（JSON）：
json
{
  "Title": "string",
  "Time": "string",
  "Status": "string" // 进行中/已结束
}
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "创建成功"
}

4. 更新竞赛信息
请求方式：PUT
接口地址：/contest/update
请求体（JSON）：
json
{
  "ID": 1,
  "Title": "string",
  "Time": "string",
  "Status": "string"
}
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "更新成功"
}

5. 删除竞赛
请求方式：DELETE
接口地址：/contest/delete/:id
参数：id 竞赛 ID（路径参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "删除成功"
}

6. 按状态筛选竞赛
请求方式：GET
接口地址：/contest/status?status=xxx
参数：status 竞赛状态（查询参数，进行中/已结束）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "ID": 1,
      "Title": "青年教师教学竞赛",
      "Time": "2026-05-01 ~ 2026-06-01",
      "Status": "进行中"
    }
  ]
}

三、报名模块
1. 教师提交报名
请求方式：POST
接口地址：/signup/add
请求体（JSON）：
json
{
  "ContestTitle": "string",
  "TeacherName": "string",
  "Unit": "string",
  "Phone": "string",
  "CourseName": "string",
  "Grade": "string",
  "Desc": "string",
  "Time": "string"
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
      "ID": 1,
      "ContestTitle": "青年教师教学竞赛",
      "TeacherName": "张三",
      "Unit": "计算机学院",
      "Phone": "13800138000",
      "CourseName": "数据结构",
      "Grade": "2023级",
      "Desc": "课程设计简介",
      "Time": "2024-01-01"
    }
  ]
}

3. 获取报名详情
请求方式：GET
接口地址：/signup/detail/:id
参数：id 报名 ID（路径参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": {
    "ID": 1,
    "ContestTitle": "青年教师教学竞赛",
    "TeacherName": "张三",
    "Unit": "计算机学院",
    "Phone": "13800138000",
    "CourseName": "数据结构",
    "Grade": "2023级",
    "Desc": "课程设计简介",
    "Time": "2024-01-01"
  }
}

4. 更新报名信息
请求方式：PUT
接口地址：/signup/update
请求体（JSON）：
json
{
  "ID": 1,
  "ContestTitle": "string",
  "TeacherName": "string",
  "Unit": "string",
  "Phone": "string",
  "CourseName": "string",
  "Grade": "string",
  "Desc": "string",
  "Time": "string"
}
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "更新成功"
}

5. 删除报名
请求方式：DELETE
接口地址：/signup/delete/:id
参数：id 报名 ID（路径参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "删除成功"
}

6. 按竞赛查询报名
请求方式：GET
接口地址：/signup/contest?contest_title=xxx
参数：contest_title 竞赛名称（查询参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "ID": 1,
      "ContestTitle": "青年教师教学竞赛",
      "TeacherName": "张三"
    }
  ]
}

7. 按教师查询报名
请求方式：GET
接口地址：/signup/teacher?teacher_name=xxx
参数：teacher_name 教师姓名（查询参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "ID": 1,
      "ContestTitle": "青年教师教学竞赛",
      "TeacherName": "张三"
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
  "ContestTitle": "string",
  "TeacherName": "string",
  "CourseName": "string",
  "Score": 90,
  "Comment": "string"
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
      "ID": 1,
      "ContestTitle": "青年教师教学竞赛",
      "TeacherName": "张三",
      "CourseName": "数据结构",
      "Score": 85,
      "Comment": "表现优秀"
    }
  ]
}

3. 获取评审详情
请求方式：GET
接口地址：/review/detail/:id
参数：id 评审 ID（路径参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": {
    "ID": 1,
    "ContestTitle": "青年教师教学竞赛",
    "TeacherName": "张三",
    "CourseName": "数据结构",
    "Score": 85,
    "Comment": "表现优秀"
  }
}

4. 更新评审信息
请求方式：PUT
接口地址：/review/update
请求体（JSON）：
json
{
  "ID": 1,
  "ContestTitle": "string",
  "TeacherName": "string",
  "CourseName": "string",
  "Score": 90,
  "Comment": "string"
}
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "更新成功"
}

5. 删除评审
请求方式：DELETE
接口地址：/review/delete/:id
参数：id 评审 ID（路径参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "删除成功"
}

6. 按竞赛查询评审
请求方式：GET
接口地址：/review/contest?contest_title=xxx
参数：contest_title 竞赛名称（查询参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "ID": 1,
      "ContestTitle": "青年教师教学竞赛",
      "TeacherName": "张三",
      "Score": 85
    }
  ]
}

7. 按教师查询评审
请求方式：GET
接口地址：/review/teacher?teacher_name=xxx
参数：teacher_name 教师姓名（查询参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "ID": 1,
      "ContestTitle": "青年教师教学竞赛",
      "TeacherName": "张三",
      "Score": 85
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
  "Teacher": "string",
  "Title": "string",
  "Award": "一等奖"
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
      "ID": 1,
      "Teacher": "张三",
      "Title": "青年教师教学竞赛",
      "Award": "一等奖"
    }
  ]
}

3. 获取获奖详情
请求方式：GET
接口地址：/award/detail/:id
参数：id 获奖 ID（路径参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": {
    "ID": 1,
    "Teacher": "张三",
    "Title": "青年教师教学竞赛",
    "Award": "一等奖"
  }
}

4. 更新获奖信息
请求方式：PUT
接口地址：/award/update
请求体（JSON）：
json
{
  "ID": 1,
  "Teacher": "string",
  "Title": "string",
  "Award": "string"
}
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "更新成功"
}

5. 删除获奖记录
请求方式：DELETE
接口地址：/award/delete/:id
参数：id 获奖 ID（路径参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": "删除成功"
}

6. 按教师查询获奖
请求方式：GET
接口地址：/award/teacher?teacher=xxx
参数：teacher 教师姓名（查询参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "ID": 1,
      "Teacher": "张三",
      "Title": "青年教师教学竞赛",
      "Award": "一等奖"
    }
  ]
}

7. 按竞赛查询获奖
请求方式：GET
接口地址：/award/title?title=xxx
参数：title 竞赛名称（查询参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": [
    {
      "ID": 1,
      "Teacher": "张三",
      "Title": "青年教师教学竞赛",
      "Award": "一等奖"
    }
  ]
}

六、统计分析模块
1. 竞赛统计
请求方式：GET
接口地址：/statistics/contest?contest_title=xxx
参数：contest_title 竞赛名称（查询参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": {
    "contest_title": "青年教师教学竞赛",
    "signup_count": 10,
    "review_count": 8,
    "award_count": 3,
    "average_score": 85,
    "total_score": 680
  }
}

2. 教师统计
请求方式：GET
接口地址：/statistics/teacher?teacher_name=xxx
参数：teacher_name 教师姓名（查询参数）
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": {
    "teacher_name": "张三",
    "contest_count": 5,
    "review_count": 5,
    "award_count": 2,
    "average_score": 88,
    "total_score": 440
  }
}

3. 整体统计
请求方式：GET
接口地址：/statistics/overall
响应示例：
json
{
  "code": 1,
  "msg": "success",
  "data": {
    "total_contests": 10,
    "ongoing_contests": 3,
    "finished_contests": 7,
    "total_users": 50,
    "total_signups": 100,
    "total_reviews": 80,
    "total_awards": 30,
    "average_score": 85
  }
}

## API统计
- 总API数量：39个
- 用户管理：8个
- 竞赛管理：6个
- 报名管理：7个
- 评审管理：7个
- 获奖管理：7个
- 统计分析：3个

## 用户角色说明
系统支持三种用户角色：
- admin：管理员
- teacher：教师
- reviewer：评审专家

## 竞赛状态说明
竞赛支持两种状态：
- 进行中：正在进行的竞赛
- 已结束：已经结束的竞赛
