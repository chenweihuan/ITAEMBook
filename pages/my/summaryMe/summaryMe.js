// pages/my/summaryMe/summaryMe.js

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.getSystemInfo({
    //   success: function(res) {
    //     console.log(res);
    //   },
    // })
    // this.loadPersonalBook();//加载个人借阅排行榜
    // this.loadContentNB();//加载神评排行榜
    // this.loadZaned();//加载点赞数最多的评论
    this.loadAllBook();//加载图书借阅排行榜
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
    if (this.data.mark > this.data.newmark && this.data.page!==3){
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
        this.setData({ page: --this.data.page})
        this.setData({
          translate: 'transform: translateY(' + (-this.data.windowHeight) + 'px)'
        })
      } else if (this.data.newmark - this.data.startmark < 0&& this.data.page !== 3){//上划
        this.setData({ page: ++e.target.dataset.page })
        this.setData({
          translate: 'transform: translateY(' + (-this.data.windowHeight) + 'px)'
        })
      }
     
    }
    this.setData({
      translateING: 'transform: translateY(0px)'
    })
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
            // console.log(res)
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
        // console.log(res)
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
            // console.log(res)
          }
        })
  },
  // 图书借阅排行榜
  loadAllBook:function(){
        var that = this;
        for(var i = 0;i<2;i++){
          // var num = -4;
          // num = num +4;
          if(i=0){var num = 0}else{var num = 4}
          wx.request({
            url: 'https://www.aloneness.cn/library_5/sendHotBooks?from='+num,
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
              // console.log(res)
            }
          })
        }

    
  }


})
