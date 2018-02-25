// pages/detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   * 
   */
  data: {
    like: false,
    likeNum: 0,
    isComment: true,
    showModalStatus: false
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
        likeNum: parseInt(this0.da10a.likeNum) + 1

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
    var url = app.utils.URL + '/f/api/user/checkPhone'
    var data = {
      accesstoken: wx.getStorageSync('accesstoken')
    }

    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      console.log(res)
      if (res.data.status == '0') {
        that.setData({
          havePhone: true
        })
      } else if (res.data.status == '009') {
        that.setData({
          havePhone: false
        })
      }
      console.log(typeof that.data.havePhone)
      if (that.data.havePhone) {
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
      } else {
        that.powerDrawer('open')
      }
    }) 
    
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

  getPhoneNumber: function (e) {
    // console.log(e.detail.errMsg)
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData)
    var url = app.utils.URL + '/f/api/user/updatePhone'
    var data = {
      accesstoken: wx.getStorageSync('accesstoken'),
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }
    var that = this
    console.log(data)
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      console.log(res)
      if (res.data.status == '0') {
        that.setData({
          havePhone: true
        })
        app.wxToast({
          title: '号码绑定成功！'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var taskId = options.taskId
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