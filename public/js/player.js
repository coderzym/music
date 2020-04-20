// 这里是处理全局播放器的JS代码，首先完成进度条的鼠标移入移出效果
let playBar = $(".player")[0],
    lock = $(".lock").find("span"),
    props = 'backgroundPosition',
    // 设置一个全局锁的开关
    flag = true,
    // 设置一个管理播放栏的对象，里面存储锁和播放栏的状态
    tools = {
        // 鼠标移入的时候，flag为true/false时，锁的状态
        lockMouseIn: ['-82px -403px', '-103px -403px'],
        // 鼠标移出的时候，flag为true/false时，锁的状态
        lockMouseOut: ['-82px -383px', '-103px -383px']
    },
    audio = $('audio')[0],
    cSong = $('.song'),
    cSpan = $('.c-top').children('span'),
    cg = $('.cg')

function playerShow(flag = true) {
    if (flag) {
        $(playBar).stop().animate({ marginBottom: 0 }, { duration: 150, easing: 'linear' })
    }
}

function playerHide(flag = false) {
    if (flag) {
        $(playBar).stop().animate({ marginBottom: -45 }, { duration: 300, easing: 'linear' })
    }
}

$(playBar).mouseout(function () {
    playerHide(flag)
})

$(playBar).mouseover(function () {
    playerShow(flag)
})

// 控制锁移入移出的效果
$(lock).mouseover(function () {
    if (flag) {
        $(lock).css(props, tools.lockMouseIn[0])
    } else {
        $(lock).css(props, tools.lockMouseIn[1])
    }
})
$(lock).mouseleave(function () {
    if (flag) {
        $(lock).css(props, tools.lockMouseOut[0])
    } else {
        $(lock).css(props, tools.lockMouseOut[1])
    }
})

// 点击小锁后通过状态管理下方的音乐器播放栏
$(lock).click(function () {
    if (flag) {
        $(this).css(props, tools.lockMouseOut[1])
    } else {
        $(this).css(props, tools.lockMouseOut[0])
    }
    flag = !flag
})

// 第一次加载页面时显示播放栏，2秒后关闭
function show2hide(f) {
    playerShow(f)
    setTimeout(() => {
        playerHide(true)
    }, 2000)
}
show2hide(flag)

// ---下方代码是播放歌曲相关的代码---
// 导入歌曲详情API
import { songDetail } from 'public/request/api.js';

var bar = $('.player').find('.play')[0]

export async function playMusic(id, url) {
    var res = await songDetail(id)
    res = res.songs[0]
    saveInfo(res, url)
    updateInfo(res)
    click2play(url)
}

if (localStorage['musicInfo']) {
    updateInfo(localStorage.getItem('musicInfo'))
}

// 将最后播放的歌曲信息永久储存，下一次打开网站的时候默认放到第一首
function saveInfo(res, url) {
    localStorage.setItem('musicInfo', JSON.stringify(res))
    localStorage.setItem('url', JSON.stringify(url))
}

// 更换播放栏的信息
function updateInfo(res) {
    var res = JSON.parse(localStorage.getItem('musicInfo'))
    $(cSong).text(res.name)
    $(cSpan).text(res.ar[0].name)
    $(cg).attr('src', res.al.picUrl)
}

// 设置一个全局的播放开关，根据开关状态分配对应的CSS样式以及JS效果
let pBar = false

function controlPlay() {
    // 点击播放后，播放栏弹出，两秒后隐藏
    if (flag) {
        show2hide(flag)
    }
    if (!pBar) {
        bar.className = 'pause'
        audio.play()
    } else {
        bar.className = 'play'
        audio.pause()
    }
}

// 播放歌曲
function click2play(url) {
    $(audio).attr('src', url)
    // 每次通过点击歌单都必须让全局播放按钮初始化 否则程序功能会报错
    pBar = false
    controlPlay()
}

// 点击播放按钮后样式切换
$(bar).click(() => {
    // 第一次进入页面的时候我们是从localStorage中获取的url链接，所以可以理解为这个功能只执行一次
    if (localStorage['url'] && !$(audio).attr('src')) {
        $(audio).attr('src', JSON.parse(localStorage.getItem('url')))
        pBar = false
        bar.className = 'pause'
        audio.play()
        return
    }
    pBar = !pBar
    controlPlay()
})