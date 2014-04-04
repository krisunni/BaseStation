/*Contoller for BaseStation*/


angular.module('Command.Write', []);

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

    // $scope.activities = ["Manual 5", "Manual 50", "Manual 100", "Manual 150", "Hello", "ON", "OFF" ];
    $scope.activities = ["Drive 100 100 ", "Turn 255 ", "Drive 255"];

}

function ArduinoRead(socket) {
    socket.on('message', function(message) {
        $scope.view = message.toString();
        console.log(message.toString());
    });
}

angular.module('BaseStation', []);


/*angular.module('BaseStation', [
  'btford.socket-io',
  'myApp.MyCtrl'
])
factory('mySocket', function (socketFactory)) {
  var mySocket = socketFactory();
  mySocket.forward('error');
  return mySocket;
});

// in one of your controllers
angular.module('myApp.MyCtrl', []).
  controller('MyCtrl', function ($scope) {
    $scope.$on('socket:error', function (ev, data) {

    });
  });*/