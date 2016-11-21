"use strict";

var Http = (function() {
    return {
        makeJsonRequest: function(obj, url) {
            return new Promise(function(resolve, reject) {
                var xmlhttp = new XMLHttpRequest();

                xmlhttp.addEventListener("load", function(response) {
                    console.log(response);
                    if (response.currentTarget.status === 200) {
                        resolve(JSON.parse(response.currentTarget.response));
                    } else {
                        reject("Error making json request");
                    }
                });

                xmlhttp.open("POST", url);
                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                console.log(obj);
                xmlhttp.send(JSON.stringify(obj));
            });
        }
    };
}());

var User = (function() {

    var user = null;

    return {
        setUser: function(u) {
            user = u;
        },
        getUserId: function() {
            return user.id;
        },
        getUser: function() {
            return user;
        }
    };
}());

var Graph = (function() {

    var users = "";
    var listOfUsers = {};

    var getMutualFriends = function(id) {
        return new Promise(function(resolve, reject) {
            FB.api(
                "/" + id,
                {
                    "fields": "context.fields(mutual_friends)"
                },
                function(response) {
                    if (response && !response.error) {
                        var friends = response.context.mutual_friends.data;
                        for (var i = 0; i < friends.length; i++) {
                            users += id + " " + friends[i].id + "\n";
                        }
                        resolve(id);
                    } else {
                        reject("Error getting mutual friends");
                    }
                }
            );
        });
    };

    return {
        initGraph: function(data) {
            return new Promise(function(resolve, reject) {
                var mutualFriendsFuncs = [];

                for (var i = 0; i < data.length; i++) {
                    listOfUsers[data[i].id] = data[i].name;
                    users += User.getUserId() + " " + data[i].id + "\n";
                    mutualFriendsFuncs.push(getMutualFriends(data[i].id));
                }

                Promise.all(mutualFriendsFuncs)
                .then(function() {
                    document.getElementById("message").style.display = "none";
                    resolve(users);
                })
                .catch(function(err) {
                    reject(err);
                });
            });
        },
        getListOfUsers: function() {
            return listOfUsers;
        }
    };

}());

var Draw = (function() {
    var findUserName = function(id) {
        var listOfUsers = Graph.getListOfUsers();
        var user = User.getUser();

        if (user.id === id) {
            return user.name;
        }
        return listOfUsers[id];
    };

    return {
        drawTable: function(res) {
            var results = document.getElementById("results");
            results.innerHTML = "";
            var str = "<table><tr><th>User</th><th>Closeness</th></tr>";
            console.log(res);
            for (var i = 0; i < res.info.length; i++) {
                str += "<tr><td>" + findUserName(res.info[i].id) + "</td><td>" + res.info[i].value + "</td></tr>";
            }
            str += "</table>";
            console.log(str);
            results.innerHTML = str;
            results.style.display = "block";
        }
    };
}());

var getListOfFriends = function() {
    FB.api(
        "/me/friends",
        function(response) {
            if (response && !response.error) {
                console.log(response);
                document.getElementById("message").innerHTML = "Recebendo lista de amigos em comum...";
                Graph.initGraph(response.data)
                .then(function(res) {
                    Http.makeJsonRequest({file: res.slice(0, -1)}, "/edges")
                    .then(function(res2) {
                        console.log(res2);
                        Draw.drawTable(res2);
                    })
                    .catch(function(err) {
                        document.getElementById("message").innerHTML = err;
                        document.getElementById("message").style.display = "block";
                    });
                })
                .catch(function(err) {
                    document.getElementById("message").innerHTML = err;
                });
            }
        }
    );
};

var getUserInfo = function() {
    FB.api("/me", function(response) {
        console.log(response);
        User.setUser(response);
        document.getElementById("message").innerHTML = "Recebendo lista de amigos...";
        getListOfFriends(response.id);
    });
};

var statusChangeCallback = function(response) {
    console.log(response);

    if (response.status === "connected") {

        console.log("conectado");
        document.getElementById("fb-login").style.display = "none";
        document.getElementById("message").innerHTML = "Recebendo informações do usuário...";
        getUserInfo();

    } else if (response.status === "not_authorized") {
        // The person is logged into Facebook, but not your app.
        console.log("enable");
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        console.log("log in");
    }
};

/* eslint-disable no-unused-vars */
var checkLoginState = function() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};
/* eslint-enable no-unused-vars */

window.fbAsyncInit = function() {
    FB.init({
        appId: "640154492832871",
        xfbml: true,
        version: "v2.8"
    });

    FB.AppEvents.logPageView();

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};

(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
return;
}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, "script", "facebook-jssdk"));
