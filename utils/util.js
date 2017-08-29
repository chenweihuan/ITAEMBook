var app = getApp()

// 分析读取的每一本书
function processbook(book){
    // console.log(111);
      var title = book.title;
      var author = book.author;
    //   var authorstr = " ";
    //   for(var index in author){
    //     authorstr+=author[index]+"/ ";
    //   }
    //   if(authorstr!=""){
    //     authorstr = authorstr.substring(0,authorstr.length-2);
    //   }
    //   book.authorstr = author;
  }
  // 分析读取到的20本书
  function processbooks(books){
      //  console.log(222);
      var that = this;
      for(var i =0;i<books.length;i++){
          var book = books[i];
          that.processbook(book);
      }
  }
//     // 分析地方
//   function locations(locations){
//       //  console.log(222);
//       var that = this;
//       for(var i =0;i<locations.length;i++){
//           var location = locations[i];
//           that.location(location);
//       }
//   }
//   //分析每本书的藏书地点
//   function location(location){
//         var locate = location
//   }

// 获取当前时间并且格式化
    function formatTime(date) {
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        
        return [year, month, day].map(formatNumber).join('-')
    }
    function formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
        }

// 封装get和post
function GetData(url, data,success, fail, complete) {
wx.request({
            url: url,
            data: data,
            method: "GET", 
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                success(res);
            },
            fail: function (res) {
                fail(res);
            },
            complete: function (res) {
                complete(res);
            }
        })

}

function PostData(url, data,success, fail, complete) {
wx.request({
            url: url,
            data: data,
            method: "POST", 
            header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
            success: function (res) {
                success(res);
            },
            fail: function (res) {
                fail(res);
            },
            complete: function (res) {
                complete(res);
            }
        })

}




  module.exports = {
     processbook: processbook,
     processbooks:processbooks,
     formatTime:formatTime,
     GetData:GetData,
     PostData:PostData

}
