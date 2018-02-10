//app.js
import { request, URL } from './utils/request.js'
var wxToast = require('toast/toast.js')
App({
  onLaunch: function () {
    var that = this
    // that.login()
    //检查登录态
    wx.checkSession({
      success: function () {
        // var url = URL + '/f/api/user/checkToken'
        // var data = {
        //   accesstoken: wx.getStorageSync('accesstoken')
        // }
        // request(url, JSON.stringify(data), 'POST', function (res) {
        //   if (res.data.status == '0') {
        //     return
        //   } else {
        //     that.login()
        //   }
        // })
      },
      fail: function () {
        console.log('过期')
        //登录态过期
        that.login()
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  login: function () {
    // 登录
    wx.login({
      success: function (res) {
        console.log(res.code)
        if (res.code) {
          var url = URL + '/f/api/user/login'
          var data = {
            code: res.code
          }
          request(url, JSON.stringify(data), 'POST', function (res) {
            if (res.data.status == '0') {
              console.log(res)
              wx.setStorageSync('accesstoken', res.data.data.accesstoken)
              wx.getUserInfo({
                success: function (resp) {
                  var userInfo = resp.userInfo //用户基本信息
                  var nickName = userInfo.nickName //用户名
                  var avatarUrl = userInfo.avatarUrl //头像链接
                  var gender = userInfo.gender //性别 0：未知、1：男、2：女

                  //更新用户信息
                  var url = URL + '/f/api/user/updateUserInfo'
                  var data = {
                    nickName: nickName,
                    avatarUrl: avatarUrl,
                    gender: gender,
                    accesstoken: res.data.data.accesstoken
                  }
                  console.log(JSON.stringify(data))
                  request(url, JSON.stringify(data), 'POST', function (res) {
                    console.log(res)
                    if (res.data.status == '0') {
                      wxToast({
                        title: '信息更新成功'
                      })
                      setTimeout(function() {
                        wx.navigateBack()
                      }, 1000)
                    }
                  })
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function (res) {
        wxToast({
          title: '用户登录失败'
        })
      }
    });
  },
  globalData: {
    userInfo: null
  },
  utils: {
    request: request,
    URL: URL
  },
  wxToast
})