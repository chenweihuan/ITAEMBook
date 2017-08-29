// pages/bookHope/bookHope.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookName:"",//书名
    bookAuthor:"",//作者
    bookISBN:"",//ISBN
    bookPublicForm:"",//出版社
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  // 获取输入内容
    // 获取书名
  inputBookName:function(e){
    this.setData({ bookName: e.detail.value})
  },
  // 获取作者
  inputBookAuthor: function (e) {
    this.setData({ bookAuthor: e.detail.value })
  },
  // 获取isbn
  inputBookISBN: function (e) {
    this.setData({ bookISBN: e.detail.value })
  },
  // 获取出版社
  inputBookPublicForm: function (e) {
    this.setData({ bookPublicForm: e.detail.value })
  },
  // 保存书愿单
  sendBookHope:function(){
    var that = this;
    var phone = wx.getStorageSync("phone");
    // console.log(that.data.bookName);
    // console.log(that.data.bookAuthor);
    // console.log(that.data.bookISBN);
    // console.log(that.data.bookPublicForm);
        wx.request({
          url: 'http://192.168.2.159/library_5/saveBookWish',
          data: {
            phone:phone,
            name: that.data.bookName,
            isbn: that.data.bookISBN,
            author: that.data.bookAuthor,
            publicForm: that.data.bookPublicForm
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
           if(res.data == "001"){//成功添加书愿单
             wx.showToast({
               title: '成功添加',
               icon: 'success',
               duration: 2000
             })
           }else{
             wx.showToast({//保存书愿单失败
               title: '添加失败',
               image: '../img/warn.png',
               duration: 2000
             })
           }
          }
        })
  }

})