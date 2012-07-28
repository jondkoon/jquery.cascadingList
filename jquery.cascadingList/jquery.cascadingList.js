(function ($, undefined) {

    //A Linked List Node
    //Expects a data object that will be stored with the node
    function LLNode(data) {
        this.data = data || null;
        this.next = null;
        this.prev = null;
    
        this.addAfter = function(node){
            node.next = this.next;
            if(node.next !== null){
                this.next.prev = node;
            }
            this.next = node;
            node.prev = this;
        };
    };

    var KEYS = {
        left: 37,
        up: 38,
        right: 39,
        down: 40
    };

    function getParam(obj, param) {
        if ($.isFunction(param)) {
            return param.call(obj);
        } else if (param in obj) {
            return obj[param];
        } else {
            return param;
        }
    }

    function formTree(options) {
        var nodeDict = {};
        var heads = [];
        $.each(options.data, function (index, obj) {
            var node = {};
            node.display = getParam(obj, options.display);
            node.value = getParam(obj, options.value);
            node.parent = getParam(obj, options.parent);
            node.children = [];
            nodeDict[node.value] = node;
        });
        $.each(nodeDict, function (index, node) {
            if (node.parent in nodeDict) {
                node.parent = nodeDict[node.parent];
                node.parent.children.push(node);
            } else {
                node.parent = null;
                heads.push(node);
            }
        });
        return {
            nodeDict: nodeDict,
            heads: heads,
        };
    }

    function printTree(el, heads) {
        $.each(heads, function (index, node) {
            var li = $("<li data-value='" + node.value + "'>" + node.display + "</li>");
            if (node.children.length) {
                var ul = $("<ul></ul>");
                printTree(ul, node.children);
                li.append(ul);
            }
            el.append(li);
        });
    };

    function getDepth(heads, depth, deepest) {
        depth = depth || 0;
        deepest = deepest || 0;
        if (depth > deepest) {
            deepest = depth;
        }
        $.each(heads, function (index, node) {
            node.depth = depth;
            if (node.children.length) {
                deepest = getDepth(node.children, depth + 1, deepest);
            }
        });
        return deepest;
    }

    function itemTemplate() {
        var li = $("<li data-value='" + this.value + "'>" + this.display + "</li>");
        if (this.children && this.children.length) {
            li.addClass('has-children');
        } else {
            li.addClass('no-children');
        }
        return li;
    }

    function listTemplate() {
        return $('<ul class="selective" ></ul>');
    }

    function attachElements(nodeDict) {
        $.each(nodeDict, function (index, node) {
            var li = itemTemplate.call(node);
            node.element = li;
        });
    }

    function createLists(data, container) {
        var uls = [];
        var listNodes = [];
        
        if (data.scrollable) {
        	container.wrap('<div style="overflow-x: auto"></div>');
        }
        if (!data.scrollable) {
            var widthPercentage = ((100 / (data.depth + 1)).toFixed(2));
            if (widthPercentage * (data.depth + 1) > 1) {
                widthPercentage -= .01;
            }
            widthPercentage += "%"
        }
        for (var i = 0; i <= data.depth; i++) {
            uls[i] = listTemplate();
            if (!data.scrollable) {
              uls[i].css('width', widthPercentage);
            }
            listNodes[i] = new LLNode(uls[i]);
            if (i > 0) {
                listNodes[i - 1].addAfter(listNodes[i]);
            }
        }
        
        $.each(data.nodeDict, function (index, node) {
            uls[node.depth].append(node.element);
            node.listNode = listNodes[node.depth];
        });
        $.each(uls, function (index, ul) {
            ul.selective();
            attachListEvents(ul, data);
            container.append(ul);
        });
        return uls;
    }

    function attachListEvents(ul, data) {
        ul.bind("keydown", function (e) {
            var key = e.keyCode;
            var selective;

            if (key === KEYS.right) {
                selective = $(this).next('.selective');
            } else if (key === KEYS.left) {
                selective = $(this).prev('.selective');
            }
            if (selective && !selective.selective('option', 'disabled')) {
                selective.focus();
                //if it doesn't have a value lets pick the first one in the list
                //moving right it should never have a value but when going left it should
                if (!selective.val()) {
                    var first_child = selective.children().eq(0);
                    if (first_child) {
                        selective.val(first_child.val());
                    }
                }
            }
        }).bind("click keyup", function () {
            var $this = $(this);
            var value = $this.val();
            setValue(value, data);
        }).bind('keydown', function (event) {
            var key = event.which;
            //if any arrow keys were pressed we should immediately remove
            //the active-entity to prevent a haze effect with the color transition
            //we must specify arrow keys because the tab key could be used
            if (key === KEYS.left || key === KEYS.right || key === KEYS.up || key === KEYS.down) {
                data.cascadingListElement.find('.active').removeClass('active');
            }
        }).bind('mousedown', function (event) {
            //on mousedown we remove the active-entity so that there is not a color flicker
            var active_item = data.cascadingListElement.find('.active').removeClass('active');
            $(window).one('mouseup', function () {
                //then on mouseup we check to make sure one got set
                //if not we set the original back to active
                if (data.cascadingListElement.find('.active').length === 0) {
                    active_item.addClass('active');
                }
            });
        }).bind('change', function(e){
            //supress change event on the UL.
            //users will only be interested in the change on cascadingList element
            e.stopPropagation();
        });
    }

    function setValue(value, data) {
        if (data.value === value) return true;
        if (value in data.nodeDict) {
            data.value = value;
            draw(value, data);
            data.element.trigger('change');
            return true;
        }
        return false;
    }
    
    function draw(value, data) {
        var redrawParents = true;

        data.cascadingListElement.find('.active').removeClass('active');
        var targetNode = data.nodeDict[value];
        targetNode.element.addClass('active');

        (function showChildren(node, targetChild) {
            if (redrawParents &&
                node.parent != null &&
                !node.parent.element.is('.selected')) {
                showChildren(node.parent, node);
            }
            var nextListNode = node.listNode.next;
            if (nextListNode != null) {
                var list = nextListNode.data;
                //deselect anything currently selected
                list.val('');
                list.children().detach();
                if (node.children.length >= 1) {
                    for (var i = 0; i < node.children.length; i++) {
                        //show the children
                        list.append(node.children[i].element);
                    }
                }
                if (targetChild == null) {
                    //Anything below the target should be cleared
                    (function clearListRecursively(listNode) {
                        if (listNode != null) {
                            listNode.data.val('').children().detach();
                            clearListRecursively(listNode.next);
                        }
                    })(nextListNode.next);
                }
            }
            if (node.depth !== targetNode.depth || node === targetNode) {
                node.element.parent().val(node.value);
            }
            if (data.scrollable && list) {
            	var neededWidth = 0
            	if (node.children.length >= 1) {
                	neededWidth += list.width();
            	}
                list.prevAll().each (function(index) {
                	neededWidth += $(this).width()
                })
                list.nextAll().each(function(index) {
                	$(this).hide();
                })
                list.parent().width(neededWidth + 2) // why 2?
            	if (node.children.length >= 1) {
            		list.show();
            	} else {
            		list.hide()
            	}
            }
        })(targetNode);
    }

    function setDefaultValue(value, data) {
        if (value != null) {
            setValue(value, data);
        } else {
            //if a default is not specified lets just grab the first one in nodeDict
            for (val in data.nodeDict) {
                setValue(data.nodeDict[val].value, data);
                break;
            }
        }
    }

    function getChildren(value, data) {
        //if a value is not specified then just use the current value
        if (value == null) {
            value = data.value;
        }
        var children = [];
        var node = data.nodeDict[value];
        if (node != null) {
            $.each(node.children, function (index, child) {
                children.push(child.value);
            });
        }
        return children;
    }

    function getChildrenCount(value, data) {
        //if a value is not specified then just use the current value
        if (value == null) {
            value = data.value;
        }
        var node = data.nodeDict[value];
        return node.children.length;
    }

    function getParent(value, data) {
        //if a value is not specified then just use the current value
        if (value == null) {
            value = data.value;
        }
        var parent = null;
        var node = data.nodeDict[value];
        if (node != null && node.parent) {
            parent = node.parent.value;
        }
        return parent;
    }

    function bindEvents(options, data) {
    	if ($.isFunction(options.change)) {
            data.element.bind("change", options.change);
        }
    }

    function highestRowCount(data) {
        var topLevelCount = 0;
        var topCount = 0;
        $.each(data.nodeDict, function (key, node) {
            if (node.parent === null) topLevelCount++;
            if (node.children.length > topCount) topCount = node.children.length;
        });
        return topCount > topLevelCount ? topCount : topLevelCount;
    }

    function getData($this) {
        var data = $this.data('cascading-list');
        if (!data) {
            data = {};
            $this.data('cascading-list', data);
        }
        return data;
    }

    var methods = {
        init: function (options) {
            options = options || {};
            return this.each(function () {
                var $this = $(this);
                var data = getData($this);
                data.element = $this;
                bindEvents(options, data);
                data.cascadingListElement = $this;
                data.cascadingListElement.addClass('cascading-list');
                var tree = formTree(options);
                data.heads = tree.heads;
                data.nodeDict = tree.nodeDict;
                data.depth = getDepth(data.heads);
                data.scrollable = options.scrollable
                attachElements(data.nodeDict);
                createLists(data, $this);
                setDefaultValue(options.defaultValue, data);
            });
        },
        value: function (value) {
            var $this = this.eq(0);
            var data = getData($this);
            if (value != null) {
                setValue(value, data);
                return this;
            } else {
                return data.value;
            }
        },
        children: function (value) {
            var $this = this.eq(0);
            var data = getData($this);
            return getChildren(value, data);
        },
        childrenCount: function (value) {
            var $this = this.eq(0);
            var data = getData($this);
            return getChildrenCount(value, data);
        },
        parent: function (value) {
            var $this = this.eq(0);
            var data = getData($this);
            return getParent(value, data);
        },
        highestRowCount: function () {
            var $this = this.eq(0);
            var data = getData($this);
            return highestRowCount(data);
        },
        printTree: function () {
            return this.each(function () {
                var $this = $(this);
                var data = getData($this);
                var list = $("<ul>");
                printTree(list, data.heads);
                $this.append(list);
            });
        }
    };

    $.fn.cascadingList = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jquery.cascading-list');
        }
    };

})(jQuery);
