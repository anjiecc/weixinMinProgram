/*global getApp Page*/
// var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var app = getApp()
Page({
    data: {
        url: "",
        name: "",
        cid: "",
        data: [],
        currentPage: 0
    },
    onLoad(options) {
        console.log(options);
        this.setData({
            url: options.url,
            name: options.name,
            cid: options.cid,
            currentPage: options.currentPage
        });
        var index = Number(options.currentPage) + 1
        var data = app.globalData["list_" + index];
        var currentPlay;
        for (let i = 0, length = data.length; i < length; i++) {
            if (data[i].indexs && data[i].indexs == options.id) {
                this.setData({
                    data: data[i]
                });
                //获取当前播放视频信息
                if (data[i].list && data[i].list.length) {
                    for (let j = 0, len = data[i].list.length; j < len; j++) {
                        if (data[i].list[j].playUrl === options.url) {
                            currentPlay = data[i].list[j];
                            break;
                        }
                    }
                }
            }

        }
        //保存播放历史数据
        if (!app.globalData.user) {
            currentPlay && app.globalData.noLoginData.push(currentPlay);
        } else {
            app.globalData.noLoginData = [];
            currentPlay && app.globalData.loginData.push(currentPlay);
        }
    }

})