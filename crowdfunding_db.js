const express = require('express') // 导入 express 库
const mysql = require('mysql2') // 导入 mysql2 库，用于连接 MySQL 数据库
const cors = require('cors') // 导入 cors 库，用于处理跨域请求
const app = express() // 创建 Express 应用实例

// 端口号
const PORT = process.env.PORT || 3000 // 设置端口号，优先使用环境变量中的 PORT

// 解决跨域
app.use(cors()) // 使用 cors 中间件以允许跨域请求
app.use(express.json()) // 使用中间件以支持 JSON 格式的请求体

// 配置 SQL 连接
const db = mysql.createConnection({
  host: 'localhost', // 数据库 IP 地址
  user: 'root', // 数据库用户名
  password: '2002113Wzy.', // 数据库密码
  database: 'crowdfunding_db', // 要连接的数据库名称
})

// 搜索路由
app.get('/search', (req, res) => {
  const { category, city, organizer } = req.query // 从请求查询参数中解构出分类、城市和组织者
  let query = `
      SELECT FUNDRAISER.*, CATEGORY.NAME AS CATEGORY_NAME 
      FROM FUNDRAISER 
      JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID
      WHERE 1=1
  ` // 初始化 SQL 查询语句

  const params = [] // 用于存储查询参数的数组
  if (category) {
    query += ' AND FUNDRAISER.CATEGORY_ID = ?' // 如果提供了分类条件，拼接查询条件
    params.push(category) // 将分类条件添加到参数数组中
  }
  if (city) {
    query += ' AND FUNDRAISER.CITY = ?' // 如果提供了城市条件，拼接查询条件
    params.push(city) // 将城市条件添加到参数数组中
  }
  if (organizer) {
    query += ' AND FUNDRAISER.ORGANIZER LIKE ?' // 如果提供了组织者条件，拼接查询条件
    params.push(`%${organizer}%`) // 将组织者条件（模糊匹配）添加到参数数组中
  }

  // 执行查询
  db.query(query, params, (err, results) => {
    if (err) {
      console.log(err) // 打印错误信息
      res.status(500).send('Error searching fundraisers') // 返回500错误
    } else {
      res.json(results) // 返回查询结果
    }
  })
})

// 获取所有类别
app.get('/categories', (req, res) => {
  const query = 'SELECT * FROM CATEGORY' // 查询所有类别
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving categories') // 返回500错误
    } else {
      res.json(results) // 返回类别结果
    }
  })
})

// 获取所有活跃的筹款项目
app.get('/fundraisers', (req, res) => {
  const query = `
      SELECT FUNDRAISER.*, CATEGORY.NAME AS CATEGORY_NAME 
      FROM FUNDRAISER 
      JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID 
      WHERE FUNDRAISER.ACTIVE = 1
  ` // 查询所有活跃的筹款项目
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving fundraisers') // 返回500错误
    } else {
      res.json(results) // 返回筹款项目结果
    }
  })
})

// 根据ID获取特定的筹款项目
app.get('/fundraiser/:id', (req, res) => {
  const fundraiserId = req.params.id // 从请求参数中获取筹款项目ID
  const query = `
      SELECT FUNDRAISER.*, CATEGORY.NAME AS CATEGORY_NAME 
      FROM FUNDRAISER 
      JOIN CATEGORY ON FUNDRAISER.CATEGORY_ID = CATEGORY.CATEGORY_ID 
      WHERE FUNDRAISER.FUNDRAISER_ID = ?
  ` // 查询特定ID的筹款项目
  db.query(query, [fundraiserId], (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving fundraiser details') // 返回500错误
    } else if (results.length === 0) {
      res.status(404).send('Fundraiser not found') // 如果没有找到筹款项目，返回404错误
    } else {
      res.json(results[0]) // 返回找到的筹款项目
    }
  })
})

// 连接到数据库
db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack) // 打印连接失败的错误信息
    return
  }
  console.log('Connected to database.') // 成功连接到数据库的消息
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`) // 服务器启动的消息
})
