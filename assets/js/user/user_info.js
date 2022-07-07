$(function () {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })

    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res)

                // @@@注意点
                // 调用form.val()快速为表单赋值
                form.val('formUsrInfo', res.data)
            }
        })
    }


    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置事件
        e.preventDefault()

        // @@@注意点：思考此处的逻辑！！！
        // 只需重新调用初始化用户的基本信息的函数即可
        initUserInfo()
    })


    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()

        // 发起Ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // @@@注意点：利用 serialize函数 快速获取表单各项内容信息
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                return layer.msg('更新用户信息成功！')

                // @@@注意点：修改用户信息后，父页面部分（头像欢迎区域）需要修改 !!!
                // 在子页面中如何调用父页面的 渲染头像欢迎区域的方法呢？？
                window.parent.getUserInfo()
            }

        })
    })

})




