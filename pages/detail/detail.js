// pages/detail/detail.js
var bookUtil = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
      book_detail:{},
      dis_unique_book_id:false,//确定是唯一id还是公共id
      location:"",//藏书地点
       windowHeight:"",
       windowWidth:"",
       index:0,
       unique_book_id:"",//图书唯一的id
       imgurl:"",//图书详情的图片
      //  height:"none",//选择器的显示与否
       date:"",//选择器的默认时间
       is_exist:"",//图书是否在馆
       introduction:"",//相关图书推荐
       dis_introduction:"flex",//显示推荐阅读
       token:"",
       form_id:"",
      //  detail_z_index:1000,
      //  choose_z_index:999,
       is_exise:false,
       dis_tomorrow:false,//是否显示预约单生成二维码按钮
       currentTab:0,//tab选项卡
       starNum:-1,//星星数量
       contentMe:"",//自己写的书评
      //  zan:false,//是否已经点赞
       contentItem:"还没有评论，快来占领沙发",//评论列表
       phone:"",//是否已经登录
       flag:"",//有没有借过此书本
   
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.LoadDis_tomorrow();
    this.loadDetail();

    // this.LoadToken();//拿到token
   
  },
  onReady:function(){
    // 页面渲染完成
   
  },
  onShow:function(){
    // 页面显示
    // console.log("显示页面");
    var phone = wx.getStorageSync("phone");
    this.setData({phone:phone});
    if (app.globalData.book_id && phone !== ""){//book_id和phone都存在的情况下
      console.log("没登录的用户")
      var bookId = app.globalData.book_id;
      var code = wx.getStorageSync("code");
      // console.log(code);
      wx.request({//让后台记录浏览信息
        url: 'http://192.168.2.159/library_5/browseBookDetail', 
        data: {
          book_id:app.globalData.book_id,
          code:code
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
        }
      })
    }

    // 获取设备的信息
     wx.getSystemInfo( {
      success: ( res ) => {
        this.setData( {
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
    // 获取用户的信息

  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  // moren:function(){
  //   console.log(111);
  //   console.log(this.data.location[0].unique_book_id);
  //   // this.setData({unique_book_id:this.data.location[0].unique_book_id})
  // },
  // 当选择器发生变化时，改变index和unique_book_id
     bindPickerChange: function(e) {
      //  console.log(e);
      this.setData({ index:e.detail.value});
      this.setData({unique_book_id:this.data.location[this.data.index].unique_book_id});//更新图书唯一的id
        // console.log(this.data.unique_book_id);
     },
    // 当选择器发生变化时，改变date
     bindDateChange:function(e){
        //  console.log(e);
          this.setData({ date:e.detail.value});
     },
    //  推荐阅读的图书详情
    load_introduction:function(e){
      // console.log(e.target.dataset.id);
        // wx.setStorageSync('bookId',e.target.dataset.id);
          app.globalData.book_id = e.target.dataset.id;
          this.loadDetail();
    },
    
    // 查看图书详情
    loadDetail:function(){
         // 获取当前时间作为默认时间
        var data = bookUtil.formatTime(new Date);
        this.setData({date:data});

      var that = this;
          var unique_book_id =  app.globalData.unique_book_id;
    //  console.log(unique_book_id);
       var bookId =  app.globalData.book_id;
    //  console.log(bookId);
    if(unique_book_id !== null){   //  如果读者点击的是借书栏等的图书详情
      // console.log(unique_book_id);
       var data = {
                  unique_book_id:unique_book_id
                  };
       var Url ='http://192.168.2.159/library_5/getBookDetailsInfoByUniqueBookId?unique_book_id='+unique_book_id;//搜索的url
        bookUtil.GetData(Url, data, function (res) {
              // console.log(res);
                that.setData({
                  dis_unique_book_id:true,
                  book_detail:res.data,
                  unique_book_id:res.data.unique_book_id,//图书唯一的id的默认值 
                  imgurl:that.data.book_detail.book_image//更新图书照片和图书是否在馆
                });
                 app.globalData.unique_book_id = null;                
        }, function (res) {
        },
        function (res) {
        })
             
    }else{//  如果读者点击的是搜索结果等的图书详情 
      // console.log(bookId);  
      var phone = wx.getStorageSync('phone');
       var data = {
                   book_id:bookId,
                   phone:phone
                  };
       var Url ='http://192.168.2.159/library_5/library_5/bookDetailsInfo?book_id='+bookId;//搜索的url
        bookUtil.GetData(Url, data, function (res) {
              console.log(res);
               that.setData({
                 book_detail:res.data,
                 location:res.data.uniqueBooks,
                 imgurl:that.data.book_detail.book_image,
               });   
        that.introduction();
        that.LoadBookContent();//加载书评
        }, function (res) {
        },
        function (res) {
        })  
      

    }
    },

  // 加入借书单
  add_book:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定把 '+ that.data.book_detail.title+' 加入借书单？',
      success: function(res) {
        if (res.confirm) {
                 var phone= wx.getStorageSync('phone');
     if(phone == ""){//如果用户没有登录，要先登录。
       wx.showModal({
            title: '提示',
            content: '还没有登录，马上登陆？',
            success: function(res) {
              if (res.confirm) {//点击确认键跳转到登录页面
                   wx.navigateTo({
                      url: '../login/login'
                  })  
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
     }else if(that.data.unique_book_id == ""){//用户还没有选择藏书地点
           wx.showModal({
            title: '提示',
            content: '请先选择书本藏书地点',
          })
     }
     
     else{
       if(that.data.location[that.data.index].is_exist == 0){//图书不在馆
             wx.showModal({
            title: '提示',
            content: '抱歉，该图书不在馆',
          })
     }else{
      //     console.log(phone);
      //  console.log(that.data.unique_book_id);       
       wx.request({
            url: 'https://www.aloneness.cn/library_5/addToList?phone='+phone+'&unique_book_id='+that.data.unique_book_id, 
            data: {
              phone:phone,
              unique_book_id:that.data.unique_book_id
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
              console.log(res);
              if(res.data == "001"){
                wx.showToast({
                    title: '成功加入借书单',
                    icon: 'success',
                    duration: 2000
                  })
              }else{
                       wx.showModal({
                          content: "已存在此书，请不要重复添加",
                          showCancel: false,
                          confirmText: "确定"
                        })
              }
            }
          })
     }

     
     }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 在线预订图书
  online_book:function(){
         var that = this;
         wx.showModal({
              title: '提示',
              content: '确定预约 '+ that.data.book_detail.title+' ？',
              success: function(res) {
                if (res.confirm) {
                       var phone= wx.getStorageSync('phone');
         var take_book_time = that.data.date + " 23:59:59";
        //  console.log(phone);
        //  console.log(that.data.unique_book_id);
        //  console.log(take_book_time);
       if(phone == ""){
              wx.showModal({
                  title: '提示',
                  content: '还没有登录，马上登陆？',
                  success: function(res) {
                    if (res.confirm) {
                           wx.navigateTo({
                                url: '../login/login'
                          })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
       } else if(that.data.unique_book_id == ""){//用户还没有选择藏书地点
           wx.showModal({
            title: '提示',
            content: '请先选择书本藏书地点',
          })
     }
       else{
         if(that.data.location[that.data.index].is_exist == 0){//图书余量为o的时候提醒是否推送有书可借信息
            wx.showModal({
                title: '提示',
                content: '该书在馆余量为0，当有书可借时是否推送信息给您？',
                success: function(res) {
                  if (res.confirm) {//用户点击确定发送token和formid给后台
                 
                  that.to_form();//传送token和form_id
                  wx.showToast({
                    title: '图书归还后，我们将发送服务通知给您',
                    icon: 'success',
                    duration: 2000
                  })
              
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
          }
          else{
                 wx.request({
            url: 'https://www.aloneness.cn/library_5/lendBookOnline?phone='+phone+'&unique_book_id1='+that.data.unique_book_id+'&take_book_time='+that.data.date,
            data: {
              phone:phone,
              unique_book_id1:that.data.unique_book_id,
              take_book_time:take_book_time
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
              console.log(res)
              if(res.data == "002"){//预订失败了
                    wx.showModal({
                        content: "抱歉，预定失败！",
                        showCancel: false,
                        confirmText: "确定"
                      })
              }else if(res.data == "003"){//没有藏书了
                  wx.showModal({
                      content: "抱歉，没有藏书了！当图书馆有书，我会通知您的",
                      showCancel: false,
                      confirmText: "确定"
                    })
              }else{//预订成功
                  wx.showToast({
                      title: '预订成功',
                      icon: 'success',
                      duration: 2000
                    })
              }
            }
          })
          }
              
       }
      
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
        

  },
  // 选择器

  sure_choose:function(){
     this.setData({is_exise:!this.data.is_exise});
  },
  // 相关图书推荐
  introduction:function(){
    var that = this;
    // console.log(that.data.book_detail.index_number);
    // console.log(that.data.book_detail.book_id);
    var url = 'http://192.168.2.159/library_5/getSimilarBooks?index_number='+that.data.book_detail.index_number+'&book_id='+that.data.book_detail.book_id;
    // console.log(url);
    var code = wx.getStorageSync("code")
    console.log(code);
    wx.request({

      url:'http://192.168.2.159/library_5/getSimilarBooks?index_number='+that.data.book_detail.index_number+'&book_id='+that.data.book_detail.book_id, 
          data: {
              index_number:that.data.book_detail.index_number,
              book_id:that.data.book_detail.book_id,
              open_id: code
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            // console.log(res.data)
            that.setData({introduction:res.data.books});
          }
        })
  },
  // 关闭推荐阅读
  close_introduction:function(){
    this.setData({dis_introduction:"none"});
    // console.log(111);
  },
    // 获取form_id
    formSubmit:function(e){
      var form_id = e.detail.formId;
      this.setData({form_id:e.detail.formId});
    },
    // 传token和form_id
    to_form:function(){
      var that =this;
      var phone= wx.getStorageSync('phone');
          // console.log(that.data.form_id);
          // console.log(that.data.token);
          // console.log(that.data.book_detail.book_id);
          // console.log(phone);
         wx.request({
          url: 'https://www.aloneness.cn/library_5/getFormIdAndToken?phone='+phone+'&form_id='+that.data.form_id+'&book_id='+that.data.book_detail.book_id, 
          data: {
            form_id:that.data.form_id,
            book_id:that.data.book_detail.book_id,
            phone:phone
          },
          method:"GET",
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            console.log(res)
          }
        })
    },
      // 预订单生成二维码
  borrow_erweima:function(e){
       var order_id = app.globalData.order;
      //  console.log(order_id);
        wx.setStorageSync('order_id',order_id);
        wx.setStorageSync("lendORborrow", "0");//借书的时候lendORborrow为0
         var order_id= wx.getStorageSync('order_id');
         console.log(order_id);
            wx.navigateTo({
                        url: '../borrow_list/noLoad/noLoad'
                    })  
  },
  //进入页面自动刷新是否显示预约单生成二维码按钮
  LoadDis_tomorrow:function(){
    this.setData({dis_tomorrow:app.globalData.dis_tomorrow})
    app.globalData.dis_tomorrow = false;//用完之后设置为false
  },

  // 简介，书评的tab选项卡
  swichNav:function(e){
    this.setData({
      currentTab: e.target.dataset.current
    })
    if (e.target.dataset.current == "2" || e.target.dataset.current == "1"){
      this.setData({
        dis_introduction:"none"
      })
    }else{
      this.setData({
        dis_introduction: "flex"
      })
    }
  },

  // 五星评价
  star:function(e){
    this.setData({
      starNum: e.target.dataset.star
    })
    // console.log(e.target.dataset.star)
  },
  // 写书评
  bindTextAreaBlur: function (e) {
    // console.log(e.detail.value)
    this.setData({
      contentMe: e.detail.value
    })
  },
  // 点赞和取消点赞
  clickZan:function(e){
    // console.log(this.data.zan);
    var that = this;
    var phone = wx.getStorageSync("phone");
    if (e.target.dataset.zan){//用户已经点赞,这里是取消点赞
      console.log("取消点赞");
      // console.log(e);
      console.log(e.target.dataset.goodid);
      console.log(e.target.dataset.reviewid);
      console.log(phone); 
      wx.request({
        url: 'http://192.168.2.159/library_5/cancleGood',
        data: {
          good_id: e.target.dataset.goodid,
          review_id: e.target.dataset.reviewid,
          phone:phone
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          if(res.data == "001"){//成功点赞
            that.LoadBookContent();//更新点赞的状态
          }else{//点赞失败

          }
    
        }
      })
    }else{//用户没有点赞，这里开始点赞
      console.log("开始点赞");
      wx.request({
        url: 'http://192.168.2.159/library_5/goodReview',
        data: {
          review_id: e.target.dataset.reviewid,
          phone: phone
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          that.LoadBookContent();//更新点赞的状态
        }
      })
    }
  },
  // 提交书评
  submitContent:function(){
    var that = this;

    var name = wx.getStorageSync("userName");
    var phone = wx.getStorageSync('phone');
    // console.log(this.data.starNum);
    // console.log(this.data.contentMe);
    // console.log(name);
    // console.log(that.data.book_detail.title);
    // console.log(app.globalData.book_id);

      wx.request({
        url: 'http://192.168.2.159/library_5/saveBookReview', //仅为示例，并非真实的接口地址
        data: {
          book_id: app.globalData.book_id,
          score: that.data.starNum,
          name:name,
          content: that.data.contentMe,
          phone:phone,
          book_name:that.data.book_detail.title
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
              if(res.data == "001"){
                wx.showToast({
                  title: '评论成功',
                  icon: 'success',
                  duration: 2000
                })
              }else{
                wx.showToast({
                  title: '评论失败',
                  image: '../img/warn.png',
                  duration: 2000
                })
              }
        }
      })
  },
  // 查看该书的书评
  LoadBookContent:function(){
      var  that =this;
      var phone = wx.getStorageSync("phone");
      // console.log(that.data.book_detail.book_id);
      wx.request({
        url: 'http://192.168.2.159/library_5/checkByBookId', 
        data: {
          book_id: that.data.book_detail.book_id,
          phone:phone
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          that.setData({contentItem:res.data})//更新所有评论
        }
      })
  },
  // 加入想看的书
  wantLook:function(){
    var that = this;
    var phone = wx.getStorageSync("phone");
    wx.showModal({
      title: '提示',
      content: '把 《' + this.data.book_detail.title + '》 加入想读计划',
      confirmText:"添加",
      success: function (res) {
        if (res.confirm) {//用户确定添加
          wx.request({
            url: 'http://192.168.2.159/library_5/wantToRead',
            data: {
              phone:phone,
              book_id: that.data.book_detail.book_id
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res)
              if(res.data == "001"){//成功添加
                wx.showToast({
                  title: '成功添加',
                  icon: 'success',
                  duration: 2000
                })
              }else{//添加失败
                wx.showToast({
                  title: '添加失败',
                  image: '../img/warn.png',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {//用户取消添加
       
        }
      }
    })
  }

})