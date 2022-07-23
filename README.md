<p align="center"><a href="https://hub.docker.com/r/metowolf/bilibilihelper"><img width="300px" src="https://user-images.githubusercontent.com/2666735/57121590-30f97200-6dab-11e9-9a83-62098bea43d9.jpeg" alt="Logo"></a></p>

<p align="center">
<img src="https://img.shields.io/badge/version-Alpha-green.svg?longCache=true&style=for-the-badge" alt="">
<img src="https://img.shields.io/badge/license-mit-blue.svg?longCache=true&style=for-the-badge" alt="aa">
</p>

# bilibiliDanmuBot

B站直播互动及数据收集机器人

**注意，本项目仍然在活跃开发中，进行并发开发时请务必注意将来的破坏性改动**

## 说明

本项目为一个Nodejs新手的开发作品，若您对代码有任何建议或意见，欢迎提交Issue，我会虚心学习各位的意见和建议!

项目功能:

收集并记录指定直播间的所有信息（弹幕、礼物、舰长、SuperChat等）并加以处理

直播间开播、下播的欢迎语自定义，高度可配置的消息自动发送系统，自动的登录状态维持及礼物等

自动的消息回复，观众自主数据查询（观看时长，赠礼金额，礼物记录等），支持插件的机器人娱乐等。

自动的直播录制，并转投稿到B站。方便地进行直播跟踪！

项目会根据开发不断添加新的功能和模块，也欢迎各位提交Pull Request加入这个项目

## 功能组件

| plugin      | version | description |
|-------------|---------|-------------|
| Auth        | Unused  | 帐号登录组件      |
| DanmuInfo   | Coding  | 弹幕数据记录      |
| GiftInfo    | Coding  | 礼物数据记录      |
| GuardInfo   | Coding  | 上舰数据记录      |
| NewFollower | Unused  | 新粉丝关注跟踪     |
| StreamInfo  | Coding  | 直播数据历史记录    |
| VideoInfo   | Coding  | 视频数据历史记录    |
| QuickSplit  | Coding  | 房管弹幕极速切片    |
| AiReply     | Coding  | AI智能弹幕消息回复  |
| SendChat    | Unused  | 弹幕发送支持库     |

## 环境依赖

| Requirement          |
|----------------------|
| Node.js (>=8.x)      |
| Redis Server (>=5.x) |

## 搭建指南

项目基础框架暂未完成，搭建指南等待编写中...

## License 许可证

本项目基于 MIT 协议发布，并增加了 SATA 协议。

当你使用了使用 SATA 的开源软件或文档的时候，在遵守基础许可证的前提下，你必须马不停蹄地给你使用的开源项目 “点赞”

比如在 GitHub 上 star，然后你必须感谢这个帮助了你的开源项目的作者，作者信息可以在许可证头部的版权声明部分找到。

本项目的所有代码文件、配置项，除另有说明外，均基于上述介绍的协议发布，具体请看分支下的 LICENSE。

此处的文字仅用于说明，条款以 LICENSE 文件中的内容为准。

## 鸣谢:

[Bangbang93](https://github.com/bangbang93) 在开发过程中提供的大力支持及本项目的雏形代码!