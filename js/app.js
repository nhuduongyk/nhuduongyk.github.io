var app = angular.module("myApp", ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ngAnimate', 'ngSanitize', 'textAngular']);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/Home.html",
            controller: 'BooksController'
        })
        .when("/books/details/:id", {
            templateUrl: "views/Details.html",
            controller: 'BooksController'
        })
        .when("/books", {
            templateUrl: "views/Category.html",
            controller: 'BooksController'
        })
        .when("/admin", {
            templateUrl: "views/Admin.html",
            controller: 'BooksController'
        })
        .when('/admin/addbook', {
            templateUrl: 'views/AddBook.html',
            controller: 'BooksController'
        })
        .when('/admin/editbook/:id', {
            templateUrl: 'views/EditBook.html',
            controller: 'BooksController'
        })
        .when('/search/:text', {
            templateUrl: 'views/Search.html',
            controller: 'BooksController'
        })
        .when("/cart", {
            templateUrl: "views/Cart.html",
            controller: 'BooksController'
        })
        .when('/category/:genreId/', {
            templateUrl: 'views/Genre.html',
            controller: 'BooksController'
        })

    .when('/profile', {
            templateUrl: 'views/Profile.html',
            controller: 'BooksController'
        })
        .otherwise({
            redirectTo: '/'
        });
});