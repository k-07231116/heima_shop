import {
  request
} from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
Page({
  data: {
    goods: [],
    isFocus: true,
    inpValue: ''
  },
  Timeid: -1,
  cancel() {
    this.setData({
      goods: [],
      isFocus: true,
      inpValue: ''
    })
  },
  //输入框改变
  handleInput(e) {
    console.log('value', e);
    const { value } = e.detail
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: true
      })
      return
    }
    this.setData({
      isFocus: false
    })
    // 防抖函数
    clearTimeout(this.Timeid)
    this.Timeid = setTimeout(() => { this.qsearch(value) }, 1500)

  },
  //发送请求获取参数
  async qsearch(query) {
    const res = await request({ url: '/goods/search', data: { query } })
    this.setData({
      goods: res.goods
    })
  }
})