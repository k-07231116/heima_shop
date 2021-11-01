// pages/category/index.js
import {
  request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    leftMenuList: [], // 左侧数据
    rightContent: [], // 右侧数据
    currentIndex: 0, // 被点击的左侧 菜单
    scrollTop: 0 //右侧内容滚动条距离
  },
  //接口的返回数据
  Cates: [],

  onLoad(options) {

    // 1.判断本地是否有缓存信息
    const Cates = wx.getStorageSync("cates");
    // 2.没有旧数据，直接发送新请求 
    if (!Cates) {
      this.getCates()
    } else {
      if (Date.now - Cates.time > 1000 * 10) {
        //重新发送请求
        this.getCates()
      } else {
        console.log('继续使用旧数据');
        this.Cates = Cates.data
        //构造左侧数据
        let leftMenuList = this.Cates.map(v => v.cat_name)
        // 构造右侧数据
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
    // 3.有旧数据并且数据没有过期，就使用本地缓存

  },

  //获取分类数据
  async getCates() {
    const res = await request({ url: "/categories" })
    this.Cates = res;
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    //构造左侧数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 点击左侧选项
  handleItemTap(e) {
    // 1.获取被点击标题的索引值
    const { index } = e.currentTarget.dataset
    // 2.重新赋值
    // 3.右侧内容变化
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }

})