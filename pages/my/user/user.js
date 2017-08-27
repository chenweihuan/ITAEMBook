// pages/user/user.js
Page({
  data:{
        bindKeyInput_username:"",//添加的管理员用户名
       bindKeyInput_password:"",//添加的管理员的密码
       manager:"",//所有管理员
       manager_one:"",//要删除的管理员
       supermanager:"",//超级管理员名字
       
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.to_all();
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
  },   // 获取输入框内容
  bindKeyInput_username:function(e){
    this.setData({bindKeyInput_username:e.detail.value})
  },
   bindKeyInput_password:function(e){
    this.setData({bindKeyInput_password:e.detail.value})
  },
    // 页面初始化，把管理员的姓名存好
  to_manager:function(){
         var supermanager= wx.getStorageSync('supermanager');
         this.setData({supermanager:supermanager})
  },
  // 获取管理员列表view内容
  get_view:function(e){
      console.log(e.currentTarget.dataset.text);
      this.setData({manager_one:e.currentTarget.dataset.text});
      this.to_delete();
  },
  // 点击添加之后清清除输入框内容
    formReset: function() {
    console.log('form发生了reset事件')
  },
  // 添加管理员
  to_add:function(){
    var that = this;
    if(that.data.bindKeyInput_username == ""){//用户名为空时
         wx.showModal({
                content: "用户名不能为空",
                showCancel: false,
                confirmText: "确定"
              })
    }else if(that.data.bindKeyInput_password == ""){//密码为空时
         wx.showModal({
                content: "密码不能为空",
                showCancel: false,
                confirmText: "确定"
              })
    }else{//正常输入用户名和密码
        wx.request({
          url: 'https://www.aloneness.cn/library_5/addAdministrator', 
          data: {
           account:that.data.bindKeyInput_username,
           password:that.data.bindKeyInput_password
          },
          header: {
              'content-type': 'application/json'
          },
          success: function(res) {
            console.log(res);
            if(res.data == "001"){//添加成功
              wx.showToast({
                  title: '添加成功',
                  icon: 'success',
                  duration: 2000
                })
                 that.to_all();//刷新data的数据
            }else if(res.data == "002"){//添加失败
                   wx.showModal({
                content: "添加失败",
                showCancel: false,
                confirmText: "确定"
              })
            }else if(res.data == "003"){//已经有该管理员了
                   wx.showModal({
                content: "已经有该管理员了，请不要重复添加",
                showCancel: false,
                confirmText: "确定"
              })
            }else{//已经超过了10个管理员，不能再添加了
                    wx.showModal({
                content: "已经拥有10管理员了，不能再添加，如需添加，请先删掉一个管理员",
                showCancel: false,
                confirmText: "确定"
              })
            }
          }
        })
    }
    
  },
  // 获取所有管理员
  to_all:function(){
    var that = this;
    wx.request({
        url: 'https://www.aloneness.cn/library_5/getAllAdministrator',
      
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res);
          that.setData({manager:res.data})
        }
      })
  },
  // 删除管理员
  to_delete:function(){
      var that = this;
      wx.showModal({
          title: '删除管理员'+ that.data.manager_one,
          content: '你确定？',
          success: function(res) {
            if (res.confirm) {
                  wx.request({
        url: 'https://www.aloneness.cn/library_5/deleteAdministrator',
      data:{
          account:that.data.manager_one
      },
        header: {
            'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res);
           if(res.data == "001"){//添加成功
              wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
                that.to_all();//刷新data的数据
            }else if(res.data == "002"){//添加失败
                   wx.showModal({
                content: "删除失败",
                showCancel: false,
                confirmText: "确定"
              })
            }else if(res.data == "003"){//已经有该管理员了
                   wx.showModal({
                content: "没有该管理员",
                showCancel: false,
                confirmText: "确定"
              })
            }else{//已经超过了10个管理员，不能再添加了
                    wx.showModal({
                content: "不可以删除超级管理员",
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

  },
     // 超级管理员退出登录
    out_manager:function(){
       wx.removeStorageSync('supermanager');//用完之后就清空超级管理员
       wx.switchTab({
         url: '../user_manager/user_manager',
       })
    }

  
})