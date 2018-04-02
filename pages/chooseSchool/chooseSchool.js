// pages/chooseSchool/chooseSchool.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['南阳理工学院', '内蒙古建筑职业技术学院'],
    index: 0,
    school: '请选择您的学校'
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value, 
      school: this.data.array[e.detail.value]
    })
  },
  submit: function() {
    if (this.data.school != '请选择您的学校') {
      wx.removeStorageSync('school')        
      wx.removeStorageSync('accesstoken')  
      if (this.data.school == '南阳理工学院') {
        app.utils.URL = "https://www.easyprogramming.cn/wxw_tkjh";
      } else {
        app.utils.URL = "https://www.easyprogramming.cn/wxw_tkjh_meng";
      } 
      app.login() 
      wx.setStorageSync('school', this.data.school) 
      wx.switchTab({
        url: '../home/home'
      })
      
    } else {
      app.wxToast({
        title: '请选择学校！'
      })
    }
    
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