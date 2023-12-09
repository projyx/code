window.Fetch = window.fetch;
window.fetch = window.request = async(resource,options)=>{
    resource = resource.toString();
    options ? null : options = {};
    console.log(3, 'window.fetch', resource);
    return new Promise(async function(resolve, reject) {
        const isValidUrl = urlString=>{
            try {
                return Boolean(new URL(urlString));
            } catch (e) {
                return false;
            }
        }
        var resonance = isValidUrl(resource);
        console.log(14, { resonance, resource });
        
        if (resource.startsWith("/")) {
            var parent = window.parent;
            var paths = parent.location.pathname.split("/").filter(o=>o.length > 1);
            var owner = paths[1];
            var id = paths[2];
            var url = "https://api.github.com" + "/gists/" + id;
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
        } else {
            var url = resource;
        }
        
        console.log(40, 'fetcheth', {url, options});
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
                console.log(41, 'fetch.request', {response, url});
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
