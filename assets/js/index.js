$(function () {
    // 获取用户基本信息的函数
    getUserInfo()

    // 退出功能
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        // console.log('ok')
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something

            // 确认退出后
            console.log('ok')
            // ① 清空本地存储中的localStorage
            localStorage.removeItem('token')
            // ② 重新跳转返回登录页面
            location.href = './login.html'

            // 关闭confirm询问框
            layer.close(index)
        });
    })
})


// 获取用户基本信息的函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // Headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            console.log(res)
            // 获取用户信息成功后，渲染用户头像
            renderAvatar(res.data)
        },


        // @@@注意点： 如何避免用户直接输入index页面的url跳转到首页？  ---- 没有权限应该无法跳转
        // 不论成功或失败，最终都会调用 complete 回调函数
        // complete: function (res) {
        //     console.log('执行了complete回调:')
        //     console.log(res)
        //     // 在complete回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // ① 强制清空 token
        //         localStorage.removeItem('token')
        //         // ② 强制跳转返回登录页面
        //         location.href = '/login.html'
        //     }

        // }


    })

}

// 渲染用户头像的函数
function renderAvatar(user) {
    // 1.获取用户名称
    var name = user.nickname || user.username
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        // 显示图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        // 隐藏文本头像
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        // 隐藏图片头像
        $('.layui-nav-img').hide()
        // 显示图片头像
        // @@@注意点：如果是英文名，首字母需要转换为大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}