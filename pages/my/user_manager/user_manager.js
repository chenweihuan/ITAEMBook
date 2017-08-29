// pages/user_manager/user_manager.js
var app = getApp();
Page({
  data:{
       display:"",//是否显示登录的按钮
       display_book:"",//是否显示个人信息
       userInfo: {},//用户信息
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.Login_or();
    this.onLoadUser();//获取用户信息
    this.manager_or();//判断管理员是否已经登录
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
     this.Login_or();
     this.manager_or();//判断管理员是否已经登录
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  //跳转到用户登录页面
  to_user:function(){
       //跳转到验证码界面
      wx.navigateTo({
          url: '../../login/login'
      })  
      app.globalData.user_manager = true;//准备跳转到个人中心
      // console.log(app.globalData.user_manager );
  },
  // //跳转管理员登录界面
  // to_manager:function(){
  //       wx.redirectTo({
  //         url: '../manager_login/manager_login'
  //     })  
  // },
   //判断是否已经登录
  Login_or:function(){
      var phone= wx.getStorageSync('phone');
    if(phone){
      this.setData({display:"none",display_book:"block"})
    }else{
         this.setData({display:"block",display_book:"none"})
    } 
  },
  // 判断管理员是否已经登录
  manager_or:function(){
         var manager= wx.getStorageSync('manager');
         var supermanager= wx.getStorageSync('supermanager');
        //  console.log(manager)
         if(manager){//如果管理猿已经登录，不用再次登录
            wx.navigateTo({
                url: '../manager/manager'
            })  
         }else if(supermanager){//如果超级管理猿已经登录，不用再次登录
           wx.navigateTo({
                url: '../user/user'
            })  
         }
  },
  //获取用户信息
    onLoadUser: function () {
    // console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      wx.setStorageSync("userName", userInfo.nickName)
      that.setData({
        userInfo:userInfo
      })
    })
  },
  // 获取我的还书二维码
  my_erweima:function(){
    wx.setStorageSync("lendORborrow", "1");//还书的时候lendORborrow为1
          wx.navigateTo({//跳转到我的二维码页
                        url: '../my_erweima/my_erweima'
                    })
  },
  // ITAEM猜
  read_day:function(){
        wx.navigateTo({//跳转到每日一读
                        url: '../read_day/read_day'
                    })
  },
  // 跳转到我的书愿单
  bookHopeMe:function(){
    wx.navigateTo({//跳转到还书提醒
      url: '../bookHopeMe/bookHopeMe'
    })
  },
  // 还书提醒
  warn_book:function(){
    wx.setStorageSync("lendORborrow", "1");//还书的时候lendORborrow为1
        wx.navigateTo({//跳转到还书提醒
                        url: '../warn_book/warn_book'
                    })
  },
  // 我的书评
  contentMe:function(){
    wx.navigateTo({//跳转到我写过的书评
      url: '../contentMe/contentMe'
    })
  },
  // 个人借阅图书年度统计
  summaryMe:function(){
    wx.navigateTo({//跳转到个人借阅图书年度统计
      url: '../summaryMe/summaryMe'
    })
  },
  // 跳转到想读
  wantLook:function(){
    wx.navigateTo({//跳转到想读
      url: '../wantLook/wantLook'
    })
  },
  // 退出登录
  downLogin:function(){
    app.globalData.login_ma = false;
     wx.removeStorageSync('phone');//用完之后就清空
       this.Login_or();
     app.globalData.history = "none";//不显示历史搜索记录
  }

})