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
            uri,
            user: window.user
        });
        var e = {};
        var status = 200;

        if (window.user) {
            //var usr = await github.oauth.user(localStorage.user);
            var avis = document.body.querySelectorAll(".avatar-image");
            Array.from(avis).forEach(function(avi) {
                var img = document.createElement("img");
                //img.setAttribute('href', '/:user');
                img.src = window.user.photoURL;
                avi.innerHTML = img.outerHTML;
            });
        }

        Array.from(document.querySelectorAll('dropdown [drop="down"] + *')).forEach(el=>{
            el.classList.remove('active');
        }
        )

        if (sub) {
            if (sub === "settings") {
                console.log("routes.view settings");
            } else if (sub === "gists") {
                if (paths.length === 1) {
                    document.getElementById("code-frame").src = "";
                } else if (paths.length > 2) {
                    document.getElementById("code-frame").src = "";
                }

                if (paths.length === 2) {
                    if (paths[1] === "discover") {
                        var username = paths[1];
                        console.log(33, {
                            username
                        });

                        var snippets = document.getElementById('code-snippets');
                        var list = await github.gists.list();
                        snippets.innerHTML = "";
                        list.forEach((item)=>{
                            var timeDate = item.updated_at ? item.updated_at : item.created_at;
                            var dateTime = model.time.date(timeDate);
                            var box = snippets.nextElementSibling.content.firstElementChild.cloneNode(true);
                            box.querySelector('.snippet-user').textContent = item.owner.login;
                            var d = new Date(timeDate);
                            var m = d.getMonth();
                            var lastActive = new Date().getMonth() === m;
                            box.querySelector('.snippet-date').textContent = ((item.updated_at) || (lastActive) ? "Last active " : "Created ") + dateTime;
                            box.querySelector('.snippet-file').textContent = Object.keys(item.files)[0];
                            box.querySelector('.snippet-file').setAttribute('href', '/:get/:get/' + item.id);
                            box.querySelector('.snippet-description').textContent = item.description;
                            snippets.insertAdjacentHTML('beforeend', box.outerHTML);
                            console.log(33, {
                                item,
                                lastActive,
                                m,
                                timeDate,
                                dateTime
                            });
                        }
                        );
                    } else {
                        var username = paths[1];
                        var json = await github.users.user(username, {
                            body: JSON.stringify({
                                'per_page': 6
                            })
                        });
                        var img = document.createElement('img');
                        img.src = json.avatar_url;
                        component.querySelector('.photo-avatar picture').innerHTML = img.outerHTML;
                        component.querySelector('[name="bio"]').textContent = json.bio;
                        component.querySelector('.profile').setAttribute('href', '/' + json.login);
                        component.querySelectorAll('[name="username"]').forEach(el=>{
                            console.log(85, el);
                            el.textContent = username;
                        }
                        );
                        component.querySelectorAll('[name="fullname"]').forEach(el=>{
                            console.log(86, el);
                            el.textContent = json.name;
                        }
                        );
                        component.querySelectorAll('[name="bio"]').forEach(el=>{
                            console.log(91, el);
                            el.textContent = json.bio;
                        }
                        );
                        var snippets = document.getElementById('code-snippets');
                        var list = await github.users.gists(username);
                        snippets.innerHTML = "";
                        list.forEach(async(item)=>{
                            var timeDate = item.updated_at ? item.updated_at : item.created_at;
                            var dateTime = model.time.date(timeDate);
                            var box = snippets.nextElementSibling.content.firstElementChild.cloneNode(true);
                            box.querySelector('.snippet-user').textContent = item.owner.login;
                            var d = new Date(timeDate);
                            var m = d.getMonth();
                            var lastActive = new Date().getMonth() === m;
                            box.querySelector('.snippet-date').textContent = ((item.updated_at) || (lastActive) ? "Last active " : "Created ") + dateTime;
                            box.querySelector('.snippet-file').textContent = Object.keys(item.files)[0];
                            box.querySelector('.snippet-file').setAttribute('href', '/:get/:get/' + item.id);
                            box.querySelector('.snippet-description').textContent = item.description;
                            snippets.insertAdjacentHTML('beforeend', box.outerHTML);
                            var snippetCode = snippets.lastElementChild.firstElementChild.querySelector('.snippet-code');
                            var gist = await github.gists.id(item.id);
                            var files = gist.files;
                            var mirror = [];
                            var assets = 0;
                            var tlm = null;
                            Object.keys(item.files).forEach(async function(key, index) {
                                var ext = key.split(".")[key.split(".").length - 1];
                                if (["index.css", "index.html", "index.js"].includes(key)) {
                                    var text = document.createElement('text');
                                    var i = document.createElement("i");
                                    var con = document.createElement("con");
                                    i.insertAdjacentHTML("beforeend", con.outerHTML);
                                    if (ext === "html") {
                                        i.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path fill="#E34F26" d="M71,460 L30,0 481,0 440,460 255,512"/>
  <path fill="#EF652A" d="M256,472 L405,431 440,37 256,37"/>
  <path fill="#EBEBEB" d="M256,208 L181,208 176,150 256,150 256,94 255,94 114,94 115,109 129,265 256,265zM256,355 L255,355 192,338 188,293 158,293 132,293 139,382 255,414 256,414z"/>
  <path fill="#FFF" d="M255,208 L255,265 325,265 318,338 255,355 255,414 371,382 372,372 385,223 387,208 371,208zM255,94 L255,129 255,150 255,150 392,150 392,150 392,150 393,138 396,109 397,94z"/>
</svg>`;
                                    }
                                    text.insertAdjacentHTML('beforeend', i.outerHTML);
                                    mirror.push(ext);
                                    assets++;
                                } else {
                                    assets++;
                                }
                                snippetCode.previousElementSibling.querySelector('.stats-comments').setAttribute('before', gist.comments);
                                snippetCode.previousElementSibling.querySelector('.stats-files').setAttribute('before', assets);
                                snippetCode.previousElementSibling.querySelector('.stats-forks').setAttribute('before', gist.forks.length);
                                snippetCode.previousElementSibling.querySelector('.stats-saves').setAttribute('before', gist.forks.length);

                                var text = document.createElement('text');
                                var span = document.createElement("span");
                                span.textContent = key;
                                text.insertAdjacentHTML('beforeend', span.outerHTML);
                                snippetCode.firstElementChild.insertAdjacentHTML('beforeend', text.outerHTML);
                                var rra = 0;
                                var arr = ["html", "css", "js"];

                                var textarea = document.createElement('text');
                                var array = Object.values(files)[index].content.split("\n").slice(0, 10);
                                while (array.length) {
                                    const last = array[array.length - 1];
                                    if (last !== "" && last !== "\r") {
                                        break;
                                    }
                                    --array.length;
                                }
                                var mode = mirror[mirror.length - 1];
                                var content = array.join("\n");
                                textarea.value = content;
                                snippetCode.lastElementChild.innerHTML = textarea.outerHTML;
                                textarea = snippetCode.lastElementChild.querySelector('text');
                                if (!textarea.cm) {
                                    box = textarea.closest('box');
                                    box.querySelector('.snippet-code > section').setAttribute('after', 'View ' + key);
                                    console.log(163, {
                                        cm: textarea.cm,
                                        code: box.querySelector('.snippet-code > section'),
                                        box,
                                        key,
                                        mode
                                    });
                                    textarea.cm = CodeMirror(textarea, {
                                        value: content,
                                        lineNumbers: true,
                                        scrollbarStyle: null
                                    });
                                    textarea.cm.setOption("theme", "3024-night");
                                }
                                snippetCode.lastElementChild.setAttribute('href', '/gists/:get/' + item.id);
                            })
                        }
                        );
                    }
                }

                if (paths.length === 1 || paths.length > 1) {
                    var username = paths[0];
                    if (paths.length === 1 || paths.length > 2) {

                        if (paths.length > 2) {
                            try {
                                var starred = await github.gists.star({
                                    id: paths[2]
                                });
                                var lv = starred.status;
                                console.log(284, {
                                    starred,
                                    lv
                                });
                                if (lv === 204) {
                                    component.querySelector(".gg-bookmark").closest("i").style.color = "#0096c7";
                                } else {
                                    component.querySelector(".gg-bookmark").closest("i").removeAttribute('style');
                                }
                            } catch (e) {
                                console.log(211, e);
                            }
                        }

                        var i = paths[3] ? (paths[3] ? ['details', 'full', 'debug'].indexOf(paths[3]) : 1) + 2 : '1';
                        var btn = document.querySelector('.buttons-group > * > :nth-child(5) [drop="down"] + flex > column text:nth-child(' + i + ')');
                        console.log(25, {
                            paths,
                            i,
                            btn
                        });
                        Array.from(document.querySelectorAll('.buttons-group > * > :nth-child(5) [drop="down"] + flex > column text')).forEach(el=>el.classList.remove('active'));
                        btn ? btn.classList.add('active') : null;

                        if (paths.length > 3) {
                            var view = paths[3];
                            console.log(26, view);
                        }
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
                            path.pop();

                            window.blobs = {
                                "html": {
                                    links: [],
                                    scripts: []
                                }
                            };
                            window.cm = {};

                            if (Object.keys(window.cm).length === 0) {
                                ["html", "css", "js"].forEach(async(ext)=>{
                                    try {
                                        var cmx = cm[ext];
                                        var cb = component.querySelector('#code-' + ext);
                                        cb.innerHTML = "";

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
                                        }
                                    } catch (e) {
                                        console.log(e ? e : null);
                                    }
                                }
                                );
                            }

                            var id = paths[2];
                            if (id) {
                                var gist = await github.gists.id(id);
                                var files = gist.files;
                                var keys = Object.values(files);
                                ["html", "css", "js"].forEach(async(value,index)=>{
                                    var ext = keys[index];
                                    console.log(141, {
                                        value,
                                        ext,
                                        index
                                    });

                                    var file = files["index." + value];
                                    var content = file ? file.content : "";
                                    var cmx = cm[value];
                                    console.log(99, {
                                        value,
                                        files,
                                        file,
                                        cmx
                                    });
                                    cmx.setValue(content);
                                    cmx.on("change", upd);

                                    if (value === "html") {
                                        document.getElementById('code-frame')[ext] = content;
                                    }

                                    if (value === "css") {
                                        document.getElementById('code-frame')[ext] = content;
                                    }

                                    if (value === "js") {
                                        console.log(168, value);
                                    }

                                    await pvw();
                                    cmx.refresh();
                                }
                                );
                            }

                        } else {
                            status = 404;
                            e = {
                                code: status,
                                message: "This page does not exist"
                            }
                        }

                    } else {
                        console.log(184, 'gists.new');
                    }
                }
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
                                var id = "a5ee57d2493835af7ac2d525788074e2";
                                var gist = await github.gists.id(id);
                                var files = gist.files;
                                var keys = Object.values(files);
                                keys.forEach(async(ext)=>{
                                    try {
                                        var url = new URL(name,parent.origin);
                                        var pn = url.pathname.split("/").filter(o=>o.length > 1);
                                        //var resource = pn.splice(4, pn.length - 1).join("/");
                                        //var resource = path + "/" + file.split('.')[0] + "." + ext;
                                        //console.log(93, path, resource);

                                        var ext = ext.filename.split('.')[1];
                                        var file = files["index." + ext];
                                        console.log(99, {
                                            ext,
                                            files
                                        });

                                        var content = file.content;
                                        var cmx = cm[ext];

                                        var cb = document.getElementById('code-' + ext);
                                        console.log(300, {
                                            cb
                                        });
                                        cb.innerHTML = "";
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

                                        await pvw();
                                        cm[ext].refresh();
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
                                0 < 1 ? console.log(258, {
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
                                var json = await github.repos.contents({
                                    owner: paths[0],
                                    repo: paths[1],
                                    resource: path.join('/')
                                }, {
                                    cache: 'reload'
                                });
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
                            //console.log(255, "wide", paths);

                            var pathed = uri.split('/').filter(o=>o.length > 0);
                            var pathname = '/' + pathed.splice(4, pathed.length - 1).join('/');

                            var address = {
                                protocol: window.location.protocol + '//',
                                subdomain: paths[1],
                                domain: paths[0],
                                tld: 'tld',
                                pathname: pathname
                            }
                            //console.log(262, address);
                            var secure = window.isSecureContext;
                            component.querySelector('[name="security"]').setAttribute('secure', secure)
                            var icon = component.querySelector('[name="security"]').querySelector('.icon');
                            icon.classList.remove('icon-lock', 'icon-locked');
                            icon.classList.add('icon-lock' + (secure ? 'ed' : ''));
                            secure ? null : component.querySelector('span').textContent = 'Not secure';

                            component.querySelector('[name="protocol"]').textContent = address.protocol;
                            component.querySelector('[name="subdomain"]').textContent = address.subdomain;
                            component.querySelector('[name="domain"]').textContent = address.domain;
                            component.querySelector('[name="tld"]').textContent = address.tld;
                            component.querySelector('[name="pathname"]').textContent = address.pathname;

                            if (paths.length > 3) {
                                //console.log(255, "wide", paths);

                                var preview = component.querySelector('iframe');
                                var contentWindow = preview.contentWindow;

                                //CONSOLE
                                let m_pos;
                                window.dom.web_tools = component.querySelector('.dev-tools');
                                var resizer = component.querySelector('line#resizer');
                                function resize(e) {
                                    const dx = (m_pos - e.x) * -1;
                                    m_pos = e.x;
                                    dom.web_tools.style.width = (parseInt(getComputedStyle(dom.web_tools, '').width) + dx) + "px";
                                    //console.log({m_pos,x:e.x},dx);
                                }
                                resizer.addEventListener("mousedown", function(e) {
                                    //console.log(e.offsetX);
                                    if (e.offsetX < resizer.clientWidth) {
                                        m_pos = e.x;
                                        document.body.classList.add('dragging');
                                        document.addEventListener("mousemove", resize, false);
                                    }
                                }, false);
                                resizer.addEventListener("mouseup", function() {
                                    document.body.classList.remove('dragging');
                                    document.removeEventListener("mousemove", resize, false);
                                }, false);

                                //FILETREE
                                var owner = paths[0];
                                var repo = paths[1];
                                var branch = paths[3];
                                var ref = "heads/" + branch;
                                if (0 < 1) {
                                    var refs = await github.database.references({
                                        owner,
                                        repo,
                                        branch,
                                        ref
                                    });
                                    0 > 1 ? console.log(293, {
                                        refs
                                    }) : null;
                                    var sha = refs.object.sha;
                                    0 > 1 ? console.log(297, {
                                        sha
                                    }) : null;
                                    var recursive = true;
                                    var params = {
                                        owner,
                                        repo,
                                        branch,
                                        sha,
                                        //recursive
                                    };
                                    var trees = await github.database.trees(params);
                                    var filetrees = component.querySelector("#file-trees");
                                    var trees = await github.repos.contents({
                                        owner,
                                        repo,
                                        resource: 0 < 1 ? "" : (urt.length > 1 ? "/" : "") + urt.join("/")
                                    }, {
                                        headers: {
                                            'If-None-Match': ''
                                        }
                                    });
                                    0 > 1 ? console.log(307, {
                                        trees
                                    }) : null;
                                    var tab = document.getElementById('sources-files');
                                    var tree = document.getElementById('file-trees');
                                    var template = tab.querySelector('template');

                                    var folder = template.content.children[1].cloneNode(true);
                                    folder.querySelector('span').textContent = paths[0];
                                    tree.insertAdjacentHTML('beforeend', folder.outerHTML);
                                    var el = tree.lastElementChild;
                                    el.onclick = (e)=>editor.tree.cd(e.target.closest('text'));
                                    0 > 1 ? console.log(322, 'trees.tree', {
                                        folder,
                                    }) : null;

                                    var wrap = document.createElement('column');
                                    el.insertAdjacentHTML('afterend', wrap.outerHTML);
                                    var clmnu = el.nextElementSibling;

                                    var folder = template.content.children[1].cloneNode(true);
                                    folder.setAttribute('path', "")
                                    folder.querySelector('span').textContent = paths[1];
                                    clmnu.insertAdjacentHTML('beforeend', folder.outerHTML);
                                    clmnu.lastElementChild.onclick = (e)=>editor.tree.cd(e.target.closest('text'));
                                    0 > 1 ? console.log(322, 'trees.tree', {
                                        folder,
                                    }) : null;

                                    var wrap = document.createElement('column');
                                    var el = clmnu.lastElementChild;
                                    el.insertAdjacentHTML('afterend', wrap.outerHTML);
                                    var clmnp = el.nextElementSibling;

                                    var files = trees.tree ? trees.tree : trees;
                                    0 < 1 ? files.sort((i,o)=>{
                                        var path1 = i.path;
                                        var path2 = o.path;
                                        var type1 = i.type;
                                        var type2 = o.type;
                                        var rted1 = rout.ed(path1);
                                        var rted2 = rout.ed(path2);
                                        var dir1 = rted1.filter(i=>i < rted2.lenggth - 1);
                                        var dir2 = rted2.filter(i=>i < rted2.lenggth - 1);
                                        var rted1l = rted1.length;
                                        var rted2l = rted2.length;
                                        //console.log(327, dir1, dir2, rted1.length, rted2.length);
                                        if (i.type === "file" && rted1.length === 1 && rted1.length > rted2.length)
                                            return 1;
                                        if (i.type === "file")
                                            return 1;
                                        if (!path1.localeCompare(path2))
                                            return -1;
                                        if (i.type === "dir")
                                            return -1;
                                        //if (rted1.length > rted2.length)
                                        //return 1;
                                        return 0;
                                    }
                                    ) : files.sort((i,o)=>{
                                        var path1 = i.path;
                                        var path2 = o.path;
                                        var type1 = i.type;
                                        var type2 = o.type;
                                        var rted1 = rout.ed(path1);
                                        var rted2 = rout.ed(path2);
                                        var dir1 = rted1.filter(i=>i < rted2.lenggth - 1);
                                        var dir2 = rted2.filter(i=>i < rted2.lenggth - 1);
                                        var rted1l = rted1.length;
                                        var rted2l = rted2.length;
                                        console.log(327, dir1, dir2, rted1.length, rted2.length);
                                        if (i.type === "blob" && rted1.length === 1 && rted1.length > rted2.length)
                                            return 1;
                                        if (i.type === "blob")
                                            return 1;
                                        if (!path1.localeCompare(path2))
                                            return -1;
                                        if (i.type === "tree")
                                            return -1;
                                        //if (rted1.length > rted2.length)
                                        //return 1;
                                        return 0;
                                    }
                                    );
                                    files.forEach(function(obj) {
                                        var path = obj.path;
                                        var type = obj.type;
                                        if (type === "dir" || type === "tree") {
                                            var folder = template.content.children[1].cloneNode(true);
                                            folder.setAttribute('path', path);
                                            folder.querySelector('span').textContent = path;
                                            clmnp.insertAdjacentHTML('beforeend', folder.outerHTML);
                                            clmnp.lastElementChild.onclick = (e)=>editor.tree.cd(e.target.closest('text'));
                                            0 > 1 ? console.log(345, 'trees.tree', {
                                                folder,
                                                obj
                                            }) : null;
                                        }
                                        if (type === "file" || type === "blob") {
                                            var file = template.content.children[2].cloneNode(true);
                                            file.setAttribute('path', obj.path);
                                            file.setAttribute('sha', obj.sha);
                                            file.querySelector('span').textContent = path;
                                            clmnp.insertAdjacentHTML('beforeend', file.outerHTML);
                                            clmnp.lastElementChild.onclick = (e)=>editor.tree.nl(e.target);
                                            0 > 1 ? console.log(354, 'trees.tree', {
                                                file,
                                                obj
                                            }) : null;
                                        }
                                    })

                                    var filetrees = component.querySelector("#file-trees");
                                    var split = uri.split('/');
                                    var urt = split.splice(5, split.length - 1);
                                    filetrees.path = 0 < 1 ? "" : (urt.length > 1 ? "/" : "") + urt.join("/");
                                }
                                console.log(540, paths);
                                var contentWindow = await wIDE(paths);
                                //console.log(540, contentWindow);

                                //DOMTREE
                                //console.log(component, contentWindow);
                                //domBuilder(component, contentWindow);
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

                        if (0 < 1) {
                            console.log(paths);
                            var json = await github.repos.repo(paths[0], paths[1], {
                                cache: "reload"
                            });
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
                        }

                        var href = uri.split("/").splice(1).filter(n=>n.length > 0);
                        var path = href.splice(4, href.length - 1)
                        var json = await github.repos.contents({
                            owner: paths[0],
                            repo: paths[1],
                            resource: path.join('/')
                        }, {
                            cache: 'reload'
                        });
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
                                    feed.lastElementChild.querySelector('span').onclick = ()=>editor.tree.nl(feed.path, row.name);
                                }
                                i++;
                            } while (i < json.length - 1)
                        }
                    }
                } else {
                    console.log(819, "routes.view user /:user", {
                        sub,
                        pic: component.querySelector('.photo-avatar picture'),
                        classes: component.querySelector('.photo-avatar picture').classList
                    });

                    try {
                        var json = await github.users.user(sub, {
                            cache: "reload"
                        });
                        console.log(286, {
                            json
                        })
                        component.querySelector('.photo-user .follow').classList[firebase.auth().currentUser && localStorage.user === paths[0] ? "add" : "remove"]("hidden");
                        component.querySelector('.photo-user .edit').classList[firebase.auth().currentUser && localStorage.user === paths[0] ? "remove" : "add"]("hidden");
                        component.querySelector('[name="username"]').textContent = json.login;
                        component.querySelector('[placeholder="Firstname Lastname"]').textContent = json.name;
                        component.querySelector('[placeholder="@username"]').textContent = '@' + json.login;
                        component.querySelector('[name="bio"]').textContent = json.bio;

                        var img = document.createElement('img');
                        img.src = json.avatar_url;
                        component.querySelector('.photo-avatar picture').innerHTML = img.outerHTML;

                        var me = localStorage.user;
                        if (me) {
                            try {
                                var res = await github.users.user(me);
                                console.log(839, {
                                    json,
                                    res
                                });
                            } catch (e) {
                                console.log(841, {
                                    e
                                });
                            }
                        }

                        console.log(852, {
                            sub,
                            me
                        });
                        if (sub === me) {
                            var json = await github.user.repos(sub);
                        } else {
                            var json = await github.users.repos(sub);
                            //req = 302;
                        }
                        console.log(291, {
                            json
                        });

                        var feed = document.getElementById('user-repositories');
                        var template = feed.nextElementSibling;
                        feed.innerHTML = "";
                        if (json.length > 0) {
                            var i = 0;
                            do {
                                var row = json[i];
                                var el = template.content.firstElementChild.cloneNode(true);
                                console.log(874, {
                                    el,
                                    feed
                                });
                                el.setAttribute('href', '/:get/' + row.name)
                                el.querySelector('text > span:first-child').textContent = row.name;
                                el.querySelector('text > span:last-child').textContent = "Last pushed " + api.time.date(Date.parse(row.updated_at));
                                feed.insertAdjacentHTML('beforeend', el.outerHTML);
                                i++;
                            } while (i < json.length);
                        }
                    } catch (e) {
                        console.log(888, 'routes.js /:user 404', {
                            e
                        });
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
