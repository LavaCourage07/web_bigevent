$(function () {

    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 为 [上传] 按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        // 模拟文件选择框的上传点击事件
        $('#file').click()
    })

    // 实现裁剪区域图片的替换
    // 为文件选择框绑定 change 事件
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        var filelist = e.target.files
        // console.log(filelist)
        // 判断用户是否上传照片,如果没有则提示,如果有则替换照片
        if (filelist.length === 0) {
            return layer.msg('请选择照片!')
        }

        // 1. 拿到用户选择的文件
        var file = e.target.files[0]
        // @@@ 注意点
        // 2. 将文件转化为路径
        var imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 为 [确定] 按钮绑定点击事件
    $('#btnUpload').on('click', function () {

        // 1. 拿到用户裁剪之后的头像
        // 将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 2. 调用接口,把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败!')
                }
                layer.msg('更换头像成功!')

                // 在子页面中调用父页面的 重新渲染头像
                window.parent.getUserInfo()
            }
        })
    })

})