// index.js
// 获取应用实例
const app = getApp()
import {
  request
} from "../../request/index.js";
Page({
  data: {
    //轮播图数据
    swiperList: [],
    // 导航数据
    catesList: [],
    // 楼层数据
    floorList: []

  },
  //页面开始加载就会触发
  onLoad: function (options) {
    // 1.异步发送请求获取轮播图数据
    this.getSwiperList()
    this.getCatesList()
    this.getFloorList()
  },
  //获取轮播图数据
  getSwiperList() {
    request({
      url: '/home/swiperdata'
    }).then(result => {
      this.setData({
        swiperList: result
      })
    })
  },
  //获取分类导航数据
  getCatesList() {
    request({
      url: '/home/catitems'
    }).then(result => {
      this.setData({
        catesList: result
      })
    })
  },
  //获取楼层数据
  getFloorList() {
    request({
      url: '/home/floordata'
    }).then(result => {
      this.setData({
        floorList: result
      })
    })
  }

})