// 思考12: 简化url的代码,将根路径拼装的过程封装起来  --- 利用ajaxPrefilter函数
// 每次调用 $.get() 或 $.post() 或 $.ajax()时,会先调用 ajaxPrefilter 这个函数
// ajaxPrefilter 函数中,可以拿到 Ajax 提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url)
    // 在发起真正的ajax请求之前,统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // console.log(options.url)


    // @@@注意点：统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    // @@@注意点：优化权限控制的代码
    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        // console.log('执行了complete回调:')
        // console.log(res)

        // 在complete回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // ① 强制清空 token
            localStorage.removeItem('token')
            // ② 强制跳转返回登录页面
            location.href = '/login.html'
        }

    }

})

