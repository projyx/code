function request(resource, options) {
    return new Promise(async function(resolve, reject) {
        await fetch(resource, options).then(async(response)=>{
            //console.log(4, response);
            if (!response.ok) {
                return response.text().then(text=>{
                    var text = JSON.stringify({
                        code: response.status,
                        message: JSON.parse(text)
                    });
                    throw new Error(text);
                }
                )
            }
            return response.text();
        }
        ).then(response=>{
            try {
                response = JSON.parse(response);
                resolve(response);
            } catch (err) {
                resolve(response);
            }
        }
        ).catch(error=>{
            console.log("function_get 404 ERROR", error);
            reject(error);
        }
        )
    }
    );
}

function getBlobURL(code, type) {

    const blob = new Blob([code],{
        type
    });

    return URL.createObjectURL(blob);

}

async function pvw(e) {

    console.log(134, e);

    const html = dom.iframe.code.doc = window.cm.html ? window.cm.html.getValue() : null;
    const css = dom.iframe.code.doc = window.cm.css ? window.cm.css.getValue() : null;
    const js = dom.iframe.code.doc = window.cm.js ? window.cm.js.getValue() : null;
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const head = doc.head;
    const body = doc.body;
    const styles = head.querySelectorAll("link");
    const scripts = head.querySelectorAll("script")
    const srcs = body.querySelectorAll("[src]")

    dom.iframe.code.head = head;
    dom.iframe.code.body = body;

    var paths = window.location.pathname.split("/").filter(n=>n.length > 0);
    const owner = paths[0];
    const repo = paths[1];

    0 > 1 ? console.log(149, {
        html,
        head,
        body,
    }, {
        styles,
        scripts
    }, {
        owner,
        repo
    }) : null;

    var l = [];
    if (0 < 1 && styles.length > 0) {
        var i = 0;
        do {
            var link = styles[i];
            //console.log(172, i, link, styles);
            if (!link.href.includes("/index.css")) {
                var uri = new URL(link.href);
                var path = uri.pathname;
                var json = await github.repos.contents(owner, repo, path);
                var text = atob(json.content);
                var blob = getBlobURL(text, 'text/javascript');
                var elem = `<link data-src="${link.href}" rel="stylesheet" type="text/css" href="${blob}" />`
                //console.log(path, {json,text,blob});
                l.push(elem)
                //console.log(164, l);
            }
            i++;
        } while (i < styles.length);
    }

    0 > 1 ? console.log(95, body, {
        styles,
        l
    }) : null;

    var s = [];
    if (scripts.length > 0) {
        var i = 0;
        do {
            var script = scripts[i];
            if (!script.src.includes("/index.js")) {
                if (script.src.startsWith("http")) {
                    var uri = new URL(script.src);
                    var path = uri.pathname;
                    var json = await github.repos.contents(owner, repo, path);
                    var text = atob(json.content);
                    var blob = getBlobURL(text, 'text/javascript');
                    var elem = `<script src="${blob}" data-src="${script.src}">${atob('PC9zY3JpcHQ+')}`;
                } else {
                    var elem = `<script src="${script.src}"></script>`;
                }
                //console.log(path, {json,text,blob});
                s.push(elem);
            }
            //console.log(182, s);
            i++;
        } while (i < scripts.length);
    }

    0 > 1 ? console.log(112, body, {
        scripts,
        s
    }) : null;

    var i = [];
    if (srcs.length > 0) {
        var i = 0;
        do {
            var script = srcs[i];
            var uri = new URL(script.src);
            var resource = uri.pathname;
            console.log(222, script, path);
            if (!path.startsWith("http")) {
                console.log(224, script.src);
                var blob = await github.raw.blob({
                    owner,
                    repo,
                    resource
                });
                var source = body.querySelectorAll("[src]")[i];
                source.src = blob;
                console.log(232, source);
            }
            i++;
        } while (i < srcs.length);
    }

    var json = await request("/raw/asset/js/blob.js");
    var text = json;
    var blob = getBlobURL(text, 'text/javascript');
    var elem = `<script src="${blob}">${atob('PC9zY3JpcHQ+')}`;

    const htmlHead = (l && l.join(" ")) + (s && s.join(" "));
    const htmlBody = body.querySelector('body');
    const src = `

    <html>

      <head>

        ${l.join(" ")}

        ${s.join(" ")}

        <style>${css}</style>

        <script>${js}</script>

        ${elem}

      </head>

      <body>

        ${body.innerHTML}

      </body>

    </html>

  `;

    0 < 1 ? console.log(211, dom.iframe.code, dom.iframe.code.head, {
        html,
        src,
        head,
        l,
        s,
        htmlStyles: l.join(" "),
        htmlScript: s.join(" "),
    }) : null;

    //dom.iframe.code.head.innerHTML = '<style id="style"></style>';
    //dom.iframe.code.head.innerHTML = head;

    //dom.iframe.code.style = dom.iframe.code.head.querySelector('style');

    //dom.iframe.code.body = document.getElementById("code-frame").contentDocument.querySelector('body');

    dom.iframe.code.elem.src = getBlobURL(src, 'text/html');
    //dom.iframe.code.elem.contentWindow.document.body.parentNode.outerHTML = src;

}

async function wIDE(paths) {
    return new Promise(async(resolve,reject)=>{
        var l = [];
        var s = [];

        var css = "";
        var js = "";

        var href = window.location.href;
        var url = new URL(href,location.origin);
        var pathname = url.pathname;
        var search = url.search ? url.search : null;
        var paths = pathname.split("/").splice(1).filter(n=>n.length > 0);
        var ext = paths[paths.length - 1];
        ext.includes('.') ? ext.split('.')[1] : '';

        console.log(231, {
            file,
            paths,
            pathname,
            ext
        });

        var file = paths[paths.length - 1];
        var path = paths.splice(4, paths.length - 1);
        var resource = "index.html";
        console.log(243, resource);

        var html = await github.raw.file({
            owner: paths[0],
            repo: paths[1],
            resource: "/index.html"
        });
        console.log(258, {
            html,
            path
        });
        //var feed = component.querySelector("#code-base");
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const head = doc.head;
        const body = doc.body;
        const styles = head.querySelectorAll("link");
        const scripts = head.querySelectorAll("script");
        const srcs = body.querySelectorAll("[src]");

        var l = [];
        if (0 < 1 && styles.length > 0) {
            var i = 0;
            do {
                var link = styles[i];
                //console.log(172, i, link, styles);
                if (0 < 1) {
                    var uri = new URL(link.href);
                    var path = uri.pathname;
                    //console.log(path);
                    var json = await github.repos.contents({
                        owner: paths[0],
                        repo: paths[1],
                        path: uri.pathname.split('/').filter(o=>o.length > 0).join('/')
                    });
                    var text = atob(json.content);
                    var blob = getBlobURL(text, 'text/javascript');
                    var elem = `<link data-src="${uri.pathname}" rel="stylesheet" type="text/css" href="${blob}" />`
                    //console.log(path, {json,text,blob});
                    l.push(elem)
                    //console.log(164, l);
                }
                i++;
            } while (i < styles.length);
        }

        var s = [];
        if (scripts.length > 0) {
            var i = 0;
            do {
                var script = scripts[i];
                if (0 < 1) {
                    if (script.src.startsWith("http")) {
                        var uri = new URL(script.src);
                        var path = uri.pathname;
                        var json = await github.repos.contents({
                            owner: paths[0],
                            repo: paths[1],
                            path: path
                        });
                        var text = atob(json.content);
                        var blob = getBlobURL(text, 'text/javascript');
                        var elem = `<script src="${blob}" data-src="${script.src}">${atob('PC9zY3JpcHQ+')}`;
                    } else {
                        var elem = `<script src="${script.src}"></script>`;
                    }
                    //console.log(path, {json,text,blob});
                    s.push(elem);
                }
                //console.log(182, s);
                i++;
            } while (i < scripts.length);
        }

        var json = await request("/raw/asset/js/blob.js");
        var text = json;
        var blob = getBlobURL(text, 'text/javascript');
        var elem = `<script src="${blob}" data-src="` + (window.location.origin + '/raw/asset/js/blob.js') + `">${atob('PC9zY3JpcHQ+')}`;

        var base = window.location.origin;
        const src = `
        <html>
          <head>
            <base href="${base}"></base>
            ${l.join(" ")}
            ${s.join(" ")}
            <style>${css}</style>
            <script>${js}</script>
            ${elem}
          </head>
          ${body.outerHTML}
        </html>
    `;

        const editor = document.getElementById('preview-editor');
        var component = editor.closest('component');
        editor.src = getBlobURL(src, 'text/html');
        iFrameReady(editor, function() {
            var contentWindow = editor.contentWindow;
            var pushState = contentWindow.history.pushState;

            var consolelog = contentWindow.console.log;
            contentWindow.console.log = function(txt) {
                try {
                    throw new Error('Throwing error for stack trace...');
                } catch (err) {
                    console.log(343, arguments);
                    var stackTrace = err.stack.split('\n');
                    for (var i = 0; i < stackTrace.length; ++i) {
                        stackTrace[i] = stackTrace[i].replace(/\s+/g, ' ');
                    }
                    var caller = stackTrace[1];
                    var callerParts = caller.split('@');
                    var line = '';

                    //CHROME & SAFARI
                    if (callerParts.length == 1) {
                        callerParts = stackTrace[2].split('('),
                        caller = false;
                        console.log(355, 'callerParts', callerParts);
                        //we have an object caller
                        if (callerParts.length > 1) {
                            console.log(358, 'callerParts', callerParts);
                            var script = callerParts[1].split(')')[0];
                            var lines = script.split(':');
                            var src = lines.splice(0, 3).join(':');
                            var elem = contentWindow.document.head.querySelector('[src="' + src + '"]');
                            var file = elem.dataset.src;
                            var uri = new URL(file,contentWindow.origin);
                            var tiator = uri.pathname.split('/').filter(o=>o.length > 0);
                            var ini = tiator[tiator.length - 1];
                            console.log(360, 'callerParts', {
                                ini,
                                file,
                                uri,
                                src,
                                callerParts,
                                script,
                                elem,
                                lines,
                                line
                            });
                            caller = callerParts[0].replace('at Object.', '');
                            line = callerParts[1].split(':');
                            line = line[2];
                        }//called from outside of an object
                        else {
                            console.log(363, 'callerParts', callerParts);
                            callerParts[0] = callerParts[0].replace('at ', '');
                            console.log(365, 'callerParts', callerParts);
                            callerParts = callerParts[0].split(':');
                            caller = callerParts[0] + callerParts[1];
                            line = callerParts[2];
                        }
                    }//FIREFOX
                    else {
                        var callerParts2 = callerParts[1].split(':');
                        line = callerParts2.pop();
                        callerParts[1] = callerParts2.join(':');
                        caller = (callerParts[0] == '') ? callerParts[1] : callerParts[0];
                    }

                    consolelog(539, 'contentWindow.console.err', arguments, {
                        err,
                        stackTrace,
                        caller,
                        callerParts,
                        ini,
                        txt
                    });
                }
                consolelog.apply(console, arguments);
                var consoletab = component.querySelector('.tools-tab.tab-console');
                var template = consoletab.querySelector('template');
                var log = template.content.firstElementChild.cloneNode(true);
                var s = log.querySelectorAll('text')[0].querySelector('span');
                var m = log.querySelectorAll('text')[1];
                s.textContent = ini;
                console.log(405, arguments);
                Object.values(arguments).forEach((e,g)=>{
                    console.log(e, g, Object.keys(arguments)[g]);
                    var span = document.createElement('span');
                    span.innerHTML = e;
                    m.insertAdjacentHTML('beforeend', span.outerHTML);
                }
                );
                consoletab.children[1].insertAdjacentHTML('beforeend', log.outerHTML);
            }
            contentWindow.history.pushState = function() {
                var unused = null;
                var blob = (0 < 1 ? 'blob:' : '') + contentWindow.location.origin;
                var uri = new URL(contentWindow.location.origin + arguments[2],contentWindow.location.origin);
                var pth = window.top.location.pathname.split("/").filter((n,o)=>n.length > 0);
                var dir = "/" + pth.splice(0, 4).join('/');
                var addr = "/" + uri.pathname.split("/").filter((n,o)=>n.length > 0).join('/');
                if (contentWindow.location.protocol === "blob:") {
                    var url = blob + "/" + addr;
                    var state = url;
                    console.log(339, arguments, {
                        state,
                        unused,
                        url
                    }, uri);
                    var state = "/" + boot.splice(4, boot.length - 1).join("/");
                    arguments = [state, unused, url];
                }
                var url = dir + addr;
                var bar = component.querySelector('.search-box');
                console.log(385, uri);
                bar.querySelector('[name="pathname"]').textContent = uri.pathname;
                console.log(352, 'editor.state', 'editor.iframe.pushState', {
                    path,
                    history: contentWindow.history,
                    location: contentWindow.location,
                    arguments,
                    url,
                    addr
                });
                pushState.apply(contentWindow.history, arguments);
                console.log(354, 'editor.state', 'editor.iframe.pushState', {
                    path,
                    history: contentWindow.history,
                    location: contentWindow.location,
                    arguments,
                    url,
                    addr
                });
                window.top.history.replaceState(state, unused, url);
            }
            var replaceState = contentWindow.history.replaceState;
            contentWindow.history.replaceState = function() {
                var unused = null;
                var blob = (0 < 1 ? 'blob:' : '') + contentWindow.location.origin;
                var uri = new URL(contentWindow.location.origin + arguments[2],contentWindow.location.origin);
                bar.querySelector('[name="pathname"]').textContent = url;
                var addr = "/" + uri.pathname.split("/").filter((n,o)=>n.length > 0).splice(1).join('/');
                if (contentWindow.location.protocol === "blob:") {
                    var url = blob + addr;
                    var state = url;
                    console.log(339, arguments, {
                        state,
                        unused,
                        url
                    }, uri);
                    //var state = "/" + boot.splice(4, boot.length - 1).join("/");

                    arguments = [state, unused, url];
                }
                var pth = window.top.location.pathname.split("/").filter((n,o)=>n.length > 0);
                var url = "/" + pth.splice(0, pth.length).join('/');
                var bar = component.querySelector('.search-box');
                console.log(385, uri);
                bar.querySelector('[name="pathname"]').textContent = uri.pathname;
                console.log(376, 'editor.state', 'editor.iframe.replaceState', {
                    history: contentWindow.history,
                    location: contentWindow.location,
                    arguments,
                    url,
                    addr
                });
                replaceState.apply(contentWindow.history, arguments);
                console.log(378, 'editor.state', 'editor.iframe.replaceState', {
                    history: contentWindow.history,
                    location: contentWindow.location,
                    arguments,
                    url,
                    addr
                });
                window.top.history.replaceState(state, unused, url);
            }
            contentWindow.onpopstate = function(e) {
                console.log(342, 'editor.contentWindow.onpopstate', e);
            }
            const boot = url.pathname.split("/").splice(1).filter(n=>n.length > 0);
            var state = "/" + boot.splice(4, boot.length).join("/");
            console.log(356, state);
            contentWindow.document.body.querySelector('boot').setAttribute('route', state);
            document.getElementById('preview-editor').contentWindow.history.pushState(state, null, state);
            console.log(360, "Iframe domcontentloaded", boot, window.location.href, contentWindow.location, state);

            resolve(contentWindow);
        })
    }
    )
}

// This function ONLY works for iFrames of the same origin as their parent
function iFrameReady(iFrame, fn) {
    var timer;
    var fired = false;

    function ready() {
        if (!fired) {
            fired = true;
            clearTimeout(timer);
            fn.call(this);
        }
    }

    function readyState() {
        if (this.readyState === "complete") {
            ready.call(this);
        }
    }

    // cross platform event handler for compatibility with older IE versions
    function addEvent(elem, event, fn) {
        if (elem.addEventListener) {
            return elem.addEventListener(event, fn);
        } else {
            return elem.attachEvent("on" + event, function() {
                return fn.call(elem, window.event);
            });
        }
    }

    // use iFrame load as a backup - though the other events should occur first

    function checkLoaded() {
        var doc = iFrame.contentDocument || iFrame.contentWindow.document;
        // We can tell if there is a dummy document installed because the dummy document
        // will have an URL that starts with "about:".  The real document will not have that URL
        if (doc.URL.indexOf("about:") !== 0) {
            if (doc.readyState === "complete") {
                ready.call(doc);
            } else {
                // set event listener for DOMContentLoaded on the new document
                addEvent(doc, "DOMContentLoaded", ready);
                addEvent(doc, "readystatechange", readyState);
            }
        } else {
            // still same old original document, so keep looking for content or new document
            timer = setTimeout(checkLoaded, 1);
        }
    }

    checkLoaded();
}

function domTree(component, contentWindow) {
    var tab = component.querySelector('.tab')
    var element = contentWindow.document.querySelector("html");
    var domtree = component.querySelector('.tools-tab.tab-elements').firstElementChild;
    var section = component.querySelector('.tools-tab.tab-elements').firstElementChild;
    var template = section.nextElementSibling.content.firstElementChild;
    var elements = [];
    var i = 0;
    do {
        elements.push(element);
        var box = template.cloneNode(true);
        var tagName = element.tagName.toLowerCase();
        box.querySelector('header').textContent = "<" + tagName + ">";
        if (!["base", "link", "meta"].includes(tagName)) {
            box.querySelector('footer').textContent = "</" + tagName + ">";
        }

        var previous = elements[i - 1];
        element.setAttribute('dom', i);
        //console.log(548, 'wIDE.elements.loop(element)', element);
        if (element.firstElementChild && parent === previous) {
            console.log(550, 'wIDE.elements.loop(element)', {
                i,
                element,
                firstElementChild: element.firstElementChild,
                elements,
                element,
                parent: element.parentNode,
                previous
            });
            element = element.firstElementChild;
            section.insertAdjacentHTML('beforeend', box.outerHTML);
            section = section.lastElementChild.querySelector('header:has(+ section) + section')
        } else {
            var next = element.closest('[dom]:has(+ :not([dom]))');
            var firstElementChild = element.firstElementChild;
            console.log(558, 'wIDE.elements.loop(element)', {
                element,
                next,
                firstElementChild: element.firstElementChild
            });
            if (next || element.firstElementChild) {
                next ? next = next.nextElementSibling : null;
                var parent = element.parentNode;
                var previous = elements[i - 1];
                //console.log(562, 'What is the section?', section);
                console.log(568, {
                    i,
                    elements,
                    element,
                    parent: element.parentNode,
                    previous
                });
                var which = null;
                if (element.parentElement === elements[i - 1]) {
                    which = 1;
                    section.insertAdjacentHTML('beforeend', box.outerHTML);
                    section = section.lastElementChild.querySelector('header:has(+ section) + section')
                } else {
                    which = 2;
                    if (previous !== element.previousElementChild) {
                        domtree.querySelector('[dom="' + parseInt(parent.getAttribute('dom')) + '"] > section').insertAdjacentHTML('beforeend', box.outerHTML);
                        section = domtree.querySelector('[dom="' + parseInt(parent.getAttribute('dom')) + '"] > section').lastElementChild.querySelector('header:has(+ section) + section')
                    } else {
                        section.closest('box').insertAdjacentHTML('afterend', box.outerHTML);
                        section = section.closest('box[dom]').nextElementSibling.querySelector('header:has(+ section) + section')
                    }
                }
                0 < 1 ? console.log(558, 'wIDE.elements.loop(next)', {
                    i,
                    which,
                    element,
                    next,
                    firstElementChild,
                    parent,
                    parentId: parseInt(parent.getAttribute('dom')),
                    previous,
                    insert: domtree.querySelector('[dom="' + parseInt(parent.getAttribute('dom')) + '"]'),
                    section
                }) : null;
                if (next) {
                    if (firstElementChild) {
                        element = firstElementChild;
                        //element = next;
                    } else {
                        element = next;
                    }
                } else {
                    element = element.firstElementChild;
                }
            } else {
                element = null;
            }
        }
        section.closest('box').setAttribute('dom', i);
        i++;
    } while (element);
}

window.Crypto = crypt = cx = {
    uid: {
        create: x=>{
            if (window.crypto || window.msCrypto) {
                var array = new Uint32Array(x);
                window.crypto.getRandomValues(array);
                array.length === 1 ? array = array[0] : null;
                return array;
            } else {
                throw new Error("Your browser can't generate secure random numbers");
            }
        }
    }
};
