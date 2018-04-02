// pages/taskStatus/taskStatus.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRefresh: true,
    index: 1,
    taskList: [],
    show: false,
    school: wx.getStorageSync('school')
  },
  getTaskStatus: function (flag, status, index) {
    wx.showLoading({
      title: '加载中~',
    })
    var that = this
    if (flag == 1 && status == 6) {
      status = '0,5,6'
    }
    if (flag == 2 && status == 5) {
      status = '0,5'
    }

    var data = {
      flag: flag,
      status: status,
      index: index,
      accesstoken: wx.getStorageSync('accesstoken')
    }
    console.log(data)
    var url = app.utils.URL + '/f/api/mission/listByMap'
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      setTimeout(function () {
        wx.hideLoading()
        if (res.data.status == '0') {
          that.setData({
            taskList: that.data.taskList.concat(res.data.data.values),
            show: true,
            currRefreshList: res.data.data.values
          })
        }
      }, 600)
    })
  },
  //进入任务详情
  toDetail: function (e) {
    var taskId = e.currentTarget.dataset.id
    var currIndex = e.currentTarget.dataset.index
    var flag = this.data.flag
    var status = this.data.taskList[currIndex].status
    var des = this.data.taskList[currIndex].des
    wx.navigateTo({
      url: '../personTaskDetail/personTaskDetail?taskId=' + taskId + '&flag=' + flag + '&status=' + status + '&des=' + des,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var flag = options.flag
    var status = options.status
    this.setData({
      flag: flag,
      status: status
    })
    if (options.history) {
      var title = options.history == 1 ? '发布历史' : (options.history == 2 ? '接取历史' : '退款中心') 
      wx.setNavigationBarTitle({
        title: title
      })
    } else {
      var statustext = options.statustext
      var title = (flag == 1 ? '我的发布' : '我的接取') + ' - ' + statustext
      wx.setNavigationBarTitle({
        title: title
      })
    }
    
    this.getTaskStatus(this.data.flag, this.data.status, this.data.index)
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
    if (this.data.currRefreshList.length < 6) {
      this.setData({
        isRefresh: false
      })
    }
    if (this.data.isRefresh) {
      this.setData({
        index: parseInt(this.data.index) + 1
      })
      this.getTaskStatus(this.data.flag, this.data.status, this.data.index)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})