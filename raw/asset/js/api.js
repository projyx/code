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

window.api.rooms = {};
window.api.rooms.random = function() {
    request('/assets/json/rooms.json').then(room);
    function room(rooms) {
        var n = Math.floor(Math.random() * (rooms.length - 0 + 1) + 0);
        console.log(10, n);
        var room = rooms[n].name;
        browse.route('/chat/' + room);
    }
}
