const mongoose = require('mongoose')
const Schema = mongoose.Schema


const danmuSchema = new Schema({
    uid:Number,       //发送人
    room:Number,      //房间号
    guard:Number,     //舰长等级
    message:String,   //消息内容
    medalInfo:{       //发送时的勋章内容
        level:{type:Number,default: 0}, //勋章等级
        name:{type:String, default: ''},  //勋章前端显示名称
        owner:{      //勋章拥有人信息
            uid:{type:Number,default:0},  //用户编号
            name:{type:String,default:''}, //用户名
            room:{type:Number,default:0}, //直播间
            _id:false
        },
        _id:false
    },
    sendTime:{type:Date,default:Date.now}//发送时间
})



const giftSchema = new Schema({
    uid:Number,  //发送人
    room:Number,  //房间号
    guard:Number,  //舰长等级
    gift:{        //礼物信息
        id:Number,  //礼物编号
        name:String,  //礼物名称
        amount:Number, //赠送数量
        type:{type:Number}, //礼物类型?(存疑)
        _id:false
    },
    price:{
        type:{type:String}, //货币类型
        amount:Number,      //货币支付数量
        _id:false
    },
    medal:{                //勋章信息
        level:Number,      //勋章等级
        owner:Number,    //归属人UID
        name:String,     //归属人用户名
        _id:false
    },
    sendTime:{type:Date,default: Date.now}//发送时间
})


const blockSchema = new Schema({
    uid:Number,
    room:Number,
    operator:Number,
    dmscore:Number,
    name:String,
    sendTime:{type:Date,default: Date.now}//发送时间
})

const silentSchema = new Schema({
    room:Number,
    type:{type:String},
    level:Number,
    until:Date,
    method:String,
    time:{type:Date,default:Date.now}//操作时间
})

const joinSchema = new Schema({
    room:Number,
    uid:Number,
    medal:{
        level:{type:Number,default:0},
        name:{type:String,default:''},
        _id:false
    },
    time:{type:Date,default:Date.now}
})


const redPocketSchema = new Schema({
    room:Number,
    hash:Number,
    price:Number,
    message:String,
    amount:Number,
    senderInfo:{
        uid:Number,
        name:String,
        avatar:String,
        _id:false
    },
    gifts:[{
        id:Number,
        name:String,
        pic:String,
        amount:Number,
        _id:false
    }],
    winners:[{
        uid:Number,
        name:String,
        serialId:Number,
        giftId:Number,
        _id:false
    }],
    users:[{
        uid:Number,
        time:{type:Date,default:Date.now},
        _id:false
    }],
    time:{
        start:Date,
        end:Date,
        _id:false
    }
})

const guardSchema = new Schema({
    room:Number,
    uid:Number,
    level:Number,
    amount:Number,
    price:Number,
    time:{
        start:Date,
        end:Date,
        _id:false
    }
})

const danmu = mongoose.model('danmu',danmuSchema)
const gift = mongoose.model('gift',giftSchema)
const block = mongoose.model('block',blockSchema)
const silent = mongoose.model('silent',silentSchema)
const join = mongoose.model('join',joinSchema)
const redPacket = mongoose.model('redPacket',redPocketSchema)
const guard = mongoose.model('guard',guardSchema)
module.exports = {
    danmu,
    gift,
    block,
    silent,
    join,
    redPacket,
    guard
}