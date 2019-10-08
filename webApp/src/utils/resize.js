var EleResize = {
    _handleResize: function(e) {
        var ele = e.target || e.srcElement;
        var trigger = ele.__resizeTrigger__;
        if (trigger) {
            var handlers = trigger.__z_resizeListeners;
            if (handlers) {
                var size = handlers.length;
                for (var i = 0; i < size; i++) {
                    var h = handlers[i];
                    var handler = h.handler;
                    var context = h.context;
                    handler.apply(context, [e]);
                }
            }
        }
    },
    _removeHandler: function(ele, handler, context) {
        var handlers = ele.__z_resizeListeners;
        if (handlers) {
            var size = handlers.length;
            for (var i = 0; i < size; i++) {
                var h = handlers[i];
                if (h.handler === handler && h.context === context) {
                    handlers.splice(i, 1);
                    return;
                }
            }
        }
    },
    _handleObjectLoad: function(e) {
        var ele = e.target || e.srcElement;
        ele.contentDocument.defaultView.__resizeTrigger__ = ele.__resizeElement__;
        ele.contentDocument.defaultView.onresize = EleResize._handleResize;
    },
    _createResizeTrigger: function(ele) {
        var obj = document.createElement('object');
        obj.setAttribute(
            'style',
            'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden;opacity: 0; pointer-events: none; z-index: -1;'
        );
        obj.onload = EleResize._handleObjectLoad;
        obj.type = 'text/html';
        ele.appendChild(obj);
        obj.data = 'about:blank';
        return obj;
    },
};

function on(ele, handler, context) {
    var handlers = ele.__z_resizeListeners;
    if (!handlers) {
        handlers = [];
        ele.__z_resizeListeners = handlers;
        if (document.attachEvent) {
            //ie9-10
            ele.__resizeTrigger__ = ele;
            ele.attachEvent('onresize', EleResize._handleResize);
        } else {
            if (getComputedStyle(ele, null).position === 'static') {
                ele.style.position = 'relative';
            }
            var obj = EleResize._createResizeTrigger(ele);
            ele.__resizeTrigger__ = obj;
            obj.__resizeElement__ = ele;
        }
    }
    handlers.push({
        handler: handler,
        context: context,
    });
}

function off(ele, handler, context) {
    var handlers = ele.__z_resizeListeners;
    if (handlers) {
        EleResize._removeHandler(ele, handler, context);
        if (handlers.length === 0) {
            if (document.attachEvent) {
                //ie9-10
                ele.detachEvent('onresize', EleResize._handleResize);
                delete ele.__z_resizeListeners;
            } else {
                var trigger = ele.__resizeTrigger__;
                if (trigger) {
                    trigger.contentDocument.defaultView.removeEventListener(
                        'resize',
                        EleResize._handleResize
                    );
                    ele.removeChild(trigger);
                    delete ele.__resizeTrigger__;
                }
                delete ele.__z_resizeListeners;
            }
        }
    }
}

export default { on, off };
