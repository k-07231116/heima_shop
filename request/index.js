// 同时发送异步代码的次数
let ajaxTimes = 0
export const request = (params) => {
  //判断url是否带有 /my/ ，如果有则带上header token
  let header = { ...params.header }
  if (params.url.includes('/my/')) {
    // 请求头拼接token
    header['Authorization'] = wx.getStorageSync('token') || '';
  }

  ajaxTimes++
  wx.showLoading({
    title: "加载中",
    mask: true
  });
  // 定义公共的url
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message)
        ajaxTimes--
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        if (ajaxTimes === 0) {
          wx.hideLoading();
        }
      }
    });
  })
}