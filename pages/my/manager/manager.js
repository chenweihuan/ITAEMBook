// pages/my/manager/manager.js
var app = getApp();
var bookUtil = require('../../../utils/util.js');
Page({
  data:{
    manager:"",//管理员名字
    dis_scan:"block",//是否显示扫描
    dis_luru:"none",//是否显示录入
    input_come_time:"",
    input_index_number:"1111",
    input_book_location:"5555",
    book_detail:"",//从豆瓣那里 录入书本的内容
    author: [], //字符串类型
    pubdate: "",
    image: "",
    pages: "",
    publisher: "",
    isbn13: "",
    title: "",
    summary: "",
    price: "",
    tag:[],//标签
    
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // this.text();
    this.to_manager();
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
      bindKeyInput_come_time:function(e){
      this.setData({input_come_time:e.detail.value});
  },   
       bindKeyInput_index_number:function(e){
      this.setData({input_index_number:e.detail.value});
  },
   bindKeyInput_book_location:function(e){
      this.setData({input_book_location:e.detail.value});
  },
  // 页面初始化，把管理员的姓名存好
  to_manager:function(){
         var manager= wx.getStorageSync('manager');
         this.setData({manager:manager})
  },
  //点击扫描isbn码录入图书信息
   // 扫isbn码

    isbn:function(){
      var that = this;
            wx.scanCode({
                success: function (res) {
                  // console.log(res);
                if (res.result) {
                  console.log(res.result);
                  wx.request({
                    url: 'https://api.douban.com/v2/book/isbn/' + res.result,
                    // url:'https://api.douban.com/v2/book/isbn/9787115226730',
                    method: 'GET', 
                    header: {
                      'content-type': 'json'
                    },
                    success: function (res) {
                      console.log(res);
                      var book_detail = res.data;
                      var tags = book_detail.tags;
                      console.log(tags);
                      var tag=[];
                      for(var i = 0;i<tags.length;i++){
                            tag = tag.concat(tags[i].name);
                      }
                      console.log(tag);
                      that.setData({book_detail:book_detail,dis_scan:"none",dis_luru:"block"});
                          var author = book_detail.author;
                       var pubdate = book_detail.pubdate;
                        var image = book_detail.image;
                         var pages = book_detail.pages;
                          var publisher = book_detail.publisher;
                           var isbn13 = book_detail.isbn13;
                            var summary = book_detail.summary;
                             var price = book_detail.price;
                                var title = book_detail.title;
                                 that.setData({
                                   author:author,
                                   pubdate:pubdate,
                                   image:image,
                                   pages:pages,
                                   publisher:publisher,
                                   isbn13:isbn13,
                                   summary:summary,
                                   price:price,
                                   title:title,
                                   tag:tag
                                   });
                    },
                    fail: function () {
                      console.log('扫isbn码失败')
                    }
                  })
                }
              },
      })
    },
    //管理员扫二维码确认读者借书
    erweima:function(){
              wx.scanCode({
          success: (res) => {
      //  #1493729791828&1493729797600%0
          var managerBook = res.result;
          var r = managerBook.replace(/(#.*?&)/g,'');//匹配order_id
           var time = r.replace(/(%.*?)/g,'')//获取二维码里面的时间
           var a = managerBook.replace(/(&.*?%)/g,'');
           var order_id = a.replace(/(#)/g,'');//匹配order_id
           var lendORborrow = managerBook.replace(/(#.*?%)/g, '');//匹配借书还是还书
           wx.setStorageSync("lendORborrow", lendORborrow);

           wx.setStorageSync('order_id',order_id);//缓存管理员验书的所需的order_id

            var order_id= wx.getStorageSync('order_id');
            console.log(order_id);
          //  console.log(order_id);
         var now_time = Date.now();//获取当前时间
           if(now_time - time < 600000){//有效期为10s，10s内扫码就成功
                    wx.showToast({
                        title: '扫码成功',
                        icon: 'success',
                        duration: 2000
                      })
                    wx.navigateTo({//跳转到管理员检验图书页面
                            url: '../managerBook/managerBook'
                         })  
           }else{
             wx.showModal({//二维码已经过期
                title: '提示',
                content: '二维码已过期。（有效期10s）',
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
           }
             
          }
        })
    },
    save_book:function(){
         // 图书开始录入
         var that =this;
         console.log(that.data.title);
          console.log(that.data.summary);
         console.log(that.data.input_index_number);
         console.log(that.data.input_book_location);         
      
                      wx.request({
                        url: 'http://192.168.2.159/library_5/saveBook', 
                            data: {
                                   author:that.data.author,
                                   pubdate:that.data.pubdate,
                                   image:that.data.image,
                                   pages:that.data.pages,
                                   publisher:that.data.publisher,
                                   isbn13:that.data.isbn13,
                                   summary:that.data.summary,
                                   price:that.data.price,
                                   title:that.data.title,
                                   index_number:that.data.input_index_number,
                                   book_location:that.data.input_book_location,
                                   tags:that.data.tag
                            },
                            method:"POST",
                            header: {
          "Content-Type": "application/x-www-form-urlencoded"
                            },
                            success: function(res) {
                              console.log(res.data);
                              if(res.data =="001"){
                                wx.showToast({
                                      title: '成功录入图书信息',
                                      icon: 'success',
                                      duration: 2000
                                    })
                                // 跳转页面回到管理员页面
                                // that.setData({dis_scan:"block",dis_luru:"none"})
                              }else{
                                  wx.showModal({
                                      content: "录入图书信息失败",
                                      showCancel: false,
                                      confirmText: "确定"
                                    })
                              }
                            },
                            fail:function(){
                              console.log("出错啦")
                            }
                          })
    },
    // 管理员退出登录
    out_manager:function(){
       wx.removeStorageSync('manager');//用完之后就清空管理员
       wx.switchTab({
         url: '../user_manager/user_manager',
       })
    },
    // 查看书愿单
    bookHope:function(){
      wx.navigateTo({//跳转到书愿单
        url: '../managerHope/managerHope'
      })  

    }

})

