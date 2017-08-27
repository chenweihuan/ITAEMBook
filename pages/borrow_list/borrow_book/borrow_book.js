// pages/logined/logined.js
var bookUtil = require('../../../utils/util.js');
var app = getApp();

Page({
  data:{
    display:"",//是否显示登录的按钮
    display_book:"",//是否显示借书单
    borrow_list:"",//借书单内容
    return_list:"",//已还书本102
    out_list:"",//待借图书100
    no_list:"",//未还图书101和1001
    tomorrow_list:"",//预订单1000
    book_id:[],//借书单id的数组
    id_num:0,//借书总量
    money:"",//押金
    book_one:"",//借书单id
    book_two:"",

    // erweima:""//借书单二维码
    // add_unique_book_id:""//图书特有二维码返回的图书唯一id
      winWidth: 0, 
      winHeight: 0, 
  // tab切换 
  currentTab: 0, 
  btn_disolay:"",//确定借书是否显示
  dis_wuyong:"none"//是否显示失效宝贝

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.text_or();
    this.Load_noout();//提前更新未还图书
 
      var that = this; 
      // 获取系统信息 
      wx.getSystemInfo( { 
        success: function( res ) { 
          that.setData( { 
          winWidth: res.windowWidth, 
          winHeight: res.windowHeight 
          }); 
        } 
      }); 
 
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
      this.text_or();//判断是否登录和刷新借书单borrow_list
      //判断当前用户在哪一个表单栏上
       if(this.data.currentTab == 1){
      this.Load_tomorrow();
       this.setData({btn_disolay:""})
    }else if(this.data.currentTab == 2){
      this.Load_out();
       this.setData({btn_disolay:""})      
    }else if(this.data.currentTab == 3){
      this.Load_noout();
       this.setData({btn_disolay:""})
      
    }else if(this.data.currentTab == 4){
      this.Load_return();
       this.setData({btn_disolay:""})      
    }else{
      this.borrow_list();
      this.setData({btn_disolay:true})
    }
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  //判断是否登录，显示登录按钮
  text_or:function(){
      // var login_ma = app.globalData.login_ma;
        var phone= wx.getStorageSync('phone');
        // console.log(phone);
    if(phone){
        this.setData({display:"none",display_book:"block"});
        this.borrow_list();//刷新借书单
    }else{
       this.setData({display:"block",display_book:"none"})
    }
  },
     // 滑动切换tab 
   bindChange: function( e ) { 
    var that = this; 
  // console.log(e);
    that.setData( { currentTab: e.detail.current }); 
  // 判断用户现在在哪一个列表上
    if(e.detail.current == 1){
      that.Load_tomorrow();
       this.setData({btn_disolay:""})
      
    }else if(e.detail.current == 2){
      that.Load_out();
       this.setData({btn_disolay:""})
      
    }else if(e.detail.current == 3){
      that.Load_noout();
       this.setData({btn_disolay:""})
      
    }else if(e.detail.current == 4){
      that.Load_return();
       this.setData({btn_disolay:""})
      
    }else{
      that.borrow_list();
       this.setData({btn_disolay:true})
      
    }
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

  //跳转到验证码界面
  Login:function(){
      wx.navigateTo({
          url: '../../login/login'
      })  
  },
    // 图书详情
  detail:function(e){
    // console.log(e);
        // wx.setStorageSync('unique_book_id',e.currentTarget.id );
        app.globalData.unique_book_id = e.currentTarget.id;
        wx.navigateTo({
          url: '../../detail/detail'
    })
  },
  // 扫描二维码添加到借书单
  scan_erweima:function(){
    var that =this;
      wx.scanCode({
        success: (res) => {
         console.log(res);
          var unique_book_id_url = res.result;//图书特有二维码返回的url
          //  console.log(unique_book_id_url);
          wx.request({
              url: unique_book_id_url, 
              header: {
                  'content-type': 'application/json'
              },
              success: function(res) {
                console.log(res.data);
                var scan_unique_book_id = res.data;
                  wx.request({
                      url: 'https://www.aloneness.cn/library_5/getBookDetailsInfoByUniqueBookId?unique_book_id='+scan_unique_book_id, 
                      data: {
                       unique_book_id:scan_unique_book_id
                      },
                      header: {
                          'content-type': 'application/json'
                      },
                      success: function(res) {
                        console.log(res)
                        var showModalTitle = res.data.title;
                        var sure_unique_book_id = res.data.unique_book_id;
                         var phone= wx.getStorageSync('phone');
                        wx.showModal({
                          title: '提示',
                          content: '确定把'+showModalTitle+'加入借书单？',
                          success: function(res) {
                            if (res.confirm) {
                              console.log(phone);
                              console.log(sure_unique_book_id);
                            wx.request({//扫码完成后直接加入借书单
                    url: 'https://www.aloneness.cn/library_5/addToList?phone='+phone+'&unique_book_id='+sure_unique_book_id, 
                    data: {
                      phone:phone,
                      unique_book_id:sure_unique_book_id
                    },
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function(res) {
                      // console.log(res.data)
                      if(res.data == "001"){//扫码成功后
                            wx.showToast({
                                title: '成功加入借书单',
                                icon: 'success',
                                duration: 2000
                              })
                              that.borrow_list();
                      }else{
                          wx.showModal({//书单已经存在此书，不用重复添加
                              content: "借书单已经存在此书，请不要重复添加",
                              showCancel: false,
                              confirmText: "确定"
                            })
                      }
                    }
                  })
                            } else if (res.cancel) {
                              console.log('用户点击取消')
                            }
                          }
                        })
                      }
                    })
              }
            })
          
        } 
      })
  },

  // 刷新借书单
  borrow_list:function(){
         var that = this;
         var phone= wx.getStorageSync('phone');
        //  console.log(phone);
      // wx.request({
      //     url: 'http://www.aloneness.cn/library_5/getBookInfoList?phone='+phone, 
      //     data: {
      //     phone:phone
      //     },
      //     header: {
      //         'content-type': 'application/json'
      //     },
      //     success: function(res) {
      //       console.log(res);
      //       that.setData({borrow_list:res.data.bookListInfo});
      //           that.dis_wuyong();//必须在成功刷新borrow_list后才能执行
      //     }
      //   })
      
        var data = {phone:phone};
        var Url='https://www.aloneness.cn/library_5/getBookInfoList?phone='+phone;//搜索的url
        bookUtil.GetData(Url, data, function (res) {
              console.log(res);
               that.setData({borrow_list:res.data.bookListInfo});
               that.dis_wuyong();//必须在成功刷新borrow_list后才能执行
        }, function (res) {
        },
        function (res) {
        })
  },
  // 删除图书
    delete_book:function(e){
      var that =this;
      console.log(e);
      var unique_book_id = e.target.dataset.text;//获取自定义数据里面的图书唯一的id
      var phone= wx.getStorageSync('phone');
          wx.showModal({
            title: '提示',
            content: '确定删除？',
            success: function(res) {
              if (res.confirm) {
                 var data = {
                  phone:phone,
                  unique_book_id:unique_book_id
                  };
        var Url='https://www.aloneness.cn/library_5/deleteBookFromList?phone='+phone+'&unique_book_id='+unique_book_id;//搜索的url
        bookUtil.GetData(Url, data, function (res) {
                  if(res.data == "001"){//成功删除借书单的图书
        
        // 预防读者选中了图书之后，没有取消选中就删除图书
          var book_id = that.data.book_id;
          for(var i=0; i<book_id.length; i++) {//取消勾选之后删掉id
            if(book_id[i] == unique_book_id) {
              book_id.splice(i, 1);
              break;
            }
          }
           that.setData({book_id:book_id,id_num:--that.data.id_num});
         
        
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                      })
                    that.borrow_list();//删除图书之后更新借书单列表
              }else{
                  wx.showModal({//删除借书单图书失败
                      content: "删除失败",
                      showCancel: false,
                      confirmText: "确定"
                    })
              }
        }, function (res) {
        },
        function (res) {
        })
     
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

      
    },
  // 点击选择框
   checkboxChange: function(e) {
     console.log(e);
      var id_num = this.data.id_num;
      var id = e.target.dataset.text;
      var money = e.target.dataset.money;
            if(e.detail.value.length == 1){//选中之后length为1
          var book_id = this.data.book_id.concat(id); //为数组添加id
            this.setData({book_id:book_id,id_num:++id_num})
            this.setData({money:money})
      }else{
        var book_id = this.data.book_id;
         for(var i=0; i<book_id.length; i++) {//取消勾选之后删掉id
            if(book_id[i] == id) {
              book_id.splice(i, 1);
              break;
            }
          }
           this.setData({book_id:book_id,id_num:--id_num})
         
      }
   this.setData({book_one:book_id[0],book_two:book_id[1]});//更新所借的两本书的唯一id
 
    
  },
  // 学生确定无误之后确定借书
  sure_borrow:function(){
    var that =this;
 if(this.data.id_num >=3){//判断借书数目超过两本
           wx.showModal({
                    content: "抱歉，一次只能借两本书",
                    showCancel: false,
                    confirmText: "确定"
                  })
   }else if(this.data.id_num == 0){//读者没有选择书本
         wx.showModal({
                    content: "请选择需借书本",
                    showCancel: false,
                    confirmText: "确定"
                  })
   }
   else{//书本少于3
     if(that.data.no_list.length == 2){
          wx.showModal({
                    content: "抱歉，请归还图书后再借阅其他图书",
                    showCancel: false,
                    confirmText: "确定"
                  })
    }else{
      var phone= wx.getStorageSync('phone');
       console.log(phone);
       console.log(that.data.book_one);
       console.log(that.data.book_two);
        var data = {
                  phone:phone,
                  money:22.0,
                  unique_book_id1:that.data.book_one,
                  unique_book_id2:that.data.book_two
                  };
        var Url='https://www.aloneness.cn/library_5/lendBookDirect?phone='+phone+'&money=22.0&unique_book_id1='+that.data.book_one+'&unique_book_id2='+that.data.book_two;//搜索的url
        bookUtil.GetData(Url, data, function (res) {
              console.log(res);
              console.log(res.data);
              // that.setData({book_one:"",book_two:"",book_id:[]});//用完清空选择框
                   wx.setStorageSync('order_id',res.data);//缓存二维码地址的order_id 
                   wx.setStorageSync("lendORborrow", "0");//借书的时候lendORborrow为0
                   wx.navigateTo({
                        url: '../noLoad/noLoad'
                    })  
        }, function (res) {
        },
        function (res) {
        })
     
   }

    }
  
  },
  // 刷新已还图书
  Load_return:function(){
         var that = this;
         var phone= wx.getStorageSync('phone');
         var data = {phone:phone};
         var Url='https://www.aloneness.cn/library_5/showLendBookOrder?flag=102&phone='+phone;//搜索的url
        bookUtil.GetData(Url, data, function (res) {
              console.log(res);
              that.setData({return_list:res.data.lendBookOrders});
        }, function (res) {
        },
        function (res) {
        })
    
  },
    // 刷新待借图书
  Load_out:function(){
         var that = this;
         var phone= wx.getStorageSync('phone');
          var data = {
                  phone:phone
                  };
        var Url='https://www.aloneness.cn/library_5/showLendBookOrder?flag=100&phone='+phone;//搜索的url
        bookUtil.GetData(Url, data, function (res) {
              console.log(res);
              that.setData({out_list:res.data.lendBookOrders});
        }, function (res) {
        },
        function (res) {
        })
     
  },
  // 刷新未还图书
  Load_noout:function(){
           var that = this;
         var phone= wx.getStorageSync('phone');
        var data = {
                    phone:phone
                  };
        var Url='https://www.aloneness.cn/library_5/showLendBookOrder?flag=101&phone='+phone;//搜索的url
        bookUtil.GetData(Url, data, function (res) {
              console.log(res);
              that.setData({no_list:res.data.lendBookOrders});
        }, function (res) {
        },
        function (res) {
        })

   
  },
  // 刷新我的预订单
  Load_tomorrow:function(){
         var that = this;
         var phone= wx.getStorageSync('phone');
         var data = {phone:phone};
         var Url='https://www.aloneness.cn/library_5/showLendBookOrder?flag=1000&phone='+phone;//搜索的url
        bookUtil.GetData(Url, data, function (res) {
              console.log(res);
              that.setData({tomorrow_list:res.data.lendBookOrders});
        }, function (res) {
        },
        function (res) {
        })
     
  },
  // 预订单点击的详情
  borrow_erweima:function(e){
     
        app.globalData.order = e.target.dataset.order;
        // console.log(app.globalData.order);
        app.globalData.dis_tomorrow = true;//显示预约二维码按钮
        app.globalData.unique_book_id = e.currentTarget.id;
        console.log( app.globalData.unique_book_id);
        wx.navigateTo({
          url: '../../detail/detail'
    })
  },
  // 取消订单(包括预订单,和直接借书订单) flag 变为 103
  delete_order:function(e){
    console.log(e);
      var that =this;
      var unique_book_id1 = e.target.dataset.unique_book_id;
      var order_id = e.target.dataset.order;
      var data = {
                 order_id :order_id,
                  unique_book_id1 :unique_book_id1
                  };
        var Url='https://www.aloneness.cn/library_5/cancelLendBookOrder?order_id='+order_id+'&unique_book_id1='+unique_book_id1;//搜索的url
        bookUtil.GetData(Url, data, function (res) {
              console.log(res);
              // 成功删除之后刷新订单表
                       if(that.data.currentTab == 1){
                            that.Load_tomorrow();
                          }else{
                            that.Load_out();
                          }
                          wx.showToast({
                              title: '成功删除',
                              icon: 'success',
                              duration: 2000
                            })
        }, function (res) {
        },
        function (res) {
        })

     
  },
  // 是否显示失效的宝贝
  dis_wuyong:function(){
    var that = this;
        var borrow_list = that.data.borrow_list;
    for(var i = 0;i < borrow_list.length;i++){
      console.log(borrow_list[i].is_exist)
      // console.log(i);
        if(borrow_list[i].is_exist == 0){
          this.setData({dis_wuyong:"block"})
          break;
        }else{
           this.setData({dis_wuyong:"none"})
        }
    }
  }

})