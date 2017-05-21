app.controller('BooksController', ['$scope', '$http', '$location', '$routeParams', '$cookieStore', function($scope, $http, $location, $routeParams, $cookieStore) {
    console.log('BooksController loaded...');
    var root = 'https://green-web-bookstore.herokuapp.com';

    $scope.paging = function() {
        $scope.totalItems = $scope.books.length;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 4;
        $scope.maxSize = 5;
        $scope.changePage = function() {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                end = begin + $scope.itemsPerPage;

            $scope.filteredBooks = $scope.books.slice(begin, end);
        };
        $scope.changePage();
    }

    $scope.getBooks = function() {
        $http.get(root + '/api/books').success(function(response) {
            $scope.books = response;
            $scope.paging();
        });
    }
    $scope.getBook = function() {
        var id = $routeParams.id;
        $http.get(root + '/api/books/' + id).success(function(response) {
            $scope.book = response;
            var rateTotal = 0;
            $scope.book.comments.rate;
            for (var i = 0; i < $scope.book.comments.length; i++) {
                rateTotal += $scope.book.comments[i].rate
            }

            if (rateTotal == 0) {
                $scope.rateAvr = 5
            } else {
                $scope.rateAvr = rateTotal / $scope.book.comments.length;
            }
        });
    }

    /*-------Genres---------- */
    $scope.getGenres = function() {
        $http.get(root + '/api/genres').success(function(response) {
            $scope.genres = response;

        })
    };
    $scope.getBookByGerne = function() {
            var genreId = $routeParams.genreId;
            $http.get(root + '/api/books/' + 'genre/' + genreId).success(function(response) {
                $scope.books = response;
                $scope.genreName = function() {
                    for (var i = 0; i < $scope.genres.length; i++) {
                        if ($scope.genres[i]._id === $routeParams.genreId) {

                            return $scope.genres[i].name;

                        }
                    }
                }
            })
        }
        /*-------Block/list---------- */
    $scope.view = "block";
    $scope.setView = function(e) {
        $scope.view = e;
    };
    $scope.isSelectedView = function(checkview) {
        return $scope.view === checkview
    };
    /*-------Search Books---------- */
    $scope.textSearch = $routeParams.text;
    $scope.searchBy = 'search'
    $scope.search = function() {
        $http.get(root + '/api/books/' + $scope.searchBy + '/' + $scope.textSearch).success(function(response) {

            $scope.books = response;
            if ($scope.books.length > 0) {
                $scope.found = true;
            } else {
                $scope.found = false
                $scope.result = "Không có sách phù hợp với thông tin bạn tìm kiếm. Vui lòng thử lại với từ khóa khác."
            }

        })
    }
    $scope.submitSearch = function() {
        console.log(root + '/api/books/' + $scope.searchBy + '/' + $scope.textSearch)
        $location.url('/search/' + $scope.textSearch);
    }



    /*-------Carousel---------- */
    $scope.getBanners = function() {
        $http.get(root + '/api/banners/').success(function(response) {
            $scope.slides = response;
        });
    }

    $scope.myInterval = 3000;
    $scope.active = 0;

    /*-------Rating---------- */
    $scope.max = 5;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
    };

    $scope.ratingStates = [
        { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' },
    ];

    /*-------Commment---------- */
    $scope.comment = {};
    $scope.addComment = function(post) {
        $scope.comment.date = Date.now();
        $scope.comment.userName = $scope.user.userName;
        $scope.comment.userAvatarUrl = $scope.user.userAvatarUrl;
        post.comments.push($scope.comment);
        var req = {
            method: 'PUT',
            url: root + '/api/books' + $routeParams.id,
            headers: {
                'Content-Type': 'application/json'
            },
            data: post
        }
        $http(req).then(function() {
                console.log('success')
            },

            function() {
                console.log('error')
            });
        // $http.put(bookservice.getBook + $routeParams.itemId, $scope.post).success(function(response) {
        //     console.log('success')
        // });

        console.log(post);

    }

    /*--------Date Picker--------- */
    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };


    /*--------Flip--------- */
    $scope.logIn = true;
    $scope.flip = function() {
        if ($scope.logIn) {
            $scope.logIn = false;
        } else {
            $scope.logIn = true;
        }
    };
    $scope.disabled = false;

    $scope.try = function() {
            $cookieStore.put('nhu', 'dep');
            var value = $cookieStore.get('nhu')
            console.log(value);
            $cookieStore.remove('nhu')
        }
        /*-------Add Books--------*/
    $scope.addBook = function() {
        console.log($scope.book);
        $http.post(root + '/api/books/', $scope.book).success(function(response) {
            window.location.href = '#/books';
        }).error(function(data, status, headers, config) {
            console.log(data, status, headers, config);
        });;
    }
    $scope.updateBook = function() {
        var id = $routeParams.id;
        $http.put(root + '/api/books/' + id, $scope.book).success(function(response) {
            window.location.href = '#/books/' + $routeParams.id;
        }).error(function(data, status, headers, config) {
            console.log(data, status, headers, config);
        });;
    }

    $scope.removeBook = function(id) {
        $http.delete(root + '/api/books/' + id).success(function(response) {
            $location.url("/")
        }).error(function(data, status, headers, config) {
            console.log(data, status, headers, config);
        });;
    }

    /*-------LogIn/SignUp--------*/

    $scope.loadLogin = function() {
        var token = $cookieStore.get('token');
        if (token !== undefined) {
            $location.url("/")
        }
    }

    $scope.logOut = function() {
        $cookieStore.remove('token');
        $cookieStore.remove('user');
    }

    $scope.viewProfile = function() {
        var token = $cookieStore.get('token');
        if (token === undefined) {
            $location.url("/login")
        }
    }


    $scope.summitLogin = function() {
        $http.post(root + '/api/auth', $scope.loginUser).success(function(response) {
            var isSuccess = response.success;
            if (isSuccess) {
                $cookieStore.put('token', response.token);
                $cookieStore.put('user', response.user);
                $scope.user = $cookieStore.get('user');
                $scope.token = $cookieStore.get('token');
                //Redirect here
                $location.url("/")
            } else {
                //Raise Error
                alert(response.message);
            }
        }).error(function(data, status, headers, config) {
            console.log(data, status, headers, config);
        });;
    }

    $scope.summitSignup = function() {
        $http.post(root + '/api/signup/', $scope.signUpUser).success(function(response) {
            var isSuccess = response.success;
            if (isSuccess) {
                $cookieStore.put('token', response.token);
                $cookieStore.put('user', response.user);
                $scope.user = $cookieStore.get('user');
                $scope.token = $cookieStore.get('token');
                //Redirect here
                $location.url("/")
            } else {
                //Raise Error
                alert(response.message);
            }
        }).error(function(data, status, headers, config) {
            console.log(data, status, headers, config);
        });
    }

    $scope.init = function() {
        $scope.user = $cookieStore.get('user');
        $scope.token = $cookieStore.get('token');
    }

    $scope.isLogged = function() {
        return $cookieStore.get('token') != undefined;
    }


}]);