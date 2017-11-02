/*global getApp wx Page*/
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var config = require('../../../config')
var util = require('../../../utils/util.js')
    // var _ = require('lodash');
var app = getApp();
Page({
    data: {
        topBarList: [{ name: '精选', id: '1001' }, { name: '黄金单身汉', id: '1002' },
            { name: '综艺', id: '1003' }, { name: '电视剧', id: '1004' },
            { name: '电影', id: '1005' }, { name: '少儿', id: '1006' }
        ],
        left: 0,
        interval: 5000,
        duration: 500,
        actived: '',
        noactived: '',
        pageHeight: '',
        currentPage: 0,
        list: {},
        rotationImages: {},
        pageData: {
            page1001: {},
            page1002: {},
            page1003: {},
            page1004: {},
            page1005: {},
            page1006: {}
        }
    },
    onLoad() {
        var _this = this;
        wx.getSystemInfo({
            success: function(res) {
                _this.setData({
                    pageHeight: `height:${res.windowHeight * 2 - 80}rpx`
                })
            }
        })
        this.setData({ actived: "color:#ec6a2c", noactived: "color;#000" });
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
                        AvatorData = [],
                        RollData = [],
                        lists = [],
                        obj = {};
                    for (let i = 0; i < datas.length - 10; i++) {
                        if (datas[i].type == 'banner') {
                            bannerData = datas[i].templateData;
                        }

                        if (datas[i].type == 'roundAvatorText') {
                            AvatorData = datas[i].templateData;
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
                    console.log(lists);
                    console.log(bannerData);
                    console.log(AvatorData);
                    console.log(RollData);
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
    isEmpty(e) { //判断Object对象是否为空
        let t;
        for (t in e) {
            return !1;
        }
        return !0
    },
    changePage(e) {
        console.log(e);
        let currentPageIndex = e.detail.current;
        this.setData({
            currentPage: currentPageIndex,
            left: 50 * currentPageIndex
        })
        this.loadPage(currentPageIndex + 1)
    },
    bindscroll() {

    },
    tapPage(e) {
        let id = e.currentTarget.id;
        let array = {
            1001: 0,
            1002: 1,
            1003: 2,
            1004: 3,
            1005: 4,
            1006: 5
        };
        this.setData({
            currentPage: array[id],
            left: 50 * array[id]
        })
        this.loadPage(array[id] + 1);
    },
    play(e) {
        let id = e.currentTarget.id;
        wx.navigateTo({
            url: `../page${id}/page${id}`
        })
    }

})