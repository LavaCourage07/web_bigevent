$(function () {
    var form = layui.form
    var layer = layui.layer

    form.verify({

        // @@@注意点：旧密码是否正确是否需要验证一遍呢？ --- 验证完需要提示给用户，提升用户体验
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验规则：如果新密码与原密码一致，则会报错
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        // 校验规则：新密码与确认密码一致
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }

    })

    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    // 自行优化：这里最好也重置一下表单
                    $('.layui-form')[0].reset()

                    return layui.layer.msg('更新密码失败！')
                }

                // 错误：不要写return！！
                // return layui.layer.msg('更新密码成功！')
                layui.layer.msg('更新密码成功！')

                // @@@注意点：如何实现重置密码的事件操作？
                // --- 首先通过jquery获取元素
                // --- 再将 元素 转化为原生 DOM 对象
                // --- 调用DOM 操作中的reset()方法
                // 思考：为什么不直接获取原生 DOM 对象？
                $('.layui-form')[0].reset()
            }
        })
    })


})