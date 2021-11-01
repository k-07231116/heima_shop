import { getSetting, chooseAddress, openSetting, showModel, showToast } from "../../utils/asyncWX";
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onLoad() {},
  onShow() {
    //获取缓存的收货地址信息
    const address = wx.getStorageSync("address");
    //获取缓存的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    // 计算全选(空数组调用every返回值为true)
    this.setCart(cart)
    this.setData({
      address
    })
  },
  //点击收货地址
  async handleChooseAdress() {
    try {
      // 1.获取权限状态
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting["scope.address"]
      // 2.判断权限状态
      if (scopeAddress === false) {
        await openSetting()
      }
      let address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      wx.setStorageSync('address', address);
    } catch (error) {}
  },
  // 点击全选复选框
  handleItemAllCheck() {
    // 获取data中数据
    let { cart, allChecked } = this.data
    allChecked = !allChecked
    cart.forEach(v => v.checked = allChecked)
    this.setData({
      cart,
      allChecked
    })
    wx.setStorageSync("cart", cart);
    this.setCart(cart)
  },
  // 商品的选中
  handleItemChange(e) {
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id
    // 获取购物车数组
    let { cart } = this.data
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    // 改变状态
    cart[index].checked = !cart[index].checked
    this.setCart(cart)
  },
  // 点击结算
  async handlePay() {
    // 1.判断收货地址是否存在
    const { address, totalNum } = this.data
    if (!address.userName) {
      await showToast({ title: '收货地址不能为空' })
      return
    }
    // 2.判断是否选购商品
    if (!totalNum) {
      await showToast({ title: '您还没有选购商品' })
      return
    }
    wx.navigateTo({
      url: '/pages/pay/index',
      success: (result) => {

      },
      fail: () => {},
      complete: () => {}
    });
  },
  // 点击+或者-
  async handleItemNumEdit(e) {
    //1.获取传递的参数
    const { operation, id } = e.currentTarget.dataset
    //2.获取购物车的参数
    let { cart } = this.data
    //3.找到对应的数据
    const index = cart.findIndex(v => v.goods_id === id)
    //4.操作对应的数据
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModel({ content: '您确定要删除吗？' })
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      cart[index].num += operation
      this.setCart(cart)
    }
  },
  //设置购物车状态 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    let allChecked = true
    // 计算总价格 总数量
    let totalPrice = 0,
      totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        allChecked = false
      }
    });
    allChecked = cart.length != 0 ? allChecked : false
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync('cart', cart)
  }
})