window.Fetch = window.fetch;
window.fetch = window.request = async(resource,options)=>{
    console.log(3, 'window.fetch', resource);
    return new Promise(async function(resolve, reject) {
        var owner = "projyx";
        var repo = "jyxer";
        var path = "index.html";
        //alert(1);
        const url = "https://api.github.com" + "/repos/" + owner + "/" + repo + "/contents/" + path;
        if (resource.startsWith("/")) {
            //alert(2);
            const accessToken = window.parent.localStorage.githubAccessToken;
            const settings = accessToken ? {
                headers: {
                    Accept: "application/vnd.github.raw",
                    Authorization: "token " + accessToken
                }
            } : null;
            //alert(16 + url);
            //resource = await Fetch(url, settings);
            //alert(16 + url);
            //alert(3);
            console.log(14, 'fetch.resource.github', url, resource);
            //resolve(resource)
            //resource = url;

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