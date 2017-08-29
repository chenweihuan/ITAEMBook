//app.js

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // this.login_openid();//获取openid
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
 
  globalData:{
    userInfo:null,
    openid:null,
    unique_book_id:null,
    book_id:null,


    radiotype:"title",
    login_ma:true,//判断是否登录状态
    user_manager:null,//判断跳转到借书单（true）还是个人主页（false）
    res:null,
    phone:null,//当前登录的电话号码
    history:"block",//历史搜索记录
    dis_tomorrow:false,//是否显示预约单的二维码按钮
    order:"",//预约单的order
  }
})