window.editor = {};

window.editor.elements = {};
window.editor.elements.styles = async function(event) {
    var target = event.target;
    var prop = target.closest('.property');
    var val = target.closest('.value');
    var property = prop ? prop.textContent : null;
    var value = val ? val.textContent : null;
    var element = null;
    console.log(8, 'editor.elements.styles', {
        target,
        property,
        value,
        prop,
        val
    });
    Array.from(target.closest('aside').querySelectorAll("[contenteditable]")).forEach(function(element) {
        element.removeAttribute('contenteditable');
    });
    if (prop) {
        prop.setAttribute("contenteditable", true);
        prop.focus();
        element = prop;
    } else if (val) {
        val.setAttribute("contenteditable", true);
        val.focus();
        element = val;
    }
    if (prop || val) {
        if (document.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (window.getSelection) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
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
    var nodes = doc.querySelectorAll('*');
    var node = nodes[index];
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
        var i = 0
        do {
            var stylesheet = stylesheets[i];
            var rules = stylesheet.rules;
            0 > 1 ? console.log(32, 'editor.elements.select select', {
                stylesheet,
                rules
            }) : null;
            //console.log(38, Object.keys(rules));
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
                            template.querySelector('header').textContent = selectorText + " {";
                            var stylesList = template.querySelector('column');
                            Object.keys(cssObject.style).forEach((prop,index)=>{
                                prop = prop.replace(/[A-Z]/g, m=>"-" + m.toLowerCase());
                                val = Object.values(cssObject.style)[index];
                                console.log(66, {
                                    prop,
                                    val
                                });
                                const propertyValue = template.querySelector('template').content.firstElementChild.cloneNode(true)
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
        console.log(5, {
            box,
            event,
            index,
            tab,
            target
        });
        if (tab) {
            var pages = Array.from(tabs.children);
            pages.forEach(page=>{
                page.style.display = "none";
            }
            );
            tab.style.display = "flex";
            console.log(20, {
                pages,
                tab
            });
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
