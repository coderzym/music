import { update } from './global-login.js';
import { warn } from "./global.js";
import { drag } from "./global.js";
import { test } from "./global.js";
import { maskEvents } from "./global.js";
import { isChecked } from "./global.js";
import { prevent } from "./global.js";
import { main2log } from "public/js/main.js";

// 这里是登录模块，首先获取登录需要用到的DOM元素，部分地方可能会用原生JS，所以没给所有元素加[0]
let log = $('.last')[0],
    clo = $('.close')[0],
    log1 = $('.log')[0],
    log2 = $('.log-top').children('span'),
    cover = $('.cover')[0],
    body = $('body')[0],
    logShow = $('.log-show')[0],
    contain = $('.contain'),
    back = $('.l-back'),
    arg1 = $('.left').find('input'),
    value1 = $('.tel').children('input')[0],
    value2 = $('.pwd')[0],
    out = $('.logout'),
    tRight = $('.t-right')

// 定义一个登录框显示隐藏的开关，定义是否更新用户信息的开关
let loginFlag = false

let userImg = $('.last').find('img')[0],
    userInfo = $('.user-info')

$(userImg).mouseenter(() => {
    $(userInfo).css('display', 'flex')
})

$(userInfo).mouseleave(() => {
    $(userInfo).css('display', 'none')
})

$(tRight).mouseleave(() => {
    $(userInfo).css('display', 'none')
})

let localIsLogin = JSON.parse(localStorage.getItem('isLogin'))

if (!localIsLogin) {
    $(log).click(loginFn)
    $(main2log).click(loginFn)
}

// 长按登录框头部拖动
let logTop = $('.login', parent.document).children('.top')[0],
    loginBox = $('.login', parent.document)[0]
drag(logTop, loginBox)

// 用户点击登录后屏蔽键盘鼠标默认事件
export function loginFn() {
    loginFlag = !loginFlag
    if (loginFlag) {
        // 显示遮罩层
        $(cover).show()
        // 禁止滚轮滑动
        maskEvents.bindEvents(cover, 'mousewheel', prevent)
        // 禁用键盘空格滚动事件
        maskEvents.bindEvents(body, 'keydown', prevent)
    } else {
        // 关闭遮罩层
        $(cover).hide()
        // 解除绑定事件
        maskEvents.unbindEvents(body, 'keydown', prevent)
    }
}

if (!localStorage['isLogin']) {
    localStorage.setItem('isLogin', false)
}

// 点击关闭按钮登录框隐藏
$(clo).click(loginFn)

// 根据用户选择切换不同的登录框
function change(el1, el2, isLogin) {
    if (isLogin) {
        $(el1).show()
        $(el2).hide()
    } else {
        $(el2).show()
        $(el1).hide()
    }
}

// 绑定登录的点击事件
$(log1).click(() => {
    let res = isChecked(arg1)
    if (res) {
        change(logShow, contain, true)
    } else {
        warn('请仔细阅读下方协议后勾选')
    }
})

// 点击其他验证方式返回
$(back).click(() => {
    change(logShow, contain, false)
})

// 导入手机登录/退出登录API
import { logPhone } from 'public/request/api.js'
import { logout } from 'public/request/api.js'

// 当用户点击登录的时候，进行验证
$(log2).click(() => {
    var v1 = value1.value, v2 = value2.value
    test.checkPhone(v1)
    test.checkPwd(v2)
    if (test.checkPhone(v1) && test.checkPwd(v2)) {
        warn('登录中，请耐心等待')
        new Promise(resolve => {
            resolve(logPhone(v1, v2))
        }).then(value => {
            warn('登录成功！')
            localStorage.setItem('isLogin', true)
            $(log).off('click')
            // 如果用户信息存在于session里面，则直接更新
            if (sessionStorage['userInfo']) {
                update()
            } else {
                // 存储sessionStorage
                saveInfo(value)
                update()
            }
            location.reload()
        }).catch(() => {
            warn('用户名或者密码有误，请确认后重新输入')
        })
    }
})

// 更新用户退出后的页面
$(out).click(e => {
    e.stopPropagation()
    new Promise(resolve => {
        resolve(logout())
    }).then(value => {
        if (value) {
            update()
            sessionStorage.clear()
            localStorage.setItem('isLogin', false)
            location.reload()
        }
    })
})

// 保存用户的登录信息，避免刷新页面数据消失
function saveInfo(res) {
    sessionStorage.setItem('userInfo', JSON.stringify(res))
}

// 如果用户信息存在于session里面，则直接更新
if (sessionStorage['userInfo']) {
    update()
}