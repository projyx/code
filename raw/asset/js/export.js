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
                var elem = `<link rel="stylesheet" type="text/css" href="${blob}" />`
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

    0 > 1 ? console.log(211, dom.iframe.code, dom.iframe.code.head, {
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
                var json = await github.repos.contents(paths[0], paths[1], path);
                var text = atob(json.content);
                var blob = getBlobURL(text, 'text/javascript');
                var elem = `<link rel="stylesheet" type="text/css" href="${blob}" />`
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
                    var json = await github.repos.contents(paths[0], paths[1], path);
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
    var elem = `<script src="${blob}">${atob('PC9zY3JpcHQ+')}`;
    
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

    const editor = document.getElementById('preview-editor');
    editor.src = getBlobURL(src, 'text/html');
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
