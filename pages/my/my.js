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
      content: '退出后需重新登录',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('accesstoken')
          app.wxToast({
            title: '退出成功！'
          })
          setTimeout(function() {
            wx.switchTab({
              url: '../home/home',
            })
          }, 1000)
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
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var url = app.utils.URL + '/f/api/mission/countByMap'
    var data = {
      flag: flag,
      accesstoken: wx.getStorageSync('accesstoken')
    }
    var that = this
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      wx.hideLoading()
      console.log(res)
      if (res.data.status == '0') {
        that.setData({
          issueStatusInfo: res.data.data
        })
      }
    })
  },
  //悬赏历史
  toAllOrder: function(e) {
    var flag = e.currentTarget.dataset.flag
    var refund = e.currentTarget.dataset.refund
    console.log(refund)
    var history = (flag == 1 ? 1 : 2)
    if (refund) {
      var status = '5,6'
      history = 3
    } else {
      var status = '0,1,2,3,4,5,6'
    }
    
    wx.navigateTo({
      url: '../taskStatus/taskStatus?flag=' + flag + '&status=' + status + '&history=' + history,
    })
  },

  //我要反馈
  tickling: function() {
    this.powerDrawer('open')
  },
  // 自定义弹框
  powerDrawer: function (e) {
    if (e == 'open') {
      this.util(e)
    } else {
      var currentStatu = e.currentTarget.dataset.statu;
      this.util(currentStatu)
    }
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
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
    if (this.data.currentTab == 0) {
      this.getPersonInfo(1)
    } else {
      this.getPersonInfo(2)
    }
    
    
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