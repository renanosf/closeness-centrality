"use strict";

var User = (function() {

    var user = null;

    return {
        setUser: function(u) {
            user = u;
        },
        getUserId: function() {
            return user.id;
        }
    };
}());

var getListOfFriends = function() {
    FB.api(
        "/me/friends",
        function(response) {
            if (response && !response.error) {
                console.log(response);
            }
        }
    );
};

var getUserInfo = function() {
    FB.api("/me", function(response) {
        console.log(response);
        User.setUser(response);
        getListOfFriends();
    });
};

var statusChangeCallback = function(response) {
    console.log(response);

    if (response.status === "connected") {

        console.log("conectado");
        document.getElementById("fb-login").style.display = "none";
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
