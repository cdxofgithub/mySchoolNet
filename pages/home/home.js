// pages/home/home.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slider: [
      { picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000000rVobR3xG73f.jpg' },
      { picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000000j6Tax0WLWhD.jpg' },
      { picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000000a4LLK2VXxvj.jpg' }
    ],
    swiperCurrent: 0,
    taskListParams: {
      indexPage: 1,
      listFlag: 1,   // 1刷新，2加
      mission_time: ''
    }
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  issueReward: function() {
    wx.navigateTo({
      url: '../issue/issue',
    })
  },
  rewardList: function() {
    wx.navigateTo({
      url: '../reward/reward',
    })
  },
  //获取首页列表
  getTaskList: function (indexPage) {
    var url = app.utils.URL + '/f/api/mission/list'
    var data = this.data.taskListParams
    var that = this
    console.log(data)
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      console.log(res)
      if (res.data.status == '0') {

      } else {
        console.log('服务器内部错误')
        app.wxToast({
          title: '服务器内部错误'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTaskList()
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