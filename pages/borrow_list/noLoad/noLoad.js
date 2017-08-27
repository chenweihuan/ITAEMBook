
// pages/main/index.js
var QR = require("../../../utils/erweima.js");
Page({
  data:{
    maskHidden:true,
    imagePath:'',
    placeholder:'http://wxapp-union.com',//默认二维码生成文本
     VerifyCode:"发送验证码",//发送验证码和倒计时
     disabled: true,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

  },
  onReady:function(){
  	var size = this.setCanvasSize();//动态设置画布大小
    // var initUrl = this.data.placeholder;
    var time = Date.now();//获取当前时间
    var order_id= wx.getStorageSync('order_id');
    var initUrl = "#"+order_id+"&"+ time+'%';
    this.createQrCode(initUrl,"mycanvas",size.w,size.h);
    //验证码倒计时
      var total_micro_second = 60 * 1000;
      count_down(this, total_micro_second);
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
  //适配不同屏幕大小的canvas
  setCanvasSize:function(){
    var size={};
    try {
        var res = wx.getSystemInfoSync();
        var scale = 750/686;//不同屏幕下canvas的适配比例；设计稿是750宽
        var width = res.windowWidth/scale;
        var height = width;//canvas画布为正方形
        size.w = width;
        size.h = height;
      } catch (e) {
        // Do something when catch error
        console.log("获取设备信息失败"+e);
      } 
    return size;
  } ,
  createQrCode:function(url,canvasId,cavW,cavH){
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url,canvasId,cavW,cavH);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage:function(){
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log("********"+tempFilePath);
          that.setData({
              imagePath:tempFilePath,
          });
      },
      fail: function (res) {
          console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg:function(e){
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
          var tempFilePath = res.tempFilePath;
					wx.previewImage({
      			current: tempFilePath, // 当前显示图片的http链接
      			urls: [tempFilePath] // 需要预览的图片http链接列表
    			})
      },
      fail: function (res) {
          console.log(res);
      }
    });
    
  },
  // 二维码失效后更新二维码
  Load_erweima:function(){
    this.onReady();
    this.setData({disabled:true});
    wx.showToast({
        title: '更新成功',
        icon: 'success',
        duration: 2000
      })
  },
  // 支付押金
  Load_money:function(){
    wx.showModal({
        title: '提示',
        content: '该功能需要购买，尚未开发',
      })
  }

})

/* 毫秒级倒计时 */
function count_down(that, total_micro_second) {
  if (total_micro_second <= 0) {
    that.setData({
      disabled: false,
      VerifyCode: "二维码已过期，请重新刷新",

    });
    // timeout则跳出递归
    return;
  }
  // 渲染倒计时时钟
  that.setData({
    VerifyCode: "有效时间倒计时："+date_format(total_micro_second) + " 秒"
  });
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that, total_micro_second);
  }, 10)
}
// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
  return sec;
}
// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
