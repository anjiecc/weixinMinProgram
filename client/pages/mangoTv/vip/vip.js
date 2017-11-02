/*global getApp Page*/
var app = getApp();
Page({
    data: {
        userInfo: ""
    },
    onLoad() {
        if (app.globalData.user) {
            this.setData({
                userInfo: app.globalData.user.data.data
            })
        }
    }
})