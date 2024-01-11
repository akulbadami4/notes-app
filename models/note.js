const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId
    },
    title:{
        type:String,
        required:[true, 'Title is requried'],
        maxlength:[50,'Please enter title less than 50 characters']
    },
    body:{
        type:String,
        required:[true, 'Text is requried'],
        maxlength:[1000,'Please enter text less than 1000 characters']
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
},
{ timestamps: true }
)

noteSchema.index({title: 'text', body: 'text'});

const note = mongoose.model('Note',noteSchema);
module.exports = note;