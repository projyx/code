window.routes = function(uri, options) {
    return new Promise((resolve,reject)=>viewer(resolve, reject));
    async function viewer(resolve, reject) {
        var component = options.component;
        var obj = {};
        var paths = uri.split('/').splice(1);
        var sub = paths[0]
        console.log(5, 'routes.js', {
            options,
            paths,
            uri
        });
        var e = {};
        var status = 200;

        if (sub) {
            if (sub === "settings") {
                console.log("routes.view settings");
            } else {
                if (paths.length > 1) {
                    if (paths.length > 2) {
                        if (paths[2] === "code") {
                            console.log(23, 'routes.view code', uri);
                        } else if (paths[2] === "edit") {
                            var file = paths[paths.length - 1];
                            if (file) {
                                console.log(37, 'routes.view editor');

                                window.dom = {

                                    body: document.body,

                                    "style": document.getElementById("css"),

                                    "code": document.getElementById("code"),

                                    "html": document.getElementById('code-html'),

                                    "css": document.getElementById('code-css'),

                                    "js": document.getElementById('js-editor'),

                                    "resize": {

                                        "code": document.getElementById("resizer"),

                                        "html": document.getElementById('html-resizer'),

                                        "css": document.getElementById('css-resizer'),

                                        "js": document.getElementById('js-resizer')

                                    },

                                    "iframe": {

                                        "code": {

                                            "elem": document.getElementById("code-frame")

                                        }

                                    }

                                };

                                var file = paths[paths.length - 1];
                                var owner = paths[0];
                                var repo = paths[1];
                                var path = uri.split('/').filter(o=>o.length > 0).splice(4);
                                path.pop();
                                path = path.join('/');
                                //console.log(143, path, file);

                                var parent = window.parent;
                                var name = window.parent.location.pathname;
                                //console.log(229, [parent]);
                                var pathed = name.split("/").filter(o=>o.length > 1);
                                //console.log(231, [parent, paths]);
                                var owner = pathed[0];
                                var repo = pathed[1];
                                var path = paths.splice(4, paths.length - 1);
                                path.pop()

                                window.blobs = {
                                    "html": {
                                        links: [],
                                        scripts: []
                                    }
                                };
                                window.cm = {};
                                ["html", "css", "js"].forEach(async(ext)=>{
                                    try {
                                        var url = new URL(name,parent.origin);
                                        var pn = url.pathname.split("/").filter(o=>o.length > 1);
                                        //var resource = pn.splice(4, pn.length - 1).join("/");
                                        var resource = path + "/" + file.split('.')[0] + "." + ext;
                                        //console.log(93, path, resource);

                                        var json = await github.repos.contents(owner, repo, resource);
                                        var content = atob(json.content);
                                        var doc = new DOMParser().parseFromString(content, "text/html");
                                        var url = "https://api.github.com" + "/repos/" + owner + "/" + repo + "/contents/" + resource;
                                        var blob = await github.raw.blob({
                                            owner,
                                            repo,
                                            resource
                                        })
                                        console.log(246, ext, {
                                            blob,
                                            content
                                        }, {
                                            owner,
                                            repo,
                                            resource
                                        }, {
                                            doc,
                                            ext
                                        });

                                        if (ext === "html") {

                                            cm[ext] = CodeMirror(component.querySelector('#code-html'), {
                                                lineNumbers: true,
                                                lineWrapping: true,
                                                htmlMode: true,
                                                mode: 'xml',
                                                styleActiveLine: true,
                                                theme: 'abcdef',
                                                matchBrackets: true
                                            });

                                            cm[ext].setValue(content);
                                            cm[ext].on("change", pvw);
                                            document.getElementById('code-frame')[ext] = content;
                                        }

                                        if (ext === "css") {

                                            cm[ext] = CodeMirror(component.querySelector('#code-css'), {
                                                lineNumbers: true,
                                                lineWrapping: true,
                                                mode: 'css',
                                                styleActiveLine: true,
                                                theme: 'abcdef',
                                                matchBrackets: true
                                            });

                                            //console.log(292, content);

                                            cm[ext].setValue(content);
                                            cm[ext].on("change", pvw);
                                            document.getElementById('code-frame')[ext] = content;
                                        }

                                        if (ext === "js") {
                                            cm[ext] = CodeMirror(component.querySelector('#code-js'), {

                                                lineNumbers: true,

                                                lineWrapping: true,

                                                mode: 'javascript',

                                                styleActiveLine: true,

                                                theme: 'abcdef',

                                                matchBrackets: true

                                            });

                                            cm[ext].setValue(content);
                                            cm[ext].on("change", pvw);
                                        }

                                        pvw();
                                    } catch (e) {
                                        console.log(e ? e : null);
                                    }
                                }
                                );

                            } else {
                                status = 404;
                                e = {
                                    code: status,
                                    message: "This page does not exist"
                                }
                            }
                        } else if (paths[2] === "tree") {
                            if (0 < 1) {
                                console.log("routes.view tree");

                                var json = await github.repos.repo(paths[0], paths[1]);
                                0 > 1 ? console.log(258, {
                                    json
                                }) : null;
                                var img = document.createElement('img');
                                img.src = json.owner.avatar_url;
                                component.querySelector('avi').innerHTML = img.outerHTML;
                                component.querySelector('[placeholder="owner"]').setAttribute("href", '/' + json.owner.login);
                                component.querySelector('[placeholder="owner"]').textContent = json.owner.login;
                                component.querySelector('[placeholder="repo"]').setAttribute("href", '/' + json.owner.login + "/" + paths[1]);
                                component.querySelector('[placeholder="repo"]').textContent = json.name;
                                component.querySelector('.info-repo button').textContent = json.private ? 'Private' : 'Public';

                                var href = uri.split("/").splice(1).filter(n=>n.length > 0);
                                var path = href.splice(4, href.length - 1)
                                0 > 1 ? console.log(245, {
                                    href,
                                    path
                                }) : null;
                                var json = await github.repos.contents(paths[0], paths[1], path.join('/'));
                                console.log(258, {
                                    json,
                                    path
                                });
                                json.sort((i,o)=>i.type.localeCompare(o.type));
                                var feed = component.querySelector("#code-base");
                                var template = feed.nextElementSibling;
                                feed.innerHTML = "";
                                if (json.length > 0) {
                                    var urx = uri.split('/').splice(1);
                                    if (urx.length > 4) {
                                        var ls = template.content.children[0].cloneNode(true);
                                        var dirs = urx.length > 2 && urx.length < 5 ? [urx[0], urx[1]] : urx.splice(0, urx.length - 1);
                                        console.log(261, dirs, urx);
                                        ls.setAttribute('href', "/" + dirs.join('/'));
                                        feed.insertAdjacentHTML('beforeend', ls.outerHTML);
                                    }

                                    var i = 0;
                                    do {
                                        var row = json[i];
                                        //console.log(266, row.type);
                                        if (row.type === "dir") {
                                            var folder = template.content.children[1].cloneNode(true);
                                            var dirs = paths.length > 4 ? paths.concat([row.name]) : [paths[0], paths[1]].concat(["tree", "main", row.name]);
                                            folder.querySelector('[placeholder="Folder"]').setAttribute('href', "/" + dirs.join('/'));
                                            folder.querySelector('[placeholder="Folder"]').textContent = row.name;
                                            feed.insertAdjacentHTML('beforeend', folder.outerHTML);
                                        }
                                        if (row.type === "file") {
                                            var file = template.content.children[2].cloneNode(true);
                                            var dirs = paths.length > 4 ? paths.concat([row.name]) : [paths[0], paths[1]].concat(["tree", "main", row.name]);
                                            file.querySelector('[placeholder="File"]').setAttribute('href', "/" + dirs.join('/'));
                                            file.querySelector('[placeholder="File"]').textContent = row.name;
                                            feed.insertAdjacentHTML('beforeend', file.outerHTML);
                                        }
                                        i++;
                                    } while (i < json.length - 1)
                                }
                            }
                        } else if (paths[2] === "wide") {
                            console.log("wide");
                            if (paths.length > 3) {
                                var href = uri.split("/").splice(1).filter(n=>n.length > 0);
                                var path = href.splice(4, href.length - 1)
                                var json = await github.repos.contents(paths[0], paths[1], path.join('/'));
                                json.sort((i,o)=>i.type.localeCompare(o.type));
                                console.log(261, {
                                    json,
                                    path
                                });

                                var feed = component.querySelector("#files-list");
                                var template = feed.nextElementSibling;
                                feed.innerHTML = "";
                                var split = uri.split('/');
                                var urt = split.splice(5, split.length - 1);
                                feed.path = (urt.length > 1 ? "/" : "") + urt.join("/");
                                if (json.length > 0) {
                                    var urx = feed.path.split('/').splice(1);
                                    console.log(274, urx);
                                    if (urx.length > 0) {
                                        var ls = template.content.children[0].cloneNode(true);
                                        var dirs = urx.length > 2 && urx.length < 5 ? [urx[0], urx[1]] : urx.splice(0, urx.length - 1);
                                        console.log(275, dirs, urx);
                                        //ls.setAttribute('href', "/" + dirs.join('/'));
                                        feed.insertAdjacentHTML('beforeend', ls.outerHTML);
                                        feed.lastElementChild.querySelector('span').onclick = ()=>editor.tree.ls("/" + dirs.join('/'));
                                    }

                                    var i = 0;
                                    do {
                                        var row = json[i];
                                        console.log(283, i, feed, row.type);
                                        if (row.type === "dir") {
                                            var folder = template.content.children[1].cloneNode(true);
                                            var dirs = paths.length > 4 ? paths.concat([row.name]) : [paths[0], paths[1]].concat(["wide", "main", row.name]);
                                            //folder.querySelector('span').setAttribute('href', "/" + dirs.join('/'));
                                            folder.querySelector('span').textContent = row.name;
                                            feed.insertAdjacentHTML('beforeend', folder.outerHTML);
                                            feed.lastElementChild.querySelector('span').onclick = (e)=>editor.tree.cd(e.target.closest('text').querySelector('span').textContent);
                                            //console.log(290, feed, folder.outerHTML);
                                        }
                                        if (row.type === "file") {
                                            var file = template.content.children[2].cloneNode(true);
                                            var dirs = paths.length > 4 ? paths.concat([row.name]) : [paths[0], paths[1]].concat(["wide", "main", row.name]);
                                            //file.querySelector('span').setAttribute('href', "/" + dirs.join('/'));
                                            file.querySelector('span').textContent = row.name;
                                            feed.insertAdjacentHTML('beforeend', file.outerHTML);
                                        }
                                        i++;
                                    } while (i < json.length - 1)
                                }
                                wIDE(paths);
                            }
                        } else {
                            status = 400;
                            e = {
                                code: status,
                                message: "This page does not exist"
                            }
                        }
                    } else {
                        console.log("routes.view repository");

                        var json = await github.repos.repo(paths[0], paths[1]);
                        console.log(258, {
                            json
                        });
                        var img = document.createElement('img');
                        img.src = json.owner.avatar_url;
                        component.querySelector('avi').innerHTML = img.outerHTML;
                        component.querySelector('[placeholder="owner"]').setAttribute("href", '/' + json.owner.login);
                        component.querySelector('[placeholder="owner"]').textContent = json.owner.login;
                        component.querySelector('[placeholder="repo"]').setAttribute("href", '/' + json.owner.login + "/" + paths[1]);
                        component.querySelector('[placeholder="repo"]').textContent = json.name;
                        component.querySelector('.info-repo button').textContent = json.private ? 'Private' : 'Public';

                        var href = uri.split("/").splice(1).filter(n=>n.length > 0);
                        var path = href.splice(4, href.length - 1)
                        var json = await github.repos.contents(paths[0], paths[1], path.join('/'));
                        console.log(258, {
                            json,
                            path
                        });
                        json.sort((i,o)=>i.type.localeCompare(o.type));

                        var feed = component.querySelector("#code-base");
                        var template = feed.nextElementSibling;
                        feed.innerHTML = "";
                        if (json.length > 0) {
                            var i = 0;
                            do {
                                var row = json[i];
                                console.log(266, row.type);
                                if (row.type === "dir") {
                                    var folder = template.content.children[1].cloneNode(true);
                                    var dirs = paths.length > 4 ? paths.concat([row.name]) : [paths[0], paths[1]].concat(["tree", "main", row.name]);
                                    folder.querySelector('[placeholder="Folder"]').setAttribute('href', "/" + dirs.join('/'));
                                    folder.querySelector('[placeholder="Folder"]').textContent = row.name;
                                    feed.insertAdjacentHTML('beforeend', folder.outerHTML);
                                }
                                if (row.type === "file") {
                                    var file = template.content.children[2].cloneNode(true);
                                    var dirs = paths.length > 4 ? paths.concat([row.name]) : [paths[0], paths[1]].concat(["tree", "main", row.name]);
                                    file.querySelector('[placeholder="File"]').setAttribute('href', "/" + dirs.join('/'));
                                    file.querySelector('[placeholder="File"]').textContent = row.name;
                                    feed.insertAdjacentHTML('beforeend', file.outerHTML);
                                }
                                i++;
                            } while (i < json.length - 1)
                        }
                    }
                } else {
                    console.log("routes.view user");

                    var json = await github.users.user(sub);
                    console.log(286, {
                        json
                    })

                    component.querySelector('[placeholder="Firstname Lastname"]').textContent = json.name;
                    component.querySelector('[placeholder="@username"]').textContent = '@' + json.login;

                    var img = document.createElement('img');
                    img.src = json.avatar_url;
                    component.querySelector('.photo-avatar picture').innerHTML = img.outerHTML;

                    try {
                        var res = await github.oauth.user();
                        var user = res.login;
                    } catch (e) {}

                    if (sub === user) {
                        var json = await github.user.repos(user);
                    } else {
                        var json = await github.users.repos(sub);
                    }
                    console.log(291, {
                        json
                    })
                    var feed = document.getElementById('user-repositories');
                    var template = feed.nextElementSibling;
                    feed.innerHTML = "";
                    if (json.length > 0) {
                        var i = 0;
                        do {
                            var row = json[i];
                            var el = template.content.firstElementChild.cloneNode(true);
                            el.setAttribute('href', '/:get/' + row.name)
                            el.querySelector('text > span:first-child').textContent = row.name;
                            el.querySelector('text > span:last-child').textContent = "Last pushed " + api.time.date(Date.parse(row.updated_at));
                            feed.insertAdjacentHTML('beforeend', el.outerHTML);
                            i++;
                        } while (i < json.length);
                    }
                }
            }
        } else {
            console.log(135, 'routes.view home', '/', uri);

            var json = await github.users.events(localStorage.user);
            console.log(322, {
                json
            })
        }
        status === 200 ? resolve(uri) : reject(e);
    }
}
