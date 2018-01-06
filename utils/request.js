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
      if (res.data.success) {
        return typeof callback == "function" && callback(res)
      } else {
        
      }
      
    },
    fail: function (err) {
      return typeof callback == "function" && callback(err)
    }
  })
}

