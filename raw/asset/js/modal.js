window.modal = {
    card: (h,style,className)=>{
        var ppp = document.createElement('aside')
        ppp.setAttribute('class', 'aside body-aside card');
        ppp.innerHTML = `<section><card class="card">` + h + `</card></section>`;
        ppp.onclick = event=>{
            event.target.classList.contains('aside') ? event.target.remove() : null
        }
        ;
        var card = ppp.firstElementChild;
        if (style && Object.keys(style).length > 0) {
            card.style = style;
            card.className = className;
            var i = 0;
            do {
                var key = Object.keys(style)[i];
                card.style[key] = style[key];
                i++;
            } while (i < Object.keys(style).length);
            style["max-width"] ? card.style["max-width"] = style["max-width"] : null;
            style["width"] ? card.style["width"] = style["width"] : null;
            style["left"] ? card.style["left"] = style["left"] : null;
            style["bottom"] ? card.style["bottom"] = style["bottom"] : null;
            style["top"] ? card.style["top"] = style["top"] : null;
            style["right"] ? card.style["right"] = style["right"] : null;
            style["border-radius"] ? card.style["border-radius"] = style["border-radius"] : null;
            card.setAttribute('class', 'aside body-aside panel');
        }
        dom.body.insertBefore(ppp, document.getElementById('boot').nextElementSibling);
        modal.zIndex(document.querySelectorAll('aside:not(#body-ppp)'));
        //dom.body.onclick = () => on.touch.tap(event,'tap');
        return new Promise((resolve,reject)=>resolve(document.getElementById('boot').nextElementSibling));
    }
    ,
    alert: async(h,ppp=document.createElement('aside'))=>{
        var innerHTML = await ajax('raw/asset/html/modal/modal.alert.html');
        var html = new DOMParser().parseFromString(innerHTML, 'text/html').body.firstElementChild;
        h.title ? html.find('[placeholder="Title"]').textContent = h.title : null;
        h.body ? html.find('[placeholder="Body"]').textContent = h.body : null;
        h.submit ? html.find('[placeholder="OK').textContent = h.submit : null;
        ppp.innerHTML = html.outerHTML;
        ppp.onclick = event=>{
            var io = false;
            if (event.target.classList.contains('aside')) {
                event.target.remove();
            } else {
                var target = event.target;
                var ok = target.closest("[placeholder='OK']");
                if (ok) {
                    modal.exit(target);
                }
            }
        }
        ;
        dom.body.insertBefore(ppp, document.getElementById('boot').nextElementSibling);
        modal.zIndex(document.querySelectorAll('aside:not(#body-ppp)'));
    }
    ,
    confirm: async(h,opt)=>{
        var ppp = document.createElement('aside');
        return new Promise(async(resolve,reject)=>{
            var innerHTML = await ajax('raw/asset/html/modal/modal.confirm.html');
            var html = new DOMParser().parseFromString(innerHTML, 'text/html').body.firstElementChild;
            html.find('[placeholder="Title"]').textContent = h.title;
            html.find('[placeholder="Body"]').textContent = h.body;
            html.find('[placeholder="No"]').textContent = opt[0];
            html.find('[placeholder="Yes"]').textContent = opt[1];
            ppp.innerHTML = html.outerHTML;
            ppp.onclick = event=>{
                var io = false;
                if (event.target.classList.contains('aside')) {
                    event.target.remove();
                } else {
                    var target = event.target;
                    var confirm = target.closest("[placeholder='Yes']");
                    var cancel = target.closest("[placeholder='No']");
                    if (confirm || cancel) {
                        io = confirm ? true : false;
                        modal.exit(target);
                        resolve(io);
                    }
                }
            }
            dom.body.insertBefore(ppp, document.getElementById('boot').nextElementSibling);
            modal.zIndex(document.querySelectorAll('aside:not(#body-ppp)'));
        }
        );
    }
    ,
    counter: 0,
    exit: target=>{
        target.closest('aside').remove();
        dom.body.classList.remove('overflow-hidden');
    }
    ,
    panel: (h,style,className)=>{
        console.log({
            h,
            style,
            className
        });
        var ppp = document.createElement('aside');
        ppp.innerHTML = h;
        var card = ppp.children[0];
        if (style) {
            card.style = style;
            card.style["margin"] = style["margin"];
            card.style["max-width"] = style["max-width"];
            card.style["width"] = style["width"];
            card.style["left"] = style["left"];
            card.style["bottom"] = style["bottom"];
            card.style["top"] = style["top"];
            card.style["right"] = style["right"];
            card.style["border-radius"] = style["border-radius"];
        }
        ppp.setAttribute('class', 'aside body-aside panel');
        className ? card.className = className : null;
        ppp.onclick = event=>{
            console.log(event.target);
            event.target.classList.contains('aside') || event.target.tagName.toLowerCase() === 'blocks' ? event.target.closest('aside').remove() : null
        }
        dom.body.insertBefore(ppp, document.getElementById('boot').nextElementSibling);
        modal.zIndex(document.querySelectorAll('aside'));
        //dom.body.onclick = () => on.touch.tap(event,'tap');
        return new Promise((resolve,reject)=>resolve(document.getElementById('boot').nextElementSibling));
    }
    ,
    zIndex: elem=>elem.forEach((v,k)=>{
        v.style.zIndex = 123456789 + (elem.length - k);
    }
    )
};
