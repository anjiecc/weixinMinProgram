/*global Page*/
Page({
    data: {
        defaultSize: 'default',
        primarySize: 'default',
        warnSize: 'default',
        disabled: false,
        plain: false,
        loading: false,
        code: "S F G H"
    },
    onLoad() {

    },
    change() {
        let result = [];
        for (let i = 0; i < 4; i++) {
            var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
            result.push(String.fromCharCode(65 + ranNum));
        }
        this.setData({
            code: result.join(" ")
        })

    }
})