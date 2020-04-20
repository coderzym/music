// 这里是歌单列表的JS代码，获取要操作的DOM，导入一系列API
import { playlistDetail } from 'public/request/api.js';
import { relatedList } from 'public/request/api.js';
import { songUrl } from 'public/request/api.js';
import { playMusic } from 'public/js/player.js';
import { songDetail } from 'public/request/api.js';
require('public/css/song.css');

export function song() {
    let listImg = $('.main-top').children('img'),
        listTitle = $('.info-title').children('span')[0],
        listIntro = $('.info-intro').children('p')[0],
        listCreate = $('.info-name').children('span')[0],
        listCreator = $('.info-name').children('img')[0],
        creatorName = $('.info-name').children('.userName')[0],
        trackCount = $('.trackCount')[0],
        playCount = $('.count').children('b')[0],
        follow = $('.info-btn').find('.follow').find('span')[0],
        share = $('.info-btn').find('.share').find('span')[0],
        com = $('.com').find('span')[0],
        tj = $('.tj').find('a'),
        apiArr = [follow, share, com],
        tbody = $('tbody')[0],
        sbs = $('.sb')[0],
        tags = $('.bq')[0],
        list = $('.info-intro')[0],
        zk = $('.zk')[0],
        urlId = Number(location.hash.split('?')[1])
    // 1.更新歌单详情
    new Promise(res => res(playlistDetail(urlId))).then(v => getPlaylistDetail(v))
    async function getPlaylistDetail(res) {
        listTop(res)
        getSongDetail(res)
    }

    // 修改歌单头部信息
    function listTop(res) {
        // 将小按钮的三个API名称保存下来，减少操作
        var time, description,
            apiNameArr = ['subscribedCount', 'shareCount', 'commentCount'],
            res = res.playlist,
            tagArr = res.tags,
            frag,
            // 创建一个判断换行符是否存在的正则
            t = /\n/g
        // 转化时间戳
        time = new Date(res.createTime).toLocaleString().split(' ')[0]
        // 更改歌单描述格式，判断换行符是否存在
        description = res.description
        description = t.test(description) ? description.replace(/\n/g, '<br>') : description
        // 创建fragment节省开销
        frag = document.createDocumentFragment()
        // 开始更改信息
        $(listImg).attr('src', res.coverImgUrl)
        $(listCreator).attr('src', res.creator.avatarUrl)
        listCreate.textContent = time.replace(/\//g, '-') + '  创建'
        trackCount.textContent = res.trackCount + '首歌'
        creatorName.textContent = res.creator.nickname
        listTitle.textContent = res.name
        playCount.textContent = computed(res.playCount)
        listIntro.innerHTML = description
        // 歌单标签需要动态创建
        for (let i = 0; i < tagArr.length; i++) {
            let tel = `${tagArr[i]}`, a = document.createElement('a')
            a.innerHTML = tel
            frag.appendChild(a)
        }
        tags.appendChild(frag)
        // 歌单的收藏、分享、播放数据
        for (let i = 0; i < apiNameArr.length; i++) {
            apiArr[i].textContent = computed(res[apiNameArr[i]])
        }
        // 喜欢这首歌的人
        for (let i = 0; i < tj.length; i++) {
            $(tj[i]).css({
                'background': 'url(' + res.subscribers[i].avatarUrl + ')',
                'backgroundSize': '40px 40px'
            })
        }
        // 歌单描述的展开与隐藏
        showDesc(list, zk)
    }

    // 2.更新相关歌单
    new Promise(res => res(relatedList(urlId))).then(v => getRelatedList(v))
    async function getRelatedList(res) {
        var frag = document.createDocumentFragment(), res = res.playlists
        // 歌单相关推荐
        for (let i = 0; i < res.length; i++) {
            let tel = `<img src="${res[i].coverImgUrl}" alt="">
                    <div class="info">
                        <p>${res[i].name}</p>
                        <p>by<a>${res[i].creator.nickname}</a><b></b></p>
                    </div>`,
                li = document.createElement('li')
            li.innerHTML = tel
            frag.appendChild(li)
        }
        sbs.appendChild(frag)
    }

    // 计算播放、收藏、分享数据
    function computed(num) {
        var res = Math.floor(num / 10000)
        return res = res >= 1 ? res + '万' : num
    }

    // 歌曲详细信息api
    async function getSongDetail(res) {
        var parArr = res.privileges,
            frag = document.createDocumentFragment(),
            res,
            idArr = []
        // 将trackID传入一个新数组
        for (let i = 0; i < parArr.length; i++) {
            idArr.push(parArr[i].id)
        }
        res = await songDetail(idArr)
        res = res.songs
        for (let i = 0; i < parArr.length; i++) {
            let tel = `<td>${i + 1}<b></b></td>
                    <td class="sn"><a href='#${parArr[i].id}'>${res[i].name}</a></td>
                    <td class="time">
                        <span>4:25</span>
                        <div class="gr">
                            <a class="ad"></a>
                            <a class="fo"></a>
                            <a class="sh"></a>
                            <a class="do"></a>
                        </div>
                    </td>
                    <td class="gs">${res[i].ar[0].name}</td>
                    <td class="album">${res[i].al.name}</td>`,
                tr = document.createElement('tr')
            tr.innerHTML = tel
            frag.appendChild(tr)
        }
        tbody.appendChild(frag)
    }

    // 歌单描述的展开与隐藏
    function showDesc(el1, el2) {
        var h = el2.offsetTop - el1.offsetTop, flag = true
        // 保存歌单描述的高度并与最大高度进行对比，高则显示展开，否则隐藏展开
        $(el2).css('display', h > 195 ? 'block' : 'none')
        // 点击zk后展开按钮歌单描述
        $(el2).click(() => {
            if (flag) {
                el1.style.maxHeight = '100%'
            } else {
                el1.style.maxHeight = '195px'
            }
            if (flag) {
                el2.textContent = '收起↑'
            } else {
                el2.textContent = '展开↓'
            }
            flag = !flag
        })
    }

    // 给歌单绑定点击事件，然后将数据传给播放栏，首先是获取和发送音乐URL
    var preBar
    tbody.addEventListener('click', e => {
        // 如果是点击的播放按钮，那么就获取音乐的url
        if ($(e.target)[0].localName === 'b') {
            // 获取兄弟节点的子节点
            let el = $($(e.target).parent().siblings()[0]).find('a'),
                musicId = Number($(el).attr('href').split('#')[1])
            // 获取音乐URL
            new Promise(resolve => {
                resolve(songUrl(musicId))
            }).then(res => {
                playMusic(musicId, res.data[0].url)
                // 改变按钮样式
                if (preBar) {
                    $(preBar).css({
                        'background': 'public/img/table.png',
                        'backgroundPosition': '0 -103px'
                    })
                }
                $(e.target).css({
                    'background': 'public/img/table.png',
                    'backgroundPosition': '-20px -128px'
                })
                preBar = $(e.target)
            })
        }
    }, false)
}