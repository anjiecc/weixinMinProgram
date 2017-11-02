/*global getApp Page wx*/
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var config = require('../../../config')
var util = require('../../../utils/util.js')
var app = getApp();
Page({
    data: {
        topBarList: [],
        scrollLeft: 0,
        playList: [],
        userInfo: '',
        logged: false
    },
    onLoad() {
        console.log('页面加载中...')

    },
    onShow() {
        //如果noLoginData数据存在说明没有登录，反之登录成功
        if (app.globalData.noLoginData.length) {
            this.setData({
                playList: app.globalData.noLoginData
            })
        } else {
            this.setData({
                playList: app.globalData.loginData
            })
        }
    },
    login() {
        if (this.data.logged) return

        util.showBusy('正在登录')
        var that = this

        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                    util.showSuccess('登录成功')
                    that.setData({
                        userInfo: result,
                        logged: true
                    })
                    app.globalData.user = result;
                    app.globalData.noLoginData = [];
                    that.setData({
                        playList: []
                    })
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                            util.showSuccess('登录成功')
                            that.setData({
                                userInfo: result.data.data,
                                logged: true
                            })
                            app.globalData.user = result;
                            app.globalData.noLoginData = [];
                            that.setData({
                                playList: []
                            })
                        },

                        fail(error) {
                            util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },

            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
    },
    go(e) {
        let url = e.currentTarget.id;
        if (url) {
            if (url === 'vip') {
                if (app.globalData.user) {
                    wx.navigateTo({
                        url: `../${url}/${url}`
                    })
                }
                return;
            }
            wx.navigateTo({
                url: `../${url}/${url}`
            })
        } else {
            wx.navigateTo({
                url: "../404/404"
            })
        }

    }

})