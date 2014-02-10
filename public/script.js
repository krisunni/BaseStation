/*Contoller for BaseStation*/

angular.module('BaseStation', []);

function UserController($scope, $http) {
    $scope.user = {};
    $scope.SerialManual = function() {
        $http({
            method: 'GET',
            url: 'http://pi.ku:3000/write?command=' + $scope.user.command
        });
        $scope.user.command = '';
    };
    $scope.SerialWriteActivity = function($Activity) {
        $http({
            method: 'GET',
            url: 'http://pi.ku:3000/write?command=' + $Activity
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

    $scope.activities = ["Manual 5", "Manual 50", "Manual 100", "Manual 150", "Hello", "ON", "OFF", ];

}

function ArduinoRead($scope, socket) {
    socket.on('message', function(message) {
        $scope.view=message.toString() ;
        console.log(message.toString());
    });
}
