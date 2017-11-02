//index.js
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var app = getApp();
Page({
    data: {
        isLoad: true,
        count: 0,
        list: []
    },
    onLoad() {
        console.log('页面加载中...')
        console.log(app.globalData);
        if (app.globalData["list_1"]) {
            this.setData({
                list: app.globalData["list_1"][1].list
            })
        }

    },
    loading() {
        let allData = app.globalData["list_1"][2].list.concat(app.globalData["list_1"][3].list, app.globalData["list_1"][4].list, app.globalData["list_1"][5].list)
        if (this.data.count >= allData.length) {
            return;
        }
        let data = [];
        let i = this.data.count;
        for (; this.data.count < 2 + i; this.data.count++) {
            data.push(allData[this.data.count]);
        }
        data = this.data.list.concat(data);
        this.setData({
            list: data
        })
        if (this.data.count >= allData.length) {
            this.setData({
                isLoad: false
            })
        }
    }

})