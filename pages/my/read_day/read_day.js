// pages/my/read_day/read_day.js
var app = getApp();
var bookUtil = require('../../../utils/util.js');
Page({
  data:{
    read_day:"",
    // one_z_index:1000,//遮布的z-index
    // two_z_index:1001,//推荐图书的zz-index
    index:0,//频率选择器的index
    is_exise:false,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
     var is_exise = wx.getStorageSync('is_exise'); 
     this.setData({is_exise:is_exise});
    if(is_exise == false){
      this.LoadRead();
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  // 读者是否关闭推荐阅读
  switchChange:function(e){
    console.log(e);
    
    wx.setStorageSync('is_exise', !e.detail.value)
    var is_exise = wx.getStorageSync('is_exise'); 
    this.setData({is_exise:is_exise});
      if(is_exise == false){
      this.LoadRead();
    }
  },
    // 更新每日一读
  LoadRead:function(){
    var that = this;
    var phone= wx.getStorageSync('phone');
    var data = {phone:phone};
    var Url ='http://192.168.2.159/library_5/recommenBook?phone='+phone;//搜索的url
        bookUtil.GetData(Url, data, function (res) {
              console.log(res.data);
               that.setData({read_day:res.data});
        }, function (res) {
        },
        function (res) {
        })
   
  },
   detail:function(e){
        app.globalData.book_id = e.currentTarget.id;
        wx.navigateTo({
          url: '../../detail/detail'
    })
    }
})