export default function showNotice(title, msg) {
  // 发送通知
  var setTitle = title + ':'
  const newNotify = function() {
    var notification = new Notification(setTitle, {
      // 通知显示正文。非必须，默认为空
      // body: '你的好友XX上线了！',
      // // 通知显示正文的图片地址。非必须，默认为空
      // image: 'imgae url',
      // // 通知左侧图标。非必须，默认为空
      // icon: 'imgae url',
      // // 通知的分类标记（ID）。非必须，默认为空
      // tag: 'test',
      // // 通知相关联的数据，通常用于方法的回调，传参。非必须，默认为空
      // data: '可以是任意数据类型',
      // // 通知显示延迟的时间。非必须，默认通知实例创建完成就显示
      // timestamp: '',
      // // 通知主体内容的水平展示顺序，有点类似direction属性。非必须，默认值是auto, 可以是ltr或rtl
      // dir: 'auto',
      // // 当没有足够的空间来显示通知本身时，用于表示通知的图像的URL。非必须，默认为空
      // badge: 'xxx',
      // // 通知的语言。非必须默认为空
      // lang: '',
      // // 通知显示时，设备的振动模式。非必须，默认为空
      // vibrate: [200, 100, 200],
      // // 新通知出现是否覆盖旧的通知，覆盖（true）则永远只显示一条通知，不覆盖（false）则会多条通知重叠。非必须，默认为true
      // renotify: true,
      // // 通知是否静音。非必须，默认为false，表示无声
      // silent: false,
      // // 通知声源文件地址。非必须，默认为空
      // sound: 'mp3',
      // // 是否不在屏幕上显示通知信息。非必须，默认为false表示要显示
      // noscreen: false,
      // // 指定通知是否应该粘滞性，即不容易被用户清理。非必须，默认false表示不具粘滞性
      // sticky: false,
      // // 指定通知是否保持活性，直到用户点击或关闭。非必须，默认为false
      // requireInteraction: false

      dir: 'auto',
      lang: 'hi',
      requireInteraction: false,
      // tag: "testTag",
      icon: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_86d58ae1.png',
      body: msg,
      data: {
        url: 'https://2ue.github.io'
      }
    })
    // notification.onclick = function(event) {
    //   // 回到发送此通知的页面
    //   window.focus()
    //   // 回来后要做什么
    //   // console.log("I'm back")
    //   // 没有关闭会有个关闭按钮
    // }

    // 四个钩子
    notification.onshow = function() {
      // console.log('通知显示了！')
    }
    notification.onclick = function(e) {
      // 可以直接通过实例的方式获取data内自定义的数据
      // 也可以通过访问回调参数e来获取data的数据
      window.open(notification.data.url, '_blank')
      notification.close()
    }
    notification.onclose = function() {
      // console.log('你墙壁了我！！！')
    }
    notification.onerror = function(err) {
      // console.log('出错了，小伙子在检查一下吧')

      throw err
    }
    setTimeout(() => {
      notification.close()
    }, 5000)
  }
  // 权限判断
  if (Notification.permission === 'granted') {
    newNotify()
  } else {
    // 请求权限
    Notification.requestPermission(function(perm) {
      if (perm === 'granted') {
        newNotify()
      }
    })
  }
}
