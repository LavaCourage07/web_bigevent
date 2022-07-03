// 思考12: 简化url的代码,将根路径拼装的过程封装起来  --- 利用ajaxPrefilter函数
// 每次调用 $.get() 或 $.post() 或 $.ajax()时,会先调用 ajaxPrefilter 这个函数
// ajaxPrefilter 函数中,可以拿到 Ajax 提供的配置对象
$.ajaxPrefilter(function (options) {
    console.log(options.url)
    // 在发起真正的ajax请求之前,统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url)
})