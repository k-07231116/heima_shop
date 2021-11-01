Page({
  data: {
    tabs: [{
      type: 1,
      value: '商品收藏',
      isActive: true
    },
    {
      type: 2,
      value: '品牌收藏',
      isActive: false
    },
    {
      type: 3,
      value: '店铺收藏',
      isActive: false
    }],
    collect: []
  },
  onShow() {
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      collect
    })
  },
  //点击选项卡
  tabItemChange(e) {
    const { index } = e.detail //获取被点击的标题索引
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false); //修改状态
    //重新赋值
    this.setData({
      tabs
    })
  },

})