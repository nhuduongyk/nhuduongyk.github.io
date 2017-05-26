app.controller('BooksController', ['$scope', 'bookservice', '$http', '$location', '$routeParams', '$cookieStore', 'uibDateParser', function($scope, bookservice, $http, $location, $routeParams, $cookieStore, uibDateParser) {
    console.log('BooksController loaded...');
    var root = 'https://green-web-bookstore.herokuapp.com';
    var config = {
        headers: {
            'Accept': 'application/json;odata=verbose',
            "x-access-token": $scope.token
        }
    }
    $scope.loaded = false;
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
            $scope.book.createDate = new Date($scope.book.createDate);
            $scope.book.releaseDate = new Date($scope.book.releaseDate);
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
            var pre = $scope.book.previousPrice;
            sell = $scope.book.sellingPrice;
            $scope.sale = Math.ceil((pre - sell) * 100 / pre);
        });

    }

    /*-------Genres---------- */
    $scope.getGenres = function() {
        $http.get(root + '/api/genres').success(function(response) {
            $scope.genres = response;
            $scope.loaded = true;
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
            $scope.paging();
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
    $scope.addComment = function(post) {
        $scope.comment.userId = $scope.user._id;
        $scope.comment.bookId = post._id;
        $scope.createdDate = Date.now();
        console.log($scope.comment);
        $http.post(root + '/api/books/comment', $scope.comment).success(function(response) {
            window.location.href = '#/books/{{book._id}}';
        }).error(function(data, status, headers, config) {
            console.log(data, status, headers, config);
        });
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
        $http.post(root + '/api/users/auth', $scope.loginUser).success(function(response) {
            var isSuccess = response.success;
            if (isSuccess) {
                $cookieStore.put('token', response.token);
                $cookieStore.put('user', response.user);
                $scope.user = $cookieStore.get('user');
                $scope.token = $cookieStore.get('token');
                //Redirect here
                //$location.url("/")
            } else {
                //Raise Error
                alert(response.message);
            }
        }).error(function(data, status, headers, config) {
            console.log(data, status, headers, config);
        });;
    }

    $scope.summitSignup = function() {
        $http.post(root + '/api/users/signup/', $scope.signUpUser).success(function(response) {
            var isSuccess = response.success;
            if (isSuccess) {
                $cookieStore.put('token', response.token);
                $cookieStore.put('user', response.user);
                $scope.user = $cookieStore.get('user');
                $scope.token = $cookieStore.get('token');
                //Redirect here
                //$location.url("/")
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
        /*-------Users--------*/
    $scope.editProfile = $scope.user;
    $scope.updateUser = function() {
            $http.put(root + '/api/users/', $scope.editProfile).success(function(response) {
                console.log('success');
                $scope.user = response;
                $cookieStore.put('user', response.user);
                $scope.user = $cookieStore.get('user');
                $location.url("/")
            }).error(function(data, status, headers, config) {
                console.log(data, status, headers, config);
            });;
        }
        /*----Cart----*/
    $scope.qty = 1;
    $scope.total = 0;
    $scope.sum = function() {
        bookservice.total.totalQty = 0;
        for (var i = 0; i < bookservice.cart.length; i++) {
            $scope.total += bookservice.cart[i].item.sellingPrice * bookservice.cart[i].qty;
            bookservice.total.totalQty += bookservice.cart[i].qty;
        }
        $scope.all = bookservice.total;

    }
    $scope.sum();


    $scope.addCart = function(item) {
        if ($scope.qty > 0) {
            if (bookservice.cart.length > 0) {
                for (var i = 0; i < bookservice.cart.length; i++) {
                    if (bookservice.cart[i].item.sku === item.sku) {
                        $scope.addedItem = true;
                        bookservice.cart[i].qty += $scope.qty;
                        bookservice.item[i].quantity += $scope.qty;
                    }
                }
                if ($scope.addedItem) {
                    $scope.addedItem = false;

                } else {
                    bookservice.cart.push({ item, qty: 1 });
                    bookservice.item.push({ _book: item._id, price: item.sellingPrice, quantity: $scope.qty });
                    console.log(item._id)
                }
            } else {
                bookservice.cart.push({ item, qty: $scope.qty });
                bookservice.item.push({ _book: item._id, price: item.sellingPrice, quantity: $scope.qty });
                console.log(item._id)
            }

        }
        $scope.sum();


    }
    $scope.cart = bookservice.cart;
    $scope.back = function() {
            $location.url("/books");
        }
        /*------------order--------------*/
    $scope.order = {};
    $scope.order.books = [];
    $scope.checkout = function() {
        if ($scope.cart.length > 0) {
            $scope.order._user = $scope.user._id;
            $scope.order.books = bookservice.item;
            $scope.order.total = $scope.total;
            // bookservice.bills.push($scope.order);
            console.log($scope.order)

            $http.post(root + 'api/orders/', $scope.order).success(function(response) {
                console.log('success');
                bookservice.item = [];
                bookservice.cart.splice(0, bookservice.cart.length);
                $scope.total = 0;
                $location.url("/")
            }).error(function(data, status, headers, config) {
                console.log(data, status, headers, config);
            });
        }
    }

    $scope.changeQty = function(index) {
        bookservice.item[index].qty = bookservice.cart[index].qty;
        $scope.total = 0;
        $scope.sum();
    }
    $scope.bills = bookservice.bills;

    $scope.removeCart = function(item) {
        console.log(item.qty)

        bookservice.cart.splice(item, 1);
        bookservice.item.splice(item, 1);
        $scope.total = 0;
        $scope.sum();

    }
}]);