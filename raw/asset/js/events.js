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

window.events.onkeydown = async function(e) {
    if (e.ctrlKey) {
        if (e.keyCode === 83) {
            e.preventDefault();
            if (confirm("Are you sure you want to save this file?")) {
                var mirror = document.body.querySelector('cell[css-display="flex"]:has(.CodeMirror)');
                var paths = window.location.pathname.split('/').filter(o=>o.length > 0);
                var owner = paths[0];
                var repo = paths[1];
                var file = mirror.closest('component').querySelector('.sources-panel text[path].active').textContent;
                var path = paths.splice(4, paths.length - 1).join("/") + file;
                var params = {
                    owner,
                    repo,
                    path
                };
                var name = "";
                var email = "";
                var commiter = {
                    name,
                    email
                }
                var code = mirror.cm.getValue();
                var content = btoa(code);
                var message = "Update file"
                var settings = {
                    body: JSON.stringify({
                        content,
                        message
                    }),
                    method: "PUT"
                };
                console.log(params, settings);
                var req = await github.repos.content(params, settings)
            }
        }
    }
}

window.events.onsubmit = {};
