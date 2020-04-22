require('public/css/index/index.css');
require('public/css/index/player.css');
require('public/js/player.js');
require('public/css/common/normalize.css');
require('public/css/common/base.css');

const main = $('#main')

class Router {
    constructor() {
        this.currentUrl = ''
        this.routes = {}
        this.fresh = this.fresh.bind(this)
        window.addEventListener('load', this.fresh, false)
        window.addEventListener('hashchange', this.fresh, false)
    }
    // 用来更新页面
    fresh() {
        this.currentUrl = location.hash.slice(1).split('.')[0] || '/'
        this.routes[this.currentUrl]()
    }
    // 用来储存路径和对应的回调函数
    route(path, callback) {
        this.routes[path] = callback
    }
}

let isRequire

// 避免多次引入相同的模块
function requireModule() {
    require('public/js/login.js')
    isRequire = true
}

// 如果不是第一次进入路由，那么就不需要继续加载这个文件
let first,
    firstRes

function mainCallback() {
    import(/* webpackChunkName: "main" */ 'public/js/main').then(value => {
        $(main).load('public/main.html', () => {
            if (!isRequire) {
                requireModule()
            }
            value.main()
        })
    })
}

function songCallback() {
    import(/* webpackChunkName: "song" */ 'public/js/song').then(value => {
        $(main).load('public/song.html', () => {
            if (!isRequire) {
                requireModule()
            }
            value.song()
        })
    })
}

window.router = new Router()
router.route('/', mainCallback)
router.route('song', songCallback)