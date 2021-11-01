import {
  request
} from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
Page({

  data: {
    goodsObj: {},
    isCollect: false,
  },
  // 商品对象
  GoodsInfo: {},
  onShow() {
    // 1.获取页面栈
    let pages = getCurrentPages();
    // 2.获取当前页面
    let currentPage = pages[pages.length - 1]
    let options = currentPage.options
    const { goods_id } = options
    this.getGoodsDetail(goods_id)
  },
  //点击收藏图标
  handleCollect() {
    let isCollect = null
    let collect = wx.getStorageSync("collect") || []
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index !== -1) {
      collect.splice(index, 1)
      isCollect = false
      wx.showToast({
        title: '取消成功',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    } else {
      collect.push(this.GoodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    }
    wx.setStorageSync('collect', collect);
    this.setData({
      isCollect
    })
  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({ url: '/goods/detail', data: { goods_id } })
    this.GoodsInfo = res
    // 1.获取缓存中商品收藏的数组
    let collect = wx.getStorageSync("collect") || []
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)
    this.setData({
      goodsObj: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: res.pics
      },
      isCollect
    })

  },
  // 轮播图预览功能
  handlePreviewImage(e) {
    // 要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    // 传递过来的url
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls,
    });
  },
  // 点击加入购物车
  handleCartAdd() {
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || [];
    //判断商品对象是否存在购物车中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    //不存在，第一层添加
    if (index === -1) {
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      cart[index].num++
    }
    // 把购物车重新添加回缓存
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      duration: 1500,
      mask: true
    });
  }
})