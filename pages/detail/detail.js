// pages/detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    like: false,
    likeNum: 0,
    isComment: true
  },
  comment: function() {
    if (this.data.isComment) {
      this.setData({
        isComment: false
      })
    }
  },
  close: function() {
    if (!this.data.isComment) {
      this.setData({
        isComment: true
      })
    }
  },
  isLike: function() {
    if (!this.data.like) {
      this.setData({
        like: true,
        likeNum: parseInt(this.data.likeNum) + 1
      })
    } else {
      this.setData({
        like: false,
        likeNum: parseInt(this.data.likeNum) - 1
      })
    }
  },
  //获取任务详情
  getTaskDetail: function() {
    wx.showLoading({
      title: '加载中~',
    })
    var url = app.utils.URL + '/f/api/mission/detail'
    var data = {
      missionId: this.data.taskId,
      accesstoken: wx.getStorageSync('accesstoken'),
      flag: 1
    }
    var that = this
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      setTimeout(function () {
        wx.hideLoading()
        if (res.data.status == '0') {
          that.setData({
            taskInfo: res.data.data
          })
        } else {
          app.wxToast({
            title: '服务器内部错误'
          })
        }
      }, 1000)
    })
  },
  //接单
  receiving: function() {
    var that = this
    wx.showModal({
      title: '可赚赏金：￥' + that.data.taskInfo.price,
      content: '接单后请及时完成哈~',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '接取中~',
          })
          var url = app.utils.URL + '/f/api/mission/receive'
          var data = {
            missionId: that.data.taskId,
            accesstoken: wx.getStorageSync('accesstoken')
          }
          app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
            wx.hideLoading()
            if (res.data.status == '0') {
              that.data.taskInfo.status = '2'
              that.setData({
                taskInfo: that.data.taskInfo
              })
              app.wxToast({
                title: '接取成功'
              })
            }
          })
        } else if (res.cancel) {
          return
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var taskId = options.taskId
    console.log(taskId)
    this.setData({
      taskId: taskId
    })
    //获取任务详情
    this.getTaskDetail()
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