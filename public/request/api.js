// 这里是要用到的各种api，引入Http
import Http from './http'
// 1.推荐歌单
export function personalized() {
    const res = new Http({
        api: '/personalized',
        data: {
            limit: 8
        }
    })
    return res
}
// 2.轮播图
export function banner() {
    const res = new Http({
        api: '/banner',
        data: {
            type: 0
        }
    })
    return res
}
// 3.新碟上架
export function album() {
    const res = new Http({
        api: '/top/album',
        data: {
            limit: 8
        }
    })
    return res
}
// 4.榜单
export function soar(param) {
    const res = new Http({
        api: '/top/list',
        data: {
            idx: param
        }
    })
    return res
}
// 5.入驻歌手
export function artistList() {
    const res = new Http({
        api: '/artist/list',
        data: {
            cat: 5001,
        }
    })
    return res
}
// 6.最热主播榜
export function popularDj() {
    const res = new Http({
        api: '/dj/toplist/popular',
        data: {
            limit: 5
        }
    })
    return res
}
// 7.获得歌单详情
export function playlistDetail(n) {
    const res = new Http({
        api: '/playlist/detail',
        data: {
            id: n
        }
    })
    return res
}
// 8.获取歌曲详情
export function songDetail(n) {
    const res = new Http({
        api: '/song/detail',
        data: {
            ids: n
        }
    })
    return res
}
// 9.相关歌单推荐
export function relatedList(n) {
    const res = new Http({
        api: '/related/playlist',
        data: {
            id: n
        }
    })
    return res
}
// 10.手机登录API
export function logPhone(n, p) {
    const res = new Http({
        api: '/login/cellphone',
        data: {
            phone: n,
            password: p
        }
    })
    return res
}
// 11.邮箱登录API
export function logEmail(n, p) {
    const res = new Http({
        api: '/login',
        data: {
            email: n,
            password: p
        }
    })
    return res
}
// 12.退出登录API
export function logout() {
    const res = new Http({
        api: '/logout'
    })
    return res
}
// 13.获取音乐URL
export function songUrl(n) {
    const res = new Http({
        api: '/song/url',
        data: {
            id: n
        }
    })
    return res
}