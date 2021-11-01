import {
  request
} from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
/**
 * 用户上滑页面 滚动条触底 开始加载下一页数据
 *  1. 找到滚动条触底数据
 *  2. 判断还有没有下一页数据
 *  3. 假如没有，弹出提示
 *  4. 假如还有，就加载
 * 
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      value: '综合',
      isActive: true
    },
    {
      id: 1,
      value: '销量',
      isActive: false
    },
    {
      id: 2,
      value: '价格',
      isActive: false
    }],
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  //总页数
  totalPages: 1,
  onLoad: function (options) {
    this.QueryParams.cid = options.cid
    this.getGoodsList()
  },
  // 页面触底事件
  onReachBottom() {
    // 判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: '没有下一页数据了',
        icon: 'none',
      });
    } else {
      this.QueryParams.pagenum++
      this.getGoodsList()
    }

  },
  // 下拉刷新事件
  onPullDownRefresh() {
    this.setData({
      goodsList: []
    })
    this.QueryParams.pagenum = 1
    this.getGoodsList()
  },

  //标题点击事件
  tabItemChange(e) {
    const { index } = e.detail //获取被点击的标题索引
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false); //修改状态
    //重新赋值
    this.setData({
      tabs
    })
  },
  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: '/goods/search', data: this.QueryParams })
    const total = res.total //获取总条数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize) // 计算总页数
    // console.log('totalPages', this.totalPages);
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods] //拼接数组
    })
    wx.stopPullDownRefresh()
  }
})