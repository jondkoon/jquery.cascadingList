(function ($, undefined) {

    function scrollTo($elem, $parent) {
        if ($parent === undefined) {
            $parent = $elem.parent();
        }
        var scrollTop = $parent.scrollTop(),
            parent_top = $parent.position().top,
            parent_height = $parent.height(),
            top = $elem.position().top - parent_top,
            height = $elem.outerHeight(),
            offset = 1;
        //if elem is not in the viewable area lets scroll to it
        if (!(top >= 0 && (top - offset + height) <= parent_height)) {
            if (top < 0) {
                $parent.scrollTop(scrollTop + top);
            } else {
                $parent.scrollTop(scrollTop + (top - parent_height + height - offset));
            }
        }
    }

    function bindEvents($elem) {
        $elem.children().bind('click.selective', function () {
            var $t = $(this);
            changeSelected($t.parent(), $t, false);
        });

        $elem.bind('click.selective focus.selective', function (event) {
            var $t = $(this);
            if (event.type !== 'focus') {
                $t.focus();
            }
        });

        var key = {
            left: 37,
            up: 38,
            right: 39,
            down: 40
        };

        $elem.bind('keydown.selective', function (event) {
            var current_selector = $(this);
            if (current_selector.length === 1 && (event.which === key.up || event.which === key.down)) {
                event.preventDefault();
                var currently_selected = getCurrent(current_selector);
                var next = [];
                //if none is selected select first in the list
                if (currently_selected.length !== 1) {
                    next = current_selector.children().first();
                }
                else if (event.which === key.down) {
                    next = currently_selected.next();
                }
                else if (event.which === key.up) {
                    next = currently_selected.prev();
                }
                if (next.length === 1) {
                    changeSelected(current_selector, next, true);
                }
            }
        });
    }

    function createValHooks(nodeName, childNodeName) {
        //add .val() functionality to the selective
        if ($.valHooks[nodeName] === undefined) {
            $.valHooks[nodeName] = {
                get: function (elem) {
                    var $elem = $(elem),
                    selected = getCurrent($elem);
                    if (selected != null){
                        var value = selected.attr('data-value');
                        return value;
                    } else {
                        return null;
                    }
                },
                set: function (elem, value) {
                    var $elem = $(elem),
                    toSelect = $elem.find('[data-value="' + value + '"]');
                    changeSelected($elem, toSelect, true);
                }
            };
        }

        if (childNodeName !== undefined && $.valHooks[childNodeName] === undefined) {
            //adds .val() functionality to the children
            $.valHooks[childNodeName] = {
                get: function (elem) {
                    return $(elem).attr('data-value');
                }
            };
        }
    }

    function changeSelected($elem, toSelect, scroll){
        var current = getCurrent($elem);
        if(current){
            current.removeClass('selected');
        }
        if(toSelect.length !== 0){
            toSelect.addClass('selected');
            if(scroll){
                scrollTo(toSelect);
            }
        }
        if(!sameElement(current, toSelect)){
            $elem.trigger('change');
        }
    }

    function sameElement(a,b){
        if(a instanceof jQuery){
            a = a[0];
        }
        if(b instanceof jQuery){
            b = b[0];
        }
        return a === b;
    }

    function getCurrent($elem){
        var current = $elem.find('.selected');
        if(current.length === 0){
            return null;
        }
        return current;
    }

    var default_options = {
        disabled: false
    };

    var methods = {
        init: function (options) {
            options = options || {};
            return this.each(function () {
                var $this = $(this),
                    nodeName = this.nodeName.toLowerCase(),
                    childNodeName = 'li',
                    data = $this.data('selective');

                options = $.extend({}, default_options, options);

                if (!data) {
                    $this.data('selective', options);

                    if (childNodeName === undefined) {
                        var children = $this.children();
                        if (children.length) {
                            childNodeName = children[0].nodeName;
                        }
                    }
                    childNodeName = childNodeName.toLowerCase();

                    createValHooks(nodeName, childNodeName);
                    if (options.disabled) {
                        $this.selective('disable');
                    } else {
                        $this.selective('enable');
                    }
                }

            });
        },
        option: function (property) {
            if (property !== undefined) {
                var options = this.data('selective');
                if (options) {
                    return options[property];
                }
            }
        },
        disable: function () {
            return this.each(function (elem) {
                var $this = $(this),
                    options = $this.data('selective');
                if (options) {
                    options.disabled = true;
                }
                $this.addClass('selective-disabled').
                      removeAttr('tabindex').
                      children().andSelf().unbind('.selective');

            });
        },
        enable: function () {
            return this.each(function (elem) {
                var $this = $(this),
                    options = $this.data('selective');
                if (options) {
                    options.disabled = false;
                }
                $this.removeClass('selective-disabled').
                      attr('tabindex', 0);
                bindEvents($this);
            });
        }
    };

    $.fn.selective = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jquery.selective');
        }
    };

})(jQuery);
