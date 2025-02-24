app.controller("orderController", function ($scope, $http, $document, $cookies, $timeout) {
    $scope.orders = [];
    $scope.form = {
        id: '',
        createAt: '',
        nameAccount: '',
        nameGame: '',
        quality: '',
        totalPrice: '',
        payment: '',
        orderStatus: '',
        voucher: [],
    }

    $scope.orderDetails = [];
    $scope.pager = {
        toFirst() {
            this.number = 0;
            this.fetchPage();
        },
        toLast() {
            this.number = this.totalPages - 1
            this.fetchPage();

        },
        next() {
            this.number++;
            if (this.number >= this.totalPages) {
                this.number = 0;
            }
            this.fetchPage();
        },
        prev() {
            this.number--;
            if (this.number < 0) {
                this.number = this.totalPages - 1;
            }
            this.fetchPage();
        },
        fetchPage() {
            $http.get(`/api/v1/order/findAllPagination?page=${this.number}&size=10`, {
                headers: {
                    'Authorization': 'Bearer ' + $cookies.get('access_token')
                }
            }).then(resp => {
                $scope.pager = {
                    ...$scope.pager,
                    ...resp.data
                };
            })
        }
    }

    $scope.initialize = function () {
        $http.get(`/api/v1/order/findAllPagination`, {
            headers: {
                "Authorization": "Bearer " + $cookies.get("access_token")
            }
        }).then(
            resp => {
                // $scope.orders = resp.data;
                // console.log($scope.orders)
                $scope.pager = {
                    ...$scope.pager,
                    ...resp.data
                };
            },
            error => {
                console.log("Error",error);
            }
        );
    }

    $scope.delete = function (id) {
        Swal.fire({
            title: "Do you want to delete this order?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                if (id) {
                    $http.delete(`/api/v1/order/delete/${id}`, {
                        headers: {
                            "Authorization": "Bearer " + $cookies.get("access_token")
                        }
                    }).then(resp => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your order has been deleted.",
                            icon: "success"
                        });
                        $scope.initialize();
                    }).catch(error => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Error deleting order!",
                        });
                        console.log("Error", error);
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Error deleting order!",
                    });
                    console.log("Error", error);
                }
            }
        });
    }

    $scope.view = async function (id) {
        await $http.get(`/api/v1/order/findByOrder/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + $cookies.get('access_token')
            }
        }).then(resp => {
                $scope.orderDetails = resp.data;
                console.log($scope.orderDetails);
            }, error => {
                return error;
            }
        )
    }
    $scope.initialize();
});