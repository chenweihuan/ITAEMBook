// pages/my/summaryMe/summaryMe.js

var Charts = require("../../../utils/wxcharts.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: false,
    mark: 0,
    newmark: 0,
    startmark: 0,
    endmark: 0,
    windowWidth: "",
    windowHeight:"",
    staus: 1,
    translate: '',
    page:0,//哪一页在最上面
    top:"",//页面放到上面
    translateING:"",//
    downMove:false,
    translateINGdown:"",
    PersonalBook:"",//个人借阅排行榜
    contentNB:"",//神评排行榜
    lessThan:"《",//书名号
    moreThan:"》",
    zaned:"",//被赞次数最多的评论
    hotBooks:[],//图书借阅排行榜
    wantBook:0,//想读的本书
    series:[],//饼状图数据
    booksNum:'',//读过的书本总量
    pageNum:'',//读过的书的总页数
    pageTime:"",//读过书的分钟数
    dataLine:[],//线型图数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // switch (this.data.page) {
    //   case 0: this.loadAllBook(); this.loadHotType(); break;
    //   case 1: this.loadPersonalBook(); break; 
    //   case 2: this.loadContentNB(); break;
    //   case 3: this.loadZaned(); break;
    //   case 4: console.log("加载我的读书总量"); break;
    //   case 5: console.log("加载我想读总量"); break;
    //     default : console.log("出错了"); break; 
    //     } 
    // this.loadPersonalBook();//加载个人借阅排行榜
    // this.loadContentNB();//加载神评排行榜
    // this.loadZaned();//加载点赞数最多的评论
    this.loadAllBook();  //加载图书借阅排行榜
    // this.loadHotType();
    // this.loadWantBook();//加载想读多少本
    // this.loadWantBook();//加载想读
    // this.loadBookMonth();//加载线性图数据
   
   //加载各类图书情况
    this.setData({ 
      windowHeight: wx.getSystemInfoSync().windowHeight,
      windowWidth: wx.getSystemInfoSync().windowWidth,
      top: 'transform: translateY(' + (-wx.getSystemInfoSync().windowHeight) + 'px)'
    })
    // console.log(wx.getSystemInfoSync().windowHeight) 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  // 侧滑效果
  // tap_ch: function (e) {
  //   if (this.data.open) {
  //     this.setData({
  //       translate: 'transform: translateX(0px)'
  //     })
  //     this.data.open = false;
  //   } else {
  //     this.setData({
  //       translate: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)'
  //     })
  //     this.data.open = true;
  //   }
  // },
  tap_start: function (e) {
    // console.log(e);
    // this.data.mark = this.data.newmark = e.touches[0].pageX;
    this.data.mark = this.data.newmark = e.touches[0].pageY;    
    this.data.startmark = e.touches[0].pageY;
    // if (this.data.staus == 1) {
    //   // staus = 1指默认状态
    //   this.data.startmark = e.touches[0].pageX;
    // } else {
    //   // staus = 2指屏幕滑动到右边的状态
    //   this.data.startmark = e.touches[0].pageX;
    // }

  },
  tap_drag: function (e) {
    /*
     * 手指从上往下移动
     * @newmark是指移动的最新点的y轴坐标 ， @mark是指原点y轴坐标
     */
    this.data.newmark = e.touches[0].pageY;
    if (this.data.mark > this.data.newmark && this.data.page!==8){
      console.log("上划");
        this.setData({
          translateING: 'transform: translateY(' + (-Math.abs(this.data.startmark - this.data.newmark)) + 'px)'
          })
    }
    /*
     * 手指从右向左移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    if (this.data.mark < this.data.newmark && this.data.page!== 0 ){
        console.log("下滑");
        var num = parseInt(
          -(this.data.windowHeight + (-(Math.abs(this.data.startmark - this.data.newmark))))
        );
        this.setData({
          downMove: true,
          translateING: 'transform: translateY(' + Math.abs(this.data.startmark - this.data.newmark) + 'px)',
          translateINGdown: 'transform: translateY(' + num + 'px)',
        
        })
    }
  },
  tap_end: function (e) {
    // console.log(e.target.dataset.page);
    this.setData({ downMove:false})
    if (Math.abs(this.data.newmark - this.data.startmark) < (this.data.windowHeight * 0.2)){//不超过屏幕40%的时候
      this.setData({
        translateING: 'transform: translateY(0px)'
        })
    }else{
      // console.log(this.data.windowHeight);
   
      if (this.data.newmark - this.data.startmark > 0 && this.data.page !== 0){//下滑
      // 下滑完毕
      console.log("下滑完毕")
        this.setData({ page: --this.data.page});
       
        this.setData({
          translate: 'transform: translateY(' + (-this.data.windowHeight) + 'px)'
        })
      } else if (this.data.newmark - this.data.startmark < 0&& this.data.page !== 8){//上划
        this.setData({ page: ++this.data.page });
        this.loadWho();
        this.setData({
          translate: 'transform: translateY(' + (-this.data.windowHeight) + 'px)'
        })
      }
     
    }
    this.setData({
      translateING: 'transform: translateY(0px)'
    })
  },

  //判断page，看加载哪个页面 
  loadWho:function(){
    switch (this.data.page) {
      case 0: this.loadAllBook(); break;
      case 1: this.loadHotType(); console.log("加载各类排行榜"); break;
      case 2: 
      this.loadPersonalBook(); 
      console.log("加载个人排行榜");
      new Charts({
        canvasId: 'pieCanvas',
        type: 'pie',
        series: this.data.series,
        width: 320,
        height: 300,
        dataLabel: false
      });

       break;
      case 3: this.loadContentNB(); console.log("加载神评排行榜"); break;
      case 4: this.loadZaned(); console.log("加载我的神评"); break;
      case 5: this.loadBookNum();console.log("加载我的读书总量"); break;
      case 6: this.loadBookMonth(); console.log("加载折线图"); break;
      case 7: 
      this.loadWantBook();console.log("加载我想读总量"); 
      new Charts({
        canvasId: 'lineCanvas',
        type: 'line',
        categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        series: [{
          name: '借阅量',
          data: this.data.dataLine,
          format: function (val) {
            return val;
          }
        }],
        yAxis: {
          title: '借阅数量 (本)',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0
        },
        width: 320,
        height: 200
      });
      break;
      default: console.log("到底了"); break;
    } 
  },

  // 个人借阅排行榜
  loadPersonalBook:function(){
        var that = this;
        wx.request({
          url: 'http://192.168.2.159/library_5/lendRank',
          data: {
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            that.setData({ PersonalBook:res.data.users})
            console.log(res)
            // that.loadContentNB();//加载神评排行榜
          }
        })
  },
  // 神评排行榜
  loadContentNB:function(){
    var that = this;
    wx.request({
      url: 'http://192.168.2.159/library_5/bookReviewRank',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({ contentNB: res.data.bookreviews })
        console.log(res)
        // that.loadZaned();//加载我的神评
      }
    })
  },
  // 被点赞最多
  loadZaned:function(){
       var that = this;
       var phone = wx.getStorageSync("phone");
        wx.request({
          url: 'http://192.168.2.159/library_5/bookByUserTop',
          data: {
            phone:phone
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            that.setData({ zaned: res.data.bookreviews })
            console.log(res)
          }
        })
  },
  // 图书借阅排行榜
  loadAllBook:function(){
        var that = this;

          wx.request({
            url: 'https://www.aloneness.cn/library_5/sendHotBooks?from=0',
            data: {
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              // that.setData({ 
              //   hotBooks: that.data.hotBooks.concat(res.data.hotBooks) 
              //   })
              var books = res.data.hotBooks;
              for (var j = 0; j < books.length; j++) {//给返回来的json添加index字段
                books[j].index = j;
              }
                that.setData({ 
                  hotBooks: that.data.hotBooks.concat(books) 
                })
                wx.request({
                  url: 'https://www.aloneness.cn/library_5/sendHotBooks?from=4',
                  data: {
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    // that.setData({ 
                    //   hotBooks: that.data.hotBooks.concat(res.data.hotBooks) 
                    //   })
                    var books = res.data.hotBooks;
                    for (var j = 0; j < books.length; j++) {//给返回来的json添加index字段
                      books[j].index = j + 4;
                    }
                    that.setData({
                      hotBooks: that.data.hotBooks.concat(books)
                    })
                    console.log(res)
                  }
                })
              console.log(res)
            }
          })
  },
  // 加载各类图书的借阅情况
  loadHotType:function(){
    var that = this;
    wx.request({
      url: 'http://192.168.2.159/library_5/hotType',
      data: {
     
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // that.setData({ zaned: res.data.bookreviews })
        console.log(res.data);
        console.log(that.data.series.length)
        if(that.data.series.length == 0){//在数据为空的时候才加载
          var num = 0;
          for (var i = 0; i < res.data.books.length; i++) {
            // console.log("i")
            // that.data.series[i].name = res.data.books[i].name;
            // that.data.series[i].data = res.data.books[i].num;
            that.data.series = that.data.series.concat({ //饼状图的数据
              name: res.data.books[i].name,
              data: res.data.books[i].num
            })
            num = num + res.data.books[i].num;
          }
          that.data.series = that.data.series.concat({ //饼状图添加“其他”类的数据
            name: "其他",
            data: res.data.sum - num
          })
        }

      }
    })
  },
  // 加载用户读了多少本书
  loadBookNum:function(){
      var that = this;
      wx.request({
        url: 'http://192.168.2.159/library_5/showLendBookOrder?flag=102&phone=13420118411',
        data: {

        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          // that.setData({ zaned: res.data.bookreviews })
          console.log(res);
          var pageNum = 0;
          for (var i = 0; i < res.data.lendBookOrders.length;i++){
            pageNum = pageNum + res.data.lendBookOrders[i].page;
          }
      
          that.setData({
            booksNum: res.data.lendBookOrders.length,
            pageNum: pageNum,
            pageTime: (pageNum / 60).toFixed(2),//保留两位小数点
          })
          // that.loadPersonalBook();
        }
      })
  },
  // 加载用户有多少本想读
  loadWantBook:function(){
        var that = this;
        var phone = wx.getStorageSync("phone");
        wx.request({
          url: 'http://192.168.2.159/library_5/bookForMe',
          data: {
              phone:phone
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            // that.setData({ zaned: res.data.bookreviews })
            console.log(res);
            that.setData({ wantBook: res.data.books.length})
            // that.loadPersonalBook();
          }
        })
  },
  // 加载读者借书月份折线图
  loadBookMonth:function(){
    var that = this;
    var phone = wx.getStorageSync("phone");
    wx.request({
      url: 'http://192.168.2.159/library_5/lendBookForYear',
      data: {
        phone: phone,
        year:2017
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          dataLine: res.data.num,
          });
      }
    })
  }


})
