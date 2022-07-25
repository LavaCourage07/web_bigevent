$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // @@@注意点：
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(t.getSeconds())
        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,     //页码值--默认请求第一页的数据
        pagesize: 2,     //每页显示几条数据，默认每页显示2条
        cate_id: '',     //文章分类的Id
        state: ''     //文章的发布状态 
    }

    // 获取文章列表数据
    initTable()

    // 初始化文章分类
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // layer.msg('获取文章列表成功！')
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // @@@注意点：此处有个小bug --- 同步异步问题导致
                // 由于layui的渲染机制问题，导致【所有分类】无法正确渲染渲染出来，显示为空
                // 此时需要重新调用form.render()方法，通知layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取筛选框中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })


    // 定义渲染分页的方法
    // 思考：在何处调用该方法呢？
    function renderPage(total) {
        // console.log(total)
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            // 注意：容器 id 值无需加 #
            elem: 'pageBox',    //分页容器的id
            count: total,   //总数据条数
            limit: q.pagesize,  //每页显示几条数据
            curr: q.pagenum,     //设置默认被选中的分页
            // @@@注意点: 通过 layout 新增自定义分页的功能项
            // 'prev', 'page', 'next'这三项是默认有的，它们的前后顺序对应页面中实际显示的页面顺序
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // @@@注意点：根据 limits 属性 --- 手动修改可以选择的数据条数数组
            limits: [2, 3, 5, 10],

            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码切换的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            // 解决死循环的方法： 利用 first 参数
            // 当点击默认选中页时，first 值为 true， 此时由第2种方式触发 jump 回调
            // 当点击其他选中页时，first 值为 undefined ，此时由第1种方式触发 jump 回调
            jump: function (obj, first) {
                console.log(first)
                console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // @@@注意点：功能绑定实现 --- 实现切换每页显示多少条数据的功能
                // 切换每页显示数量时，也会触发 jump 回调
                // 把最新的条目数赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // @@@注意点： 直接调用 initTable() 将会发生死循环！！！！！！
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }


    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // console.log('ok')

        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // console.log(len)
        // 获取到待删除文章 对应的 id
        var id = $(this).attr()
        // 询问用户是否要删除数据
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // @@@注意点: bug --- 如果删除掉最后一页的所有文章后，由于页面值还是对应最后一页的值，因此又取了一遍数据，导致取到的结果为空
                    // 解决方案：当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如何判断页面上还剩余多少条数据？ --- 根据页面上【删除】按钮的数量判断
                    // 如果没有剩余的数据了，让页码值 -1 之后，再重新调用initTable() 方法
                    // 重新渲染文章列表
                    if (len === 1) {
                        // 如果len的值为1，证明删除完毕之后，页面上将没有任何数据
                        // @@@注意点： 前提条件：页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            // 关闭弹出层
            layer.close(index)
        })
    })



})