app.controller('homeCtrl', function ($scope, $http, $filter) {
    
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.FillLogoDetails = function () {
        console.log('hiii');
        $http.get('/osp/home/FillLogoDetails').then(function success(response) {
            $scope.LANG_TYPE = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.FillMenu = function () {
        $http.get('/FillMenu').then(function success(response) {
            $scope.LANG_TYPE = response.data.LANG_TYPE;
            $scope.ParentMenuId = response.data.ParentMenuId;
            console.log(response.data);
        }, function error(response) {
            console.log(response.status);            
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.FillSubMenu = function () {
        $http.get('/FillSubMenu').then(function success(response) {
            $scope.LANG_TYPE = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };
});