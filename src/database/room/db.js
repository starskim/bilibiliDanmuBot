const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomInfo = new Schema({
    id:Number,   //房间号
    trackInfo:{
        tracked:Boolean,
        clients:[{
            id:String
        }],
        always:Boolean,
        time:{
            start:Date,
            effect:Date,
        }
    },
    liveInfo:{
        live:Boolean,
        viewers:Number,
        time:{
            start:Date,
        }
    },
    roomInfo:{
        title:String,
        locked:Boolean,
    }
})