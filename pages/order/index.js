import {
  request
} from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
Page({
  data: {
    orders: [],
    tabs: [{
      type: 1,
      value: '全部',
      isActive: true
    },
    {
      type: 2,
      value: '代付款',
      isActive: false
    },
    {
      type: 3,
      value: '代发货',
      isActive: false
    },
    {
      type: 4,
      value: '退款/退货',
      isActive: false
    }],
  },
  onShow(options) {
    //判断有没有token
    // const token = wx.getStorageSync('token');
    // if (!token) {
    //   wx.navigateTo({
    //     url: '/pages/auth/index'
    //   });
    //   return
    // }
    // 1.获取页面栈
    let pages = getCurrentPages();
    // 2.获取当前页面
    let currentPage = pages[pages.length - 1]
    const { type } = currentPage.options
    this.changeTitleTabs(type - 1)
    this.getOrders(type)
  },
  // 获取订单列表
  async getOrders(type) {
    const res = await request({ url: '/my/orders/all', data: { type } }) || {}
    this.setData({
      // orders: res.orders || []
      orders: res.orders.map(v => ({ ...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString()) })) || []
    })
  },
  //根据标题索引改变标题数据
  changeTitleTabs(index) {
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false); //修改状态
    //重新赋值
    this.setData({
      tabs
    })
  },
  //点击选项卡
  tabItemChange(e) {
    const { index } = e.detail //获取被点击的标题索引
    this.changeTitleTabs(index)
    //重新发送请求
    this.getOrders(index + 1)
  }
})