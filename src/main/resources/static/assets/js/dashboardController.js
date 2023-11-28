app.controller("dashboardController", function ($scope, $http, $document, $cookies) {
    $scope.totalGames = 0;
    $scope.totalGameLastWeek = 0;
    $scope.percentageChange = 0;

    $scope.gameOfTheMonth = [];
    $scope.gameOfTheYear = [];

    $scope.revenueByMonth = [];
    $scope.resultRevenue = [];

    $scope.selectedMonth = '11';
    $scope.months = [
        {name: 'Tháng 1', value: '1'},
        {name: 'Tháng 2', value: '2'},
        {name: 'Tháng 3', value: '3'},
        {name: 'Tháng 4', value: '4'},
        {name: 'Tháng 5', value: '5'},
        {name: 'Tháng 6', value: '6'},
        {name: 'Tháng 7', value: '7'},
        {name: 'Tháng 8', value: '8'},
        {name: 'Tháng 9', value: '9'},
        {name: 'Tháng 10', value: '10'},
        {name: 'Tháng 11', value: '11'},
        {name: 'Tháng 12', value: '12'}

    ]

    $scope.isLoading = true;

    // Hàm để tạo mảng năm
    function generateYears() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const establishedYear = 2023;

        $scope.selectedYear = currentYear.toString();

        if (currentYear === establishedYear) {
            return [{name: currentYear.toString(), value: currentYear.toString()}];
        } else if (currentYear > establishedYear) {
            const years = [];
            const count = currentYear - establishedYear
            for (let i = currentYear; i >= currentYear + count; i--) {
                years.push({name: i.toString(), value: i.toString()});
            }
            return years;
        } else {
            alert("Cút");
        }
    }

    // Hàm để chọn năm hiện tại hoặc năm tiếp theo nếu đã qua năm mới
    function getCurrentOrNextYear() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Nếu đã qua năm mới, chọn năm tiếp theo
        if (currentDate.getMonth() === 0) {
            return (currentYear - 1).toString();
        } else {
            return currentYear.toString();
        }
    }

    // Hàm để duyệt qua các tháng và lấy ra mảng các giá trị revenue
    function getRevenues(data) {
        const revenues = Array(12).fill(0); // Khởi tạo mảng với 12 phần tử, mỗi phần tử có giá trị là 0

        // Duyệt qua từng tháng trong năm
        for (const key in data) {
            if (data.hasOwnProperty(key) && Array.isArray(data[key])) {
                // Duyệt qua từng phần tử trong mảng tháng và kiểm tra nếu có thuộc tính revenue
                data[key].forEach(item => {
                    if (item && item.revenue !== undefined) {
                        // Thay thế giá trị 0 bằng giá trị revenue tại vị trí tương ứng với tháng trong mảng
                        const monthIndex = parseInt(key.replace('month', '')) - 1; // Lấy chỉ số của tháng từ tên tháng (vd: month11)
                        revenues[monthIndex] = item.revenue;
                    }
                });
            }
        }

        return revenues;
    }

    // Biểu đồ doanh thu
    const ctx2 = document.getElementById("chart-line").getContext("2d");
    const chartRevenue = new Chart(ctx2, {
        type: "line",
        data: {
            labels: ["Jan", "Fer", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                label: "Revenue",
                tension: 0,
                borderWidth: 0,
                pointRadius: 5,
                pointBackgroundColor: "rgba(255, 255, 255, .8)",
                pointBorderColor: "transparent",
                borderColor: "rgba(255, 255, 255, .8)",
                borderColor: "rgba(255, 255, 255, .8)",
                borderWidth: 4,
                backgroundColor: "transparent",
                fill: true,
                data: [],
                maxBarThickness: 6

            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                        borderDash: [5, 5],
                        color: 'rgba(255, 255, 255, .2)'
                    },
                    ticks: {
                        display: true,
                        color: '#f8f9fa',
                        padding: 10,
                        font: {
                            size: 14,
                            weight: 300,
                            family: "Roboto",
                            style: 'normal',
                            lineHeight: 2
                        },
                    }
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                        borderDash: [5, 5]
                    },
                    ticks: {
                        display: true,
                        color: '#f8f9fa',
                        padding: 10,
                        font: {
                            size: 14,
                            weight: 300,
                            family: "Roboto",
                            style: 'normal',
                            lineHeight: 2
                        },
                    }
                },
            },
        },
    });

    // Hàm cập nhật dữ liệu trong biểu đồ
    function updateChart(data) {
        chartRevenue.data.datasets[0].data = data;
        chartRevenue.update();
    }

    // Hàm để chạy animation cho bộ số đếm
    function animateValue(id, start, end, duration) {
        if (start === end) return;
        let range = end - start;
        let current = start;
        let increment = end > start ? 1 : -1;
        let stepTime = Math.abs(Math.floor(duration / range));
        let obj = document.getElementById(id);
        let timer = setInterval(function () {
            current += increment;
            obj.innerHTML = current;
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    $scope.initialize = async function () {
        const currentDate = new Date();
        // Tạo mảng năm
        $scope.years = generateYears();
        $scope.month = currentDate.getMonth() + 1;
        $scope.year = currentDate.getFullYear();
        $scope.selectedMonth = $scope.month.toString();
        // Chọn năm hiện tại làm giá trị mặc định cho ô chọn năm
        $scope.selectedYear = getCurrentOrNextYear();
        $scope.selectedYearForRevenue = getCurrentOrNextYear();

        await $http.get("/api/v1/game/totalGame", {
            headers: {
                'Authorization': 'Bearer ' + $cookies.get('token')
            }
        }).then(resp => {
            console.log(resp.data)
            $scope.totalGames = resp.data;
            animateValue("countDisplay", 0, $scope.totalGames, 3000);
        });

        await $http.get(`/api/v1/game/totalGameLastWeek`, {
            headers: {
                'Authorization': 'Bearer ' + $cookies.get('token')
            }
        }).then(r => {
            console.log(r.data)
            $scope.totalGameLastWeek = r.data;

            // Hàm tính % sự thay đổi
            $scope.calculatePercentageChange = function (currentValue, previousValue) {
                if (previousValue === 0) {
                    return currentValue > 0 ? 100 : 0;
                }
                const percentageChange = ((currentValue - previousValue) / previousValue) * 100;
                return percentageChange.toFixed(1); // Làm tròn đến 2 chữ số thập phân
            };

            // Tính % sự thay đổi và gán vào biến $scope
            $scope.percentageChange = $scope.calculatePercentageChange($scope.totalGames, $scope.totalGameLastWeek);
            console.log($scope.percentageChange)
        });

        $http.get(`/api/v1/dashboard/getTopSellingProductsInMonthYear?year=${$scope.year}&month=${$scope.month}`, {
            headers: {
                "Authorization": "Bearer " + $cookies.get("accessToken")
            }
        }).then(resp => {
            $scope.gameOfTheMonth = resp.data;
            console.log(resp.data);
            console.log($scope.gameOfTheMonth)
            $scope.isLoading = false;
        })

        await $http.get(`/api/v1/dashboard/getRevenueByMonth?year=2023`, {
            headers: {
                "Authorization": "Bearer " + $cookies.get("accessToken")
            }
        }).then(resp => {
            $scope.revenueByMonth = resp.data;
            console.log(resp.data)
            $scope.resultRevenue = getRevenues($scope.revenueByMonth);
            console.log($scope.resultRevenue);
            updateChart($scope.resultRevenue);
        })

    }
    $scope.getGameBestSeller = async function () {
        await $http.get(`/api/v1/dashboard/getTopSellingProductsInMonthYear?year=${$scope.selectedYear}`, {
            headers: {
                "Authorization": "Bearer " + $cookies.get("accessToken")
            }
        }).then(resp => {
            $scope.gameOfTheYear = resp.data;
            console.log(resp.data);
            return resp.data;
        }).then(r => {
            $scope.gameOfTheYear = r;
        })
    }
    $scope.getGamesByMonth = async function () {
        $scope.isLoading = true;
        await $http.get(`/api/v1/dashboard/getTopSellingProductsInMonthYear?year=${$scope.selectedYear}&month=${$scope.selectedMonth}`, {
            headers: {
                "Authorization": "Bearer " + $cookies.get("accessToken")
            }
        }).then(resp => {
            $scope.gameOfTheMonth = resp.data;
            console.log(resp.data);
            console.log($scope.gameOfTheMonth)
            $scope.isLoading = false;
        })
    }
    $scope.getRevenueByYear = function () {
        $http.get(`/api/v1/dashboard/getRevenueByMonth?year=${$scope.selectedYearForRevenue}`, {
            headers: {
                "Authentication": "Bearer " + $cookies.get("accessToken")
            }
        }).then(resp => {
            $scope.revenueByMonth = resp.data;
            console.log(resp.data)
            $scope.resultRevenue = getRevenues($scope.revenueByMonth);
            console.log($scope.resultRevenue);
            updateChart($scope.resultRevenue);
        })
    }

    $scope.initialize();
});