var $table = $('#table'),
        $remove = $('#remove'),
        selections = [];
    function initTable() {
        $table.bootstrapTable({
            height: getHeight(),
            columns: [
                [
                    {
                        field: 'state',
                        checkbox: true,
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle',
                        visible : false,
                    }, {
                        title: '用户 ID',
                        field: '_id',
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle',
                        visible : false,
                    }, {
                        field: 'name',
                        title: '用户名',
                        rowspan: 2,
                        sortable: true,
                        valign: 'middle',
                        align: 'center'
                    }, {
                        field: 'passwd',
                        title: '密码',
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle',
                        editable: {
                            type: 'password',
                            validate: function (value) {
                                value = $.trim(value);
                                if (!value) {
                                    return 'This field is required';
                                }
                                return '';
                            }
                        }
                    }, {
                        field: 'operate',
                        title: '测试',
                        rowspan: 2,
                        align: 'center',
                        valign: 'middle',
                        events: testOperateEvents,
                        formatter: testOperateFormatter
                    }, {
                        title: '第一次打卡时间（8点）',
                        colspan: 1,
                        align: 'center'
                    }, {
                        title: '第二次打卡时间（18点）',
                        colspan: 1,
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
                        field: 'minute1',
                        title: '分钟范围',
                        align: 'center',
                        editable: {
                            type: 'text',
                            min: 1,
                            max: 59,
                            validate: function (value) {
                                value = $.trim(value);
                                if (!value) {
                                    return 'This field is required';
                                } else {
                                	var arr = value.split('-');
                                	
                                	if(arr.length == 2) {
                                		if(!(/^\d+$/.test(arr[0]) && /^\d+$/.test(arr[1]))) {
                                			return '请输入纯数字';
                                		}
                                		if(arr[0] > 59 || arr[0] < 1 || arr[1] > 59 || arr[1] < 1) {
                                			return '请输入1-59之间的数字';
                                		}
                                		if(arr[0] > arr[1]) {
                                			return '开始值须不大于结束值';
                                		}
                                	} else {
                                		return '重新输入，如10-20';
                                	}
                                }
                                return '';
                            }
                        },
                    }, {
                        field: 'minute2',
                        title: '分钟范围',
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
                                		if(!(/^\d+$/.test(arr[0]) && /^\d+$/.test(arr[1]))) {
                                			return '请输入纯数字';
                                		}
                                		if(arr[0] > 59 || arr[0] < 1 || arr[1] > 59 || arr[1] < 1) {
                                			return '请输入1-59之间的数字';
                                		}
                                		if(arr[0] > arr[1]) {
                                			return '开始值须不大于结束值';
                                		}
                                	} else {
                                		return '重新输入';
                                	}
                                }
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
      //      console.log(name, args);
        });
        $table.on('editable-hidden.bs.table', function (e, name, args) {
            $table.bootstrapTable('resetView');
//          console.log(name, args);
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
        	$.ajax({
        		type:"POST",
        		url:"/users/update/"+JSON.stringify(row),
	    		timeout: 3000,
        		success:function(flag){
        			if(flag) {
        				console.log('update seccess~')
        				alert('update seccess~')
        			} else {
        				console.log('update err')
        				alert('update err')
        			}
        		},
        		error: function (err) {
                	console.log(err)
                }
        	});
        },
        'click .remove': function (e, value, row, index) {
            $.ajax({
            	type:"POST",
            	url:"/users/delete/"+row._id,
            	success : function(flag) {
            		if(flag) {
						$table.bootstrapTable('remove', {
							field: '_id',
						    values: [row._id]
						});
            		}
				},
				error : function(err) {
					console.log(err);
				}
            });
        }
    };

	window.testOperateEvents = {
		'click .punch':　function(e, value, row, index) {
			var userinfo = {};
			userinfo.username = row.name;
			userinfo.passwd = row.passwd;
			$.ajax({
            	type:"POST",
            	url:"/users/test/"+JSON.stringify(userinfo),
            	success : function(flag) {
            		alert('请去考勤页面查看~')
				},
				error : function(err) {
					console.log(err);
				}
            });
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