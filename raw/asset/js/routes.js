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
                        if (paths[2] === "blob") {
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
                                console.log(143, path, file);

                                var parent = window.parent;
                                var name = window.parent.location.pathname;
                                console.log(229, [parent]);
                                var pathed = name.split("/").filter(o=>o.length > 1);
                                console.log(231, [parent, paths]);
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
                                        console.log(93, path, resource);

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
                                        });
                                        console.log(149, doc, ext);

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

                                            cm[ext].on("change", pvw);
                                            //cm[ext].setValue(content);

                                            var links = doc.head.querySelectorAll('link');
                                            var parsed = doc.head.outerHTML + doc.body.outerHTML;
                                            console.log(229, doc.head, content);
                                            cm[ext].setValue(content);
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

                                            console.log(292, content);

                                            cm[ext].on("change", pvw);
                                            cm[ext].setValue(content);
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

                                            cm[ext].on("change", pvw);
                                            cm[ext].setValue(content);
                                        }
                                    } catch (e) {
                                        console.log(e ? e : null);
                                    }
                                }
                                );

                            } else {
                                status = 400;
                                e = {
                                    code: status,
                                    message: "This page does not exist"
                                }
                            }
                        } else if (paths[2] === "tree") {
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
                        } else {
                            status = 400;
                            e = {
                                code: status,
                                message: "This page does not exist"
                            }
                        }
                    } else {
                        console.log("routes.view repository");
                        component.querySelector('.explorer-section').innerHTML = "";
                        var path = uri.split('/').splice(3).join('/');
                        console.log(82, path, uri.split('/').splice(3));
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
                        contents.sort(compare).forEach((content)=>{
                            console.log(84, path, content.name, '/' + sub + '/' + paths[1] + '/blob/main/' + path);
                            var el = template.cloneNode(true);
                            var icon = null;
                            var href = null;
                            if (content.type === "file") {
                                href = '/' + sub + '/' + paths[1] + '/blob/main/' + path + content.name;
                                icon = "/raw/asset/png/file-repository.png";
                            } else if (content.type === "dir") {
                                href = '/' + sub + '/' + paths[1] + '/tree/main/' + path + content.name;
                                icon = "/raw/asset/png/folder-repository.png";
                            }
                            el.setAttribute('href', href);
                            icon ? el.querySelector('.folder-image img').src = icon : null;
                            el.querySelector('.folder-name').textContent = content.name;
                            feed.insertAdjacentHTML('beforeend', el.outerHTML)
                        }
                        );
                        console.log('users.repos', repos);

                    }
                } else {
                    console.log("routes.view user");
                }
            }
        } else {
            var explorer = component.querySelector('.explorer-section');
            explorer.innerHTML = "";
            var html = await request("/raw/asset/html/explorer.home.html");
            explorer.innerHTML = html;
            console.log("routes.view home");
        }

        console.log(135, uri);
        status === 200 ? resolve(uri) : reject(e);
    }
}
