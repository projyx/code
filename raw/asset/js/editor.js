window.editor = {};

window.editor.elements = {};
window.editor.elements.onmouseout = async function(event) {
    var target = event.target;
    var box = target.closest('box');
    //console.log(box);
    if (box) {
        //console.log(node);
        var node = box.node;
        if (node) {
            var component = target.closest('component');
            var editor = component.querySelector('iframe');
            var contentWindow = editor.contentWindow;
            var doc = contentWindow.document;
            doc.querySelectorAll("div:has(+ body)").forEach(function(el) {
                el.remove();
            });
        }
    }
}
window.editor.elements.onmouseover = async function(event) {
    var target = event.target;
    var doc = target.ownerDocument;
    var component = target.closest('component');
    var editor = component.querySelector('iframe');
    var contentWindow = editor.contentWindow;
    var select = target.closest('box.element > *');
    var element = target.closest('box.element');
    var node = element && element.node ? element.node : null;
    if (node) {
        var doc = contentWindow.document;
        doc.querySelectorAll("div:has(+ body)").forEach(function(e) {
            e.remove();
        })

        var el = doc.createElement("div");
        el.style.position = "relative";
        el.style.zIndex = "132456789";
        doc.querySelector("body").insertAdjacentHTML('beforebegin', el.outerHTML);

        const host = doc.querySelector("div:has(+ body)");
        const shadow = host.attachShadow({
            mode: "open"
        });

        var viewportOffset = node.getBoundingClientRect();
        var top = viewportOffset.top + "px";
        ;var left = viewportOffset.left + "px";
        ;var computed = getComputedStyle(node);
        var boxSizing = computed.getPropertyValue("box-sizing");
        var borderTop = computed.getPropertyValue("border-left-width") + " solid orange";
        var borderLeft = computed.getPropertyValue("border-left-width") + " solid orange";
        var borderRight = computed.getPropertyValue("border-right-width") + " solid orange";
        var borderBottom = computed.getPropertyValue("border-bottom-width") + " solid orange";
        var marginTop = computed.getPropertyValue("margin-top");
        var marginLeft = computed.getPropertyValue("margin-left");
        var marginRight = computed.getPropertyValue("margin-right");
        var marginBottom = computed.getPropertyValue("margin-bottom");
        var paddingTop = computed.getPropertyValue("padding-top");
        var paddingLeft = computed.getPropertyValue("padding-left");
        var paddingRight = computed.getPropertyValue("padding-right");
        var paddingBottom = computed.getPropertyValue("padding-bottom");
        var height = computed.getPropertyValue("height");
        var width = computed.getPropertyValue("width");

        var overlay = doc.createElement('custom-element');
        overlay.className = "overlay";
        overlay.id = "overlay";
        overlay.style.position = "fixed";
        overlay.style.backgroundColor = "rgba(39, 151, 252, 0.38)";
        //overlay.style.borderColor = "#de9757bf";
        overlay.style.boxSizing = boxSizing;
        overlay.style.paddingTop = paddingTop;
        overlay.style.paddingLeft = paddingLeft;
        overlay.style.paddingRight = paddingRight;
        overlay.style.paddingBottom = paddingBottom;
        overlay.style.height = height;
        overlay.style.width = width;
        overlay.style.left = left;
        overlay.style.top = top;

        var pad = doc.createElement('custom-padding');
        pad.style.boxSizing = boxSizing;
        pad.style.borderTop = paddingTop + " solid rgba(130, 211, 133, 0.63)";
        pad.style.borderLeft = paddingLeft + " solid rgba(130, 211, 133, 0.63)";
        pad.style.borderRight = paddingRight + " solid rgba(130, 211, 133, 0.63)";
        pad.style.borderBottom = paddingBottom + " solid rgba(130, 211, 133, 0.63)";
        pad.style.top = 0;
        pad.style.left = 0;
        pad.style.width = width;
        pad.style.height = height;
        overlay.appendChild(pad);

        var margins = doc.createElement('custom-margins');
        margins.style.borderTop = marginTop + " solid rgba(222, 151, 87, 0.75)";
        margins.style.borderLeft = marginLeft + " solid rgba(222, 151, 87, 0.75)";
        margins.style.borderRight = marginRight + " solid rgba(222, 151, 87, 0.75)";
        margins.style.borderBottom = marginBottom + " solid rgba(222, 151, 87, 0.75)";
        margins.style.top = "-" + marginTop;
        margins.style.left = "-" + marginLeft;
        margins.style.right = marginRight;
        margins.style.width = "100%";
        margins.style.height = height;
        overlay.appendChild(margins);

        style = `<style>custom-element {
            display: flex;
            position: relative;
        } custom-padding {
            position: absolute;
        } custom-margins {
            position: absolute;
        }</style>`;
        shadow.innerHTML = style + overlay.outerHTML;

        0 > 1 ? console.log(23, {
            computed,
            host,
            node,
            style: node.style,
            computed: node.computedStyleMap(),
            styles: {
                borderTop,
                borderLeft,
                borderRight,
                borderBottom,
                paddingTop,
                paddingLeft,
                paddingRight,
                paddingBottom,
                height,
                width
            },
            shadow
        }) : null;
    }
}
window.editor.elements.selector = async function(event) {
    var keyCode = event.keyCode;
    var target = event.target;
    var type = event.type;
    //console.log(106, event, keyCode);

    if (type === "keydown") {
        //TAB
        if (keyCode === 9) {
            event.preventDefault();
            var declaration = target.parentNode.nextElementSibling;
            console.log(186, {
                declaration
            });
            if (declaration) {
                var property = declaration.querySelector('.property');
                console.log(188, {
                    property
                });
                if (property) {
                    target.removeAttribute('contenteditable');
                    property.setAttribute('contenteditable', true);
                    if (document.body.createTextRange) {
                        var range = document.body.createTextRange();
                        range.moveToElementText(property);
                        range.select();
                    } else if (window.getSelection) {
                        var selection = window.getSelection();
                        var range = document.createRange();
                        range.selectNodeContents(property);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            }
        }
    }
}
window.editor.elements.property = async function(event) {
    var keyCode = event.keyCode;
    var target = event.target;
    var type = event.type;
    //console.log(106, event, keyCode);

    if (type === "keydown") {
        var text = target.closest('text');
        text.classList.add('focus');
        console.log(186, {
            keyCode,
            target: target.textContent,
            text
        });
        //TAB
        if (keyCode === 9) {
            event.preventDefault();
            var value = target.parentNode.querySelector('.value');
            text.classList.add('ed');
            console.log(190, {
                target: target.textContent,
                text,
                value
            });
            if (value) {
                console.log(151, {
                    target: target.textContent,
                    text,
                    value
                });
                if (text.classList.contains('connected')) {

                    //if(dsp.textContent.length === 0 || (dsp.textContent.length > 0 && dsv.textContent.length === 0)) {
                    //text.remove();
                    //}

                    if (text.classList.contains('focus')) {

                        value.setAttribute('contenteditable', true);
                        value.focus();

                    } else {

                        target.removeAttribute('contenteditable');
                        value.setAttribute('contenteditable', true);
                        console.log(197, {
                            value: value.textContent.length
                        });
                        if (value.textContent.length > 0) {
                            if (document.body.createTextRange) {
                                var range = document.body.createTextRange();
                                range.moveToElementText(value);
                                range.select();
                            } else if (window.getSelection) {
                                var selection = window.getSelection();
                                var range = document.createRange();
                                range.selectNodeContents(value);
                                selection.removeAllRanges();
                                selection.addRange(range);
                            }
                        } else {
                            console.log(210, value, text);
                            //value.focus();
                        }

                    }

                } else {

                    if (target.textContent.length > 0) {
                        target.removeAttribute('contenteditable');
                        value.setAttribute('contenteditable', true);
                        console.log(197, {
                            value: value.textContent.length
                        });
                        if (value.textContent.length > 0) {
                            text.classList.add('focus');
                            if (document.body.createTextRange) {
                                var range = document.body.createTextRange();
                                range.moveToElementText(value);
                                range.select();
                            } else if (window.getSelection) {
                                var selection = window.getSelection();
                                var range = document.createRange();
                                range.selectNodeContents(value);
                                selection.removeAllRanges();
                                selection.addRange(range);
                            }
                        } else {
                            console.log(210, value);
                            text.classList.add('focus');
                            value.focus();
                        }
                        console.log(206, {
                            value
                        });
                    } else {//target.blur();
                    }

                    //focus && focus.closest('text') ? focus.closest('text').remove() : null;

                }
            }
        }
    }
}
window.editor.elements.value = async function(event) {
    var keyCode = event.keyCode;
    var target = event.target;
    var type = event.type;
    //console.log(106, event, keyCode);

    if (type === "keydown") {
        //TAB
        if (keyCode === 9) {
            event.preventDefault();
            var declaration = target.parentNode.nextElementSibling;
            console.log(186, {
                declaration
            });
            if (declaration) {
                var property = declaration.querySelector('.property');
                console.log(188, {
                    property
                });
                if (property) {
                    target.removeAttribute('contenteditable');
                    property.setAttribute('contenteditable', true);
                    if (document.body.createTextRange) {
                        var range = document.body.createTextRange();
                        range.moveToElementText(property);
                        range.select();
                    } else if (window.getSelection) {
                        var selection = window.getSelection();
                        var range = document.createRange();
                        range.selectNodeContents(property);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            } else {
                var footer = target.closest('column').parentNode.lastElementChild;
                console.log(248, footer);
                triggerMouseEvent(footer, "mousedown");
                triggerMouseEvent(footer, "mouseup");
            }
        }
    }
}
window.editor.elements.styles = function(event) {
    var target = event.target;
    var box = target.closest('box');
    console.log(110, event.type, {
        box,
        target
    }, event);

    if ((["mouseup", "mousedown"].includes(event.type) && event.which === 1) || (event.type === "focusout")) {
        if (box) {

            var children = box.parentNode.children;
            var index = Array.from(children).indexOf(box);
            var last = index === children.length - 1;
            var className = target.closest('box > header > .slct > span:first-child');
            //console.log(123, event.type);
            //box.nulled = null;

            if (box && ["focusout", "mouseup"].includes(event.type)) {
                var dspx = target.closest('span.property');
                var dsvx = target.closest('span.value');
                var dsp = dsvx ? dsvx.parentNode.querySelector('span.property') : target.closest('span.property');
                var dsv = dspx ? dspx.parentNode.querySelector('span.value') : target.closest('span.value');
                dsp ? null : dsp = box.querySelector('span.property');
                dsv ? null : dsv = box.querySelector('span.value');
                console.log(112, 113, 120, {
                    dsp,
                    dsv
                }, target, event.type);
                var ep = (dsp && dsp.textContent === "");
                var ev = (dsv && dsv.textContent === "");
                var epnv = (dsp && !dsv && (dsp.textContent !== ""));
                var npfv = (!dsp && dsv && (dsv.textContent !== ""));
                var epfv = (dsp && dsv && (dsp.textContent === "" && dsv.textContent !== ""));
                var fpev = (dsp && dsv && (dsp.textContent !== "" && dsv.textContent === ""));
                console.log(114, 115, 120, {
                    dsp,
                    dsv
                }, {
                    ep,
                    ev,
                    epnv,
                    npfv,
                    epfv,
                    fpev
                }, event.type);
                if (ep || ev || fpev || epnv || epfv || npfv) {
                    var focus = dsp || dsv;
                    if (focus) {
                        if (focus.closest('box').deselection === false || !focus.closest('box').deselection) {
                            focus.closest('box').deselection = true;
                        }
                        console.log(120, 'deselection', {
                            focus
                        });
                        focus.blur();
                        var text = focus.closest('text');
                        //console.log(362, 'select.focus', text, dsp.textContent.length, dsv.textContent.length);
                        if (text.classList.contains('connected')) {
                            //if (dsp.textContent.length === 0 || (dsp.textContent.length > 0 && dsv.textContent.length === 0)) {
                            if (text.classList.contains('focus')) {
                                console.log(365, 'select.focus', {
                                    text,
                                    dspx,
                                    dsvx,
                                    ptl: dsp.textContent.length,
                                    vtl: dsv.textContent.length
                                });
                                if (dspx) {
                                    console.log(369, 'property.value dspx', {
                                        text,
                                        dspx,
                                        dsp,
                                        toxt: dsp.textContent,
                                        dsvx,
                                        dsv,
                                        tuxt: dsv.textContent
                                    });
                                    if (dspx.textContent.length > 0) {
                                        console.log(381, 'value.focus', {
                                            dspx,
                                            dsvx
                                        });
                                        if (!text.classList.contains('ed')) {
                                            text.remove();
                                        }
                                        //dsv.setAttribute('contenteditable', true);
                                        //dsv.focus();
                                    } else {
                                        text.remove();
                                    }
                                } else if (dsvx) {
                                    //console.log(369, 'property.value dsvx', dsvx);
                                    if (dsvx.textContent.length === 0) {
                                        text.remove();
                                    }
                                }
                            } else {
                                //console.log(391, text);
                                if (text.classList.contains('connected')) {
                                    text.remove();
                                } else {
                                    text.remove();
                                }
                            }
                            //}
                            //focus && focus.closest('text') ? focus.closest('text').remove() : null;
                        } else {
                            focus && focus.closest('text') ? focus.closest('text').remove() : null;
                        }
                    }
                }
            }

            if (event.type === "mousedown" && (box.unfocused === true || !box.unfocused)) {
                box.nulled = false;
                box.unfocused = false;
            }
            if (event.type === "focusout") {
                box.nulled = true;
                box.unfocused = true;
            }

            if (box) {//console.log(127, box.deselection, event.type, box.nulled);
            }

            if (box && ["mouseup"].includes(event.type) && (box.deselection === false || !box.deselection) && (box.nulled === false || !box.nulled)) {
                var children = box.parentNode.children;
                var index = Array.from(box.parentNode.children).indexOf(box);
                var text = target.closest('box > column > text');
                var footer = target.closest('box > footer');
                var header = target.closest('box > header');
                var className = target.closest('box > header > .slct span:first-child');
                var prop = target.closest('.property');
                var val = target.closest('.value');
                var property = prop ? prop.textContent : null;
                var value = val ? val.textContent : null;
                var element = null;
                0 > 1 ? console.log(8, 'editor.elements.styles', {
                    index,
                    box,
                    box: box.parentNode,
                    children,
                    className,
                    header,
                    footer,
                    target,
                    property,
                    value,
                    prop,
                    val
                }) : null;
                Array.from(target.closest('aside').querySelectorAll("[contenteditable]")).forEach(function(element) {
                    element.removeAttribute('contenteditable');
                });
                var elem = box.querySelector('column');
                var insert = false;
                if (target === box) {
                    console.log(130, 'editor.elements.styles select.selector', {
                        header
                    });
                    var insert = 'afterbegin';
                } else if (isDescendant(footer, target) || footer === target) {
                    console.log(130, 'editor.elements.styles select.selector', {
                        footer
                    });
                    var insert = 'beforeend';
                } else if (isDescendant(header, target) || header === target) {
                    console.log(130, 'editor.elements.styles select.selector', {
                        header
                    });
                    var insert = 'afterbegin';
                } else if (className) {
                    console.log(130, 'editor.elements.styles select.selector', {
                        className
                    });
                    var className = target.closest('box > header > span:first-child');
                } else if (target === text) {
                    var insert = 'afterend';
                    var elem = text;
                    console.log(130, 'editor.elements.styles select.selector', {
                        insert,
                        elem
                    });
                }
                if (Array.from(children).indexOf(box) === children.length - 1) {
                    0 > 1 ? console.log(121, 'editor.elements.styles select.box', {
                        index,
                        insert,
                        target,
                        box
                    }) : null;
                    if (insert) {
                        var template = target.closest('aside').nextElementSibling.content.firstElementChild.querySelector('template').content.firstElementChild.cloneNode(true);
                        if (["afterbegin", "afterend", "beforeend"].includes(insert)) {
                            var elementChild = null;
                            insert === "afterbegin" ? elementChild = "firstElementChild" : null;
                            insert === "beforeend" ? elementChild = "lastElementChild" : null;
                            insert === "afterend" ? elementChild = "lastElementChild" : null;
                            //console.log(157, 'editor.elements.styles select', elementChild);
                            if (insert === "afterend") {
                                elem.insertAdjacentHTML(insert, template.outerHTML);
                            } else {
                                elem.insertAdjacentHTML(insert, template.outerHTML);
                            }
                            var text = box.querySelector('column')[elementChild];
                            //console.log(443, text);
                            if (insert === "afterend") {
                                prop = target.closest('text').nextElementSibling.querySelector('span.property');
                            } else {
                                prop = box.querySelector('column')[elementChild].querySelector('span.property');
                            }
                            //prop.setAttribute("onfocusout", `window.editor.elements.deselect(event)`);
                            select(prop);
                        }
                    }
                } else {
                    var el;
                    if (target.closest('span.property')) {
                        el = target.closest('span.property')
                    }
                    if (target.closest('span.value')) {
                        el = target.closest('span.value')
                    }
                    console.log(532, {
                        el,
                        insert
                    });
                    if (insert) {
                        var template = target.closest('aside').nextElementSibling.content.firstElementChild.querySelector('template').content.firstElementChild.cloneNode(true);
                        if (["afterbegin", "afterend", "beforeend"].includes(insert)) {
                            var elementChild = null;
                            insert === "afterbegin" ? elementChild = "firstElementChild" : null;
                            insert === "beforeend" ? elementChild = "lastElementChild" : null;
                            insert === "afterend" ? elementChild = "lastElementChild" : null;
                            console.log(157, 'editor.elements.styles select', elementChild);
                            if (!className) {
                                elem.insertAdjacentHTML(insert, template.outerHTML);
                            }
                            var text = box.querySelector('column')[elementChild];
                            console.log(443, text);
                            if (insert === "afterend") {
                                prop = target.closest('text').nextElementSibling.querySelector('span.property');
                            } else {
                                prop = box.querySelector('column')[elementChild].querySelector('span.property');
                            }
                            //prop.setAttribute("onfocusout", `window.editor.elements.deselect(event)`);
                            select(prop);
                        }
                    } else {
                        select(el)
                    }
                }
                function select(el) {
                    0 > 1 ? console.log(175, 'editor.elements.styles select', {
                        el,
                        className,
                        index,
                        last,
                        prop,
                        val
                    }) : null;
                    if (className && !last) {
                        className.setAttribute("contenteditable", true);
                        className.focus();
                        element = className;
                    } else if (prop) {
                        if ((!last && !className) || last) {
                            prop.setAttribute("contenteditable", true);
                            prop.focus();
                            element = prop;
                        }
                    } else if (val) {
                        val.setAttribute("contenteditable", true);
                        val.focus();
                        element = val;
                    }
                    if (className || prop || val) {
                        if ((!last && !className) || last) {
                            if (document.body.createTextRange) {
                                var range = document.body.createTextRange();
                                range.moveToElementText(el);
                                range.select();
                            } else if (window.getSelection) {
                                var selection = window.getSelection();
                                var range = document.createRange();
                                range.selectNodeContents(el);
                                selection.removeAllRanges();
                                selection.addRange(range);
                            }
                        }
                    }
                }
            }
            console.log(216, {
                dsvx,
                dspx
            }, box.deselection, target.closest('span.property'));
            if (box.deselection === true && ["focusout", "mouseup"].includes(event.type)) {
                box.deselection = false;
            }

            dsvx ? dsvx.closest('text').removeAttribute('class') : null;

            if (event.type === "mouseup") {
                box.nulled = false;
                box.unfocused = false;
                if ((target.closest('span.property') || target.closest('span.value')) && (target.closest('span.property') !== el || target.closest('span.value') !== el)) {
                    var node = target.closest('span.property') || target.closest('span.value');
                    console.log(636, 'focus else', {
                        target,
                        node
                    });
                    //triggerMouseEvent(node, "mousedown");
                    //triggerMouseEvent(node, "mouseup");
                }
            }
        }

        if (event.type === "focusout") {
            var target = event.target;
            var type = event.type;
            var box = target.closest('box');
            if (box && target.closest('.value')) {
                var col = box.querySelector('column');
                var span = box.querySelector('header > .file > span');
                var src = span.getAttribute('src');
                var href = span.getAttribute('href');
                var node = box.node;
                var stylesheets = document.getElementById('preview-editor').contentWindow.document.styleSheets;
                //var sheets = Array.from(stylesheets).filter(o=>o.href === href);
                //var sheets = document.getElementById('preview-editor').contentWindow.document.querySelectorAll('link[href][rel="stylesheet"]');
                box.setAttribute('data-href', href);
                box.setAttribute('data-src', src);
                var selector = box.node.getAttribute('selector');
                var rules = selector;
                rules += ' { ';
                Array.from(box.querySelector('column').children).forEach(function(el) {
                    rules += el.querySelector('.property').textContent + ': ' + el.querySelector('.value').textContent + '; ';
                })
                rules += '}';
                var cssText = selector + ' ' + rules;
                var parse = parseCSSText(cssText);
                box.node.textContent = rules;

                console.log(645, 'declick', {
                    parse,
                    box,
                    node: box.node,
                    rule: box.rule,
                    rules,
                    cssText,
                    target,
                    type,
                    src,
                    href
                });

                var html = [];
                var cc = Array.from(col.children);
                cc.length > 0 ? cc.forEach(el=>{
                    console.log(669, {
                        cc
                    });
                    html.push(el.querySelector('.property').textContent + ":" + el.querySelector('.value').textContent);
                }
                ) : null;
                var css = box.querySelector('header > .slct > span').textContent + " { " + html.join('; ') + " }";

                // get stylesheet(s)
                var stylesheets = document.getElementById('preview-editor').contentWindow.document.styleSheets;
                window.sheets = window.sheets ? window.sheets : null;
                if (!sheets)
                    window.sheets = [...stylesheets];
                else if (window.sheets.sup) {
                    // sheets is a string
                    let absoluteURL = new URL(window.sheets,document.baseURI).href;
                    window.sheets = [...stylesheets].filter(i=>i.href == absoluteURL);
                } else {
                    window.sheets = window.sheets;
                    //[window.sheets];
                }
                // sheets is a stylesheet                
                var sheet = window.sheets.filter(checkSheet)[0];
                function checkSheet(s) {
                    if (s.href && !s.parentStyleSheet) {
                        if (s.href === box.rule.parentStyleSheet.ownerNode.href) {
                            return true;
                        }
                        if (s.href === box.rule.href) {
                            return true;
                        }
                    }
                    if (!s.href && s.parentStyleSheet.ownerNode.href) {
                        if (s.parentStyleSheet.ownerNode.href === box.rule.parentStyleSheet.ownerNode.href) {
                            return true;
                        }
                        if (s.parentStyleSheet.ownerNode.href === box.rule.href) {
                            return true;
                        }
                    }
                }
                var parse = parseCSSText(css);
                var node = box.node;

                console.log(709, {
                    box,
                    css,
                    rule: box.rule,
                    sheets
                });

                //var cssom = makeSearcher(box.rule);
                var cssom = getParents(node, 'css *');
                console.log(668, {
                    box,
                    css,
                    cssom,
                    node,
                    rule: box.rule,
                    sheets,
                    sheet
                });
                var desc = [];
                Array.from(cssom).reverse().forEach(function(el, index) {
                    var tagName = el.tagName.toLowerCase();
                    var conditionText = el.getAttribute('condition');
                    var css = el.getAttribute('css');
                    if (css === "media") {
                        desc.push({
                            el,
                            parse: parseCSSText(box.rule.cssText),
                            conditionText,
                            type: 4
                        });
                    }
                    if (css === "style") {
                        desc.push({
                            el,
                            parse: parseCSSText(box.rule.cssText),
                            selectorText: box.rule.selectorText,
                            type: 1
                        });
                    }
                    console.log(749, {
                        el
                    });
                });
                var cssText = "";
                var nest = [];
                desc.forEach(leaf=>{
                    var type = leaf.type;
                    0 < 1 ? console.log(777, {
                        type
                    }) : null;
                    
                    if (type === 4) {
                        cssText += "@media " + leaf.conditionText + " { ";
                        nest.push(twig);
                    }
                    if (type === 1) {
                        cssText += box.rule.selectorText + " { ";
                        nest.push(twig);
                    }
                }
                );
                desc.forEach(leaf=>{
                    var el = leaf.el;
                    var css = el.getAttribute('css');
                    if(css === "style") {
                        var ruler = parse.cssText.split('{')[1].split('}')[0];                    
                        cssText += ruler;
                    }
                }
                );
                desc.forEach(leaf=>{
                    var type = leaf.type;
                    
                    cssText += " }";
                }
                );
                sheet.insertRule(parse.cssText, sheet.cssRules.length - 1);
                //cssText = `.component-home .home-people .people-user { display: flex; width: calc((100% - 220px) / 12); }`;
                //sheet.addRule(box.rule.selectorText, parseCSSText(css).cssText.split('{')[1].split('}')[0], 1);
                console.log(688, 'sheet.insertRule', sheet, {
                    desc,
                    selectorText: box.rule.selectorText,
                    parse,
                    cssText
                }, {
                    css,
                    box: box,
                    rule: box.rule,
                    target
                });
                //}
                //);
                //})
            }
        }
    }
}
window.editor.elements.onkeyup = function(event) {
    console.log(253, event.keyCode);
    var target = event.target;
}
window.editor.elements.selecting = function(event) {
    var target = event.target;
    var component = target.closest('component');
    var editor = component.querySelector('iframe');
    var contentWindow = editor.contentWindow;
    var select = target.closest('box.element > *');
    var element = select.closest('box.element');
    var elements = document.querySelectorAll('box.element');
    var startTag = document.querySelectorAll('box.element > header');
    var index = Array.from(startTag).indexOf(element.firstElementChild);
    var doc = contentWindow.document;
    var node = element && element.node ? element.node : null;

    console.log(5, 'editor.elements.select variables', {
        target,
        node
    });

    Array.from(target.closest('component').querySelectorAll('.tools-tab.tab-elements .selected')).forEach(function(el) {
        el.classList.remove('selected');
    });
    target.classList.add('selected');

    var stylesheets = doc.styleSheets;
    var styles = getComputedStyle(node);
    console.log(5, 'editor.elements.select styles', {
        stylesheets,
        styles
    });

    //CSS ELEMENT
    if (stylesheets.length > 0) {
        console.log(680, 'editor.elements.select', {
            stylesheets
        });
        var s = 0;
        var rule = stylesheets[s];
        var css = {};
        var template = document.createElement('css');
        document.head.querySelector('css') ? document.head.querySelector('css').remove() : null;
        document.head.insertAdjacentHTML('beforeend', template.outerHTML);
        template = document.head.querySelector('css');
        //SHEET
        do {
            var stylesheet = stylesheets[s];
            var cssRules = stylesheet.cssRules;
            var mediaRule = cssRules.MEDIA_RULE;
            console.log(690, {
                stylesheet,
                cssRules,
                mediaRule
            });
            var sheet = document.createElement("sheet");
            if (stylesheet.href) {
                sheet.setAttribute("href", stylesheet.href);
                sheet.setAttribute("src", stylesheet.ownerNode.dataset.src);
                template.insertAdjacentHTML('beforeend', sheet.outerHTML);
            }
            list = template.lastElementChild;
            var next = template.lastElementChild;
            var ss = 0;
            var ii = 0;
            //var list = stylesheet.cssRules;
            do {
                var cssRule = cssRules[ss];
                var sss = 0;
                list ? null : list = template.lastElementChild;
                console.log(699, {
                    cssRule,
                    template,
                    list,
                    last: template.lastElementChild,
                    file: template.lastElementChild.closest('sheet').getAttribute('src')
                });
                //RULE
                if (cssRule) {
                    var type = cssRule.type;
                    var ownerNode = cssRule.parentStyleSheet.ownerNode;
                    if (list || ownerNode) {
                        //var list = cssRule.cssRules;
                        var src = ownerNode.dataset.src;
                        css[src] ? null : css[src] = [];
                        0 < 1 ? console.log(714, {
                            css,
                            list
                        }) : null;

                        //STYLERULE:1
                        0 < 1 ? console.log(729, type, {
                            css,
                            src
                        }, {
                            list,
                            next
                        }) : null;
                        if (type === 1) {
                            var obj = "";
                            next.insertAdjacentHTML('beforeend', '<rule css="style" uid="' + Crypto.uid.create(1) + '"></rule>');
                            list = next.lastElementChild ? next.lastElementChild : list.closest(':has(~ [dom]) ~ [dom]');
                        }
                        //MEDIARULE:4
                        if (type === 4) {
                            var obj = []
                            console.log(817, {
                                next
                            });
                            next.insertAdjacentHTML('beforeend', '<rule css="media" dom="' + ii + '" uid="' + Crypto.uid.create(1) + '"></rule>');
                            next.lastElementChild.mr = obj;
                            next.lastElementChild.setAttribute('condition', cssRule.conditionText);
                            console.log(752.1, {
                                next: next.outerHTML,
                                list: list.outerHTML,
                                sheet: sheet.outerHTML
                            });
                            list = next.lastElementChild ? next.lastElementChild : list.closest(':has(~ [dom]) ~ [dom]');
                            console.log(752.2, {
                                next: next.outerHTML,
                                list: list.outerHTML,
                                sheet: sheet.outerHTML
                            });
                            ii++
                        }
                        console.log(sss, 698, 698.2, type, 'stylesheet.mediarule', obj);
                        if (css[src]) {
                            var lastRule = 0 > 1;
                            if (lastRule) {//var irule = ;
                            }

                            css[src].push(obj);
                        }
                    }
                    do {
                        if (cssRule && cssRule.cssRules[sss]) {
                            //var style = cssRule && css.cssRules && cssRule.cssRules[sss] ? cssRule.cssRules[sss].style : null;
                            0 < 1 ? console.log(707, {
                                cssRule,
                                cssRules,
                                ownerNode
                            }) : null;

                            console.log(748, 'lastRule', src, sss, {
                                cssRules: cssRule.cssRules,
                                length: cssRule.cssRules.length
                            });
                            ///list[sss] ? Object.keys(css[src]) = list[sss] : null;
                            if (ss === cssRules.length - 1) {
                                var csr = css[src];
                                var more = document.head.querySelector('css').querySelector('rule[dom]');
                                if (sss === cssRule.cssRules.length - 1) {
                                    if (list && list instanceof HTMLElement) {
                                        var what = list.closest(':has(~ [dom]) ~ [dom]');
                                        console.log(749, 749.1, 'lastRule', {
                                            sss,
                                            src
                                        }, {
                                            csr,
                                            css,
                                            cssRule,
                                            rules: cssRule.cssRules,
                                            rule: cssRule.cssRules[sss]
                                        }, {
                                            more: more ? [more, more.outerHTML] : null,
                                            what: what ? [what, what.outerHTML] : null,
                                            list: list ? [list, list.outerHTML] : null,
                                            next: next ? [next, next.outerHTML] : null
                                        });
                                        more ? more.removeAttribute('dom') : null;
                                        //more ? next = more : next = null;
                                        //list.querySelector(' ')
                                        list = list.parentNode;
                                        //.querySelector(':has(> rule[css="media"][dom]:empty) ~ rule[css="media"][dom]:empty')
                                    }
                                }
                                more ? more.removeAttribute('dom') : null;
                                console.log(749, 749.2, 'lastRule', {
                                    sss,
                                    src
                                }, {
                                    csr,
                                    css,
                                    cssRule,
                                    rules: cssRule.cssRules,
                                    rule: cssRule.cssRules[sss]
                                }, {
                                    more: more ? [more, more.outerHTML] : null,
                                    what: what ? [what, what.outerHTML] : null,
                                    list: list ? [list, list.outerHTML] : null,
                                    next: next ? [next, next.outerHTML] : null
                                });
                                //list = list.parentNode.firstElementChild('')
                                //list = document.querySelector('css')
                            }
                            //else {
                            //console.log(834.1, list ? list.outerHTML : null);
                            var dommie = list && list instanceof HTMLElement ? list.closest(':has(~ [dom]) ~ [dom]') : null;
                            list = dommie ? dommie : document.querySelector('css').querySelector('rule[dom]');
                            //console.log(834.2, sheet, list ? list.outerHTML : null);
                            if (list || !list) {
                                type = cssRule.cssRules[sss].type === 1 ? 'style' : '';
                                type = type ? type : cssRule.cssRules[sss].type === 4 ? 'media' : '';
                                var cssObject = parseCSSText(cssRule.cssRules[sss].cssText);
                                var selector = cssRule.cssRules[sss].selectorText;

                                var declaration = '';
                                if (type === "style") {
                                    declaration = '{';
                                    //template.querySelector('header').innerHTML = '<span onkeydown="window.editor.elements.selector(event)" onkeyup="window.editor.elements.selector(event)">' + selectorText + '</span> <span>{</span>';
                                    Object.keys(cssObject.style).forEach((prop,index)=>{
                                        prop = prop.replace(/[A-Z]/g, m=>"-" + m.toLowerCase());
                                        val = Object.values(cssObject.style)[index];
                                        console.log(66, {
                                            prop,
                                            val
                                        });
                                        declaration += prop + ':' + val + ';';
                                    }
                                    );
                                    declaration += '}';
                                }
                                var elur = document.querySelector('css').querySelectorAll('rule');
                                var lure = elur[elur.length - 1];
                                var ee = elur[elur.length - 1].children.length > 0 ? elur[elur.length - 1] : elur[elur.length - 1];
                                var eee = elur.length > 0;

                                cssRule.cssRules[sss].type === 1 ? type = "style" : null;
                                cssRule.cssRules[sss].type === 4 ? type = "media" : null;
                                var cond = type === "media" && !list;
                                where = cond ? 'afterend' : 'beforeend';

                                if (list) {
                                    var edon = list;
                                } else {
                                    var last = elur[elur.length - 1];
                                    if (cssRule.cssRules[sss].type === 4 && last.parentNode.getAttribute('condition') === cssRule.cssRules[sss].parentRule.conditionText) {
                                        var edon = last;
                                    } else if (cssRule.cssRules[sss].type === 1 && last.parentNode.getAttribute('condition') && last.parentNode.getAttribute('condition') !== cssRule.cssRules[sss].parentRule.conditionText && last.parentNode.parentNode.closest('sheet')) {
                                        var edon = last.parentNode.parentNode;
                                    } else if (cssRule.cssRules[sss].type === 1 && !last.parentNode.getAttribute('condition')) {
                                        if (last.innerHTML === "") {
                                            var edon = last;
                                        } else {
                                            var edon = last.parentNode;
                                        }
                                    } else {
                                        var edon = last.parentNode;
                                    }
                                    if (cssRule.cssRules[sss].type === 4 || cssRule.cssRules[sss].type === 1) {
                                        console.log({
                                            edon,
                                            ct: cssRule.cssRules[sss].type
                                        }, {
                                            last,
                                            pn: last.parentNode
                                        }, {
                                            lc: last.parentNode.getAttribute('condition'),
                                            pc: cssRule.cssRules[sss].parentRule.conditionText
                                        }, {
                                            st: cssRule.cssRules[sss].selectorText
                                        });
                                    }
                                }
                                var ifit = cond ? 'nextElementSibling' : 'lastElementChild';
                                console.log(961, {
                                    cond,
                                    type,
                                    where,
                                    text: cssRule.cssRules[sss].selectorText || cssRule.cssRules[sss].conditionText
                                }, {
                                    elur,
                                    edon,
                                    lure,
                                    sss: cssRule.cssRules[sss]
                                }, {
                                    ee,
                                    eee,
                                    eel: ee.length
                                });
                                edon.insertAdjacentHTML(where, '<rule css="' + type + '"' + (selector ? ' selector="' + selector + '"' : '') + '  id="' + Crypto.uid.create(1) + '">' + declaration + '</rule>');
                                var elur = document.querySelector('css').querySelectorAll('rule');
                                var elur = document.querySelector('css').querySelectorAll('rule');
                                var eee = elur.length > 0;
                                var ifit = cond ? 'nextElementSibling' : 'lastElementChild';
                                var lure = elur[elur.length - 1];
                                console.log(964, {
                                    type
                                }, {
                                    elur,
                                    edon,
                                    last: edon.lastElementChild
                                }, {
                                    ee,
                                    eee,
                                    eel: ee.length
                                }, {
                                    edonifit: edon[ifit],
                                    ifit
                                });
                                lure.mr = cssRule.cssRules[sss];
                                cssRule.cssRules[sss].type === 1 ? lure.setAttribute('class', selector) : null;
                                cssRule.cssRules[sss].type === 4 ? lure.setAttribute('condition', cssRule.cssRules[sss].conditionText) : null;
                                var cms = cssRule.cssRules[sss];
                                console.log(807, 807.1, {
                                    type,
                                    cms
                                }, {
                                    ee: ee.getAttribute('css'),
                                    list,
                                    edon,
                                    rule: cssRule.cssRules[sss],
                                    list,
                                    sheet,
                                    dommie,
                                    cssObject
                                }, cssRule.cssRules[sss], list instanceof HTMLElement);
                                if (type === "media") {
                                    loops(edon, cms);
                                    function loops(edo, cr, z, y) {
                                        var root = edo.lastElementChild && edo.lastElementChild.innerHTML === "" ? edo.lastElementChild : edo.nextElementSibling;
                                        console.log(869, 869.1, {
                                            edo,
                                            root,
                                            cr,
                                            z,
                                            cms
                                        });
                                        root ? null : root = edo;
                                        console.log(869, 869.2, {
                                            edo,
                                            root,
                                            cr,
                                            z,
                                            cms
                                        });
                                        if (cr) {
                                            var m = cr.cssRules;
                                            var r = 0;
                                            0 < 1 ? console.log(873, '880 loop', {
                                                m
                                            }) : null;
                                            if (m.length > 0) {
                                                do {
                                                    var t = m[r].type === 1 ? 'style' : '';
                                                    t = t ? t : m[r].type === 4 ? 'media' : '';
                                                    console.log(875, m[r].type, {
                                                        t,
                                                        mr: m[r],
                                                        m,
                                                        cms,
                                                        z,
                                                        y,
                                                        root,
                                                        cr,
                                                        rules: cssRule.cssRules
                                                    });
                                                    root.mr = m[r];
                                                    //list.insertAdjacentHTML('beforeend', '<rule css="' + type + '"' + (selector ? ' selector="' + selector + '"' : '') + '  id="' + Crypto.uid.create(1) + '">' + declaration + '</rule>');
                                                    if (t === "media" || t === "style") {
                                                        cms = cms ? cms.cssRules[r] : null;
                                                        if (m[r]) {
                                                            var declaration = JSON.stringify(parseCSSText(m[r].cssText).style);
                                                            var selector = unescape(parseCSSText(m[r].cssText).ruleName);
                                                        }
                                                        console.log(982, {
                                                            length: m[r].cssRules.length,
                                                            mr: m[r],
                                                            root,
                                                            t,
                                                            rule: cssRule.cssRules[sss]
                                                        });
                                                        if (0 < 1) {
                                                            console.log(1059, {
                                                                root,
                                                                selector
                                                            });
                                                            root.insertAdjacentHTML('beforeend', `<rule css="${t}" id="${Crypto.uid.create(1)}">${declaration}</rule>`);
                                                            selector ? root.lastElementChild.setAttribute('selector', selector) : null;
                                                            t === "media" ? root.lastElementChild.setAttribute('recursive', true) : null;
                                                            root.lastElementChild.mr = m[r];
                                                            root.lastElementChild.setAttribute('selector', m[r].selectorText);
                                                        }
                                                        if (m && m[r].cssRules.length > 0) {
                                                            if (t === "media") {
                                                                rl = root.lastElementChild;
                                                            } else {
                                                                rl = root;
                                                            }
                                                            loops(rl, m[r], 'recursed=true', parseCSSText(cms.cssText));
                                                            console.log(876, 'media.type.recursion', t, root.lastElementChild.outerHTML, m[r], rl)
                                                        }
                                                        //m = cms;
                                                    }
                                                    r++;
                                                } while (r < m.length);
                                            }
                                        }
                                    }
                                    //list = list.lastElementChild;
                                    //cssRules = cssRule.cssRules[sss].cssRules;
                                    //sss = 0;
                                }
                            } else {
                                type = cssRule.cssRules[sss].type === 1 ? 'style' : '';
                                type = type ? type : cssRule.cssRules[sss].type === 4 ? 'media' : '';
                                var cssObject = parseCSSText(cssRule.cssRules[sss].cssText);
                                var selector = cssRule.cssRules[sss].selectorText;

                                var declaration = '';
                                if (type === "style") {
                                    declaration = '{';
                                    //template.querySelector('header').innerHTML = '<span onkeydown="window.editor.elements.selector(event)" onkeyup="window.editor.elements.selector(event)">' + selectorText + '</span> <span>{</span>';
                                    Object.keys(cssObject.style).forEach((prop,index)=>{
                                        prop = prop.replace(/[A-Z]/g, m=>"-" + m.toLowerCase());
                                        val = Object.values(cssObject.style)[index];
                                        console.log(66, {
                                            prop,
                                            val
                                        });
                                        declaration += prop + ':' + val + ';';
                                    }
                                    );
                                    declaration += '}';
                                }
                                if (type === "media") {
                                    var cr = cssRule.cssRules[sss];
                                    //var list = document.head.querySelector('css').querySelector('rule[dom]:empty');
                                    var rs = document.head.querySelector('css').querySelectorAll('rule');
                                    var pn = rs[rs.length - 1].parentNode;
                                    //list ? null : list = rs[rs.length - 1].parentNode;
                                    console.log(891, {
                                        list,
                                        cr,
                                        pn
                                    });
                                    Array.from(cr.cssRules).forEach((a,b)=>{
                                        console.log(872, {
                                            a,
                                            b,
                                            pn
                                        });
                                        var t = a.type === 1 ? "style" : "";
                                        t = t ? t : a.type === 4 ? "media" : "";
                                        if (list) {
                                            list.insertAdjacentHTML('beforeend', '<rule css="' + t + '"' + (a.selectorText ? ' selector=\"' + a.selectorText + '\"' : '') + '>' + JSON.stringify(parseCSSText(a.cssText).style) + '</rule>');
                                            list.lastElementChild.setAttribute('class', a.selectorText)
                                        }
                                    }
                                    );
                                    //cssRule.cssRules = cr.cssRules;
                                    //sss = -1;
                                    //forEach() 
                                    //declaration.push(obj);
                                }
                                //list.insertAdjacentHTML('beforeend', '<rule css="' + type + '"' + (selector ? ' selector="' + selector + '"' : '') + '>' + declaration + '</rule>');                          
                                console.log(807, 807.2, {
                                    list,
                                    dommie,
                                    cssObject
                                }, cssRule.cssRules[sss], list instanceof HTMLElement)
                            }
                            //}
                            sss++;
                        }
                    } while (sss < cssRule.cssRules.length);
                }
                //css.push(obj);
                ss++;
            } while (ss < cssRules.length);

            s++;
        } while (s < stylesheets.length);
        console.log('739', {
            css,
            stylesheets
        });
    }

    //STYLES PANEL
    if (document.head.querySelector('css')) {
        var css = document.head.querySelector('css');
        var rules = css.querySelectorAll('rule[css="style"]');
        var aside = component.querySelector('.tools-tab.tab-elements').querySelector('aside');
        aside.innerHTML = "";
        var conditions = [];
        Array.from(rules).forEach(function(rule, b) {
            var mr = rule.mr;
            var type = rule.getAttribute('css');
            var parent = rule.parentNode;
            var ancestors = getParents(rule, '[condition][css="media"]');
            var i = 0;
            ancestors.forEach((el)=>{
                conditions[i] = el.getAttribute('condition');
                i++;
            }
            )
            conditions = conditions.filter(n=>n && n.length > 0);
            if (conditions.length > 0) {
                console.log(1023, 'conditions', conditions);
                if (conditions.length > 1) {
                    var mm = [];
                    conditions.forEach((condition,index)=>{
                        var matchMedia = contentWindow.matchMedia(condition).matches;
                        var matches = element.node.matches(rule.mr.selectorText);
                        mm[index] = {
                            rule,
                            mr,
                            condition,
                            matchMedia,
                            matches,
                            node: element.node,
                            element
                        };
                    }
                    )
                    console.log(1033, 'mm', {
                        mm,
                        mr,
                        conditions
                    })
                } else {
                    var matchMedia = contentWindow.matchMedia(conditions[0]);
                    var matches = element.node.matches(mr.selectorText);
                    var matched = matchMedia && matches;
                    var mm = [];
                    matched ? mm.push({
                        matched,
                        matchMedia,
                        matches,
                        node: element.node,
                        element
                    }) : null;
                }
            } else {
                var matches = mr ? element.node.matches(mr.selectorText) : false;
                matched = true;
            }

            (mm && mm.length > 0) && matched ? console.log(1051, {
                mm,
                matchMedia: matchMedia.matches,
                matched,
                matches,
                conditions
            }) : null;

            var matchex = [];
            conditions.forEach((a,b)=>{
                var bool = contentWindow.matchMedia(a).matches;
                matchex.push(bool);
            }
            )
            var matcher = checker(matchex.filter(n=>n));
            console.log(1078, {
                conditions,
                matcher
            });

            if (matches) {
                var cssObject = parseCSSText(mr.cssText);
                var href = stylesheet.href;
                var link = mr.parentStyleSheet.ownerNode;
                var src = link.dataset.src;
                var dirs = rout.ed(src);
                var dir = dirs[dirs.length - 1];
                console.log(1005, {
                    ancestors,
                    conditions,
                    matchex,
                    matcher,
                    matches,
                    node: element.node,
                    selectorText: mr.selectorText,
                    dir,
                    mr,
                    parent,
                    rule,
                    type
                });
                var ww = [];
                var nope = false;
                var ruleHTML = "";
                conditions.length > 0 ? ruleHTML += '<span style="color:#aaa;font-family:monospace;">@media</span> ' : '';
                conditions.forEach((a,b)=>{
                    var matchMedia = contentWindow.matchMedia(a);
                    var bool = matchMedia && element.node.matches(mr.selectorText);
                    if (matchMedia.matches) {
                        ww.push(bool);
                        console.log(1065, {
                            a,
                            selectorText: mr.selectorText,
                            match: element.node.matches(mr.selectorText),
                            matchMedia: matchMedia.matches,
                            element,
                            node: element.node
                        });
                        ruleHTML += '<span>' + a + '</span>';
                    } else {
                        nope = true;
                    }
                }
                )

                if (nope === false) {
                    var template = aside.nextElementSibling.content.firstElementChild.cloneNode(true);
                    //template.querySelector('header').innerHTML = '<span onkeydown="window.editor.elements.selector(event)" onkeyup="window.editor.elements.selector(event)">' + selectorText + '</span> <span>{</span>';
                    var ww = [];
                    template.querySelector('header > .rule').innerHTML = ruleHTML;
                    template.querySelector('header > .file').innerHTML = '<span href="' + link.getAttribute('href') + '" src="' + link.dataset.src + '">' + dir + '</span>';
                    template.querySelector('header > .slct').innerHTML = '<span onkeydown="window.editor.elements.selector(event)" onkeyup="window.editor.elements.selector(event)">' + mr.selectorText + '</span> <span>{</span>';
                    var stylesList = template.querySelector('column');
                    Object.keys(cssObject.style).forEach((prop,index)=>{
                        prop = prop.replace(/[A-Z]/g, m=>"-" + m.toLowerCase());
                        val = Object.values(cssObject.style)[index];
                        console.log(66, {
                            prop,
                            val
                        });
                        const propertyValue = template.querySelector('template').content.firstElementChild.cloneNode(true)
                        propertyValue.classList.remove('connected');
                        propertyValue.removeAttribute('connected');
                        console.log(596, 'disconnect', propertyValue);
                        propertyValue.querySelector('.property').textContent = prop;
                        propertyValue.querySelector('.value').textContent = val;
                        stylesList.appendChild(propertyValue);
                        stylesList.appendChild(propertyValue);
                    }
                    );
                    template.querySelector('footer').textContent = "}";
                    var cssom = document.querySelector('css');
                    var node = cssom.querySelector('[selector="' + mr.selectorText + '"]');
                    console.log(1206, {
                        mr,
                        cssom,
                        node
                    });
                    aside.insertAdjacentHTML('beforeend', template.outerHTML);
                    aside.lastElementChild.node = node;
                    aside.lastElementChild.rule = mr;
                }
            }
        })

        var template = aside.nextElementSibling.content.firstElementChild.cloneNode(true);
        template.querySelector('header').innerHTML = '<span style="color:#888">element.style</span> <span>{</span>';
        template.querySelector('footer').textContent = "}";
        aside.insertAdjacentHTML('beforeend', template.outerHTML);
    }
}
window.editor.elements.select = function(event) {
    var target = event.target;
    var component = target.closest('component');
    var editor = component.querySelector('iframe');
    var contentWindow = editor.contentWindow;
    var select = target.closest('box.element > *');
    var element = select.closest('box.element');
    var elements = document.querySelectorAll('box.element');
    var startTag = document.querySelectorAll('box.element > header');
    var index = Array.from(startTag).indexOf(element.firstElementChild);
    var doc = contentWindow.document;
    var node = element && element.node ? element.node : null;

    console.log(5, 'editor.elements.select variables', {
        target,
        node
    });

    Array.from(target.closest('component').querySelectorAll('.tools-tab.tab-elements .selected')).forEach(function(el) {
        el.classList.remove('selected');
    });
    target.classList.add('selected');

    var stylesheets = doc.styleSheets;
    var styles = getComputedStyle(node);
    console.log(5, 'editor.elements.select styles', {
        stylesheets,
        styles
    });
    if (stylesheets.length > 0) {
        var aside = component.querySelector('.tools-tab.tab-elements aside');
        aside.innerHTML = "";

        var i = 0;
        do {
            var stylesheet = sheet = stylesheets[i];
            var rules = stylesheet.rules;
            0 > 1 ? console.log(32, 'editor.elements.select select', {
                stylesheet,
                rules
            }) : null;
            //console.log(38, Object.keys(rules));

            var href = stylesheet.href;
            var link = stylesheet.ownerNode;
            var src = link.dataset.src;
            var dirs = rout.ed(src);
            var dir = dirs[dirs.length - 1];
            console.log(666, 'stylesheet.sheet', {
                styleSheet,
                rules,
                link,
                href,
                src,
                dir
            });

            var ii = 0;
            do {
                var rule = Object.values(rules)[ii];
                var cssRules = rule && rule.cssRules ? rule.cssRules : null;

                console.log(42, ii, 'editor.elements.select select rule', rule, cssRules);
                if (cssRules && cssRules.length > 0) {

                    var iii = 0;
                    do {
                        var cssRule = cssRules[iii];
                        var selectorText = cssRule.selectorText;
                        var matches = node.matches(selectorText);
                        if (matches) {
                            var styleMap = cssRule.styleMap;
                            var cssObject = parseCSSText(cssRule.cssText);

                            console.log(49, {
                                cssRule,
                                matches,
                                node,
                                selectorText,
                                styleMap,
                                cssObject
                            });
                            var template = aside.nextElementSibling.content.firstElementChild.cloneNode(true);
                            //template.querySelector('header').innerHTML = '<span onkeydown="window.editor.elements.selector(event)" onkeyup="window.editor.elements.selector(event)">' + selectorText + '</span> <span>{</span>';
                            template.querySelector('header > .file').innerHTML = '<span>' + dir + '</span>';
                            template.querySelector('header > .slct').innerHTML = '<span onkeydown="window.editor.elements.selector(event)" onkeyup="window.editor.elements.selector(event)">' + selectorText + '</span> <span>{</span>';
                            var stylesList = template.querySelector('column');
                            Object.keys(cssObject.style).forEach((prop,index)=>{
                                prop = prop.replace(/[A-Z]/g, m=>"-" + m.toLowerCase());
                                val = Object.values(cssObject.style)[index];
                                console.log(66, {
                                    prop,
                                    val
                                });
                                const propertyValue = template.querySelector('template').content.firstElementChild.cloneNode(true)
                                propertyValue.classList.remove('connected');
                                propertyValue.removeAttribute('connected');
                                console.log(596, 'disconnect', propertyValue);
                                propertyValue.querySelector('.property').textContent = prop;
                                propertyValue.querySelector('.value').textContent = val;
                                stylesList.appendChild(propertyValue);
                                stylesList.appendChild(propertyValue);
                            }
                            );
                            template.querySelector('footer').textContent = "}";
                            aside.insertAdjacentHTML('beforeend', template.outerHTML);
                        }
                        iii++;
                    } while (iii < cssRules.length)
                }
                ii++;
            } while (ii < Object.keys(rules).length);

            i++;
        } while (i < stylesheets.length);

        var selectorText = "element.style";
        console.log(49, {
            node,
            selectorText
        });
        var template = aside.nextElementSibling.content.firstElementChild.cloneNode(true);
        template.querySelector('header').innerHTML = '<span style="color:#888">' + selectorText + '</span> <span>{</span>';
        template.querySelector('footer').textContent = "}";
        aside.insertAdjacentHTML('beforeend', template.outerHTML);

        styleSheet(node)
    }
}

window.editor.tools = {};
window.editor.tools.tool = async function(event) {
    var target = event.target;
    var box = target.closest('box');
    if (box) {
        var index = Array.from(box.parentNode.children).indexOf(box);
        var tabs = box.closest('header').nextElementSibling;
        var tab = tabs.children[index];
        0 > 1 ? console.log(5, {
            box,
            event,
            index,
            tab,
            target
        }) : null;
        if (tab) {
            var pages = Array.from(tabs.children);
            pages.forEach(page=>{
                page.style.display = "none";
            }
            );
            tab.style.display = "flex";
            0 > 1 ? console.log(20, {
                pages,
                tab
            }) : null;
        }
    }
}

window.editor.tree = {};
window.editor.tree.cd = async function(el) {
    var dir = el.querySelector('span').textContent;
    const feed = document.getElementById('file-trees');
    console.log(5, 'editor.tree.cd', el, dir, feed.path);

    var wrap = document.createElement('column');
    var clmn = el.nextElementSibling;

    console.log(101, clmn);
    if (!clmn || clmn.tagName.toLowerCase() !== "column") {
        el.insertAdjacentHTML('afterend', wrap.outerHTML);

        var clmn = el.nextElementSibling;
        var fp = feed.path.split("/").filter(n=>n.length > 0);
        var fref = fp.splice(0, fp.length - 1).filter(n=>n.length > 0);
        var uri = window.location.pathname;
        var paths = uri.split("/").splice(1).filter(n=>n.length > 0);
        var split = feed.path.split("/").filter(n=>n.length > 0);
        var href = split.splice(5, split.length - 1).filter(n=>n.length > 0);
        var path = clmn.previousElementSibling.getAttribute('path');
        console.log(110, clmn);

        console.log(12, 'editor.tree.cd', {
            clmn: clmn.previousElementSibling,
            dir,
            feed: feed.path,
            fp,
            fref,
            href,
            path
        });
        var json = await github.repos.contents({
            owner: paths[0],
            repo: paths[1],
            path: path
        }, {
            headers: {
                'If-None-Match': ''
            }
        });
        json.sort((i,o)=>i.type.localeCompare(o.type));
        console.log(261, {
            json
        });

        var template = feed.parentNode.querySelector('template');
        //feed.innerHTML = "";
        var split = uri.split('/');
        var urt = split.splice(5, split.length - 1);
        feed.path = path;
        if (json.length > 0) {
            var urx = feed.path.split('/').splice(1);
            console.log(274, urx);

            var i = 0;
            do {
                var row = json[i];
                console.log(283, i, feed, row.type);
                if (row.type === "dir") {
                    var folder = template.content.children[1].cloneNode(true);
                    var dirs = paths.length > 4 ? paths.concat([row.name]) : [paths[0], paths[1]].concat(["wide", "main", row.name]);
                    //folder.querySelector('span').setAttribute('href', "/" + dirs.join('/'));
                    folder.setAttribute('path', row.path);
                    folder.querySelector('span').textContent = row.name;
                    clmn.insertAdjacentHTML('beforeend', folder.outerHTML);
                    clmn.lastElementChild.onclick = (e)=>editor.tree.cd(e.target.closest('text'));
                    //console.log(290, feed, folder.outerHTML);
                }
                if (row.type === "file") {
                    var file = template.content.children[2].cloneNode(true);
                    var dirs = paths.length > 4 ? paths.concat([row.name]) : [paths[0], paths[1]].concat(["wide", "main", row.name]);
                    //file.querySelector('span').setAttribute('href', "/" + dirs.join('/'));
                    file.setAttribute('path', row.path);
                    file.setAttribute('sha', row.sha);
                    file.querySelector('span').textContent = row.name;
                    clmn.insertAdjacentHTML('beforeend', file.outerHTML);
                    clmn.lastElementChild.onclick = (e)=>editor.tree.nl(e.target);
                }
                i++;
            } while (i < json.length)
        }
    }

    var clmn = el.nextElementSibling;
    if (clmn.style.display) {
        if (clmn.style.display === "none") {
            clmn.style.display = "flex";
        } else {
            clmn.style.display = "none";
        }
    } else {
        clmn.style.display = "flex";
    }
}
window.editor.tree.ls = async function(dir) {
    const feed = document.getElementById('files-list');
    console.log(5, 'editor.tree.ls', dir, feed.path);

    var fp = feed.path.split("/").filter(n=>n.length > 0);
    var fref = fp.splice(0, fp.length - 1).filter(n=>n.length > 0);
    var uri = window.location.pathname;
    var paths = uri.split("/").splice(1).filter(n=>n.length > 0);
    var split = feed.path.split("/").filter(n=>n.length > 0);
    var href = split.splice(5, split.length - 1).filter(n=>n.length > 0);
    var path = (fref.length > 0 ? '/' : '') + fref.join("/");
    console.log(12, 'editor.tree.cd', {
        dir,
        feed: feed.path,
        fref,
        href,
        path
    });
    var json = await github.repos.contents({
        owner: paths[0],
        repo: paths[1],
        path: path
    });
    json.sort((i,o)=>i.type.localeCompare(o.type));
    console.log(261, {
        json
    });

    var template = feed.nextElementSibling;
    feed.innerHTML = "";
    var split = uri.split('/');
    var urt = split.splice(5, split.length - 1);
    feed.path = path;

    if (path === "") {
        var folder = template.content.children[1].cloneNode(true);
        //folder.querySelector('span').setAttribute('href', "/" + dirs.join('/'));
        folder.querySelector('span').textContent = paths[1];
        folder.removeAttribute('data-before');
        //folder.setAttribute('sha', row.sha);
        feed.insertAdjacentHTML('beforeend', folder.outerHTML);
        feed.lastElementChild.querySelector('span').onclick = (e)=>editor.tree.cd(e.target.closest('text').querySelector('span').textContent);
        feed.lastElementChild.classList.add('active');
    }

    if (json.length > 0) {
        var urx = feed.path.split('/').splice(1);
        console.log(274, urx);
        if (urx.length > 0) {
            var ls = template.content.children[0].cloneNode(true);
            var dirs = urx.length > 2 && urx.length < 5 ? [urx[0], urx[1]] : urx.splice(0, urx.length - 1);
            console.log(275, dirs, urx);
            //ls.setAttribute('href', "/" + dirs.join('/'));
            ls.setAttribute('path', "/" + dirs.join('/'));
            ls.querySelector('span').textContent = dirs[dirs.length - 1] ? dirs[dirs.length - 1] : "/";
            feed.insertAdjacentHTML('beforeend', ls.outerHTML);
            feed.lastElementChild.querySelector('span').onclick = ()=>editor.tree.ls(row.name);
        }

        var i = 0;
        do {
            var row = json[i];
            console.log(283, i, feed, row.type);
            if (row.type === "dir") {
                var folder = template.content.children[1].cloneNode(true);
                var dirs = paths.length > 4 ? paths.concat([row.name]) : [paths[0], paths[1]].concat(["wide", "main", row.name]);
                //folder.querySelector('span').setAttribute('href', "/" + dirs.join('/'));
                folder.setAttribute('path', row.path);
                folder.querySelector('span').textContent = row.name;
                feed.insertAdjacentHTML('beforeend', folder.outerHTML);
                feed.lastElementChild.querySelector('span').onclick = (e)=>editor.tree.cd(e.target.closest('text').querySelector('span').textContent);
                //console.log(290, feed, folder.outerHTML);
            }
            if (row.type === "file") {
                var file = template.content.children[2].cloneNode(true);
                var dirs = paths.length > 4 ? paths.concat([row.name]) : [paths[0], paths[1]].concat(["wide", "main", row.name]);
                //file.querySelector('span').setAttribute('href', "/" + dirs.join('/'));
                file.setAttribute('path', row.path);
                file.querySelector('span').textContent = row.name;
                feed.insertAdjacentHTML('beforeend', file.outerHTML);
                feed.lastElementChild.querySelector('span').onclick = (e)=>editor.tree.nl(e.target);
            }
            i++;
        } while (i < json.length - 1)
    }
}
window.editor.tree.mv = async function(target) {}
window.editor.tree.nl = async function(target) {
    console.log(138, {
        target
    })
    var uri = window.location.pathname;
    var paths = uri.split("/").filter(n=>n.length > 0);
    var split = paths.splice(5, paths.length - 1).filter(n=>n.length > 0);
    var owner = paths[0];
    var repo = paths[1];
    var fullname = owner + '/' + paths[1];
    var feed = target.closest('#files-list');
    var filename = target.closest('span').textContent;
    var dir = target.closest('column').previousElementSibling.getAttribute('path');
    var path = dir + "/" + filename;
    var ext = filename.split('.')[filename.split('.').length - 1];
    var component = target.closest('component');

    var tabs = component.querySelector('.sources-panel > header');
    var code = component.querySelector('.sources-panel > section');
    console.log(path);
    if (!code.querySelector('cell[path="' + path + '"]')) {
        var res = await github.repos.contents({
            owner: owner,
            repo: repo,
            path: path
        })
        var sha = res.sha;
        var tab = tabs.nextElementSibling.content.firstElementChild.cloneNode(true);
        tab.querySelector('[placeholder="file.ext"]').textContent = filename;
        tab.setAttribute('path', path);
        tab.setAttribute('sha', sha);
        tabs.insertAdjacentHTML('beforeend', tab.outerHTML);
        tabs.lastElementChild.onclick = function(e) {
            console.log(164, e.target);
            var target = e.target.closest('text');
            var close = e.target.closest('i:has(.icon-exit)');
            console.log(165, close);

            if (close) {

                console.log(123);
                close.closest('text').remove();
                var text = close.closest('text');
                var path = text.getAttribute('path');
                var mirr = code.querySelector('cell[path="' + path + '"]');
                mirr.remove();

            } else {

                var path = target.getAttribute('path');
                Array.from(tabs.children).forEach(tab=>{
                    tab.classList.remove('active');
                }
                );
                Array.from(code.children).forEach(tab=>{
                    tab.removeAttribute('css-display', 'none');
                }
                );
                tabs.querySelector('text[path="' + path + '"]').classList.add('active');
                code.querySelector('cell[path="' + path + '"]').setAttribute('css-display', 'flex');

            }
        }
        Array.from(tabs.children).forEach(tab=>{
            tab.classList.remove('active');
            tab.removeAttribute('css-display', 'none');
        }
        );
        tabs.lastElementChild.classList.add('active');

        var cell = document.createElement('cell');
        console.log(code, cell);
        code.insertAdjacentHTML('beforeend', cell.outerHTML);
        var tab = code.lastElementChid;
        console.log(146, {
            uri,
            repo,
            feed: path,
            filename,
            path,
            ext,
            component,
            code,
            tab
        });
        Array.from(code.children).forEach(tab=>{
            tab.removeAttribute('css-display', 'none');
        }
        );
        var mime = null;
        if (ext === "html") {
            mime = 'text/html';
        } else if (ext === "js") {
            mime = "text/javascript";
        } else if (ext === "css") {
            mime = "text/css";
        }
        code.lastElementChild.setAttribute('id', Crypto.uid.create(1));
        code.lastElementChild.setAttribute('path', path);
        code.lastElementChild.setAttribute('css-display', 'flex');
        code.lastElementChild.cm = CodeMirror(code.lastElementChild, {
            lineNumbers: true,
            lineWrapping: true,
            htmlMode: true,
            mode: mime,
            styleActiveLine: true,
            theme: 'abcdef',
            matchBrackets: true
        });

        var content = await github.raw.file({
            owner,
            repo,
            resource: path
        });
        //console.log(158, content);
        code.lastElementChild.cm.setValue(content);
        code.lastElementChild.cm.on("change", function(event) {
            editor.window.preview(event);
        })
    } else {
        Array.from(tabs.children).forEach(tab=>{
            tab.classList.remove('active');
            tab.removeAttribute('css-display', 'none');
        }
        );
        tabs.querySelector('[path="' + path + '"]').classList.add('active');
        code.querySelector('[path="' + path + '"]').classList.add('active');

        var cell = document.createElement('cell');
        console.log(code, cell);
        code.insertAdjacentHTML('beforeend', cell.outerHTML);
        var tab = code.lastElementChid;
        console.log(146, {
            uri,
            repo,
            feed: feed.path,
            filename,
            path,
            ext,
            component,
            code,
            tab
        });
        Array.from(code.children).forEach(tab=>{//tab.removeAttribute('css-display', 'none');
        }
        );
        code.querySelector('cell[path="' + path + '"]').setAttribute('css-display', 'flex');
    }
}

editor.window = {};
editor.window.preview = function(event) {
    console.log(293, 'editor.window.preview', event);
    var mode = event.options.mode;
    var cm = event.doc.cm;
    var content = cm.getValue();
    var tab = document.querySelector('.sources-panel text[path].active');
    var iframe = tab.closest('component').querySelector('iframe');
    var path = tab.getAttribute('path');
    console.log(300, 'editor.window.preview', {
        iframe,
        event
    });

    if (mode === "text/css") {
        var link = iframe.contentWindow.document.head.querySelector('link[data-src="' + path + '"]');
        var src = link.dataset.src;
        var blob = getBlobURL(content, mode);
        console.log('editor.window.preview text/css', {
            blob,
            link,
            src,
            path,
            content,
        });
        link.href = blob;
    }
}
