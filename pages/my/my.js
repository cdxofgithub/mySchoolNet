// pages/issue/issue.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    // tab切换  
    currentTab: 0,
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    that.getPersonInfo(parseInt(that.data.currentTab) + 1)
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    if (this.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.currentTarget.dataset.current
      })
      this.getPersonInfo(parseInt(this.data.currentTab) + 1)
    }
  },
  logout: function() {
    wx.showModal({
      title: '确定退出吗？',
      content: '再次登录需重新授权',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('accesstoken')
          app.wxToast({
            title: '退出成功！'
          })
        } else if (res.cancel) {
          return;
        }
      }
    })
  },
  getTaskStatus: function(e) {
    var flag = this.data.currentTab == 0? '1' : '2'
    var status = e.currentTarget.dataset.status
    var statustext = e.currentTarget.dataset.statustext
    wx.navigateTo({
      url: '../taskStatus/taskStatus?flag=' + flag + '&status=' + status + '&statustext=' + statustext,
    })
  },
  getPersonInfo: function (flag) {
    var url = app.utils.URL + '/f/api/mission/countByMap'
    var data = {
      flag: flag,
      accesstoken: wx.getStorageSync('accesstoken')
    }
    var that = this
    console.log(data)
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      console.log(res)
      if (res.data.status == '0') {
        that.setData({
          issueStatusInfo: res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /** 
     * 获取系统信息 
     */
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight
        });
      }
    });
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
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
    //获取发布信息
    this.getPersonInfo(1)
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