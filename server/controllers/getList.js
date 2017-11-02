let page1 = require('../Datas/1001');
let page2 = require('../Datas/1002');
let page3 = require('../Datas/1003');
let page4 = require('../Datas/1004');
let page5 = require('../Datas/1005');
let page6 = require('../Datas/1006');

module.exports = {
    pagea: async ctx => {
        ctx.state.data = page1.data
    },
    pageb: async ctx => {
        ctx.state.data = page2.data
    },
    pagec: async ctx => {
        ctx.state.data = page3.data
    },
    paged: async ctx => {
        ctx.state.data = page4.data
    },
    pagee: async ctx => {
        ctx.state.data = page5.data
    },
    pagef: async ctx => {
        ctx.state.data = page6.data
    }
}