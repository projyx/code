window.Fetch = window.fetch;
window.fetch = window.request = async(resource,options)=>{
    options ? null : options = {};
    console.log(3, 'window.fetch', resource);
    return new Promise(async function(resolve, reject) {
        if (resource.startsWith("/")) {
            var parent = window.parent;
            var paths = parent.location.pathname.split("/").filter(o=>o.length > 1);
            var owner = paths[0];
            var repo = paths[1];
            var dirs = resource.split("/").filter(o=>o.length > 1);
            var path = paths.splice(4, paths.length - 1);
            var url = "https://api.github.com" + "/repos/" + owner + "/" + repo + "/contents/" + dirs.join("/");
            console.log(15, {
                dirs,
                path,
                url
            });
            
            const accessToken = window.parent.localStorage.githubAccessToken;
            if (accessToken) {
                options.cache = "reload";
                options.headers = {
                    Accept: "application/vnd.github.raw",
                    Authorization: "token " + accessToken
                };
            }
            console.log(19, 'fetch.request', url, options);
        }
        0 < 1 ? await Fetch(url, options).then(async(response)=>{
            //console.log(response);
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
                //console.log(39, response);
                response = JSON.parse(response);
                console.log(41, 'fetch.request', response);
                resolve(response);
            } catch (err) {
                resolve(response);
            }
        }
        ).catch(error=>{
            console.log("function_get 404 ERROR", error);
            reject(error);
        }
        ) : null;
    }
    );
}
