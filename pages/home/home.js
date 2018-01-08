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
  issueReward: function () {
    wx.navigateTo({
      url: '../issue/issue',
    })
  },
  rewardList: function () {
    wx.navigateTo({
      url: '../reward/reward',
    })
  },
  //获取首页列表
  getTaskList: function (state) {
    var that = this
    wx.showLoading({
      title: '任务加载中...',
      mask: true
    })
    if (state == 'down') {
      console.log('进入了下拉刷新')
      that.data.taskListParams.mission_time = that.data.taskList[0].releaseTime
      that.data.taskListParams.listFlag = 1
      that.setData({
        taskListParams: that.data.taskListParams
      })
    }
    if (state == 'up') {
      console.log('进入了上拉加载')
      that.data.taskListParams.mission_time = that.data.taskList[(that.data.taskList.length - 1)].releaseTime
      that.data.taskListParams.listFlag = 2
      
      that.setData({
        taskListParams: that.data.taskListParams
      })
    }
    var url = app.utils.URL + '/f/api/mission/list'
    var data = that.data.taskListParams
    
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      console.log(res)
      wx.hideLoading()
      if (res.data.status == '0') {
        if (state == 'down') {
          var taskList = res.data.data.missions.concat(that.data.taskList)
          that.setData({
            taskList: taskList,   //任务列表
            listFlag: res.data.data.listFlag,   //当前页数
            updataTask: res.data.data.missions.length   //更新条数
          })
          wx.stopPullDownRefresh()
          app.wxToast({
            title: '更新了' + that.data.updataTask + '条任务'
          })
        } else if (state == 'up') {
          var taskList = that.data.taskList.concat(res.data.data.missions)
          that.setData({
            taskList: res.data.data.missions,   //任务列表
            listFlag: res.data.data.listFlag,   //当前页数
            updataTask: res.data.data.missions.length   //更新条数
          })
        } else {
          that.setData({
            taskList: res.data.data.missions,   //任务列表
            listFlag: res.data.data.listFlag,   //当前页数
            updataTask: res.data.data.missions.length   //更新条数
          })
        }
        
      } else {
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
    var that = this
    that.getTaskList('down')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.data.taskListParams.indexPage = that.data.taskListParams.indexPage
    that.setData({
      taskListParams: that.data.taskListParams.indexPage
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})