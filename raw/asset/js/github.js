window.github = {
    endpoint: "https://api.github.com",
    oauth: {
        client_id: {
            "code.jyxer.tld": "627d321fca16fcbe8180",
        },
        login: (target)=>{
            console.log(8, target);
            if (target.closest('avi, i').innerHTML === "") {
                var provider = new firebase.auth.GithubAuthProvider();
                //"delete_repo,gist,user,public_repo,repo"
                provider.addScope('delete_repo');
                provider.addScope('gist');
                provider.addScope('public_repo');
                provider.addScope('repo');
                provider.addScope('user');
                provider.setCustomParameters({
                    'redirect_uri': window.location.protocol + "//" + window.location.pathname
                });

                firebase.auth().signInWithPopup(provider).then((result)=>{
                    var credential = result.credential;
                    var token = credential.accessToken;
                    var user = result.user;
                    console.log({
                        result
                    });
                    localStorage.setItem('githubAccessToken', token);
                }
                ).catch((error)=>{
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    var email = error.email;
                    var credential = error.credential;
                    console.log({
                        error
                    });
                }
                );
            }
        }
        ,
        user: async(target)=>{
            try {
                var user = await github.users.user(localStorage.user)
            } catch (e) {
                console.log(e);
            }
            console.log(44, user)
            return user
        }
    }
};

github.database = {};
github.database.blobs = function(params, settings) {
    if (settings) {
        if (settings.method) {
            if (settings.method === "POST") {
                return new Promise((resolve,reject)=>{
                    const data = settings.body;
                    const encoding = params.encoding ? settings.encoding = params.encoding : null
                    const owner = params.owner;
                    const repo = params.repo;
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/blobs";
                    const dataType = settings.method;
                    const a = (data)=>{
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    console.log(173, params, {
                        url,
                        settings
                    });
                    request(url, settings).then(a).catch(b);
                }
                );
            }
        }
    } else {
        return new Promise((resolve,reject)=>{
            const owner = params.owner;
            const repo = params.repo;
            const sha = params.sha;
            const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/blobs/" + sha;
            const a = (data)=>{
                resolve(data);
            }
            const b = (error)=>{
                console.log(error);
                reject(error);
            }
            const accessToken = localStorage.githubAccessToken;
            var settings = {};
            accessToken ? settings.headers = {
                Accept: "application/vnd.github+json",
                Authorization: "token " + accessToken
            } : null;
            //console.log({ url, settings });
            request(url, settings).then(a).catch(b);
        }
        );
    }
}
github.database.commits = function(params, settings) {
    if (settings && settings.method) {
        if (settings.method === "POST") {
            return new Promise((resolve,reject)=>{
                var message = params.message;
                var owner = params.owner;
                var repo = params.repo;
                var sha = params.sha;
                const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/commits";
                const dataType = settings.method;
                const a = (data)=>{
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                request(url, settings).then(a).catch(b);
            }
            );
        }
    }
}
github.database.references = function(params, settings) {
    if (settings) {
        if (settings.method) {
            if (settings.method === "GET") {
                return new Promise((resolve,reject)=>{
                    var owner = params.owner;
                    var repo = params.repo;
                    var branch = params.branch;
                    var ref = branch ? "/heads/" + branch : params.ref;
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/refs" + ref;
                    const dataType = settings.method;
                    const a = (data)=>{
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    request(url, settings).then(a).catch(b);
                }
                );
            }
            if (settings.method === "PATCH") {
                return new Promise((resolve,reject)=>{
                    var owner = params.owner;
                    var repo = params.repo;
                    var branch = params.branch;
                    var ref = branch ? "/heads/" + branch : "";
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/refs" + ref;
                    const dataType = settings.method;
                    const a = (data)=>{
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    request(url, settings).then(a).catch(b);
                }
                );
            }
        }
    } else {
        return new Promise((resolve,reject)=>{
            var owner = params.owner;
            var repo = params.repo;
            var branch = params.branch;
            var ref = branch ? "/heads/" + branch : params.ref;
            const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/refs" + ref;
            const a = (data)=>{
                resolve(data);
            }
            const b = (error)=>{
                console.log(error);
                reject(error);
            }
            const accessToken = localStorage.githubAccessToken;
            accessToken ? settings = {
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                }
            } : null;
            request(url, settings).then(a).catch(b);
        }
        );
    }
}
github.database.trees = function(params, settings) {
    if (settings) {
        if (settings.method) {
            if (settings.method === "GET") {
                return new Promise((resolve,reject)=>{
                    var owner = params.owner;
                    var repo = params.repo;
                    var branch = params.branch;
                    var sha = params.sha;
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/trees/" + sha;
                    const data = settings.body;
                    const dataType = settings.method;
                    const a = (data)=>{
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    request(url, settings).then(a).catch(b);
                }
                );
            }
            if (settings.method === "POST") {
                return new Promise((resolve,reject)=>{
                    var owner = params.owner;
                    var repo = params.repo;
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/trees";
                    const a = (data)=>{
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    console.log(219, settings);
                    request(url, settings).then(a).catch(b);
                }
                );
            }
        }
    } else {
        return new Promise((resolve,reject)=>{
            var owner = params.owner;
            var repo = params.repo;
            var branch = params.branch;
            var sha = params.sha;
            var recursive = params.recursive ? "?recursive=" + params.recursive : "";
            const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/trees/" + sha + recursive;
            const a = (data)=>{
                resolve(data);
            }
            const b = (error)=>{
                console.log(error);
                reject(error);
            }
            const accessToken = localStorage.githubAccessToken;
            accessToken ? settings = {
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                }
            } : null;
            request(url, settings).then(a).catch(b);
        }
        );
    }
}

github.gists = {};
github.gists.id = async function(id, settings) {
    settings ? null : settings = {};
    //alert("github.gists.id " + JSON.stringify(settings));
    if (Object.keys(settings).length > 0 && settings.method !== "GET") {
        //alert("297 " + settings.method);
        if (settings.method) {
            console.log(298, 'settings.method', settings.method);
            if (settings.method === "PATCH") {
                return new Promise(function(resolve, reject) {
                    const url = github.endpoint + "/gists/" + id;
                    const dataType = settings.method;
                    const a = (data)=>{
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    request(url, settings).then(a).catch(b);
                }
                );
            }
        }
    } else {
        //alert("302" + id);
        return new Promise(function(resolve, reject) {
            const url = github.endpoint + "/gists/" + id;
            const a = data=>{
                console.log(308, data);
                resolve(data);
            }
            const b = (error)=>{
                console.log(error);
                resolve(error);
            }
            const accessToken = localStorage.githubAccessToken;
            const settings = accessToken ? {
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                }
            } : null;
            request(url, settings).then(a).catch(b);
        }
        );
    }
}
github.gists.star = async(id) => {
    console.log(352, 'github.gists.star', {
        id
    });
};

github.orgs = {};
github.orgs.members = async(org,username,settings)=>{
    settings ? null : settings = {};
    return new Promise(function(resolve, reject) {
        const url = github.endpoint + "/orgs/" + org + "/members/" + username;
        const a = data=>{
            resolve(data);
        }
        const b = (error)=>{
            console.log(error);
            resolve(error);
        }
        const accessToken = localStorage.githubAccessToken;
        const settings = accessToken ? {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: "token " + accessToken
            }
        } : null;
        fetch(url, settings).then(a).catch(b);
    }
    );
}
github.orgs.repos = (org,settings)=>{
    settings ? null : settings = {};
    return new Promise(function(resolve, reject) {
        const url = github.endpoint + "/orgs/" + org + "/repos?type=all";
        const a = data=>{
            resolve(data);
        }
        const b = (error)=>{
            console.log(error);
            reject(error);
        }
        const accessToken = localStorage.githubAccessToken;
        const settings = accessToken ? {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: "token " + accessToken
            }
        } : null;
        request(url, settings).then(a).catch(b);
    }
    );
}

github.raw = {};
github.raw.blob = async(params,settings)=>{
    settings ? null : settings = {};
    return new Promise((resolve,reject)=>{
        fetch("https://api.github.com/repos/" + params.owner + "/" + params.repo + "/contents" + params.resource, {
            cache: "reload",
            headers: {
                Accept: "application/vnd.github.raw",
                Authorization: "token " + localStorage.githubAccessToken
            }
        }).then(async(response)=>{
            if (response.status === 404) {
                var res = await response.json();
                var json = {
                    json: res,
                    error: new Error(response.status)
                }
                throw json;
            } else {
                return response.blob()
            }
        }
        ).then((blob)=>{
            resolve(URL.createObjectURL(blob));
        }
        ).catch((e)=>{
            reject(e.json)
        }
        );
    }
    );
}
github.raw.file = async(params)=>{
    var url = "https://api.github.com/repos/" + params.owner + "/" + params.repo + "/contents" + params.resource;
    var settings = {
        cache: "no-store",
        headers: {
            'If-None-Match': ''
        }
    };
    const accessToken = localStorage.githubAccessToken;
    if (accessToken) {
        settings.headers.Accept = "application/vnd.github.raw",
        settings.headers.Authorization = "token " + accessToken
    }
    //console.log(url, settings);
    return new Promise((resolve,reject)=>{
        fetch(url, settings).then(async(response)=>{
            if (response.status === 404) {
                var res = await response.json();
                var json = {
                    json: res,
                    error: new Error(response.status)
                }
                throw json;
            } else {
                return response.text()
            }
        }
        ).then((response)=>{
            resolve(response);
        }
        ).catch((e)=>{
            reject(e.json)
        }
        );
    }
    );
}

github.repos = {};
github.repos.contents = (params,settings)=>{
    settings ? null : settings = {};
    return new Promise(function(resolve, reject) {
        const url = github.endpoint + "/repos/" + params.owner + "/" + params.repo + "/contents" + params.resource;
        const a = data=>{
            resolve(data);
        }
        const b = (error)=>{
            console.log(error);
            reject(error);
        }
        const accessToken = localStorage.githubAccessToken;
        accessToken ? settings.headers = {
            Accept: "application/vnd.github+json",
            Authorization: "token " + accessToken
        } : null;
        if (settings) {
            if (settings.headers) {
                settings.headers['If-None-Match'] = "";
            } else {
                settings.headers = {
                    'If-None-Match': ''
                };
            }
        } else {
            settings = {
                headers: {
                    'If-None-Match': ''
                }
            };
        }
        //console.log(url, settings);
        request(url, settings).then(a).catch(b);
    }
    );
}
github.repos.repo = (owner,repo,settings)=>{
    settings ? null : settings = {};
    return new Promise(function(resolve, reject) {
        const url = github.endpoint + "/repos/" + owner + "/" + repo;
        const a = data=>{
            resolve(data);
        }
        const b = (error)=>{
            console.log(error);
            reject(error);
        }
        const accessToken = localStorage.githubAccessToken;
        accessToken ? settings.headers = {
            Accept: "application/vnd.github+json",
            Authorization: "token " + accessToken
        } : null;
        if (settings) {
            if (settings.headers) {
                settings.headers['If-None-Match'] = "";
            } else {
                settings.headers = {
                    'If-None-Match': ''
                };
            }
        } else {
            settings = {
                headers: {
                    'If-None-Match': ''
                }
            };
        }
        request(url, settings).then(a).catch(b);
    }
    );
}

github.user = {};
github.user.repos = (params,settings)=>{
    settings ? null : settings = {};
    return new Promise(function(resolve, reject) {
        const url = github.endpoint + "/user/repos";
        const a = data=>{
            resolve(data);
        }
        const b = (error)=>{
            console.log(error);
            reject(error);
        }
        const accessToken = localStorage.githubAccessToken;
        accessToken ? settings.headers = {
            Accept: "application/vnd.github+json",
            Authorization: "token " + accessToken
        } : null;
        if (settings) {
            if (settings.headers) {
                settings.headers['If-None-Match'] = "";
            } else {
                settings.headers = {
                    'If-None-Match': ''
                };
            }
        } else {
            settings = {
                headers: {
                    'If-None-Match': ''
                }
            };
        }
        request(url, settings).then(a).catch(b);
    }
    );
}
github.user.self = function(usernam, settings) {
    settings ? null : settings = {};
    return new Promise((resolve,reject)=>{
        const url = github.endpoint + "/user";
        const a = data=>{
            resolve(data);
        }
        const b = (error)=>{
            console.log(error);
            reject(error);
        }
        const accessToken = localStorage.githubAccessToken;
        const settings = accessToken ? {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: "token " + accessToken
            }
        } : null;
        request(url, settings).then(a).catch(b);
    }
    );
}

github.users = {};
github.users.events = (username,settings)=>{
    settings ? null : settings = {};
    return new Promise(function(resolve, reject) {
        const url = github.endpoint + "/users/" + username + "/events";
        const a = data=>{
            resolve(data);
        }
        const b = (error)=>{
            console.log(error);
            reject(error);
        }
        const accessToken = localStorage.githubAccessToken;
        const settings = accessToken ? {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: "token " + accessToken
            }
        } : null;
        request(url, settings).then(a).catch(b);
    }
    );
}
github.users.repos = (username,settings)=>{
    settings ? null : settings = {};
    return new Promise(function(resolve, reject) {
        const url = github.endpoint + "/users/" + username + "/repos";
        const a = data=>{
            resolve(data);
        }
        const b = (error)=>{
            console.log(error);
            reject(error);
        }
        const accessToken = localStorage.githubAccessToken;
        accessToken ? settings.headers = {
            Accept: "application/vnd.github+json",
            Authorization: "token " + accessToken
        } : null;
        if (settings) {
            if (settings.headers) {
                settings.headers['If-None-Match'] = "";
            } else {
                settings.headers = {
                    'If-None-Match': ''
                };
            }
        } else {
            settings = {
                headers: {
                    'If-None-Match': ''
                }
            };
        }
        request(url, settings).then(a).catch(b);
    }
    );
}
github.users.user = function(username, settings) {
    settings ? null : settings = {};
    return new Promise((resolve,reject)=>{
        const url = github.endpoint + "/users/" + username;
        const a = data=>{
            resolve(data);
        }
        const b = (error)=>{
            console.log(error);
            reject(error);
        }
        const accessToken = localStorage.githubAccessToken;
        const settings = accessToken ? {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: "token " + accessToken
            }
        } : null;
        request(url, settings).then(a).catch(b);
    }
    );
}
