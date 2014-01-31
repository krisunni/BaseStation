
function UserController($scope, $http) {
    $scope.user = {};
    $scope.SerialManual = function() {
        $http({
            method: 'GET',
            url: 'http://pi.ku:3000/write?command=' + $scope.user.command
        });
    };
    $scope.SerialManualRead = function() {
        $http({
            method: 'GET',
            url: 'http://pi.ku:3000/Read' + $scope.user.command
        });
    };

}

function UserOptions($scope) {
    $scope.user = {
        activities: "ON"
    };

    $scope.activities = ["ON", "OFF", "Manual", "Hello"];
}

var ButtonsCtrl = function ($scope) {

  $scope.singleModel = 1;

  $scope.radioModel = 'Middle';

  $scope.checkModel = {
    left: false,
    middle: true,
    right: false
  };
};