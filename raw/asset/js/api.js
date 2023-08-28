window.api = {};

window.api.oauth = {};
window.api.oauth.config = {
    client_id: 0 > 1 ? "" : "ed63f2ffe8929b18142d",
    redirect_uri: window.location.protocol + "//" + window.location.host + window.location.pathname,
    scope: "delete_repo,user,public_repo,repo"
}
window.api.oauth.login = function() {
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
    var paths = window.location.pathname.split("/").filter(o => o.length > 1);
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
