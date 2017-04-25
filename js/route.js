var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/details", {
            templateUrl: "Details.html"
        })
        .when("/books", {
            templateUrl: "Category.html"
        })
        .when("/admin", {
            templateUrl: "Admin.html"
        });
});