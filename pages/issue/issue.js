// pages/issue/issue.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realContentFocus: false,
    havePhone: false,
    array: [],
    index: 0,
    textareaHidden: true,
    switchChange: false,

    time: '默认12:00或者18:00',
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
    })
  },
  switchChange: function (e) {
    this.setData({
      switchChange: e.detail.value
    })
  },
  nameInput: function (e) {
    this.setData({
      nameValue: e.detail.value
    })
  },
  descInput: function (e) {
    this.setData({
      describe: e.detail.value
    })
  },
  realInput: function (e) {
    this.setData({
      realContent: e.detail.value
    })
  },
  addressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
    if (this.data.address) {
      this.setData({
        passAddress: true
      })
    }
  },
  priceInput: function (e) {
    this.setData({
      price: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  remarkInput: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  submit: function () {
    //验证手机号
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
          havePhone: false,
          textareaHidden: false
        })
      }
      if (that.data.havePhone) {
        if (!that.data.describe) {
          app.wxToast({
            title: '简介不能为空'
          })
        } else if (!(/^[0-9]+.?[0-9]*$/.test(that.data.price)) || parseInt(that.data.price) < 1) {
          app.wxToast({
            title: '赏金最低为1元'
          })
        } else if (!that.data.nameValue) {
          app.wxToast({
            title: '姓名不能为空'
          })
        } else if (!that.data.address) {
          app.wxToast({
            title: '地址不能为空'
          })
        } else if (!that.data.realContent) {
          wx.showModal({
            title: '详细信息未填写！',
            content: '立即去填写？',
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  realContentFocus: true
                })
              } else if (res.cancel) {
                that.setData({
                  realContentFocus: false
                })
                that.issue()
              }
            }
          })
        } else if (that.data.phone) {
          if (!(/^1[345678]\d{9}$/.test(that.data.phone))) {
            app.wxToast({
              title: '号码格式错误'
            })
          } else {
            that.issue()
          }
        } else {
          that.issue()
        }
      } else {
        that.powerDrawer('open')
      }

    })
  },
  //发布
  issue: function () {
    var that = this
    wx.showLoading({
      title: '发布中...',
      mask: true
    })
    var url = app.utils.URL + '/f/api/mission/add'
    var data = {
      description: that.data.describe,
      realContent: that.data.realContent,
      price: that.data.price,
      categoryId: that.data.array[that.data.index].id,
      address: that.data.address,
      remark: that.data.remark,
      realName: that.data.nameValue,
      phone: that.data.phone ? that.data.phone : '',
      userCompleteTime: that.data.time == '默认12:00或者18:00' ? '' : (that.data.year + '-' + that.data.month + '-' + that.data.day + ' ' + that.data.time + ':' + '00'),
      accesstoken: wx.getStorageSync('accesstoken')
    }
    console.log(data)
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      if (res.data.status == '0') {
        that.getPayInfo(res.data.data.missionId)
      } else {
        app.wxToast({
          title: '服务器内部错误'
        })
      }
    })
  },
  //取得支付信息 
  getPayInfo: function (missionId) {
    var url = app.utils.URL + '/f/api/receive/unifiedorder'
    var data = {
      missionId: missionId,
      accesstoken: wx.getStorageSync('accesstoken')
    }
    var that = this
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      wx.hideLoading()
      if (res.data.status == '0') {
        var result = res.data.data
        wx.requestPayment({
          'timeStamp': result.timeStamp,
          'nonceStr': result.nonceStr,
          'package': result.package,
          'signType': result.signType,
          'paySign': result.paySign,
          'success': function (res) {
            wx.navigateTo({
              url: '../success/success?text=恭喜您，发布成功!&catchtapText=返回首页',
            })
          },
          'fail': function (res) {
            if (res.errMsg == 'requestPayment:fail cancel') {
              var url = app.utils.URL + '/f/api/mission/cancelPay'
              var data = {
                payinfoId: result.payinfo_id,
                accesstoken: wx.getStorageSync('accesstoken')
              }
              app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
                if (res.data.status == '0') {
                  app.wxToast({
                    title: '取消支付成功'
                  })
                } else {
                  app.wxToast({
                    title: '服务器内部错误'
                  })
                }
              })
            } else {
              app.wxToast({
                title: '支付出错'
              })
            }
          }
        })
      }
    })

  },
  useCoupon: function () {
    wx.navigateTo({
      url: '../coupon/coupon',
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
            showModalStatus: false,
            textareaHidden: true
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
    console.log(e.detail.errMsg)
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
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
    } else {
      app.wxToast({
        title: '取消了授权！'
      })
    }
  },
  //获取类目
  getSubject: function () {
    wx.showLoading({
      title: '加载中...',
    })
    var url = app.utils.URL + '/f/api/category/list'
    var data = {
      accesstoken: wx.getStorageSync('accesstoken'),
    }
    var that = this
    console.log(data)
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      wx.hideLoading()
      var result = res.data.data.categories
      var arr = []
      var arrRang = []
      result.forEach(function (e) {
        var obj = {
          id: e.id,
          name: e.name
        }
        arr.push(obj)
        arrRang.push(e.name)
      })
      that.setData({
        array: arr,
        arrRang: arrRang
      })
    })
  },
  getYearMonthDay: function () {
    //获取完整的日期  
    var date = new Date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" + month : month);
    var day = date.getDate(); //获取当前日(1-31) 
    day = (day < 10 ? "0" + day : day);
    this.setData({
      year: year,
      month: month,
      day: day
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSubject()
    this.getYearMonthDay()
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