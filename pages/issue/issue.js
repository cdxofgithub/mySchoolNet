// pages/issue/issue.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passAddress: false
  },
  descInput: function (e) {
    this.setData({
      describe: e.detail.value
    })
  },
  addressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
    if (this.data.address) {
      this.setData({
        passAddress: true
      })
    }
  },
  priceInput: function (e) {
    this.setData({
      price: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  submit: function () {
    wx.showLoading({
      title: '发布中...',
      mask: true
    })
    if (!this.data.describe) {
      app.wxToast({
        title: '描述不能为空'
      })
    } else if (!(/^[0-9]+.?[0-9]*$/.test(this.data.price)) || parseInt(this.data.price) < 1) {
      app.wxToast({
        title: '赏金最低为1元'
      })
    } else if (!this.data.address && !this.data.passAddress) {
      var that = this
      wx.showModal({
        title: '温馨提示',
        content: '忽略送达地址吗',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              passAddress: true
            })
          } else if (res.cancel) {
            that.setData({
              passAddress: false
            })
          }
        }
      })
    } else if (!(/^1[34578]\d{9}$/.test(this.data.phone))) {
      app.wxToast({
        title: '号码格式错误'
      })
    } else {
      var url = app.utils.URL + '/f/api/mission/add'
      var data = {
        description: this.data.describe,
        price: this.data.price,
        phone: this.data.phone,
        address: this.data.address,
        accesstoken: wx.getStorageSync('accesstoken')
      }
      var that = this
      console.log(data)
      app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
        if (res.data.status == '0') {
          that.getPayInfo(res.data.data.missionId)
        } else {
          app.wxToast({
            title: '服务器内部错误'
          })
        }
      })
    }
  },
  //取得支付信息 
  getPayInfo: function (missionId) {
    var url = app.utils.URL + '/f/api/payInfo/unifiedorder'
    var data = {
      missionId: missionId,
      accesstoken: wx.getStorageSync('accesstoken')
    }
    var that = this
    console.log(data)
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      wx.hideLoading()
      console.log(res)
      if (res.data.status == '0') {
        var result = res.data.data
        wx.requestPayment({
          'timeStamp': result.timeStamp,
          'nonceStr': result.nonceStr,
          'package': result.package,
          'signType': result.signType,
          'paySign': result.paySign,
          'success': function (res) {
            wx.navigateTo({
              url: '../success/success',
            })
          },
          'fail': function (res) {
            console.log(result.payinfo_id)
            if (res.errMsg == 'requestPayment:fail cancel') {
              var url = app.utils.URL + '/f/api/mission/cancel'
              var data = {
                payinfoId: result.payinfo_id,
                accesstoken: wx.getStorageSync('accesstoken')
              }
              console.log(data)
              app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
                console.log(res)
                if (res.data.status == '0') {
                  app.wxToast({
                    title: '取消支付成功'
                  })
                } else {
                  app.wxToast({
                    title: '服务器内部错误'
                  })
                }
              })
            } else {
              app.wxToast({
                title: '支付出错'
              })
            }
          }
        })
      }
    })

  },
  useCoupon: function () {
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})