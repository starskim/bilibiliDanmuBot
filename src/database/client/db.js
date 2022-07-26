const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientSchema = new Schema({
    hash: String,        //唯一编号
    rooms: Number,       //当前监听房间数量
    name: String,        //名称
    version: String,     //版本号
    ip: String,          //IP地址
})


const client = mongoose.model('client', clientSchema)

module.exports = {
    client
}