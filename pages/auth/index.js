import {
  request
} from "../../request/index.js";
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
import { login } from "../../utils/asyncWX";
Page({
  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      // 1.获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail
      // 2.获取code
      const { code } = await login()
      const loginParams = { encryptedData, rawData, iv, signature, code }
      console.log('loginParams', loginParams);
      // 3.发送请求获取token值
      const { token } = await request({ url: '/users/wxlogin', data: loginParams, method: "post" }) || ''
      // 4.把token存到缓存中再跳回支付页
      wx.setStorageSync('token', token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log('error', error);

    }

  }
})