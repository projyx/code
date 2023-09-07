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
                        }
                        else if (paths[2] === "edit") {
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
                            if (0 > 1) {
                                component.querySelector('.explorer-section').innerHTML = "";
                                var path = uri.split('/').filter(o=>o.length > 0).splice(4).join('/');
                                console.log("routes.view repository", {
                                    path
                                });
                                var contents = await github.repos.contents(sub, paths[1], path);
                                var explorer = component.querySelector('.explorer-section');
                                explorer.innerHTML = "";
                                var html = await request("/raw/asset/html/explorer.repo.html");
                                explorer.innerHTML = html;
                                var feed = explorer.querySelector('.section-repositories > section');
                                var template = feed.nextElementSibling.content.firstElementChild;
                                function compare(a, b) {
                                    return a.type.localeCompare(b.type) || b.name - a.name;
                                }
                                contents.sort(compare).forEach((content,index)=>{
                                    var el = template.cloneNode(true);
                                    var icon = null;
                                    var href = null;
                                    if (content.type === "file") {
                                        href = '/' + sub + '/' + paths[1] + '/blob/main/' + path + '/' + content.name;
                                        icon = "/raw/asset/png/file-repository.png";
                                    } else if (content.type === "dir") {
                                        href = '/' + sub + '/' + paths[1] + '/tree/main/' + path + '/' + content.name;
                                        icon = "/raw/asset/png/folder-repository.png";
                                    }
                                    console.log({
                                        href,
                                        icon,
                                        content
                                    });
                                    href ? el.setAttribute('href', href) : null;
                                    icon ? el.querySelector('.folder-image img').src = icon : null;
                                    el.querySelector('.folder-name').textContent = content.name;
                                    feed.insertAdjacentHTML('beforeend', el.outerHTML)
                                }
                                );
                                console.log('users.repos', repos);
                            }
                        } else {
                            status = 400;
                            e = {
                                code: status,
                                message: "This page does not exist"
                            }
                            alert(e.code)
                        }
                    } else {
                        console.log("routes.view repository");
                    }
                } else {
                    console.log("routes.view user");

                    var feed = document.getElementById('user-repositories');
                    var template = feed.nextElementSibling;
                    var json = await github.users.repos(sub);
                    console.log(291, {
                        json
                    })
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
                        } while (i < json.length - 1);
                    }
                }
            }
        } else {
            console.log(135, 'routes.view home', '/', uri);
        }
        status === 200 ? resolve(uri) : reject(e);
    }
}
