// pages/detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonShow: '',
    buttonText: '',

    statusLightNum: '',   //状态亮的数量
    statusShow: '',
    firstStatusText: '',
    SecondStatusText: '',
    ThirdStatusText: '',
    cancelIcon: false
  },
  //获取任务详情
  getTaskDetail: function () {
    var flag = (this.data.flag == '1' ? '2' : '3')
    wx.showLoading({
      title: '加载中~',
    })
    var url = app.utils.URL + '/f/api/mission/detail'
    var data = {
      missionId: this.data.taskId,
      accesstoken: wx.getStorageSync('accesstoken'),
      flag: flag
    }
    console.log(data)
    var that = this
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      console.log(res)
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
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var taskId = options.taskId
    var flag = options.flag
    var status = options.status
    var des = options.des
    wx.setNavigationBarTitle({
      title: des + ' - ' + '详情'
    })
    var currStatus = flag + status
    if (currStatus == '16') {
      this.setData({
        buttonShow: false,
        statusLightNum: 3,
        statusShow: 3,
        firstStatusText: '发布中',
        SecondStatusText: '完成者',
        ThirdStatusText: '已取消',
        cancelIcon: true,
      })
    } else if (currStatus == '11') {
      this.setData({
        buttonShow: true,
        buttonText: '取消任务',
        statusLightNum: 1,
        statusShow: 3,
        firstStatusText: '发布中',
        SecondStatusText: '被抢了',
        ThirdStatusText: '已完成',
        cancelIcon: false
      })
    } else if (currStatus == '12') {
      this.setData({
        buttonShow: true,
        buttonText: '确认完成',
        statusLightNum: 2,
        statusShow: 3,
        firstStatusText: '发布中',
        SecondStatusText: '完成中',
        ThirdStatusText: '已完成',
        cancelIcon: false
      })
    } else if (currStatus == '14') {
      this.setData({
        buttonShow: false,
        statusLightNum: 3,
        statusShow: 3,
        firstStatusText: '发布中',
        SecondStatusText: '完成中',
        ThirdStatusText: '已完成',
        cancelIcon: false
      })
    } else if (currStatus == '25') {
      this.setData({
        buttonShow: false,
        statusLightNum: 2,
        statusShow: 2,
        firstStatusText: '发布中',
        SecondStatusText: '已取消',
        cancelIcon: true
      })
    } else if (currStatus == '22') {
      this.setData({
        buttonShow: true,
        buttonText: '任务完成',
        statusLightNum: 2,
        statusShow: 3,
        firstStatusText: '发布中',
        SecondStatusText: '完成中',
        ThirdStatusText: '已完成',
        cancelIcon: false
      })
    } else if (currStatus == '23') {
      this.setData({
        buttonShow: false,
        statusLightNum: 3,
        statusShow: 3,
        firstStatusText: '发布中',
        SecondStatusText: '完成中',
        ThirdStatusText: '待确认',
        cancelIcon: false
      })
    } else if (currStatus == '24') {
      this.setData({
        buttonShow: false,
        statusLightNum: 3,
        statusShow: 3,
        firstStatusText: '发布中',
        SecondStatusText: '完成中',
        ThirdStatusText: '已完成',
        cancelIcon: false
      })
    }
    this.setData({
      taskId: taskId,
      flag: flag
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