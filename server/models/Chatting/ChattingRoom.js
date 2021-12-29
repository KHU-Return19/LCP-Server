const mongoose=require('mongoose');

const chattingroomSchema=mongoose.Schema({
    user_uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    room_name:{
        type:String,
    }
})
const ChattingRoom=mongoose.model('ChattingRoom',chattingroomSchema);
module.exports={ChattingRoom};