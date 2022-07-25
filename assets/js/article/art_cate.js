$(function () {

    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // 用模板引擎渲染表格
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 给【添加类别】按钮绑定点击事件
    // @@@注意点； 使用 layer.open 实现弹出层效果
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        // / @@@注意点：调用layer.open（）时，会得到layer的索引号，需要先接收，以便于后续关闭弹出层
        indexAdd = layer.open({
            // type - 基本层类型
            // 可传入的值有：0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            type: 1,
            // 设置弹出层的尺寸
            area: ['500px', '250px'],
            title: '添加文章分类',

            // @@@注意点：在弹出层内部渲染表格！！！
            content: $('#dialog-add').html()
        })
    })

    // @@@注意点：通过代理的形式，为form-add表单绑定submit事件
    // 思考：什么情况下需要用到代理？ 后期添加的结构元素？无法直接获取到
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                console.log('测试新增分类')
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                // 重新获取文章分类的列表
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式，为 btn-edit 按钮绑定点击事件
    var indexEdit = null
    // @@@注意点：.btn-edit   通过类名选择元素，前面必须要加·   
    $('tbody').on('click', '.btn-edit', function () {
        // console.log('ok')
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            // 设置弹出层的尺寸
            area: ['500px', '250px'],
            title: '修改文章分类',

            // @@@注意点：在弹出层内部渲染表格！！！
            content: $('#dialog-edit').html()
        })

        // 修改文章分类的弹出层需要填充原始数据
        // 根据自定义id属性 -- 确定点击对应项进行编辑
        var id = $(this).attr('data-id')
        // console.log(id)
        // 发起请求 获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 修改之后，更新文章分类的数据
    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                // 重新获取最新列表数据并渲染
                initArtCateList()
            }
        })
    })


    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // console.log('ok')
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' },
            function (index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/deletecate/' + id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg('删除分类失败！')
                        }
                        layer.msg('删除分类成功！')
                        layer.close(index)

                        // 重新获取文章分类的列表
                        initArtCateList()
                    }
                })

            })
    })


})