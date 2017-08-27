// pages/my/my_erweima/my_erweima.js
var bookUtil = require('../../../utils/util.js');
Page({
  data:{
    no_list:""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.Load_noout();
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
     this.Load_noout();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  // 刷新未还图书
  Load_noout:function(){
         var that = this;
         var phone= wx.getStorageSync('phone');
         var data = {phone:phone};
         var Url= 'https://www.aloneness.cn/library_5/showLendBookOrder?flag=101&phone='+phone;
        bookUtil.GetData(Url, data, function (res) {
              console.log(res);
              that.setData({no_list:res.data.lendBookOrders});
        }, function (res) {
        },
        function (res) {
        })
  },
  // 跳转到借书二维码
  to_noLoad:function(e){
      console.log(e);
          wx.setStorageSync('order_id',e.target.dataset.order);//缓存二维码地址的order_id 
                   wx.navigateTo({
                        url: '../../borrow_list/noLoad/noLoad'
                    })  
  }
})