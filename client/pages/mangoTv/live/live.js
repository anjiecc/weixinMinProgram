/*global getApp wx Page*/
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var config = require('../../../config')
var util = require('../../../utils/util.js')
    // var _ = require('lodash');
var app = getApp();
Page({
    data: {
        left: 0,
        interval: 5000,
        duration: 500,
        currentPage: 0,
        isLoadTv: true,
        count: 0,
        list: {},
        rotationImages: {},
        pageData: {
            page1001: {}
        },
        loadingData: [{
            day: "24",
            date: "/10月",
            time: "21:00",
            tvName: "成都卫视",
            moiveName: "《舌尖上的美味-成都》直播"
        }, {
            day: "24",
            date: "/10月",
            time: "22:00",
            tvName: "广西卫视",
            moiveName: "《长征》直播"
        }, {
            day: "24",
            date: "/10月",
            time: "23:00",
            tvName: "CCTV_1",
            moiveName: "《午间新闻》直播"
        }, {
            day: "24",
            date: "/10月",
            time: "23:30",
            tvName: "CCTV_1",
            moiveName: "《午间新闻》直播"
        }],
        liveData: [{
            day: "24",
            date: "/10月",
            time: "18:30",
            tvName: "上海卫视",
            moiveName: "《反黑电视剧》直播"
        }, {
            day: "24",
            date: "/10月",
            time: "19:00",
            tvName: "四川卫视",
            moiveName: "《新闻联播》直播"
        }, {
            day: "24",
            date: "/10月",
            time: "19:30",
            tvName: "四川卫视",
            moiveName: "《天气预报》直播"
        }, {
            day: "24",
            date: "/10月",
            time: "20:00",
            tvName: "湖南卫视",
            moiveName: "《爸爸去哪第三季》直播"
        }]
    },
    onLoad() {
        this.loadPage(1);

    },
    loadPage(index) {
        var _this = this;
        let urlList = ['', 'getListPagea', 'getListPageb', 'getListPagec', 'getListPaged', 'getListPagee', 'getListPagef'];
        let url = config.service[urlList[index]];
        let listData = app.globalData["list_" + index];
        let bannerData = app.globalData["rotationImages_" + index];
        let rollData = app.globalData["rollData" + index];
        let key = `page100${index}`;
        if (listData && listData.length) {
            _this.data.pageData[key]['list'] = listData;
            _this.setData({
                list: this.data.pageData
            })
            wx.hideLoading();
        }
        if (bannerData && bannerData.length) {
            _this.data.pageData[key]['rotationImages'] = bannerData;
            _this.setData({
                list: _this.data.pageData
            })
            wx.hideLoading();
        }
        if (rollData && rollData.length) {
            _this.data.pageData[key]['rollData'] = rollData;
            _this.setData({
                list: _this.data.pageData
            })
            wx.hideLoading();
        } else {
            wx.showLoading({
                title: "加载中...",
                mask: true
            })
            qcloud.request({
                url: url,
                login: true,
                success(result) {
                    console.log('request success', result)
                    let datas = result.data.data,
                        bannerData = [],
                        RollData = [],
                        lists = [],
                        obj = {};
                    for (let i = 0; i < datas.length - 10; i++) {
                        if (datas[i].type == 'banner') {
                            bannerData = datas[i].templateData;
                        }

                        if (datas[i].type == 'textRollLink') {
                            RollData = datas[i].templateData;
                        }

                        if (datas[i].type == 'title' ||
                            datas[i].type == 'normalLandScape' ||
                            datas[i].type == 'largeLandScapeNodesc' ||
                            datas[i].type == 'textMoreLink' ||
                            datas[i].type == 'normalLandScapeNodesc' &&
                            datas[i].templateData.length) {

                            if (datas[i].type == 'title') {

                                if (!_this.isEmpty(obj)) {
                                    lists.push(obj);
                                    obj = {};
                                    obj.indexs = i;
                                }

                                if (datas[i + 1].type == 'largeLandScapeNodesc') {
                                    obj.type = 'big';
                                    obj.name1 = datas[i].templateData[0].name;
                                    obj.name2 = datas[i + 1].templateData[0].name;
                                    obj.bigPic = datas[i + 1].templateData[0].picUrl;
                                } else {
                                    obj.title = datas[i].templateData[0].name;
                                    obj.type = 'small';

                                }

                                obj.more = datas[i].templateData[0]['jumpChannel'] ? true : false;
                                obj.list = [];

                            }

                            if (datas[i].type == 'textMoreLink') {
                                obj.links = datas[i].templateData[0].name;
                            }

                            if (datas[i].type == 'normalLandScape' ||
                                datas[i].type == 'normalLandScapeNodesc') {
                                obj.list = obj.list.concat(datas[i].templateData);
                            }

                        }
                    }
                    _this.data.pageData[key]['rotationImages'] = bannerData;
                    _this.data.pageData[key]['list'] = lists;
                    _this.data.pageData[key]['rollData'] = RollData;
                    _this.setData({
                        list: _this.data.pageData
                    });
                    app.globalData["list_" + index] = lists;
                    app.globalData["rotationImages_" + index] = bannerData;
                    app.globalData["rollData" + index] = RollData;
                    wx.hideLoading();
                },
                fail(error) {
                    util.showModel('请求失败', error);
                    console.log('request fail', error);
                }
            })
        }
    },
    loadingtv() {
        if (this.data.count >= this.data.loadingData.length) {
            return;
        }
        let data = [];
        let i = this.data.count;
        for (; this.data.count < 2 + i; this.data.count++) {
            data.push(this.data.loadingData[this.data.count]);
        }
        data = this.data.liveData.concat(data);
        this.setData({
            liveData: data
        })
        if (this.data.count >= this.data.loadingData.length) {
            this.setData({
                isLoadTv: false
            })
        }
    },
    isEmpty(e) { //判断Object对象是否为空
        let t;
        for (t in e) {
            return !1;
        }
        return !0
    }

})