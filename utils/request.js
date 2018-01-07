export const request = (url, data, method, callback) => {
  method = method.toUpperCase()
  wx.request({
    url: url,
    data: data,
    method: method,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res)
      if (res.data.status == '401') {
        wx.showModal({
          title: 'token过期',
          content: '请重新登录',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        return typeof callback == "function" && callback(res)
      }
      
    },
    fail: function (err) {
      return typeof callback == "function" && callback(err)
    }
  })
}


export const URL = 'http://1t896460i2.iask.in'
