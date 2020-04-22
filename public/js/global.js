// 这里放的是全局都可能用到的API

// 1.警告框的弹出与消失
export function warn(value) {
    let warning = $('.xieyi')[0]
    $(warning).text(value)
    $(warning).show()
    setTimeout(() => {
        $(warning).hide()
        $(warning).text('')
    }, 1500)
}

// 2.拖拽模态框
export function drag(child, parent) {
    child.addEventListener('mousedown', e => {
        // 获取鼠标在盒内的距离
        var x = e.clientX - parent.offsetLeft,
            y = e.clientY - parent.offsetTop
        function move(e) {
            parent.style.left = e.clientX - x + 'px'
            parent.style.top = e.clientY - y + 'px'
        }
        // 移动时触发
        document.addEventListener('mousemove', move)
        // 弹起时解绑
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', move)
        })
    })
}

// 3.正则验证
export const test = {
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

// 4.绑定和解除绑定
export const maskEvents = {
    bindEvents(el, type, fn) {
        el.addEventListener(type, fn)
    },
    unbindEvents(el, type, fn) {
        el.removeEventListener(type, fn)
    }
}

// 5.判断复选框是否选中
export function isChecked(el) {
    var a1 = $(el).prop("checked")
    return a1
}

// 6.屏蔽默认事件
export function prevent() {
    let e = window.event
    if (e.type === 'mousewheel' || (e.type === 'keydown' && e.keyCode === 32)) {
        e.preventDefault()
    }
}