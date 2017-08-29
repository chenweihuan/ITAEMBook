// pages/my/warn_book/warn_book.js
var bookUtil = require('../../../utils/util.js');
Page({
  data:{
    warn_list:""//未还的书本
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
        this.LoadReturn();
        console.log(options);
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
  // 更新还书提醒
  LoadReturn:function(){
    var that = this;
    var phone= wx.getStorageSync('phone');
    var data = {phone:phone};
        var Url='https://www.aloneness.cn/library_5/returnBooksRemind?phone='+phone;
        bookUtil.GetData(Url, data, function (res) {
              console.log(res);
               that.setData({warn_list:res.data});
        }, function (res) {
        },
        function (res) {
        })
   
  },
    // 跳转到借书二维码
  to_noLoad:function(e){
      console.log(e.target.dataset.order);
          wx.setStorageSync('order_id',e.target.dataset.order);//缓存二维码地址的order_id 
                   wx.navigateTo({
                        url: '../../borrow_list/noLoad/noLoad'
                    })  
  }
})