Page({
  data: {
    tabs: [{
      id: 0,
      value: '体验问题',
      isActive: true
    },
    {
      id: 1,
      value: '商品、商家投诉',
      isActive: false
    }],
    chooseImgs: []
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
  //单击+添加图片
  handleChooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });
  },
  // 删除图片
  handleRemoveImg(e) {
    // 1.获取被点击的组件索引
    const { index } = e.currentTarget.dataset
    // 2.获取data中的数组
    let { chooseImgs } = this.data
    // 3.删除元素
    chooseImgs.splice(index, 1)
    // 4.重新赋值
    this.setData({
      chooseImgs
    })
  }
})