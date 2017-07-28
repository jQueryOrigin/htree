/**
 * Package: tree.js
 * Function: Tree 树结构
 * Author: liutao.
 * Date: 2016-12-24 14:00:00.
 */
(function(root, factory){
    
    factory(root.jQuery);    //传入window.jQuery 
    
})(window, function($){
    var opts = {

    };

    var params = {
        'key':'',
        'checkedFlag':false
    };

    function plugin(elm, data, options, param){
        var _this = this;

        _this.$elm = $(elm);

        _this.data = data;

        _this.param = $.extend({}, params, param);

        _this.opts = $.extend({}, opts, options);

        _this.init();
    }

    plugin.prototype = {
        init: function(){
            var _this = this;
            var html = '';

            //数据视图渲染
            var html = _this.render(_this.data);
            _this.$elm.html(html);

            //视图事件监听
            _this.handle();

        },
        render: function(data){
            var _this = this,
                html = '',
                length = data.length;

            for(var i=0; i<length; i++){
                html += '<li class="tree-li" data-id="'+ data[i].id +'" data-name="'+ data[i].name +'" data-parentid="'+ data[i].parentId +'">';

                if(data[i].selected){
                    html += '<i class="cursor-pointer icon-Uncheck icon-Check"></i>';
                }else{
                    html += '<i class="cursor-pointer icon-Uncheck"></i>';
                }

                if(!data[i].children || !data[i].children.length){
                    html += '<i class="cursor-pointer icon-leafs"></i>';
                }else{
                    html += '<i class="cursor-pointer icon-Open"></i>';
                }

                html += '<p><span class="htree-text">'+ data[i].name +'</span></p>';

                if(data[i].children && data[i].children.length){
                    html += '<ul class="htree-children">';
                    html += _this.render(data[i].children);
                    html += '</ul>';
                }

                html += '</li>';
            }
            return html;
        },
        handle: function(){
            var _this = this;

            //节点展开
            _this.$elm.on('click', '.icon-Open', function(e){
                $(this).parent('li.tree-li').children('ul.htree-children').slideDown();
                $(this).addClass('icon-Close').removeClass('icon-Open');
            });

            //节点收起
            _this.$elm.on('click', '.icon-Close', function(e){
                $(this).parent('li.tree-li').children('ul.htree-children').slideUp();
                $(this).addClass('icon-Open').removeClass('icon-Close');
            });

            //复选框勾选
            _this.$elm.on('click', '.icon-Uncheck', function(e){
                if($(this).hasClass('icon-Check')){    //原始状态为全勾选
                    $(this).removeClass('icon-Check');
                    $(this).parent('li.tree-li').find('.icon-Uncheck').each(function(){
                        $(this).removeClass('icon-Check');
                    });
                }else if($(this).hasClass('icon-inoperable')){
                    $(this).removeClass('icon-inoperable');
                    $(this).parent('li.tree-li').find('.icon-Uncheck').each(function(){
                        $(this).removeClass('icon-Check');
                    });
                }else{
                    $(this).addClass('icon-Check');
                    $(this).parent('li.tree-li').find('.icon-Uncheck').each(function(){
                        $(this).addClass('icon-Check');
                    });
                }
                _this.upcheked();
            });
        },
        setParam: function(param){
            var _this = this;
            _this.param = $.extend({}, params, param);
        },
        getLeafsChecked: function(){
            var _this = this;
            var ret = [];
            _this.$elm.find('.icon-leafs').each(function(){
                if($(this).prev('.icon-Uncheck').hasClass('icon-Check')){
                    var id = $(this).parent('.tree-li').attr('data-id');
                    ret.push(id);
                }
            });
            return ret;
        },
        expendAll: function(){
            var _this = this;
            _this.$elm.find('ul').each(function(){
                $(this).slideDown();
            });
            _this.$elm.find('.icon-Open').each(function(){
                $(this).removeClass('icon-Open').addClass('icon-Close');
            });
        },
        shrinkAll: function(){
            var _this = this;
            _this.$elm.find('ul').each(function(){
                $(this).slideUp();
            });
            _this.$elm.find('.icon-Close').each(function(){
                $(this).removeClass('icon-Close').addClass('icon-Open');
            });
        },
        showChecked: function($elm){
            var _this = this;

            var key = $.trim(_this.param.key) ? $.trim((_this.param.key).toLowerCase()) : '';

            $elm = $elm == undefined ? _this.$elm : $elm;

            $elm.show();

            $elm.children('li.tree-li').each(function(){
                if(!$(this).hasClass('tree-li-hide')){
                    if($(this).find('.icon-Check').length){

                        if($(this).children('ul.htree-children').length){
                            //递归
                            _this.showChecked($(this).children('ul.htree-children'));
                        }
                    }else{
                        $(this).addClass('tree-li-hide');
                    }
                }
            });

            _this.$elm.find('.icon-Open').each(function(){
                $(this).removeClass('icon-Open').addClass('icon-Close');
            });
        },
        refresh: function(){
            var _this = this;
            var html = _this.render(_this.data);
            _this.$elm.html(html);
            _this.upcheked();
        },
        upcheked: function($elm){
            var _this = this;

            $elm = $elm == undefined ? _this.$elm : $elm;
            $elm.children('li.tree-li').each(function(){
                var count = 0;
                var length = $(this).find('.icon-leafs').length;
                $(this).find('.icon-leafs').each(function(){
                    if($(this).prev('.icon-Uncheck').hasClass('icon-Check')){
                        ++count;
                    }
                });
                console.log(count == length);
                if(count == length){    //全选
                    $(this).children('.icon-Uncheck').removeClass('icon-inoperable').addClass('icon-Check');
                }else if(count){    //半选
                    $(this).children('.icon-Uncheck').removeClass('icon-Check').addClass('icon-inoperable');
                }else{
                    $(this).children('.icon-Uncheck').removeClass('icon-inoperable').removeClass('icon-Check');
                }
                if($(this).children('ul.htree-children')){
                    _this.upcheked($(this).children('ul.htree-children'));
                }
            });
        },
        search: function($elm){
            var _this = this;
            var key = $.trim(_this.param.key) ? $.trim((_this.param.key).toLowerCase()) : '';

            $elm = $elm == undefined ? _this.$elm : $elm;

            $elm.children('li.tree-li').each(function(){
                var text = $(this).children('p').children('.htree-text').html();

                if(text && (text.toLowerCase()).indexOf(key) != -1){
                    $(this).parents('.htree-children').each(function(){
                        $(this).show();

                        $(this).parents('.tree-li').removeClass('tree-li-hide');

                        $(this).parents('.tree-li').children('.icon-Open').each(function(){
                            $(this).addClass('icon-Close').removeClass('icon-Open');
                        });
                    });
                }else{
                    $(this).addClass('tree-li-hide');

                    if($(this).children('ul.htree-children').length){
                        //递归查询
                        _this.search($(this).children('ul.htree-children'));
                    }
                }
            });
        },
        filterTree: function($elm){
            var _this = this;

            $elm = $elm == undefined ? _this.$elm : $elm;

            $elm.children('li.tree-li').each(function(){
                if($(this).children('ul.htree-children').length){
                    _this.filterTree($(this).children('ul.htree-children'));
                }else{
                    var ishiden = true;
                    $(this).parent('ul').children('li.tree-li').each(function(){
                        if(!$(this).hasClass('tree-li-hide')){
                            ishiden = false;
                        }
                    });
                    if(ishiden){
                        $(this).parent('ul').parent('li.tree-li').addClass('tree-li-hide')
                    }
                }
            });
        },
        treeParam: function(){
            var _this = this;

            //重新刷新树结构数据
            _this.refresh();

            var key = $.trim(_this.param.key) ? $.trim((_this.param.key).toLowerCase()) : '',
                flag = _this.param.checkedFlag ? _this.param.checkedFlag : false;

            //执行搜索和选中操作
            key ? _this.search() : '';
            flag ? _this.showChecked() : '';
            //过滤掉残留dom
            _this.filterTree();
        }
    };

    $.fn.htree = function(data, options, param){
        var plugins = new plugin(this, data, options, param);
        return plugins;
    }
});