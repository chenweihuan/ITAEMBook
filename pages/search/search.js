var bookUtil = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
    inputVal:"",
    books:[1],
    hidden:true,//加载中。。。
    radiotype:"标题",
    array: ['标题', '作者', '索书号'],
    index:0,
    bindPickerChange:"title",
    book_detail:"",//图书详情
    dis_history:"block",//默认显示历史搜索记录
    history:{},//历史搜索记录
    more:""

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // console.log(options);
      this.Login_history();
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
     //获取搜索类型
   bindPickerChange: function(e) {
       console.log(this.data.array[e.detail.value]);
       this.setData({
        radiotype:this.data.array[e.detail.value],
        index:e.detail.value
        });

        // 判断radiotype的值，决定传什么给后台
       var radiotype = this.data.radiotype;
        if(radiotype == "标题"){
           this.setData({bindPickerChange:"title"});
        }else if(radiotype == "作者"){
           this.setData({bindPickerChange:"author"});
        }else{
              this.setData({bindPickerChange:"index_number"});
        }
  },
  //获取输入内容
    bindKeyInput:function(e){
      this.setData({inputVal:e.detail.value});
  },
  // 点击历史搜索记录进行搜索
  to_history:function(e){
    this.setData({inputVal:e.target.dataset.text});
    this.search();//点击后直接搜索
  },
 //搜索按钮事件
  search:function(){
    var that = this;
    var bindPickerChange = this.data.bindPickerChange;
    // console.log(radiotype);
     var this_phone= wx.getStorageSync('phone');//获取当前哪个电话号码登录了
    //  console.log(this_phone);
     var content =  that.data.inputVal;
     if(content == ""){//输入内容为空时
          wx.showModal({
                content: "输入内容不能为空，兄弟",
                showCancel: false,
                confirmText: "确定"
              })
     }else{
        that.setData({dis_history:"none",hidden:false});//不显示历史搜索记录
        var data = {
                  phone:this_phone,
                  search_type: bindPickerChange ,//搜索类型
                  search_content: that.data.inputVal//输入内容
                  };
                  // 192.168.2.159
        var Url ='https://www.aloneness.cn/library_5/search?phone='
        +app.globalData.phone+"&search_type="+bindPickerChange+
        "&search_content="+that.data.inputVal;//搜索的url
        bookUtil.GetData(Url, data, function (res) {
              console.log(res);
              var books = res.data.books; 
              bookUtil.processbooks(books);
              that.setData({books:books,hidden:true});
        }, function (res) {
        },
        function (res) {
        })
     }

     },
       // 图书详情
  detail:function(e){
        // wx.setStorageSync('bookId',e.currentTarget.id );
        app.globalData.book_id = e.currentTarget.id;
        wx.navigateTo({
          url: '../detail/detail'
    })
  },
    //  扫码功能
     // 扫isbn码
    isbn:function(){
      var that = this;
            wx.scanCode({
                success: function (res) {
                  console.log(res);
                if (res.result) {
              // 1.首先通过豆瓣API获取相对应的书名  
        var data = {};
        var Url='https://api.douban.com/v2/book/isbn/' + res.result;//搜索的url
        // bookUtil.GetData(Url, data, function (res) {
        //       console.log(res);
        //      var book = res.data;
        //      var title = book.title;
        //       // 2.通过书名获取book_id
        //           var data = {title:title};
        //           var Url='https://www.aloneness.cn/library_5/search?search_type=title&search_content='+title;//搜索的url
        //       bookUtil.GetData(Url, data, function (res) {
        //             console.log(res);
        //             app.globalData.book_id = res.data.books[0].book_id;//赋值给book_id
        //      //  3.跳转到详情页
        //             wx.navigateTo({
        //                           url: '../detail/detail'
        //                     })
                  
        //       }, function (res) {
        //       },
        //       function (res) {
        //       })
        // }, function (res) {
        // },
        // function (res) {
        // })

                  // 1.首先通过豆瓣API获取相对应的书名
                  wx.request({
                    url: 'https://api.douban.com/v2/book/isbn/' + res.result,
                    method: 'GET', 
                    success: function (res) {
                      console.log(res.data);
                      var book = res.data;
                      var title = book.title;
                      // 2.通过书名获取book_id
                      wx.request({
  url: 'http://www.aloneness.cn/library_5/search?search_type=title&search_content='+title, 
  data: {
     title:title
  },
  header: {
      'content-type': 'application/json'
  },
  success: function(res) {
    console.log(res);
    app.globalData.book_id = res.data.books[0].book_id;
    //  3.跳转到详情页
        wx.navigateTo({
                      url: '../detail/detail'
                })
  }
})
                    },
                    fail: function () {
                      console.log('douban error')
                    }
                  })
                }
              },
      })
    },
    //获取历史搜索记录
    Login_history:function(){
      var that = this;
      var this_phone= wx.getStorageSync('phone');//获取当前哪个电话号码登录了
      // console.log(this_phone);
        if(this_phone == ""|| that.data.history == " "){//用户没登录，然后就不显示历史搜索记录
        that.setData({dis_history:"none"});
      }
       var data = {
                  phone:this_phone
                  };
        var Url='https://www.aloneness.cn/library_5/getAllHistorySearch';//搜索的url
        bookUtil.GetData(Url, data, function (res) {
              console.log(res);
            that.setData({history:res.data});//缓存历史记录
            if(res.data.searchContent0 == null){
               that.setData({dis_history:"none"});
            }
        }, function (res) {
        },
        function (res) {
        })
     
    },
    // 清除历史搜索记录
    claer_history:function(){
          var that =this;
          var this_phone= wx.getStorageSync('phone');//获取当前哪个电话号码登录了

           var data = {
                 phone:this_phone
                  };
        var Url='https://www.aloneness.cn/library_5/deleteAllHistorySearch';//搜索的url
        bookUtil.GetData(Url, data, function (res) {
               console.log("成功清除历史记录");
               that.Login_history();
        }, function (res) {
        },
        function (res) {
        })

     
    },
    // 跳转到书愿单
    toBookHope:function(){
      wx.navigateTo({
        url: '../bookHope/bookHope'
      })
    }


})