window.editor = {};

window.editor.tree = {};
window.editor.tree.cd = async function(dir) {
    const feed = document.getElementById('files-list');
    console.log(5, 'editor.tree.cd', dir, feed.path);

    var fp = feed.path.split("/").filter(n=>n.length > 0);
    var fref = fp.splice(0, fp.length - 1).filter(n=>n.length > 0);
    var uri = window.location.pathname;
    var paths = uri.split("/").splice(1).filter(n=>n.length > 0);
    var split = feed.path.split("/").filter(n=>n.length > 0);
    var href = split.splice(5, split.length - 1).filter(n=>n.length > 0);
    var path = feed.path + "/" + dir;
    console.log(12, 'editor.tree.cd', {
        dir,
        feed: feed.path,
        fp,
        fref,
        href,
        path
    });
    var json = await github.repos.contents(paths[0], paths[1], path);
    json.sort((i,o)=>i.type.localeCompare(o.type));
    console.log(261, {
        json
    });

    var template = feed.nextElementSibling;
    feed.innerHTML = "";
    var split = uri.split('/');
    var urt = split.splice(5, split.length - 1);
    feed.path = path;
    if (json.length > 0) {
        var urx = feed.path.split('/').splice(1);
        console.log(274, urx);
        if (urx.length > 0) {
            var ls = template.content.children[0].cloneNode(true);
            var dirs = urx.length > 2 && urx.length < 5 ? [urx[0], urx[1]] : urx.splice(0, urx.length - 1);
            console.log(275, dirs, urx);
            //ls.setAttribute('href', "/" + dirs.join('/'));
            feed.insertAdjacentHTML('beforeend', ls.outerHTML);
            feed.lastElementChild.querySelector('span').onclick = ()=>editor.tree.ls(row.name);
        }

        var i = 0;
        do {
            var row = json[i];
            console.log(283, i, feed, row.type);
            if (row.type === "dir") {
                var folder = template.content.children[1].cloneNode(true);
                var dirs = paths.length > 4 ? paths.concat([row.name]) : [paths[0], paths[1]].concat(["wide", "main", row.name]);
                //folder.querySelector('span').setAttribute('href', "/" + dirs.join('/'));
                folder.querySelector('span').textContent = row.name;
                feed.insertAdjacentHTML('beforeend', folder.outerHTML);
                feed.lastElementChild.querySelector('span').onclick = (e)=>editor.tree.cd(e.target.closest('text').querySelector('span').textContent);
                //console.log(290, feed, folder.outerHTML);
            }
            if (row.type === "file") {
                var file = template.content.children[2].cloneNode(true);
                var dirs = paths.length > 4 ? paths.concat([row.name]) : [paths[0], paths[1]].concat(["wide", "main", row.name]);
                //file.querySelector('span').setAttribute('href', "/" + dirs.join('/'));
                file.querySelector('span').textContent = row.name;
                feed.insertAdjacentHTML('beforeend', file.outerHTML);
                feed.lastElementChild.querySelector('span').onclick = ()=>editor.tree.cd(row.name);
            }
            i++;
        } while (i < json.length - 1)
    }
}
window.editor.tree.ls = async function(dir) {
    const feed = document.getElementById('files-list');
    console.log(5, 'editor.tree.ls', dir, feed.path);

    var fp = feed.path.split("/").filter(n=>n.length > 0);
    var fref = fp.splice(0, fp.length - 1).filter(n=>n.length > 0);
    var uri = window.location.pathname;
    var paths = uri.split("/").splice(1).filter(n=>n.length > 0);
    var split = feed.path.split("/").filter(n=>n.length > 0);
    var href = split.splice(5, split.length - 1).filter(n=>n.length > 0);
    var path = (fref.length > 0 ? '/' : '') + fref.join("/");
    console.log(12, 'editor.tree.cd', {
        dir,
        feed: feed.path,
        fref,
        href,
        path
    });
    var json = await github.repos.contents(paths[0], paths[1], path);
    json.sort((i,o)=>i.type.localeCompare(o.type));
    console.log(261, {
        json
    });

    var template = feed.nextElementSibling;
    feed.innerHTML = "";
    var split = uri.split('/');
    var urt = split.splice(5, split.length - 1);
    feed.path = path;
    if (json.length > 0) {
        var urx = feed.path.split('/').splice(1);
        console.log(274, urx);
        if (urx.length > 0) {
            var ls = template.content.children[0].cloneNode(true);
            var dirs = urx.length > 2 && urx.length < 5 ? [urx[0], urx[1]] : urx.splice(0, urx.length - 1);
            console.log(275, dirs, urx);
            //ls.setAttribute('href', "/" + dirs.join('/'));
            feed.insertAdjacentHTML('beforeend', ls.outerHTML);
            feed.lastElementChild.querySelector('span').onclick = ()=>editor.tree.ls(row.name);
        }

        var i = 0;
        do {
            var row = json[i];
            console.log(283, i, feed, row.type);
            if (row.type === "dir") {
                var folder = template.content.children[1].cloneNode(true);
                var dirs = paths.length > 4 ? paths.concat([row.name]) : [paths[0], paths[1]].concat(["wide", "main", row.name]);
                //folder.querySelector('span').setAttribute('href', "/" + dirs.join('/'));
                folder.querySelector('span').textContent = row.name;
                feed.insertAdjacentHTML('beforeend', folder.outerHTML);
                feed.lastElementChild.querySelector('span').onclick = (e)=>editor.tree.cd(e.target.closest('text').querySelector('span').textContent);
                //console.log(290, feed, folder.outerHTML);
            }
            if (row.type === "file") {
                var file = template.content.children[2].cloneNode(true);
                var dirs = paths.length > 4 ? paths.concat([row.name]) : [paths[0], paths[1]].concat(["wide", "main", row.name]);
                //file.querySelector('span').setAttribute('href', "/" + dirs.join('/'));
                file.querySelector('span').textContent = row.name;
                feed.insertAdjacentHTML('beforeend', file.outerHTML);
                feed.lastElementChild.querySelector('span').onclick = ()=>editor.tree.cd(row.name);
            }
            i++;
        } while (i < json.length - 1)
    }
}
