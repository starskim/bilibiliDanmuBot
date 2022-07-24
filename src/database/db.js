const mongoose = require('mongoose')
const Schema = mongoose.Schema

//DANMU_MSG
const danmuSchema = new Schema({
    uid: Number,       //发送人
    room: Number,      //房间号
    guard: Number,     //舰长等级
    message: String,   //消息内容
    medalInfo: {       //发送时的勋章内容
        level: {type: Number, default: 0}, //勋章等级
        name: {type: String, default: ''},  //勋章前端显示名称
        owner: {      //勋章拥有人信息
            uid: {type: Number, default: 0},  //用户编号
            name: {type: String, default: ''}, //用户名
            room: {type: Number, default: 0}, //直播间
            _id: false
        },
        _id: false
    },
    sendTime: {type: Date, default: Date.now}//发送时间
})


//SEND_GIFT
const giftSchema = new Schema({
    uid: Number,  //发送人
    room: Number,  //房间号
    guard: Number,  //舰长等级
    gift: {        //礼物信息
        id: Number,  //礼物编号
        name: String,  //礼物名称
        amount: Number, //赠送数量
        type: {type: Number}, //礼物类型?(存疑)
        _id: false
    },
    price: {
        type: {type: String}, //货币类型
        amount: Number,      //货币支付数量
        _id: false
    },
    medal: {                //勋章信息
        level: Number,      //勋章等级
        owner: Number,    //归属人UID
        name: String,     //归属人用户名
        _id: false
    },
    sendTime: {type: Date, default: Date.now}//发送时间
})


//ROOM_BLOCK_MSG
const blockSchema = new Schema({
    uid: Number,
    room: Number,
    operator: Number,
    dmscore: Number,
    name: String,
    sendTime: {type: Date, default: Date.now}//发送时间
})


//ROOM_SILENT_OFF
//ROOM_SILENT_ON
const silentSchema = new Schema({
    room: Number,
    type: {type: String},
    level: Number,
    until: Date,
    method: String,
    time: {type: Date, default: Date.now}//操作时间
})


//INTERACT_WORD
const joinSchema = new Schema({
    room: Number,
    uid: Number,
    medal: {
        level: {type: Number, default: 0},
        name: {type: String, default: ''},
        _id: false
    },
    time: {type: Date, default: Date.now}
})


//DANMU_AGGREGATION
//POPULARITY_RED_POCKET_START
//POPULARITY_RED_POCKET_WINNER_LIST
const redPocketSchema = new Schema({
    room: Number,
    hash: Number,
    price: Number,
    message: String,
    amount: Number,
    senderInfo: {
        uid: Number,
        name: String,
        avatar: String,
        _id: false
    },
    gifts: [{
        id: Number,
        name: String,
        pic: String,
        amount: Number,
        _id: false
    }],
    winners: [{
        uid: Number,
        name: String,
        serialId: Number,
        giftId: Number,
        _id: false
    }],
    users: [{
        uid: Number,
        time: {type: Date, default: Date.now},
        _id: false
    }],
    time: {
        start: Date,
        end: Date,
        _id: false
    }
})


//GUARD_BUY
const guardSchema = new Schema({
    room: Number,
    uid: Number,
    level: Number,
    amount: Number,
    price: Number,
    time: {
        start: Date,
        end: Date,
        _id: false
    }
})


//WATCHED_CHANGE
const watchSchema = new Schema({
    room: Number,
    amount: Number,
    time: {type: Date, default: Date.now}
})

//ANCHOR_LOT_AWARD
const anchorSchema = new Schema({
    room: Number, //房间号
    hash: Number, //抽奖ID
    amount: Number, //参与用户数量
    infos: {
        amount: Number, //奖励数量
        name: String,   //抽奖名称
        danmu: String, //弹幕要求
        price: Number, //奖励
        require: {
            text: String,
            type: {type: Number},
            value: Number
        }
    },
    winners: [{
        uid: Number,  //UID
        uname: String, //用户名
        face: String, //avatar照片
        level: Number, //用户UL等级
        amount: Number,  //数量?中奖数量? 原key为 num
        _id: false
    }],
    users: [{
        uid: Number,
        time: {type: Date, default: Date.now}
    }],
    time: {
        start: Date,
        duration: Number,
        _id: false
    }
})

//NOTICE_MSG
const noticeSchema = new Schema({
    room: Number,
    type: {type: Number},
    name: String,
    message: String,
    businessHash: String,
    selfMessage: String,
    time: {type: Date, default: Date.now}
})


const battleSchema = new Schema({
    room: Number,
    hash: Number,
    info: {
        target: Number,
        self: Number,
        voteName: String,
        type: {type: Number},
        _id: false
    },
    winner: {
        room: Number,
        uid: Number,
        name: String,
        face: String,
        exp: {
            level: Number,
            ulLevel: Number,
            _id: false
        },
        bestUser: {
            uid: Number,
            name: String,
            face: String,
            votes: Number,
            ulLevel: Number
        },
        _id: false
    },
    self: {
        room: Number,
        uid: Number,
        name: String,
        face: String,
        exp: {
            level: Number,
            ulLevel: Number,
            _id: false
        },
        bestUser: {
            uid: Number,
            name: String,
            face: String,
            votes: Number,
            ulLevel: Number
        },
        _id: false
    },
    progress: [{
        self: {
            room: Number,
            votes: Number,
            bestUser: String,
            time: {type: Date, default: Date.now},
            _id: false,
        },
        target: {
            room: Number,
            votes: Number,
            bestUser: String,
            time: {type: Date, default: Date.now},
            _id: false,
        },
        _id: false
    }],
    assistList: [{
        id: Number,
        name: String,
        face: String,
        score: Number
    }],
    time: {
        start: Date,
        end: Date,
        _id: false
    }
}, {minimize: false})

const testSchema = new Schema({
    info: String
})

const danmu = mongoose.model('danmu', danmuSchema)
const gift = mongoose.model('gift', giftSchema)
const block = mongoose.model('block', blockSchema)
const silent = mongoose.model('silent', silentSchema)
const join = mongoose.model('join', joinSchema)
const redPacket = mongoose.model('redPacket', redPocketSchema)
const guard = mongoose.model('guard', guardSchema)
const watch = mongoose.model('watch', watchSchema)
const anchor = mongoose.model('anchor', anchorSchema)
const test = mongoose.model('test', testSchema)
const notice = mongoose.model('notice', noticeSchema)
const battle = mongoose.model('battle', battleSchema)

module.exports = {
    danmu,
    gift,
    block,
    silent,
    join,
    redPacket,
    guard,
    watch,
    anchor,
    test,
    notice,
    battle
}