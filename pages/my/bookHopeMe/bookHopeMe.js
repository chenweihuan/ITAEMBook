// pages/my/bookHopeMe/bookHopeMe.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookHope:"",
    clickName:"",//用户点击了谁
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadBookHope();
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
  // 获取我的书愿单
  loadBookHope:function(){
    var that = this;
    var phone = wx.getStorageSync("phone");
      wx.request({
        url: 'http://192.168.2.159/library_5/checkBookWishByPhone', 
        data: {
          phone:phone
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res);
          that.setData({bookHope:res.data})
        }
      })
  },
  // 点击查看书愿单详情
  openDeatil:function(e){
    console.log(e.target.dataset.bookname);
    if (!e.target.dataset.flag){
      wx.showToast({
        title: '此书暂无更多信息',
        image: '../../img/warn.png',
        duration: 2000
      })
    }else{
      this.setData({ clickName: e.target.dataset.bookname })//把用户点了哪本书传回去
    }
  }
})