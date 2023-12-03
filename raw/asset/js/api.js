window.api = {};

window.api.oauth = {};
window.api.oauth.config = {
    client_id: 0 > 1 ? "" : "ed63f2ffe8929b18142d",
    redirect_uri: window.location.protocol + "//" + window.location.host + window.location.pathname,
    scope: "delete_repo,gist,user,public_repo,repo"
}
window.api.oauth.login = function(target) {
    var client_id = api.oauth.config.client_id;
    var redirect_uri = api.oauth.config.redirect_uri;

    var scope = api.oauth.config.scope;
    var state = 'github_' + Crypto.uid.create(1);
    var obj = {
        client_id,
        scope,
        state,
        redirect_uri
    }
    var query = new URLSearchParams(obj).toString();

    var a = document.createElement('a');
    var href = "https://github.com/login/oauth/authorize?" + query;
    a.href = href;
    a.click();
    console.log(534, "mvc.js", {
        href,
        obj,
        query
    });
}

window.api.code = {};
api.code.push = function() {
    var paths = window.location.pathname.split("/").filter(o=>o.length > 1);
    var names = paths.splice(5, paths.length - 1);
    var path = names.join('/')
    var params = {
        message: "Update /" + path,
        repo: paths[1],
        owner: paths[0]
    };
    var array = [{
        content: cm.html.getValue(),
        path: path + "index.html"
    }, {
        content: cm.css.getValue(),
        path: path + "index.css"
    }, {
        content: cm.js.getValue(),
        path: path + "index.js"
    }];
    console.log(52, path, params, array);
    0 < 1 ? github.repos.push(params, array).then(function(response) {
        console.log(37, response);
    }) : null
}
api.code.view = function(target) {
    console.log(60, target);
    target.closest('box').classList.toggle('active');
    var frame = document.getElementById("code-frame");
    var code = frame.closest("block");
    code.classList.toggle('hidden');
}

window.api.gists = {};
api.gists.push = function() {
    var id = rout.e.paths[2];

    var code = [];
    var html = window.cm.html.getValue();
    var css = window.cm.css.getValue();
    var js = window.cm.js.getValue();
    html === "" ? null : code.html = html;
    css === "" ? null : code.css = css;
    js === "" ? null : code.js = js;

    var files = {};
    var keys = Object.keys(code);
    var vals = Object.values(code);
    Object.keys(code).forEach((key,index)=>{
        var value = vals[index];
        var extension = key;
        var content = vals[index];
        var obj = {
            content
        };
        var file = "index." + extension;
        files[file] = obj;
        console.log(83, {
            code,
            content,
            keys,
            obj,
            vals,
            files,
            file
        });
    }
    );
    0 > 1 ? console.log(93, {        
        code,
        keys,
        vals,
        files
    }) : null;

    var settings = {
        body: JSON.stringify({
            description: "An updated gist description",
            files
        }),
        method: 'PATCH'
    };
    0 < 1 ? console.log(107, {        
        id,
        settings
    }) : null;
    github.gists.id(id, settings)
}
api.gists.config = () => {
    console.log(116, 'api.gists.config');
    request('/raw/asset/html/modal/gist.options.html').then((html) => {
        console.log(118, {
            html
        });
        modal.panel(html);
    });
}
api.gists.view = () => {
    console.log(119, 'api.gists.view');
}
api.gists.likes = () => {
    console.log(116, 'api.gists.likes');
    request('/raw/asset/html/modal/gist.likes.html').then((html) => {
        console.log(118, {
            html
        });
        modal.panel(html);
    });
}

window.api.time = {};
api.time.date = (previous)=>{
    var date = Date.now();
    var current = date;
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
    }
}

window.api.tree = {};
window.api.tree.edit = function(target) {
    var box = target.closest('box');
    var link = box.querySelector('text span');
    var filename = link.textContent;
    var parts = filename.split('.');
    var ext = parts[parts.length - 1];
    //console.log(90, filename, ext);

    if (box.querySelector('.icon-file')) {
        if (["index.css", "index.html", "index.js"].includes(filename)) {
            var href = link.getAttribute('href');
            var dirs = href.split('/').filter(o=>o.length > 0);
            dirs[2] = 'edit';
            console.log(97, href, dirs);
            rout.er("/" + dirs.join("/"))
        }

        if (["jpg", "jpeg", "png", "svg"].includes(ext)) {
            console.log("Cannot edit images...");
        }
    }

    if (box.querySelector('.icon-folder')) {
        var href = link.getAttribute('href');
        var dirs = href.split('/').filter(o=>o.length > 0);
        dirs[2] = 'wide';
        console.log(97, href, dirs);
        rout.er("/" + dirs.join("/"));
    }
}
