import jsonp from 'common/js/jsonp'
import {commonParams, options} from "./config"
import axios from 'axios'

/**
 * jsonp 抓取推荐页轮播图数据
 * 接口：https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg
 */
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

/**
 * axios 抓取推荐页列表数据
 * 接口：https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg
 * 接口提供方使用了 referer:https://y.qq.com/portal/playlist.html
 * axios 结合 node.js 代理后端请求
 */
export function getDiscList() {
	const url = '/api/getDiscList'

	const data = Object.assign({}, commonParams, {
		platform: 'yqq',
		hostUin: 0,
		sortId: 5,
		sin: 0,
		ein: 29,
		needNewCode: 0,
		categoryId: 10000000,
		rnd: Math.random(),
		format: 'json'
	})
	return axios.get(url,{
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}