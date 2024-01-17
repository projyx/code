window.onload = async(event)=>{
    function compare(a, b) {
        var routed = (c)=>{
            return c.getAttribute('route') ? c.getAttribute('route') : c.getAttribute('routes');
        }
        var aa = routed(a);
        var bb = routed(b);
        var x = rout.ed(aa);
        var y = rout.ed(bb);
        0 < 1 ? console.log(15, aa, bb, x.length, y.length) : null;
        var routes = (z)=>{
            return x.length < y.length ? x : y;
        }
        var alpha = routed(b).localeCompare(routed(a));
        var length = routes(b).length - routes(a).length;
        var paths = rout.ed(aa).length - rout.ed(bb).length;
        return alpha
    }
    Array.from(document.querySelectorAll('[route], [routes]')).sort(compare).reverse().forEach(function(component) {
        var route = {
            file: component.getAttribute('component') + ".html",
            url: component.getAttribute('route') || component.getAttribute('routes'),
        };
        window.rout.es.push(route);
    });
    0 < 1 ? window.rout.es.sort(function(a, b) {
        return rout.ed(a.url).length - rout.ed(b.url).length
    }).reverse() : null;
    0 > 1 ? console.log(2, "window.onload", {
        routes: window.routes
    }) : null;

    firebase.initializeApp({
        apiKey: "AIzaSyA2K41RYhtZm4nx2F1liIJ8ly4ejy6gqc8",
        authDomain: "pro-jyx.firebaseapp.com",
        projectId: "pro-jyx",
        appId: "1:492439614306:web:58cffeca539613b875b23b"
    });
    firebase.auth().onAuthStateChanged(async(user)=>{
        var pathname = window.location.href.split(document.head.querySelector("base").href)[1];
        console.log(41, {
            pathname
        });
        if (user) {
            window.user = user;
            0 < 1 ? console.log(42, 'index.user', {
                user
            }) : null;
            try {
                var uid = user.uid;
                var user = await github.user.self();
                //console.log(user);
                var avatar_url = user.avatar_url;

                document.body.setAttribute('uid', uid)
                localStorage.setItem('githubAccessToken', token);

                localStorage.setItem("user", user.login);

                rout.er(pathname);
            } catch (e) {
                console.log(56, 'onAuthStateChanged', {
                    e
                });

                rout.er(pathname);
            }
        } else {
            window.user = null;
            localStorage.removeItem('githubAccessToken');
            Array.from(document.body.querySelectorAll(".avatar-image")).forEach(function(avatar) {
                avatar.innerHTML = "";
            });
            rout.er(pathname);
        }
        //dom.body.dataset.load = "ed";
    }
    );
    
    document.body.onclick = window.events.onclick.document;

    document.onkeydown = window.events.onkeydown;

    window.dom = {};
}

window.onpopstate = (event)=>{
    var state = event.state;
    console.log(event, state);
    if (state && state.url) {
        console.log(state);
        state.url.length > 0 ? rout.er(state.url, {
            pop: true
        }) : null;
    }
}
