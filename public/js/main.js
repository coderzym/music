// 这里的代码是首页所有的逻辑，获取要操作的DOM，导入一系列API
require('swiper/css/swiper.min.css');
require('public/css/main.css');

import Swiper from 'swiper';
import { banner } from 'public/request/api.js';
import { personalized } from 'public/request/api.js';
import { album } from 'public/request/api.js';
import { soar } from 'public/request/api.js';
import { artistList } from 'public/request/api.js';
import { popularDj } from 'public/request/api.js';
import { updateMain } from 'public/js/login.js'

export function main() {
    const pics = $(".swiper-slide"),
        bns = $(".banner")[0],
        ps = $(".bf"),
        intros = $(".intros"),
        bgcs = $(".bgc"),
        albumNames = $(".albumName"),
        singers = $(".singer"),
        albumPics = $(".album"),
        ls = $(".l-song").find(".song"),
        cs = $(".c-song").find(".song"),
        rs = $(".r-song").find(".song"),
        sNames = $('.singerName'),
        sIntros = $('.intro'),
        sImgs = $('.singer-list').find('img'),
        aImgs = $(".author-list").find('img'),
        aNames = $(".author-list").find('a'),
        aIntros = $(".author-list").find('.intro'),
        hot = $('.l-hot').find('ul')[0],
        lis = $('.l-hot').find('li'),
        e = $('.l-hot').find('e'),
        msk = $('.l-hot').find('.msk')

    // 1.更新网页轮播图
    new Promise(res => res(banner())).then(v => getBanner(v))
    async function getBanner(res) {
        var size = '?imageView&blur=40x20', res = res.banners
        for (let i = 0; i < pics.length; i++) {
            $(pics[i]).css({
                'background': 'url(' + res[i].imageUrl + ')',
                'backgroundSize': '728px 285px'
            })
        }
        var mySwiper = new Swiper('.swiper-container', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            on: {
                init: () => {
                    $(bns).css({
                        'background': 'url(' + res[0].imageUrl + size + ')',
                        'backgroundSize': '6000px',
                        'backgroundPosition': 'center center'
                    })
                },
                slideChange: () => {
                    $(bns).css({
                        'background': 'url(' + res[mySwiper.realIndex].imageUrl + size + ')',
                        'backgroundSize': '6000px',
                        'backgroundPosition': 'center center'
                    })
                }
            }
        })
    }

    // 2.更新推荐歌单
    new Promise(res => res(personalized())).then(v => getPersonalized(v))
    async function getPersonalized(res) {
        var res = res.result
        for (let i = 0; i < ps.length; i++) {
            intros[i].textContent = res[i].name
            $(bgcs[i]).attr('data-id', res[i].id)
            $(intros[i]).attr('data-id', res[i].id)
            $(lis[i]).attr('data-id', res[i].id)
            $(e[i]).attr('data-id', res[i].id)
            $(msk[i]).attr('data-id', res[i].id)
            ps[i].textContent = Math.ceil((res[i].playCount) / 10000) + '万'
            $(bgcs[i]).css({
                'background': 'url(' + res[i].picUrl + ')',
                'backgroundSize': '140px 140px'
            })
        }
        hot.addEventListener('click', e => {
            location.hash = 'song.html?' + $(e.target).attr('data-id')
        }, false)
    }

    // 3.更新新碟上架内容
    new Promise(res => res(album())).then(v => getAlbum(v))
    async function getAlbum(res) {
        var res = res.albums
        for (let i = 0; i < albumNames.length; i++) {
            albumNames[i].textContent = res[i].name
            singers[i].textContent = res[i].artists[0].name
            $(albumPics[i]).css({
                'background': 'url(' + res[i].picUrl + ')',
                'backgroundSize': '100px 100px'
            })
        }
    }

    // 4.榜单
    const numArr = [3, 0, 2]
    for (let i = 0; i < numArr.length; i++) {
        new Promise(res => res(soar(i))).then(v => getSoar(v, i))
    }
    async function getSoar(res, i) {
        var listArr = [ls, cs, rs]
        for (let j = 0; j < 10; j++) {
            listArr[i][j].textContent = res.playlist.tracks[j].name
        }
    }

    // 5.入驻歌手
    new Promise(res => res(artistList())).then(v => getArtistList(v))
    async function getArtistList(res) {
        var res = res.artists
        for (let i = 0; i < sNames.length; i++) {
            sNames[i].textContent = res[i].name
            sIntros[i].textContent = res[i].name
            $(sImgs[i]).attr('src', res[i].img1v1Url)
        }
    }
 
    // 6.最热主播榜
    new Promise(res => res(popularDj())).then(v => getPopularDj(v))
    async function getPopularDj(res) {
        var res = res.data.list
        for (let i = 0; i < aImgs.length; i++) {
            aNames[i].textContent = res[i].nickName
            aIntros[i].textContent = res[i].nickName
            $(aImgs[i]).attr('src', res[i].avatarUrl)
        }
    }
}