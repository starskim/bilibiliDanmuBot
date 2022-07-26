const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomInfoSchema = new Schema({
    id: Number,   //房间号
    trackInfo: {  //跟踪选项
        tracked: Boolean,   //是否已跟踪
        clients: [{         //跟踪的客户端列表
            id: String      //客户端id
        }],
        always: Boolean,    //是否持续跟踪(不断开连接)
        time: {             //各项时间
            start: Date,    //开始直播时间
            effect: Date,   //跟踪有效时间
        }
    },
    liveInfo: {            //直播信息
        live: Boolean,     //是否正在直播
        viewers: Number,   //观众数
        time: {            //直播时间信息
            start: Date,   //直播开始时间
        }
    },
    roomInfo: {            //房间信息
        title: String,     //标题
        locked: Boolean,   //是否锁定
    },
    zoneInfo: {            //分区信息
        id: Number,        //分区编号
        name: String,      //分区名称
        childId: Number,   //子分区编号
        childName: String  //子分区名称
    }
})

const room = mongoose.model('room', roomInfoSchema)


module.exports = {
    room
}