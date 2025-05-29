//1.
const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000


connectDB()

const app = express()

//enable request body as json and url encoded
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/items',require('./routes/itemRoutes'))
app.use(errorHandler)
app.listen(port,()=> console.log(`server already started ${port}`))
