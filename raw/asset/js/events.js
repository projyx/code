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
window.events.onclick.exit = function(event) {
    var paths = window.location.pathname.split('/').filter(o=>o.length > 0);
    paths[2] = "tree";
    paths.pop();
    //console.log(paths);
    var href = "/" + (paths.length > 0 ? paths.join("/") : "");
    console.log(42, href);
    rout.er(href);
}

window.events.oncontextmenu = {}
window.events.oncontextmenu.filesystem = async function(event) {
    event.preventDefault();
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
