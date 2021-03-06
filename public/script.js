/*Contoller for BaseStation*/

var BaseStationModule = angular.module('BaseStation', []);
BaseStationModule.filter('alphaAngular', function() {
    return function(name) {
        return 'This block works';
    };
});

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
    $scope.activities = ["Go 255 ", "Turn 255", "Go -255", "Turn -255", "Drive 0 0"];

}

function UpdateScreen($scope) {
    window.addEventListener('deviceorientation', function(event) {
        var alpha = Math.round(event.alpha * 100) / 100;
        var beta = Math.round(event.beta * 100) / 100;
        var gamma = Math.round(event.gamma * 100) / 100;
        /* if (beta > 10 && gamma > 10) {
     $http({
                method: 'GET',
                url: 'http://pi.ku:3000/write?command=' + 'Drive' + beta + gamma
            });
        }*/
        $scope.alphaAngular = alpha;
        $scope.betaAngular = beta;
        $scope.gammaAngular = gamma;
        console.log(alpha);
    }, false);
    var multiplier = 3;

    function map2(value, from1, to1, from2, to2) {
        return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
    }

    function map(value, max, minrange, maxrange) {
        return Math.round(((max - value) / (max)) * (maxrange - minrange)) + minrange;
    }
}


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