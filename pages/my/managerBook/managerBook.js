// pages/my/managerBook/managerBook.js
Page({
  data:{
    books:"",
     unique_book_id1:"",
     unique_book_id2:"",
     phone:"",//电话号码
     money:"",
     lendORborrow:'',//判断借书还是还书
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.Loadbook();
    this.setData({
      lendORborrow: wx.getStorageSync("lendORborrow")
    })
    // this.sure_borrow();
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
  // 管理员验书界面
  Loadbook:function(){
    var that =this;
     var order_id= wx.getStorageSync('order_id');
     console.log(order_id);
    //  console.log(111);
      wx.request({//获取借书单二维码里面的两本书
          url: 'https://www.aloneness.cn/library_5/getLendBookInfo?order_id='+order_id, 
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            console.log(res.data);
            that.setData({books:res.data.books});//更新借的那两本书
            if(res.data.books.length == 2){
    that.setData({
                unique_book_id1:res.data.books[0].unique_book_id,
                unique_book_id2:res.data.books[1].unique_book_id
                })
            }else{
                 that.setData({
                unique_book_id1:res.data.books[0].unique_book_id,
                unique_book_id2:""
                })        
            }
            that.setData({phone:res.data.phone,money:res.data.money});
          
          }
        })
  },
  // 确定借出书本
  sure_borrow:function(){
        var that =this;
       
             wx.showModal({
                  title: '提示',
                  content: '确定借出该书？',
                  success: function(res) {
                    if (res.confirm) {
                       var order_id= wx.getStorageSync('order_id');
             console.log(order_id);
             console.log(that.data.phone);
             console.log(that.data.unique_book_id1);
             console.log(that.data.unique_book_id2);
                             wx.request({
        url: 'https://www.aloneness.cn/library_5/checkBooks?order_id='+order_id+'&phone='+that.data.phone+'&unique_book_id1='+that.data.unique_book_id1+'&unique_book_id2='+that.data.unique_book_id2, 
        data: {
            order_id:order_id,
            phone:that.data.phone,
            unique_book_id1:that.data.unique_book_id1,
            unique_book_id2:that.data.unique_book_id2
        },
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res)
          wx.showToast({
            title: '成功借出',
            icon: 'success',
            duration: 2000
          })
        }
      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
 
  },
  // 确定读者归还书本
  return_borrow:function(){
          var that =this;
          wx.showModal({
              title: '提示',
              content: '确定无误？',
              success: function(res) {
                if (res.confirm) {
                       var order_id= wx.getStorageSync('order_id');
             console.log(order_id);
             console.log(that.data.phone);
             console.log(that.data.unique_book_id1);
             console.log(that.data.unique_book_id2);
    wx.request({
        url: 'https://www.aloneness.cn/library_5/returnBooks?order_id='+order_id+'&phone='+that.data.phone+'&unique_book_id1='+that.data.unique_book_id1+'&unique_book_id2='+that.data.unique_book_id2, 
        data: {
            order_id:order_id,
            phone:that.data.phone,
            unique_book_id1:that.data.unique_book_id1,
            unique_book_id2:that.data.unique_book_id2
        },
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res)
          wx.showToast({
              title: '成功归还图书',
              icon: 'success',
              duration: 2000
            })
        }
      })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })

       
  }
})