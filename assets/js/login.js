$(function () {
    // 思考2：通过隐藏显示来切换页面的效果---积累

    // 点击‘去注册’的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击‘去登录’的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })


    // 从layui中 获取 form 对象
    var form = layui.form
    // 从layui中 获取 layer 对象
    var layer = layui.layer

    // 通过 form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 的校验规则
        // 思考5：注意：后面需要加 ， 分隔两个校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 自定义了一个叫做 repwd 的校验规则 --- 校验两个代码是否一致
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 接着进行一次等于判断
            // 如果判断值为false，则return一个提示消息即可

            // 思考6： .reg-box [name=password]  一定要注意中间必须有空格，否则会有错误！！！无法获取该元素！！！
            var pwd = $('.reg-box [name=password]').val()
            console.log(pwd)
            console.log(value)
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })


    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 发起Ajax的POST请求
        // 思考8：代码优化：把参数数据提取出来，使得结构更加清晰
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser',
            data,
            function (res) {
                if (res.status !== 0) {
                    // return console.log(res.message)
                    return layer.msg(res.message)
                }
                // console.log('注册成功！')
                layer.msg('注册成功,请登录！')

                // 思考7： 提升用户体验---注册完成后自动跳转到登录页面
                // 代码模拟点击‘去登录’行为
                $('#link_login').click()
            }
        )
    })


    // 监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 思考9：小技巧 --- 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')

                // 思考10：token有什么作用？为什么很重要？
                // header里面的application是什么,有什么用???
                // 将登录成功得到的 token 字符串，保存到localStorage中 --- 方便后续用到时取用
                localStorage.setItem('token', res.token)
                console.log(res.token)
                // 登录成功后跳转到后台主页
                location.href = '/index.html'
            }
        })
    })


})

