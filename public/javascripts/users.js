var $table = $('#table'),
        $remove = $('#remove'),
        selections = [];
    function initTable() {
    	console.log('ss')
        $table.bootstrapTable({
            height: getHeight(),
            columns: [
                [
                    {
                        field: 'state',
                        checkbox: true,
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle'
                    }, {
                        title: '用户 ID',
                        field: '_id',
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle',
                        sortable: true
                    }, {
                        title: '用户信息',
                        colspan: 3,
                        align: 'center'
                    }, {
                        title: '第一次打卡时间',
                        colspan: 2,
                        align: 'center'
                    }, {
                        title: '第二次打卡时间',
                        colspan: 2,
                        align: 'center'
                    }, {
                        title: '操作',
                        field: 'operation',
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle',
                        events: operateEvents,
                        formatter: operateFormatter
                    }
                ],
                [
                    {
                        field: 'name',
                        title: '用户名',
                        sortable: true,
                        editable: {
                        	type: 'text',
                        	validate: function (value) {
                                value = $.trim(value);
                                if (!value) {
                                    return '不可为空';
                                }
                                var data = $table.bootstrapTable('getData'),
                                    index = $(this).parents('tr').data('index');
                                console.log(data[index]);
                                return '';
                            }
                        },
                        align: 'center'
                    }, {
                        field: 'passwd',
                        title: '密码',
                        align: 'center',
                        editable: {
                            type: 'password',
                            validate: function (value) {
                                value = $.trim(value);
                                if (!value) {
                                    return 'This field is required';
                                }
                                var data = $table.bootstrapTable('getData'),
                                    index = $(this).parents('tr').data('index');
                                console.log(data[index]);
                                return '';
                            }
                        }
                    }, {
                        field: 'operate',
                        title: '测试',
                        align: 'center',
                        events: testOperateEvents,
                        formatter: testOperateFormatter
                    }, {
                        field: 'minute1',
                        title: '分',
                        align: 'center',
                        editable: {
                            type: 'text',
                            min: 1,
                            max: 59,
                            validate: function (value) {
                                value = $.trim(value);
                                if (!value) {
                                    return 'This field is required';
                                }
                                var data = $table.bootstrapTable('getData'),
                                    index = $(this).parents('tr').data('index');
                                console.log(data[index]);
                                return '';
                            }
                        },
                    }, {
                        field: 'second1',
                        title: '秒',
                        align: 'center',
                        editable: {
                            type: 'text',
                            min: 1,
                            max: 59,
                            validate: function (value) {
                                value = $.trim(value);
                                if (!value) {
                                    return 'This field is required';
                                }
                                var data = $table.bootstrapTable('getData'),
                                    index = $(this).parents('tr').data('index');
                                console.log(data[index]);
                                return '';
                            }
                        },
                    }, {
                        field: 'minute2',
                        title: '分',
                        align: 'center',
                       editable: {
                            type: 'text',
                            validate: function (value) {
                                value = $.trim(value);
                                if (!value) {
                                    return 'This field is required';
                                } else {
                                	var arr = value.split('-');
                                	if(arr.length == 2) {
                                		if(arr[0] > arr[1]) {
                                			return '非法输入';
                                		}
                                	} else {
                                		return '重新输入';
                                	}
                                }
                                var data = $table.bootstrapTable('getData'),
                                    index = $(this).parents('tr').data('index');
                                console.log(data[index]);
                                return '';
                            }
                        },
                    }, {
                        field: 'second2',
                        title: '秒',
                        align: 'center',
                        editable: {
                            type: 'text',
                            validate: function (value) {
                                value = $.trim(value);
                                if (!value) {
                                    return 'This field is required';
                                } else if(value < 1 || value > 59) {
                                	return '1-59';
                                }
                                var data = $table.bootstrapTable('getData'),
                                    index = $(this).parents('tr').data('index');
                                console.log(data[index]);
                                return '';
                            }
                        },
                    }
                ]
            ]
        });
        // sometimes footer render error.
        setTimeout(function () {
            $table.bootstrapTable('resetView');
        }, 200);
        $table.on('check.bs.table uncheck.bs.table ' +
                'check-all.bs.table uncheck-all.bs.table', function () {
            $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);

            // save your data, here just save the current page
            selections = getIdSelections();
            // push or splice the selections if you want to save all data selections
        });
        $table.on('expand-row.bs.table', function (e, index, row, $detail) {
            if (index % 2 == 1) {
                $detail.html('Loading from ajax request...');
                $.get('LICENSE', function (res) {
                    $detail.html(res.replace(/\n/g, '<br>'));
                });
            }
        });
        $table.on('all.bs.table', function (e, name, args) {
            console.log(name, args);
        });
        $table.on('editable-hidden.bs.table', function (e, name, args) {
            $table.bootstrapTable('resetView');
            console.log(name, args);
        });
        $remove.click(function () {
            var ids = getIdSelections();
            $table.bootstrapTable('remove', {
                field: 'id',
                values: ids
            });
            $remove.prop('disabled', true);
        });
        $(window).resize(function () {
            $table.bootstrapTable('resetView', {
                height: getHeight()
            });
        });
    }

    function getIdSelections() {
        return $.map($table.bootstrapTable('getSelections'), function (row) {
            return row.id
        });
    }

    function responseHandler(res) {
        $.each(res.rows, function (i, row) {
            row.state = $.inArray(row.id, selections) !== -1;
        });
        return res;
    }

    function detailFormatter(index, row) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return html.join('');
    }

    function operateFormatter(value, row, index) {
        return [
            '<a class="save" href="javascript:void(0)" title="保存">',
            '<i class="glyphicon glyphicon-floppy-saved"></i>',
            '</a>  ',
            '<a class="remove" href="javascript:void(0)" title="删除">',
            '<i class="glyphicon glyphicon-remove"></i>',
            '</a>'
        ].join('');
    }

	function testOperateFormatter(value, row, index) {
		return [
            '<button type="button" class="btn btn-primary btn-xs punch">打卡</button>'
        ].join('');
	}

    window.operateEvents = {
        'click .save': function (e, value, row, index) {
            alert('You click like action, row: ' + JSON.stringify(row));
        },
        'click .remove': function (e, value, row, index) {
            $table.bootstrapTable('remove', {
                field: 'id',
                values: [row.id]
            });
        }
    };

	window.testOperateEvents = {
		'click .punch':　function(e, value, row, index) {
            console.log('You click like action punch, row: ' + JSON.stringify(row));
        }
	}

    function getHeight() {
        return $(window).height() - $('h1').outerHeight(true);
    }

    $(function () {
        var scripts = [
                location.search.substring(1) || 'assets/bootstrap-table/src/bootstrap-table.js',
                'assets/bootstrap-table/src/extensions/export/bootstrap-table-export.js',
//                'http://rawgit.com/hhurz/tableExport.jquery.plugin/master/tableExport.js',
                'assets/bootstrap-table/src/extensions/export/tableExport.js',
                'assets/bootstrap-table/src/extensions/editable/bootstrap-table-editable.js',
//                'http://rawgit.com/vitalets/x-editable/master/dist/bootstrap3-editable/js/bootstrap-editable.js'
                'assets/bootstrap-table/src/extensions/editable/bootstrap-editable.js'
            ],
            eachSeries = function (arr, iterator, callback) {
                callback = callback || function () {};
                if (!arr.length) {
                    return callback();
                }
                var completed = 0;
                var iterate = function () {
                    iterator(arr[completed], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            if (completed >= arr.length) {
                                callback(null);
                            }
                            else {
                                iterate();
                            }
                        }
                    });
                };
                iterate();
            };

        eachSeries(scripts, getScript, initTable);
    });

    function getScript(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = url;

        var done = false;
        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState ||
                    this.readyState == 'loaded' || this.readyState == 'complete')) {
                done = true;
                if (callback)
                    callback();

                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
            }
        };

        head.appendChild(script);

        // We handle everything using the script element injection
        return undefined;
    }