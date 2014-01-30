function UserController($scope, $http) {
    $scope.user = {};
    $scope.SerialManual = function() {
        $http({
            method : 'GET',
            url : 'http://pi.ku:3000/write?command='+$scope.user.command
        });
    };
}