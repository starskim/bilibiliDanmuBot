const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientSchema = new Schema({
    hash: String,        //唯一编号
    name: String,        //名称
    version: String,     //版本号
    amount: {
        room: Number,     //正在监听房间数
        mission: Number   //正在执行任务数
    },
    ip: String,          //IP地址
})


const client = mongoose.model('client', clientSchema)

module.exports = {
    client
}