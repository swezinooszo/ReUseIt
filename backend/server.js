//1.
const express = require('express')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5000

const app = express()

//enable request body as json and url encoded
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/items',require('./routes/itemRoutes'))
app.use(errorHandler)
app.listen(port,()=> console.log(`server already started ${port}`))
