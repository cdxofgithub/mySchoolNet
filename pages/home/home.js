// pages/home/home.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // slider: [{
    //   picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000000rVobR3xG73f.jpg'
    // },
    // {
    //   picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000000j6Tax0WLWhD.jpg'
    // },
    // {
    //   picUrl: 'http://y.gtimg.cn/music/photo_new/T003R720x288M000000a4LLK2VXxvj.jpg'
    // }],
    slider: [
      {
        picUrl: '../../images/banner-1.png',
      },
      {
        picUrl: '../../images/banner-2.png',
      },
    ],
    swiperCurrent: 0,
    taskListParams: {
      listFlag: 1, // 1刷新，2加
      mission_time: ''
    },
    tips: true,
    isRefresh: true,
    firstLoad: true   // 第一次加载
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
    // wx.navigateTo({
    //   url: '../reward/reward',
    // })
    app.wxToast({
      title: '正在施工中...'
    })
  },
  //关闭tips
  closeTip: function() {
    this.setData({
      tips: false
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
      // that.data.taskListParams.mission_time = that.data.taskList[0].releaseTime
      // that.data.taskListParams.listFlag = 1
      // that.setData({
      //   taskListParams: that.data.taskListParams
      // })
      that.data.taskListParams.mission_time = '',
        that.data.taskListParams.listFlag = 1
    } else if (state == 'up') {
      that.data.taskListParams.mission_time = that.data.taskList[(that.data.taskList.length - 1)].releaseTime
      that.data.taskListParams.listFlag = 2
      that.setData({
        taskListParams: that.data.taskListParams
      })
    } else {
      that.data.taskListParams.mission_time = '',
        that.data.taskListParams.listFlag = 1
    }
    var data = that.data.taskListParams
    var url = app.utils.URL + '/f/api/mission/list'
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      //延迟loading
      setTimeout(function () {
        wx.hideLoading()
        if (res.data.status == '0') {
          if (state == 'down') {
            // var taskList = res.data.data.missions.concat(that.data.taskList)
            // that.setData({
            //   taskList: taskList, //任务列表
            //   updataTask: res.data.data.missions.length //更新条数
            // })
            // wx.stopPullDownRefresh()
            // app.wxToast({
            //   title: '更新了' + that.data.updataTask + '条任务',
            //   tapClose: true,
            //   duration: 800,
            //   tapClose: true
            // })
            that.setData({
              taskList: res.data.data.missions, //任务列表
              updataTask: res.data.data.missions.length, //更新条数
              isRefresh: true,
              firstLoad: true
            })
            wx.stopPullDownRefresh()
            app.wxToast({
              title: '刷新成功',
              tapClose: true,
              duration: 800,
              tapClose: true
            })
          } else if (state == 'up') {
            var result = res.data.data.missions
            var taskList = that.data.taskList.concat(result)
            that.setData({
              taskList: taskList, //任务列表
              updataTask: res.data.data.missions.length //更新条数
            })
            if (result.length < 6) {
              that.setData({
                isRefresh: false
              })
            }
            app.wxToast({
              title: '加载了' + that.data.updataTask + '条任务',
              tapClose: true,
              duration: 800,
              tapClose: true
            })
          } else {
            that.setData({
              taskList: res.data.data.missions, //任务列表
              updataTask: res.data.data.missions.length //更新条数
            })
          }
        }
      }, 600)

    })
  },
  //进入任务详情
  toDetail: function (e) {
    var currIndex = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../detail/detail?taskId=' + currIndex
    })
  },
  // 检测授权状态
  checkSettingStatu: function (cb) {
    // 是否为空对象
    function isEmptyObject(e) {
      var t;
      for (t in e)
        return !1;
      return !0
    }
    var that = this;
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function success(res) {
        console.log(res.authSetting);
        var authSetting = res.authSetting;
        if (isEmptyObject(authSetting)) {
          console.log('首次授权');
        } else {
          console.log('不是第一次授权', authSetting);
          // 没有授权的提醒
          if (authSetting['scope.userInfo'] == false) {
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用校园小叮当的服务功能，请按确定并在授权管理中选中“用户信息”，最后再重新进入小程序即可正常使用。',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.openSetting({
                    success: function success(res) {
                      console.log('openSetting success', res.authSetting);
                    }
                  });
                }
              },
              fail: function() {
                return
              }
            })
          }
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用应用实例的方法获取全局数据
    wx.getUserInfo(function (userInfo) {
      //更新用户数据
      this.setData({
        userInfo: userInfo
      })
    });
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
      this.checkSettingStatu()
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
    if (this.data.firstLoad) {
      if (this.data.taskList.length < 6) {
        this.setData({
          firstLoad: false,
          isRefresh: false
        })
        return
      }
    }
    if (this.data.isRefresh) {
      var that = this
      that.getTaskList('up')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})