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

        0 > 1 ? console.log(231, {
            file,
            paths,
            pathname,
            ext
        }) : null;

        var file = paths[paths.length - 1];
        var path = paths.splice(4, paths.length - 1);
        var resource = "index.html";
        //console.log(243, resource);

        var html = await github.raw.file({
            owner: paths[0],
            repo: paths[1],
            resource: "/index.html"
        });
        0 > 1 ? console.log(258, {
            html,
            path
        }) : null;
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
        var link = window.location.protocol + `//` + window.location.host + `/raw/asset/css/webtools.css`;
        var link = ``;
        const src = `
        <html>
          <head>
            <base href="${base}"></base>
            <!--<link rel="stylesheet" type="text/css" href="${link}" />-->
            ${l.join(" ")}
            ${s.join(" ")}
            <!--<style>${css}</style>-->
            <!--<script>${js}</script>-->
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
                    //console.log(343, arguments);
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
                        //console.log(355, 'callerParts', callerParts);
                        //we have an object caller
                        if (callerParts.length > 1) {
                            //console.log(358, 'callerParts', callerParts);
                            var script = callerParts[1].split(')')[0];
                            var lines = script.split(':');
                            var src = lines.splice(0, 3).join(':');
                            var elem = contentWindow.document.head.querySelector('[src="' + src + '"]');
                            var file = elem.dataset.src;
                            var uri = new URL(file,contentWindow.origin);
                            var tiator = uri.pathname.split('/').filter(o=>o.length > 0);
                            var ini = tiator[tiator.length - 1];
                            0 > 1 ? console.log(360, 'callerParts', {
                                ini,
                                file,
                                uri,
                                src,
                                callerParts,
                                script,
                                elem,
                                lines,
                                line
                            }) : null;
                            caller = callerParts[0].replace('at Object.', '');
                            line = callerParts[1].split(':');
                            line = line[2];
                        }//called from outside of an object
                        else {
                            //console.log(363, 'callerParts', callerParts);
                            callerParts[0] = callerParts[0].replace('at ', '');
                            //console.log(365, 'callerParts', callerParts);
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

                    0 > 1 ? consolelog(539, 'contentWindow.console.err', arguments, {
                        err,
                        stackTrace,
                        caller,
                        callerParts,
                        ini,
                        txt
                    }) : null;
                }
                //consolelog.apply(console, arguments);
                var consoletab = component.querySelector('.tools-tab.tab-console');
                var template = consoletab.querySelector('template');
                var log = template.content.firstElementChild.cloneNode(true);
                var s = log.querySelectorAll('text')[0].querySelector('span');
                var m = log.querySelectorAll('text')[1];
                s.textContent = ini;
                //console.log(405, arguments);
                Object.values(arguments).forEach((e,g)=>{
                    //console.log(e, g, Object.keys(arguments)[g]);
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

                var blob = (0 < 1 ? 'blob:' : '') + contentWindow.location.origin;
                var uri = new URL(contentWindow.location.origin + arguments[2],contentWindow.location.origin);
                //bar.querySelector('[name="pathname"]').textContent = url;
                var addr = "/" + uri.pathname.split("/").filter((n,o)=>n.length > 0).splice(1).join('/');
                if (contentWindow.location.protocol === "blob:") {
                    var url = blob + addr;
                    var state = url;
                    0 > 1 ? console.log(339, arguments, {
                        state,
                        unused,
                        url
                    }, uri) : null;
                    //var state = "/" + boot.splice(4, boot.length - 1).join("/");

                    arguments = [state, unused, url];
                }

                var url = dir + addr;
                var bar = component.querySelector('.search-box');
                0 > 1 ? console.log(385, {
                    uri,
                    dir,
                    addr,
                    blob,
                    arguments
                }) : null;
                bar.querySelector('[name="pathname"]').textContent = uri.pathname;
                0 > 1 ? console.log(352, 'editor.state', 'editor.iframe.pushState', {
                    path,
                    history: contentWindow.history,
                    location: contentWindow.location,
                    arguments,
                    url,
                    addr
                }) : null;
                //pushState.apply(contentWindow.history, arguments);
                0 > 1 ? console.log(354, 'editor.state', 'editor.iframe.pushState', {
                    path,
                    history: contentWindow.history,
                    location: contentWindow.location,
                    arguments,
                    url,
                    addr
                }) : null;
                window.top.history.replaceState(state, unused, url);
                domBuilder(component, contentWindow);

                resolve ? resolve(contentWindow) : null;
            }
            var replaceState = contentWindow.history.replaceState;
            contentWindow.history.replaceState = function() {
                var unused = null;
                var blob = (0 < 1 ? 'blob:' : '') + contentWindow.location.origin;
                var uri = new URL(contentWindow.location.origin + arguments[2],contentWindow.location.origin);
                //bar.querySelector('[name="pathname"]').textContent = url;
                var addr = "/" + uri.pathname.split("/").filter((n,o)=>n.length > 0).splice(1).join('/');
                if (contentWindow.location.protocol === "blob:") {
                    var url = blob + addr;
                    var state = url;
                    0 > 1 ? console.log(339, arguments, {
                        state,
                        unused,
                        url
                    }, uri) : null;
                    //var state = "/" + boot.splice(4, boot.length - 1).join("/");

                    arguments = [state, unused, url];
                }
                var pth = window.top.location.pathname.split("/").filter((n,o)=>n.length > 0);
                var url = "/" + pth.splice(0, pth.length).join('/');
                var bar = component.querySelector('.search-box');
                //console.log(385, uri);
                bar.querySelector('[name="pathname"]').textContent = uri.pathname;
                0 > 1 ? console.log(376, 'editor.state', 'editor.iframe.replaceState', {
                    history: contentWindow.history,
                    location: contentWindow.location,
                    arguments,
                    url,
                    addr
                }) : null;
                replaceState.apply(contentWindow.history, arguments);
                0 > 1 ? console.log(378, 'editor.state', 'editor.iframe.replaceState', {
                    history: contentWindow.history,
                    location: contentWindow.location,
                    arguments,
                    url,
                    addr
                }) : null;
                window.top.history.replaceState(state, unused, url);
            }
            contentWindow.onpopstate = function(e) {//console.log(342, 'editor.contentWindow.onpopstate', e);
            }
            const boot = url.pathname.split("/").splice(1).filter(n=>n.length > 0);
            var state = "/" + boot.splice(4, boot.length).join("/");
            //console.log(356, state);
            if(contentWindow.document.body.querySelector('boot')) {
                contentWindow.document.body.querySelector('boot').setAttribute('route', state);
            } else {
                var el = document.createElement('boot');
                document.body.insertAdjacentHTML('afterbegin', el.outerHTML)
            }
            //contentWindow.location.href = uri.origin + uri.pathname;
            //document.getElementById('preview-editor').contentWindow.history.replaceState(state, null, state);
            //console.log(360, "Iframe domcontentloaded", boot, window.location.href, contentWindow.location, state);
        })
    }
    )
}

function parseCSSText(cssText) {
    var cssTxt = cssText.replace(/\/\*(.|\s)*?\*\//g, " ").replace(/\s+/g, " ");
    var style = {}
      , [,ruleName,rule] = cssTxt.match(/ ?(.*?) ?{([^}]*)}/) || [, , cssTxt];
    var cssToJs = s=>s.replace(/\W+\w/g, match=>match.slice(-1).toUpperCase());
    var properties = rule.split(";").map(o=>o.split(":").map(x=>x && x.trim()));
    for (var [property,value] of properties)
        style[cssToJs(property)] = value;
    style = Object.entries(style).filter(([key,value])=>value !== undefined).reduce((obj,[key,value])=>{
        obj[key] = value;
        return obj;
    }
    , {});
    return {
        cssText,
        ruleName,
        style
    };
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

function domBuilder(component, contentWindow) {
    var tab = component.querySelector('.tab')
    var element = contentWindow.document.querySelector("html");
    var domtree = component.querySelector('.tools-tab.tab-elements').firstElementChild;
    var section = component.querySelector('.tools-tab.tab-elements').firstElementChild;
    var template = section.nextElementSibling.content.firstElementChild;
    var elements = [];
    var i = 0;
    section.innerHTML = "";
    do {
        //VARIABLES
        elements.push(element);
        //var elem = element;
        var box = template.cloneNode(true);
        var tagName = element.tagName.toLowerCase();
        var attributes = [];
        //console.log(590, element.attributes.length, element);

        //MANIPULATE
        var innerHTML = "";
        var leftAngleBracket = document.createElement('span');
        leftAngleBracket.style.color = "#5db0d7";
        leftAngleBracket.textContent = "<";
        var startTag = document.createElement('span');
        startTag.style.color = "#5db0d7";
        startTag.textContent = tagName;
        innerHTML += leftAngleBracket.outerHTML;
        innerHTML += startTag.outerHTML;
        if (element.attributes.length > 0) {
            //console.log(592, element.attributes);
            for (const attr of element.attributes) {
                var attribute = document.createElement('span');
                attribute.style.color = "#9bbbdc";
                attribute.textContent = attr.name;
                var equalSign = document.createElement('span');
                equalSign.style.color = "#5db0d7";
                equalSign.textContent = "=";
                var leftQuote = document.createElement('span');
                leftQuote.style.color = "#5db0d7";
                leftQuote.textContent = '"';
                var value = document.createElement('span');
                value.style.color = "#f29766";
                value.textContent = attr.value
                var rightQuote = document.createElement('span');
                rightQuote.style.color = "#5db0d7";
                rightQuote.textContent = '"';
                var outerHTML = attribute.outerHTML + equalSign.outerHTML + leftQuote.outerHTML + value.outerHTML + rightQuote.outerHTML;
                attributes.push(outerHTML);
            }
        }
        innerHTML += (attributes.length > 0 ? " " : "") + attributes.join(" ");
        var rightAngleBracket = document.createElement('span');
        rightAngleBracket.style.color = "#5db0d7";
        rightAngleBracket.textContent = ">";
        innerHTML += rightAngleBracket.outerHTML;
        //console.log(615, innerHTML);
        box.querySelector('header').innerHTML = innerHTML;
        if (!["base", "link", "meta"].includes(tagName)) {
            //box.querySelector('footer').textContent = "</" + tagName + ">";
            var endTag = document.createElement('span');
            endTag.style.color = "#5db0d7";
            endTag.textContent = "</" + tagName + ">";
            box.querySelector('footer').innerHTML = endTag.outerHTML;
        }

        //REDECLARE
        var previous = elements[i - 1];
        element.setAttribute('dom', i);
        //console.log(548, 'wIDE.elements.loop(element)', element);
        if (element.firstElementChild && parent === previous) {
            0 > 1 ? console.log(550, 'wIDE.elements.loop(element)', {
                i,
                element,
                firstElementChild: element.firstElementChild,
                elements,
                element,
                parent: element.parentNode,
                previous
            }) : null;
            element = element.firstElementChild;
            section.insertAdjacentHTML('beforeend', box.outerHTML);
            section = section.lastElementChild.querySelector('header:has(+ section) + section');
            0 > 1 ? console.log(693, 'section.onmouseover', {
                box: section.closest('box'),
                element
            }) : null;
            section.closest('box').node = element;
        } else {
            var next = element.closest('[dom]:has(+ :not([dom]))');
            var firstElementChild = element.firstElementChild;
            0 > 1 ? console.log(558, 'wIDE.elements.loop(element)', {
                element,
                next,
                firstElementChild
            }) : null;
            if (next || firstElementChild) {
                next ? next = next.nextElementSibling : null;
                var parent = element.parentNode;
                var previous = elements[i - 1];
                //console.log(562, 'What is the section?', section);
                0 > 1 ? console.log(568, {
                    i,
                    elements,
                    element,
                    parent: element.parentNode,
                    previous
                }) : null;
                var which = null;
                if (element.parentElement === elements[i - 1]) {
                    which = 1;
                    section.insertAdjacentHTML('beforeend', box.outerHTML);
                    section = section.lastElementChild.querySelector('header:has(+ section) + section')
                    0 > 1 ? console.log(718, 'section.onmouseover', {
                        box: section.closest('box'),
                        element
                    }) : null;
                    section.closest('box').node = element;
                } else {
                    which = 2;
                    if (previous !== element.previousElementChild) {
                        which = "2.5";
                        domtree.querySelector('[dom="' + parseInt(parent.getAttribute('dom')) + '"] > section').insertAdjacentHTML('beforeend', box.outerHTML);
                        section = domtree.querySelector('[dom="' + parseInt(parent.getAttribute('dom')) + '"] > section').lastElementChild.querySelector('header:has(+ section) + section');
                        0 > 1 ? console.log(726, 'section.onmouseover', {
                            box: section.closest('box'),
                            element
                        }) : null;
                        section.closest('box').node = element;
                    } else {
                        which = "2.8";
                        section.closest('box').insertAdjacentHTML('afterend', box.outerHTML);
                        section.closest('box').node = element;
                        section = section.closest('box[dom]').nextElementSibling.querySelector('header:has(+ section) + section');
                        0 > 1 ? console.log(736, 'section.onmouseover', {
                            box: section.closest('box'),
                            element
                        }) : null;
                        section.closest('box').node = element;
                    }
                }
                if (next) {
                    if (firstElementChild) {
                        element = firstElementChild;
                        //element = next;
                    } else {
                        element = next;
                    }
                } else {
                    if (firstElementChild) {
                        element = element.firstElementChild;
                    } else {
                        element = element;
                    }
                }
            } else {
                section.closest('box').insertAdjacentHTML('afterend', box.outerHTML);
                section = section.closest('box[dom]').nextElementSibling.querySelector('header:has(+ section) + section');
                0 > 1 ? console.log(773, 'section.onmouseover', {
                    box: section.closest('box'),
                    element
                }) : null;
                section.closest('box').node = element;
                element = null;
            }
            var line = section.closest('box');
        }
        section.closest('box').setAttribute('dom', i);
        i++;
    } while (element);
    Array.from(document.querySelectorAll('[dom]')).forEach((el)=>{
        el.removeAttribute('dom');
    }
    )
    Array.from(contentWindow.document.querySelectorAll('[dom]')).forEach((el)=>{
        el.removeAttribute('dom');
    }
    )
    var body = domtree.firstElementChild.children[2].children[1];
    body.classList.add('expand');
}

function cssRules(doc) {
    var value;
    [].some.call(doc.styleSheets, function(sheet) {
        return [].some.call(sheet.rules, function(rule) {
            if (rule.selectorText) {
                return [].some.call(rule.style, function(style) {
                    if (attribute === style) {
                        value = rule.style.getPropertyValue(attribute);
                        return true;
                    }
                    return false;
                });
            } else {
                var rules = rule.cssRules;
                console.log(1518, rule, rules);
            }
            return false;
        });
    });

    return value;
}

function styleSheet(node) {
    var doc = node.ownerDocument;
    console.log(820, 'stylesheet.variables', {
        doc,
        node
    });
    [].some.call(doc.styleSheets, function(sheet) {
        var href = sheet.href;
        var link = sheet.ownerNode;
        var src = link.dataset.src;
        var dirs = rout.ed(src);
        var dir = dirs[dirs.length - 1];
        console.log(820, 'stylesheet.sheet', {
            sheet,
            href,
            src,
            dir
        });
        return [].some.call(sheet.rules, function(rule) {
            console.log(820, 'stylesheet.rules', rule);
            if (rule.selectorText) {
                return [].some.call(rule.style, function(style) {
                    console.log(820, style);
                    if (attribute === style) {
                        value = rule.style.getPropertyValue(attribute);
                        return true;
                    }
                    return false;
                });
            } else {
                var rules = rule.cssRules;
                console.log(1518, rule, rules);
            }
            return false;
        });
    });
}

function isDescendant(parent, child) {
     var node = child.parentNode;
     while (node != null) {
         if (node == parent) {
             return true;
         }
         node = node.parentNode;
     }
     return false;
}

function triggerMouseEvent(node, eventType) {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(eventType, true, true);
    node.dispatchEvent(clickEvent);
}

function checker(arr) {
    return arr.length > 0 ? arr.every(v => v === true) : false;
}

var getParents = function (elem, selector) {

	// Element.matches() polyfill
	if (!Element.prototype.matches) {
		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function(s) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(s),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
	}

	// Set up a parent array
	var parents = [];

	// Push each parent element to the array
	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		if (selector) {
			if (elem.matches(selector)) {
				parents.push(elem);
			}
			continue;
		}
		parents.push(elem);
	}

	// Return our parent array
	return parents;

};

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
