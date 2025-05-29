const mongoose = require('mongoose')

const itemSchema = mongoose.Schema(
    {   
        text:{
            type: String,
            require: [true, 'Please add a text value']
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Item',itemSchema)//'Item' refer to 'items' colletion' in mongoDB