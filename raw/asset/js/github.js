window.github = {
    endpoint: "https://api.github.com",
    oauth: {
        client_id: {
            "code.jyxer.tld": "627d321fca16fcbe8180",
        },
        login: (target)=>{

            var provider = new firebase.auth.GithubAuthProvider();
            provider.addScope('repo');
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
    },
    repos: {
        contents: (owner,repo,path)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents/" + path;
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
    },
    users: {
        repos: (username)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/users/" + username + "/repos";
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
    }
}
