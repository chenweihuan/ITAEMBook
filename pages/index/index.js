var bookUtil = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
        array: [
                        [
                           { 
                          text: '工业技术',
                          id:"00",
                            docu:"T",
                            src: '../img/24580194416930757.png'
                        },
                          {
                             text: '天文学',
                             id:"01",
                               docu:"P",
                               src: '../img/452335044550080584.png'
                          },  { 
                            text: '生物科学',
                            id:"02",
                              docu:"Q",
                              src: '../img/733962381632237162.png'
                          },  { 
                      text: '社会科学',
                         id:"03",
                           docu:"C",
                           src: '../img/196289721070695780.png'
                    }, { 
                      text: '军事',
                       id:"04",
                         docu:"E",
              src: 'https://www.aloneness.cn/images/libraryImages/Expression_9.png'
                    },
                        {
                      text: '经济',
                       id:"05",
                         docu:"F",
                     src: 'https://www.aloneness.cn/images/libraryImages/Expression_12.png'
                    },  { 
                      text: '文化',
                       id:"06",
                         docu:"G",
               src: 'https://www.aloneness.cn/images/libraryImages/Expression_13.png'
                    },  { 
                      text: '语言',
                        id:"07",
                          docu:"H",
                  src: 'https://www.aloneness.cn/images/libraryImages/Expression_15.png'
                    }]

              ,  
                       [{
                            text: '文学',
                              id:"10",
                                docu:"I",
                         src: 'https://www.aloneness.cn/images/libraryImages/Expression_17.png'
                          },  { 
                            text: '艺术',
                             id:"11",
                               docu:"J",
                          src: 'https://www.aloneness.cn/images/libraryImages/Expression_19.png'
                          },  { 
                            text: '历史地理',
                             id:"12",
                               docu:"K",
                        src: 'https://www.aloneness.cn/images/libraryImages/Expression_20.png'
                          }, { 
                            text: '自然科学',
                            id:"13",
                              docu:"N",
                    src: 'https://www.aloneness.cn/images/libraryImages/Expression_21.png'
                    }, { 
                            text: '化学',
                            id:"14",
                              docu:"O",
                           src: 'https://www.aloneness.cn/images/libraryImages/Expression_22.png'
                    },
                               {
                      text: '马克思',
                      docu:"A",
                      id:"15",
                      src: 'https://www.aloneness.cn/images/libraryImages/Expression_1.png'
                    },  { 
                      text: '哲学',
                        id:"16",
                        docu:"B",
                     src: 'https://www.aloneness.cn/images/libraryImages/Expression_4.png'
                    },  { 
                              text: '医学',
                              id:"17",
                                docu:"R",
                             src: 'https://www.aloneness.cn/images/libraryImages/Expression_27.png'
                          }]
              ,  
                      [{
                          text: '农业科学',
                          id:"20",
                            docu:"S",
                        src: 'https://www.aloneness.cn/images/libraryImages/Expression_28.png'
                        },  { 
                      text: '政治 ',
                        id:"21",
                          docu:"D",
                   src: 'https://www.aloneness.cn/images/libraryImages/Expression_7.png'
                    }, { 
                          text: '交通运输',
                          id:"22",
                            docu:"U",
                        src: 'https://www.aloneness.cn/images/libraryImages/Expression_32.png'
                        }, { 
                          text: '航空',
                          id:"23",
                            docu:"V",
                      src: 'https://www.aloneness.cn/images/libraryImages/Expression_33.png'
                    }, { 
                          text: '科学',
                          id:"24",
                            docu:"X",
                       src: 'https://www.aloneness.cn/images/libraryImages/Expression_34.png'
                    },
                              {
                          text: '综合类',
                          id:"25",
                            docu:"Z",
                         src: 'https://www.aloneness.cn/images/libraryImages/Expression_36.png'
                        }]
              ],
   
        books:[],
        hidden:false,
        classid:"",
        windowHeight:"",
        windowWidth:"",
        startnum:4,//热门搜索开始的位置
        class_content:false,//加载更多
        no_more:false,//没有更多了
        q:"",//分类的名字
      
        indicatorDots: true,
        autoplay: false,
        interval: 5000,
        duration: 1000
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    // console.log(app.globalData.openid)
    wx.setStorageSync('unique_book_id',"weihuan");
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    this.onclassify();
  },
  onShow: function( e ) {
     // 生命周期函数--监听页面显示
    wx.getSystemInfo( {
      success: ( res ) => {
        this.setData( {
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  // 下拉刷新菜单
    pullDownRefresh: function( e ) {
    console.log( "下拉刷新...." )
    // this.onclassify()
  },

  pullUpLoad: function( e ) {

    console.log( "上拉拉加载更多...." );

  },


  onHide:function(){
    // 生命周期函数--监听页面隐藏

  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
 
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
      var that = this;

  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'ITAEMBook', // 分享标题
      desc: '最好用的借书小程序', // 分享描述
      path: '/pages/index' // 分享路径
    }
  },
  
  //搜索页
  soso:function(){
      wx.navigateTo({
       url: '../search/search'
})

  },
  // 默认的列表，热门图书
  onclassify:function(){
       var that = this;
        var data = {};
        var Url='https://www.aloneness.cn/library_5/sendHotBooks?from=0';//搜索的url
        bookUtil.GetData(Url, data, function (res) {
              console.log(res);
               var books = res.data.hotBooks; 
               bookUtil.processbooks(books);
               that.setData({books:books,hidden:true}); 
        }, function (res) {
        },
        function (res) {
        })
  
  },
  //点击加载更多
  onloadmore:function(){
        var that = this;
        var startnum = that.data.startnum;
        this.setData({hidden:false});//未获得数据时 加载中...
        if(that.data.class_content == false){//用户点击了热门阅读的加载更多
                    wx.request({
      url: 'https://www.aloneness.cn/library_5/sendHotBooks?from='+startnum,
      header: {
          'content-type': 'application/text'
      },
      success: function(res) {
        console.log(res.data);
        console.log("hot");
        if(res.data.hotBooks.length == 0){//没有更多的时候
          that.setData({no_more:true,hidden:true});
        }else{
               var books = that.data.books.concat(res.data.hotBooks);
        that.setData({books:books,hidden:true,startnum:startnum+4});
        }
      }
    })
        }else{//用户点击了分类阅读的加载更多
                  wx.request({
    url:'https://www.aloneness.cn/library_5/getBookDetailsInfo?category='+that.data.q+'&from='+startnum,
      header: {
          'content-type': 'application/text'
      },
      success: function(res) {
        console.log("分类的加载更多");
        console.log(res.data);
             if(res.data.books.length == 0){//没有更多的时候
          that.setData({no_more:true,hidden:true});
        }else{
        var books = that.data.books.concat(res.data.books);
  
        that.setData({books:books,hidden:true,startnum:startnum+4});
        }
      }
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
    // var bookId =   wx.getStorageSync('bookId');
    // console.log(bookId);
  },
  // 不同类不同的列表
  ee:function(e){
    var classid = e.currentTarget.id;//点击赋予每个分类一个id
    // console.log(classid);
    this.setData({classid:classid});
    this.setData({ no_more: false});//变回加载更多的字样
    this.classee();
  },
  // 不同类不同的列表
  classee:function(){
        var that = this;
        var string1 = this.data.classid;//取得分类的每个id
         var one = string1.substring(0,1);//匹配数组的第一个下标
         var two = string1.substring(1);//匹配数组的第二个下标
         var one_num = parseInt(one);//把string型转化为number
         var two_num = parseInt(two);        
      var q = this.data.array[one_num][two_num].docu;//取得每个分类的名字
      console.log(q);
       this.setData({hidden:false,class_content:true,q:q});//未获得数据时 加载中...he赋予加载更多的自定义内容
       var data = {
                category:q
                  };
        var Url='https://www.aloneness.cn/library_5/getBookDetailsInfo?category='+q+'&from=0';//搜索的url
        bookUtil.GetData(Url, data, function (res) {
              console.log(res);
               var books = res.data.books; 
               bookUtil.processbooks(books);
               that.setData({books:books,hidden:true,startnum:4});
        }, function (res) {
        },
        function (res) {
        })
  
  },


})