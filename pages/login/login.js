// pages/my/login/login.js
var bookUtil = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    // display_error:"block",//是否显示验证码错误字段
    inputVal_phone:"",//输入的电话内容
    inputVal_check:"",//输入验证码内容
    openid:"",
    code:"",//获取openid所需
  
  // tab切换 
      currentTab: 0, 
      winWidth: 0, 
      winHeight: 0, 

      VerifyCode:"发送验证码",//发送验证码和倒计时
      disabled: false,

       bindKeyInput_username:"",//管理员用户名
       bindKeyInput_password:"",//管理员的密码
   
       tag_one: [{ tag: '古代文学', index: '1', active: false },
       { tag: '言情小说', index: '2', active: false },
       { tag: 'IT编程', index: '3', active: false }],
       tag_two: [{ tag: '航空航天', index: '4', active: false },
       { tag: '外语外文', index: '5', active: false },
       { tag: '哲学', index: '6', active: false }],
       tag_three: [{ tag: '工业技术', index: '7', active: false },
       { tag: '军事', index: '8', active: false },
       { tag: '户外运动', index: '9', active: false }],
        tag_four:[],
        tag:[],//选中的标签
        addTagValue:"",//添加自定义标签的默认内容
        disTag:"none",

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
     // 获取系统信息 
     var that =this;
      this.login_openid();//获取code       
      wx.getSystemInfo( { 
      success: function( res ) { 
        that.setData( { 
        winWidth: res.windowWidth, 
        winHeight: res.windowHeight 
        }); 
      } 
      }); 
      this.onLoadUser();//获取用户信息
  },
  onReady:function(){
    // 页面渲染完成
    // this.onLoadUser();
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
    // 滑动切换tab 
   bindChange: function( e ) { 
    var that = this; 
  // console.log(e);
    that.setData( { currentTab: e.detail.current }); 
  },
   // 点击tab切换 
   swichNav: function( e ) { 
    var that = this; 
    if( this.data.currentTab === e.target.dataset.current ) { 
     return false; 
    }else{ 
     that.setData( { 
      currentTab: e.target.dataset.current 
     }) 
    } 
   } ,


  //获取输入的电话内容
      bindKeyInput_phone:function(e){
      // console.log(e);
      this.setData({inputVal_phone:e.detail.value});
  },
      //获取输入验证码内容
    bindKeyInput_check:function(e){
      // console.log(e);
      this.setData({inputVal_check:e.detail.value});
  },
  //发送验证码
Loadcheck:function(){
     var that = this;
       console.log(that.data.inputVal_phone);
        var data = {
                  phone:that.data.inputVal_phone
                  };
        var Url='https://www.aloneness.cn/library_5/register';//搜索的url
        bookUtil.PostData(Url, data, function (res) {
              console.log(res);
        }, function (res) {
        },
        function (res) {
        })
   
},
// 获取openid
    login_openid:function(){
      var that =this;
        wx.login({
          success: function(res){
            var code = res.code;
            that.setData({code:code});
            wx.setStorageSync('code', code);//缓存openid
          }
        })
    },
//  检验验证码
  Loadphone:function(){
    var that = this;
      //发送请求
      console.log(that.data.inputVal_check);
      var openid = this.data.openid;
      console.log(that.data.code);
      console.log(that.data.inputVal_phone);
    wx.request({
      url: 'http://192.168.2.159/library_5/check', 
        data: {
           phone:that.data.inputVal_phone,
           userCheckCode:that.data.inputVal_check,
           code:that.data.code
        },
        method:"POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
        console.log(res.data);
        //成功登陆后
        if(res.data == "001"){
            wx.setStorageSync('phone',that.data.inputVal_phone);//缓存登录的手机号码
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面
            })
       
        } else if (res.data == "003"){
            wx.setStorageSync('phone', that.data.inputVal_phone);//缓存登录的手机号码
            that.setData({ disTag:"block"})
        }
        else{
          if(res.statusCode == "500"){
            wx.showModal({
              content: "服务器出错，正在修复中...",
              showCancel: false,
              confirmText: "确定"
            })
          }else{
            // console.log("注册失败");
            // that.setData({display_error:"block"});
            //显示验证码错误
            wx.showModal({
              content: "验证码错误，咋回事呀？",
              showCancel: false,
              confirmText: "确定"
            })
          }
       
          
         }
        },
        fail:function(){
            console.log("请求出错");
        }
      })
  },
// 发送验证码和倒计时
  setVerify: function (e) {//发送验证码
  var inputVal_phone = this.data.inputVal_phone;//用户输入的电话号码
  if(inputVal_phone == ""){
             wx.showModal({//手机号码为空时
                content: "手机号码不能为空",
                showCancel: false,
                confirmText: "确定"
              })
  }
  else if (!(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(inputVal_phone)))
  // else if(!(/^1[3|5][0-9]\d{4,8}$/.test(inputVal_phone)))
  {
            wx.showModal({//错误的电话号码格式时
                content: "请输入正确的电话号码",
                showCancel: false,
                confirmText: "确定"
              })
  }
  else{
    console.log("ok");
          this.setData({disabled: !this.data.disabled});
          this.Loadcheck();//发送验证码
           var linkTel = this.data.linkTel;
           var _Url = "申请下发短信的地址";
           var total_micro_second = 60 * 1000;
         //验证码倒计时
          count_down(this, total_micro_second);
  } 
},
  //管理员登录成功后跳转页面
  LoadManager:function(){
    var that = this;
            wx.request({
                  url: 'https://www.aloneness.cn/library_5/checkAdministrator',
                  data: {
                  account:that.data.bindKeyInput_username,
                  password:that.data.bindKeyInput_password
                  },
                  method:"POST",
                  header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                  },
                  success: function(res) {
                    console.log(res);
                    if(res.data == "100"){
                       wx.setStorageSync('manager',that.data.bindKeyInput_username);//缓存登录的管理员用户名
                           wx.redirectTo({//成功跳转管理员页面
                              url: '../my/manager/manager'
                          })
                    }else if(res.data == "101"){
                       wx.setStorageSync('supermanager',that.data.bindKeyInput_username);//缓存登录的超级管理员用户名
                           wx.redirectTo({//成功跳转超级管理员页面
                              url: '../my/user/user'
                          })
                    }else if(res.data == "002"){
                  wx.showModal({//失败弹窗
                      content: "没有该管理员",
                      showCancel: false,
                      confirmText: "确定"
                    })
                    }
                    else{
                      wx.showModal({//失败弹窗
                            content: "密码错误，你是管理员吗？",
                            showCancel: false,
                            confirmText: "确定"
                          })
                    }
   
                  },
                  fail:function(){
                      console.log("请求出错");
                  }
                })

  },
   // 获取管理员输入框内容
  bindKeyInput_username:function(e){
    this.setData({bindKeyInput_username:e.detail.value})
  },
   bindKeyInput_password:function(e){
    this.setData({bindKeyInput_password:e.detail.value})
  },
  // 点击标签
   choose_tap:function(e){
    //  console.log(e.target.dataset.index);
    //  console.log(e.target.dataset.tag);  
     var tag_one = this.data.tag_one;
     var tag_two = this.data.tag_two;
     var tag_three = this.data.tag_three;
    var add = true;   
    var tag = this.data.tag;
    if (tag.length >= 5 && !e.target.dataset.click ){//选择标签不能超过5个
        // console.log("不能选太多");
        wx.showToast({
          title: '不能超过5个',
          image:'../img/warn.png',
          duration: 2000
        })
    }else{
      for (var i = 0; i < tag.length; i++) {//取消标签
        if (tag[i] == e.target.dataset.tag) {
          tag.splice(i, 1);
          var add = false;
          break;
        }
      }
      if (add) { tag = tag.concat(e.target.dataset.tag); }//添加标签
      this.setData({ tag: tag });

      //标签的背景颜色
      if (e.target.dataset.index < 4) {
        tag_one[e.target.dataset.index - 1].active = !tag_one[e.target.dataset.index - 1].active;
        this.setData({ tag_one: tag_one });
      } else if (e.target.dataset.index > 6) {
        tag_three[e.target.dataset.index - 7].active = !tag_three[e.target.dataset.index - 7].active;
        this.setData({ tag_three: tag_three });
      } else {
        tag_two[e.target.dataset.index - 4].active = !tag_two[e.target.dataset.index - 4].active;
        this.setData({ tag_two: tag_two });
      }
    }

    },
    // 添加自定义标签
   add_tag:function(e){
      // console.log(e.detail.value);
      var tag_four = this.data.tag_four;
      var tag = this.data.tag;
      if (tag.length >= 5){//超过5个标签后不能添加
        wx.showToast({
          title: '不能超过5个',
          image: '../img/warn.png',
          duration: 2000
        })
      }else{//添加标签给数组
        tag_four = tag_four.concat({ tag: e.detail.value, active: true });
        tag = tag.concat(e.detail.value);
        this.setData({ tag_four: tag_four, tag: tag })
      }
      this.setData({ addTagValue:''});
      console.log(tag);
   },
  //  删除自定义标签
   detele_tap:function(e){
     console.log(e.target.dataset.tag)
     var tag = this.data.tag;
     var tag_four = this.data.tag_four;
     for (var i = 0; i < tag.length; i++) {//取消标签
       if (tag[i] == e.target.dataset.tag) {
         tag.splice(i, 1);
         break;
       }
     }
     for (var i = 0; i < tag_four.length; i++) {//取消标签
       if (tag_four[i].tag == e.target.dataset.tag) {
         tag_four.splice(i, 1);
         break;
       }
     }
     this.setData({ tag: tag, tag_four: tag_four})
   },
  //  保存标签
   saveTag:function(){
     var that = this; 
      wx.request({
        url: 'http://192.168.2.159/library_5/saveUserTag',
        data: {
          code: that.data.code,
          care_keyword: that.data.tag
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          if(res.data == '001'){
            that.setData({ disTag: "none" });
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面
            });
            wx.showToast({
              title: '成功保存',
              icon: 'success',
              duration: 2000
            });
          }
        }
      })
   },
   //获取用户信息
   onLoadUser: function () {
     // console.log('onLoad')
     var that = this
     //调用应用实例的方法获取全局数据
     app.getUserInfo(function (userInfo) {
       //更新数据
       wx.setStorageSync("userName", userInfo.nickName)
     })
   },




})

/* 毫秒级倒计时 */
function count_down(that, total_micro_second) {
  if (total_micro_second <= 0) {
    that.setData({
      disabled: false,
      VerifyCode: "重新发送",
    
    });
    // timeout则跳出递归
    return;
  }
  // 渲染倒计时时钟
  that.setData({
    VerifyCode: "已发送"+date_format(total_micro_second) + " 秒"
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