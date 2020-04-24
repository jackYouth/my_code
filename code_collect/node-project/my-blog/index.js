const express = require('express')
const path = require('path')

const indexRouter = require('./routes/index.js')
const usersRouter = require('./routes/users.js')

const app = express()

// 设置模版引擎
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use('/', indexRouter)
app.use('/users', usersRouter)

app.listen('3000')