// 这里是登录模块，首先获取登录需要用到的DOM元素，部分地方可能会用原生JS，所以没给所有元素加[0]
let log = $('.last')[0],
    clo = $('.close')[0],
    log1 = $('.log')[0],
    log2 = $('.log-top').children('span'),
    loginBox = $('.login', parent.document)[0],
    cover = $('.cover')[0],
    body = $('body')[0],
    logShow = $('.log-show')[0],
    contain = $('.contain'),
    back = $('.l-back'),
    arg1 = $('.left').find('input'),
    xieyi = $('.xieyi')[0],
    logTop = $('.login', parent.document).children('.top')[0],
    value1 = $('.tel').children('input')[0],
    value2 = $('.pwd')[0],
    main2log = $('.r-list-top').children('a'),
    out = $('.logout')

// 定义一个登录框显示隐藏的开关，定义是否更新用户信息的开关
let loginFlag = false,
    userFlag = true

let userImg = $('.last').find('img')[0],
    userInfo = $('.user-info'),
    menu = $('.last').children('span'),
    right2log = $('.r-list-top'),
    logIn = $('.logIn'),
    logInImg = $('.log-info').children('img'),
    eventCount = $('.eventCount'),
    follows = $('.follows'),
    followeds = $('.followeds'),
    userInfoP = $('.userInfo').children('p'),
    tRight = $('.t-right')

// 登录后的状态
function showLogin(userData) {
    let profile = userData.profile
    $(userImg).attr({
        'src': profile.avatarUrl,
        'alt': profile.nickname
    })
    $(userImg).css('display', 'block')
    $(menu).css('display', 'none')
    $(userImg).mouseenter(() => {
        $(userInfo).css('display', 'flex')
    })
    $(userInfo).mouseleave(() => {
        $(userInfo).css('display', 'none')
    })
    $(tRight).mouseleave(() => {
        $(userInfo).css('display', 'none')
    })
    $(right2log).css('display', 'none')
    $(logIn).css('display', 'block')
    $(logInImg).attr('src', profile.avatarUrl)
    $(followeds).text(profile.followeds)
    $(follows).text(profile.follows)
    $(eventCount).text(profile.eventCount)
    $(userInfoP).text(profile.nickname)
}

// 退出登录
function hideLogin() {
    $(userImg).attr({
        'src': '',
        'alt': ''
    })
    $(userImg).css('display', 'none')
    $(menu).css('display', 'block')
    $(right2log).css('display', 'block')
    $(logIn).css('display', 'none')
}

// 警告框的弹出与消失
function warn(value) {
    $(xieyi).text(value)
    $(xieyi).show()
    setTimeout(() => {
        $(xieyi).hide()
        $(xieyi).text('')
    }, 1500)
}

// 长按登录框头部拖动
logTop.addEventListener('mousedown', e => {
    // 获取鼠标在盒内的距离
    var x = e.clientX - loginBox.offsetLeft,
        y = e.clientY - loginBox.offsetTop
    function move(e) {
        loginBox.style.left = e.clientX - x + 'px'
        loginBox.style.top = e.clientY - y + 'px'
    }
    // 移动时触发
    document.addEventListener('mousemove', move)
    // 弹起时解绑
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', move)
    })
})

// 用户点击登录后屏蔽键盘鼠标默认事件
function loginFn() {
    loginFlag = !loginFlag
    if (loginFlag) {
        // 显示遮罩层
        $(cover).show()
        // 禁止滚轮滑动
        cover.addEventListener('mousewheel', e => {
            e.preventDefault()
        })
        // 禁用键盘空格滚动事件
        body.addEventListener('keydown', preventKeyboard, true)
    } else {
        // 关闭遮罩层
        $(cover).hide()
        // 解除绑定事件
        body.removeEventListener('keydown', preventKeyboard, true)
    }
}

// 点击首页main中登录框弹出登录
if (main2log) {
    $(main2log).click(loginFn)
}

if (!localStorage['isLogin']) {
    localStorage.setItem('isLogin', false)
}

let localIsLogin = JSON.parse(localStorage.getItem('isLogin'))

if (!localIsLogin) {
    $(log).on('click', loginFn)
}

// 点击关闭按钮登录框隐藏
$(clo).click(loginFn)

// 阻止键盘默认事件，取消绑定得另外申明一个函数
function preventKeyboard() {
    var e = window.event
    // 禁用空格
    if (e.keyCode == 32) {
        e.preventDefault()
    }
}

// 判断复选框是否选中
function isChecked(el) {
    var a1 = $(el).prop("checked")
    return a1
}

// 绑定点击事件
$(log1).click(() => {
    let res = isChecked($(arg1))
    if (res) {
        change(logShow, contain, true)
    } else {
        warn('请仔细阅读下方协议后勾选')
    }
})

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
            $(log).off('click')
            // 如果用户信息存在于session里面，则直接更新
            if (sessionStorage['userInfo']) {
                update()
            } else {
                // 存储sessionStorage
                saveInfo(value)
                update()
            }
            localStorage.setItem('isLogin', true)
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

// 更新用户登录后页面的入口函数
function update() {
    let userData = JSON.parse(sessionStorage.getItem('userInfo'))
    // 界面显示用户基本信息
    if (userFlag) {
        showLogin(userData)
    } else {
        hideLogin()
    }
    userFlag = !userFlag
}

// 判断用户输入格式是否正确
const test = {
    // 验证输入手机号
    checkPhone(v) {
        // 匹配手机号的正则
        const exp = /^[1][3,4,5,7,8,9][0-9]{9}$/
        if (!v) {
            warn('请输入手机号')
            return false
        }
        if (!exp.test(v)) {
            warn('您输入的手机号格式有误')
            return false
        }
        return true
    },
    // 验证输入密码
    checkPwd(v) {
        const exp = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/
        if (!v) {
            warn('请输入密码')
            return false
        }
        if (!exp.test(v)) {
            warn('您输入的密码格式有误')
            return false
        }
        return true
    },
    // 验证邮箱
    checkEmail(v) {
        const exp = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/
        if (!v) {
            warn('请输入邮箱')
            return false
        }
        if (!exp.test(v)) {
            warn('您输入的邮箱有误')
            return false
        }
        return true
    }
}