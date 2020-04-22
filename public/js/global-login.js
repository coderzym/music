// 这里是登录模块的所有方法

// 获取储存在sessionStorage里的当前的登录状态，
function getLoginState() {
    let isLogin = JSON.parse(localStorage.getItem('isLogin'))
    return isLogin
}

// 获取用户数据
function getUserData() {
    let userData = JSON.parse(sessionStorage.getItem('userInfo')).profile
    return userData
}

// 创建一个更新的对象方法集合
const utils = {
    updateLogin(userData) {
        // 获取元素
        let userImg = $('.last').find('img')[0],
            menu = $('.last').children('span'),
            logInImg = $('.log-info').children('img'),
            eventCount = $('.eventCount'),
            follows = $('.follows'),
            followeds = $('.followeds'),
            userInfoP = $('.userInfo').children('p'),
            right2log = $('.r-list-top'),
            logIn = $('.logIn')
        // 更新头部
        $(userImg).attr({
            'src': userData.avatarUrl,
            'alt': userData.nickname
        })
        $(userImg).css('display', 'block')
        $(menu).css('display', 'none')
        // 更新main部分
        $(right2log).css('display', 'none')
        $(logInImg).attr('src', userData.avatarUrl)
        $(followeds).text(userData.followeds)
        $(follows).text(userData.follows)
        $(eventCount).text(userData.eventCount)
        $(userInfoP).text(userData.nickname)
        $(logIn).css('display', 'block')
    },
    updateLogout() {
        let userImg = $('.last').find('img')[0],
            menu = $('.last').children('span'),
            right2log = $('.r-list-top'),
            logIn = $('.logIn')
        $(userImg).attr({
            'src': '',
            'alt': ''
        })
        $(userImg).css('display', 'none')
        $(menu).css('display', 'block')
        $(right2log).css('display', 'block')
        $(logIn).css('display', 'none')
    }
}

// 根据登录状态选择对应的展示方式
export function update() {
    let isLogin = getLoginState(),
        userData = getUserData()
    if (isLogin) {
        utils.updateLogin(userData)
    } else {
        utils.updateLogout()
    }
}