import { requestPayment, showToast } from "../../utils/asyncWX";
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onLoad() {},
  onShow() {
    //获取缓存的收货地址信息
    const address = wx.getStorageSync("address");
    //获取缓存的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤购物车数据
    cart = cart.filter(v => v.checked)
    // 计算全选(空数组调用every返回值为true)
    // this.setCart(checkedCart)
    // 计算总价格 总数量
    let totalPrice = 0,
      totalNum = 0
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price
      totalNum += v.num
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },

  //设置购物车状态 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {

  },
  //点击支付
  async handleOrder() {
    try {
      // 1.判断缓存中有没有token
      const token = wx.getStorageSync('token');
      // 2.判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return
      }
      // 3.创建订单
      // 3.1准备请求头参数
      const header = { Authorization: token }
      // 3.2准备请求体参数
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address.all
      const cart = this.data.cart
      let goods = []
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = {
        order_price,
        consignee_addr,
        goods
      }
      // 4.准备请求获取订单编号
      const { order_number } = await request({ url: '/my/orders/create', method: 'POST', data: orderParams })
      // 5.发起预支付接口获取支付参数
      const { pay } = await request({ url: '/my/orders/req_unifiedorder', method: 'POST', data: { order_number } })
      // 6.发起微信支付
      const res1 = await requestPayment(pay)
      // 7.查询后台订单状态
      const res2 = await request({ url: '/my/orders/chkOrder', data: { order_number }, method: 'POST' })
      await showToast('支付成功')
      // 8.删除已经购买的商品
      let newCart = wx.getStorageSync('cart');
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync('cart', newCart);
    } catch (error) {
      console.log('error', error);
      await showToast('支付失败')

    }

  },
})