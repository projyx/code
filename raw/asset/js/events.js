window.events = {};

window.events.onclick = {}
window.events.onclick.cd = function(dir) {
    var href = null;
    var pathname = window.location.pathname;
    var paths = pathname.split('/').filter(o=>o.length > 0);
    //console.log(pathname, paths);
    if (paths[paths.length - 3] === "tree") {
        if (paths[paths.length - 2] === "main") {
            paths.splice(paths.length - 3, 3);
        }
    } else {
        if (dir === "..") {
            paths.pop();
        }
    }
    if (paths) {
        href = "/" + (paths.length > 0 ? paths.join("/") : "")
        console.log(href, paths);
        rout.er(href);
    }
}
window.events.onclick.document = async function(event) {
    var target = event.target;
    var elem = target;

    Array.from(document.querySelectorAll('.modal')).forEach(elem=>{
        elem.remove();
    }
    );

    Array.from(document.querySelectorAll('[drop="down"]')).forEach(elem=>{
        elem.nextElementSibling.setAttribute('css-display', 'none');
    }
    );

    elem = target.closest('[href]');
    if (elem) {
        event.preventDefault();
        var href = elem.getAttribute('href');
        //console.log(47, href);
        rout.er(href);
    }

    elem = target.closest('[drop]');
    if (elem) {
        if (elem.nextElementSibling.getAttribute("css-display") === 'none') {
            Array.from(document.querySelectorAll('[onclick="events.onclick.dropdown(event.target)"]')).forEach(elem=>{
                elem.nextElementSibling.setAttribute('css-display', 'none');
            }
            );
            elem.nextElementSibling['removeAttribute']('css-display', 'none');
        } else {
            elem.nextElementSibling['setAttribute']('css-display', 'none');
        }
    }
}
window.events.onclick.dropdown = function(target) {
    var dropdown = target.closest('dropdown');
    var ul = target.closest('ul');
    if(ul) {
        var li = target.closest('li');
        console.log(63, ul);
        if(li) {
            dropdown.querySelector('ul').classList.remove('active');
            dropdown.firstElementChild.textContent = li.textContent;
        }
    } else {
        console.log(65, sel);
        var sel = target.closest('dropdown > *');
        dropdown.querySelector('ul').classList.toggle('active');
    }
}
window.events.onclick.exit = function(event) {
    var paths = window.location.pathname.split('/').filter(o=>o.length > 0);
    paths[2] = "tree";
    paths.pop();
    //console.log(paths);
    var href = "/" + (paths.length > 0 ? paths.join("/") : "");
    console.log(42, href);
    rout.er(href);
}
window.events.onclick.mv = async function(event) {
    var target = event.target;
    var menu = target.closest('.context-menu');
    var selection = menu.selection;
    console.log(725, {
        target,
        menu,
        selection
    });
    selection.querySelector('span').addEventListener("focusout", window.events.onfocusout.mv, {
        once: true
    });
    selection.querySelector('span').setAttribute('contenteditable', true);
    selection.querySelector('span').focus();

    var range = document.createRange();
    range.selectNodeContents(selection.querySelector('span'));
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

window.events.onclick.rm = async function(event) {
    console.log(64, 'events.onclick.rm', event);

    var target = event.target;
    var menu = target.closest('.modal');
    var component = event.target.closest('component');
    var paths = window.location.pathname.split('/').filter(o=>o.length > 0);

    console.log(71, 'events.onclick.rm', menu, menu.selection);

    var owner = paths[0];
    var repo = paths[1];
    var path = menu.selection.getAttribute('path');
    var sha = menu.selection.getAttribute('sha');

    console.log(71, 'events.onclick.rm', {
        owner,
        repo,
        path
    });

    menu.remove();

    try {
        0 < 1 ? await github.repos.contents({
            owner,
            repo,
            path
        }, {
            body: JSON.stringify({
                message: "Delete file",
                sha: sha
            }),
            method: 'DELETE'
        }) : null;
        menu.selection.remove();
    } catch (e) {
        console.log(101, e);
    }
}
window.events.onclick.touch = async function(event) {
    var target = event.target;
    var component = event.target.closest('component');
    var menu = target.closest('.context-menu');
    console.log(112, menu);
    var selection = menu.selection;
    var files = selection.nextElementSibling;

    console.log(109, 'events.onclick.touch', event, {
        target,
        component,
        menu,
        selection,
        files
    });

    var paths = window.location.pathname.split('/').filter(o=>o.length > 0);
    var owner = paths[0];
    var repo = paths[1];
    console.log(132, {
        paths,
        owner,
        repo,
        path
    });

    var dir = 0 < 1 ? await github.repos.contents({
        owner: owner,
        repo: repo,
        path: (selection.getAttribute('path') ? selection.getAttribute('path') : '')
    }) : [];
    var NewFiles = dir.filter(o=>o.name.startsWith('NewFile'))
    console.log(158, NewFiles);
    var i = 0;
    var prev = 0;
    while (i < NewFiles.length + 1) {
        var o = NewFiles[i];
        if (o) {
            var int = o.name.split('NewFile')[1] ? parseInt(o.name.split('NewFile')[1]) : 0;
            var id = i > 0 ? i : '';
            console.log(160, 2, 'NewFile' + id, int, id);
            if (int > 0 && NewFiles.filter(o=>o.name === 'NewFile' + id).length === 0) {
                console.log(166, id);
                break;
            }
        } else {
            var id = i;
            console.log(160, 7, 'NewFile' + id, int, id);
            if (i > 0 && NewFiles.filter(o=>o.name === 'NewFile' + id).length === 0) {
                break;
            }
        }
        i++;
    }
    var NewFile = 'NewFile' + id;

    console.log(158, {
        dir,
        NewFiles,
        NewFile,
    });

    var template = component.querySelectorAll('template')[0].content.children[2].cloneNode(true);
    template.querySelector('span').setAttribute('contenteditable', true);
    files.insertAdjacentHTML('beforeend', template.outerHTML);
    files.lastElementChild.querySelector('span').focus();
    files.lastElementChild.querySelector('span').textContent = NewFile;
    files.lastElementChild.querySelector('span').addEventListener("focusout", window.events.onfocusout.touch, {
        once: true
    });

    var path = (selection.getAttribute('path') ? selection.getAttribute('path') : '') + (selection.getAttribute('path') ? '/' : '') + NewFile;

    var range = document.createRange();
    range.selectNodeContents(files.lastElementChild.querySelector('span'));
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    console.log(136, template);
}
window.events.onclick.gistConfigTab = target=>{
    var text = target.closest('text');
    if (text) {
        var nav = text.closest('nav');
        var texts = text.closest('box').querySelectorAll('text');
        var index = Array.from(texts).indexOf(text);
        var tabs = nav.nextElementSibling;
        var tab = tabs.children[index];
        console.log(217, index, text.textContent, tab);
        tabs.querySelector('card.active').classList.remove('active');
        nav.querySelector('text.active').classList.remove('active');
        tab.classList.add('active');
        text.classList.add('active')
    }
}
;

window.events.onchange = {}
window.events.onchange.gistConfigBehavior = target=>{
    var name = target.getAttribute('name');
    var bool = target.checked;
    console.log(228, 'events.onchange.gistConfigBehavior', {
        bool,
        name,
        target
    });

}

window.events.oncontextmenu = {}
window.events.oncontextmenu.wIDE = async function(event) {

    var target = event.target
    var component = event.target.closest('component');

    Array.from(component.querySelectorAll('.context-menu')).forEach(function(o) {
        o.remove();
    });

    var context = null;
    var files = target.closest('#file-trees');
    if (files) {
        var text = target.closest('text');
        if (text) {
            var dir = text.querySelector('span[placeholder="dir"]');
            var file = text.querySelector('span[placeholder="file"]');
            if (dir) {
                var template = component.querySelectorAll('template')[1].content.firstElementChild.cloneNode(true);
            } else if (file) {
                var template = component.querySelectorAll('template')[2].content.firstElementChild.cloneNode(true);
            }
            console.log(component, component.querySelectorAll('template'), template);
            template.style.top = event.clientY + 'px';
            template.style.left = event.clientX + 'px';
            files.closest('aside').insertAdjacentHTML('beforebegin', template.outerHTML);
            var menu = files.closest('aside').previousElementSibling;
            menu.selection = text;
            console.log(74, text);
        }
    }

    console.log(68, 'events.oncontextmenu.filesystem', event, {
        component,
        template
    });

    //event.preventDefault();
}

window.events.onfocusout = {};
window.events.onfocusout.mv = async function(e) {
    console.log(263, 'events.onfocusout.mv', e);
    var target = e.target;
    var file = target.closest('text').getAttribute('path');
    var name = target.textContent;
    target.removeAttribute('contenteditable');
    if (file === name) {
        console.log("Same name");
    } else {
        try {
            var paths = window.location.pathname.split('/').filter(o=>o.length > 0);
            var owner = paths[0];
            var repo = paths[1];
            var message = "Rename file";
            var dir = target.closest('#files-list').path;
            var path = dir + (dir === "" ? '' : '/') + file;
            var content = await github.raw.file({
                owner: owner,
                repo: repo,
                resource: dir + (dir === "" ? '/' : '') + file
            });
            var meta = await github.repos.contents({
                owner: owner,
                repo: repo,
                path: dir + (dir === "" ? '/' : '') + file
            });
            var sha = meta.sha;
            console.log(280, {
                message,
                meta,
                owner,
                repo,
                content,
                path,
            });
            0 < 1 ? await github.repos.push({
                message,
                owner,
                repo
            }, [{
                content: null,
                path: dir + (dir === "" ? '' : '/') + file
            }, {
                content,
                path: dir + (dir === "" ? '' : '/') + name,
                sha: sha
            }]) : null;
        } catch (e) {
            console.log(101, e);
        }
    }
}
window.events.onfocusout.touch = async function(e) {
    console.log(263, 'events.onfocusout.touch', e);
    var target = e.target;
    var file = target.textContent;
    target.removeAttribute('contenteditable');
    try {
        var paths = window.location.pathname.split('/').filter(o=>o.length > 0);
        var owner = paths[0];
        var repo = paths[1];
        var folder = target.closest('column').previousElementSibling;
        var dir = folder.getAttribute('path') ? folder.getAttribute('path') : "";
        var path = dir + (dir === "" ? '' : '/') + file;
        console.log(280, {
            owner,
            repo,
            path,
        });
        var put = 0 < 1 ? await github.repos.contents({
            owner: owner,
            repo: repo,
            path: path
        }, {
            body: JSON.stringify({
                content: "",
                message: "Create File"
            }),
            method: "PUT"
        }) : null;
    } catch (e) {
        console.log(277, e);
    }
}

window.events.onkeydown = async function(e) {
    if (e.ctrlKey) {
        if (e.keyCode === 83) {
            e.preventDefault();
            var mirror = document.body.querySelector('cell[css-display="flex"]:has(.CodeMirror)');
            var filepath = document.body.querySelector('.sources-panel text.active').getAttribute('path').split('/').filter(o=>o.length > 0);
            var paths = window.location.pathname.split('/').filter(o=>o.length > 0);
            var owner = paths[0];
            var repo = paths[1];
            var file = filepath[filepath.length - 1];
            var exts = file.split('.');
            var ext = exts[exts.length - 1];
            var path = filepath.join("/");
            var params = {
                owner,
                repo,
                path
            };
            console.log(81, {
                file,
                ext
            }, params);

            var name = "";
            var email = "";
            var commiter = {
                name,
                email
            }
            var code = mirror.cm.getValue();
            var content = btoa(code);
            var message = "Update file"
            var sha = mirror.closest('component').querySelector('.sources-panel text[path].active').getAttribute('sha');
            var settings = {
                body: JSON.stringify({
                    content,
                    message,
                    sha
                }),
                method: "PUT"
            };
            console.log(96, params, settings);
            var req = await github.repos.contents(params, settings)

            if (ext === "css") {//alert("CSS file saved");                
            }

            if (ext === "html") {
                var event = mirror.cm;

                var mode = event.options.mode;
                var cm = event.doc.cm;
                var content = cm.getValue();
                var tab = document.querySelector('.sources-panel text[path].active');
                var iframe = tab.closest('component').querySelector('iframe');
                var path = tab.getAttribute('path');

                if (mode === "text/html") {
                    var blob = getBlobURL(content, mode);
                    console.log('editor.window.preview text/html', {
                        path,
                        content,
                    });
                    //if (path === "/index.html") {
                    var uri = window.location.pathname.split('/').filter(o=>o.length > 0);
                    var paths = uri.splice(4, uri.length - 1);
                    console.log(paths);
                    wIDE(paths);
                    //}
                }
            }

            if (ext === "js") {
                var event = mirror.cm;
                console.log(138, event);

                var mode = event.options.mode;
                var cm = event.doc.cm;
                var content = cm.getValue();
                var tab = document.querySelector('.sources-panel text[path].active');
                var iframe = tab.closest('component').querySelector('iframe');
                var path = tab.getAttribute('path');

                if (mode === "text/javascript") {
                    var blob = getBlobURL(content, mode);
                    console.log('editor.window.preview text/html', {
                        path,
                        content,
                    });
                    //if (path === "/index.html") {
                    var uri = window.location.pathname.split('/').filter(o=>o.length > 0);
                    var paths = uri.splice(4, uri.length - 1);
                    console.log(paths);
                    wIDE(paths);
                    //}
                }
            }
        }
    }
}

window.events.onsubmit = {};
