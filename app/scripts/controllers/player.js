'use strict';

/**
 * @ngdoc function
 * @name flangerApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the flangerApp
 */
angular.module('flangerApp')
.controller('PlayerCtrl', function ($scope, player, playerService, PLAYER_EVENTS) {
  $scope.info = { percentage : 0 };
  $scope.$on(PLAYER_EVENTS.properties, function() {
    $scope.info = player.properties;
    $scope.percentage = $scope.info.percentage;
    $scope.time = moment(player.properties.time);
    $scope.timeleft = moment(player.properties.totaltime).subtract(moment(player.properties.time));  });
  $scope.$on(PLAYER_EVENTS.play, function() { $scope.playing = player.playing; });
  $scope.$on(PLAYER_EVENTS.item, function() { $scope.current = player.currentItem; } );

  /*
   $scope.$watch('info.percentage', function() {
     if (Math.round($scope.percentage * 10) != Math.round($scope.info.percentage * 10))
       playerService.seek( { playerid : player.playerid, value : $scope.info.percentage });
   });
  */

  $scope.seek = function(value) {
    console.log("Seek " + value);
       playerService.seek( { playerid : player.playerid, value : value });
  };


  $scope.togglePlay = player.togglePlay;
  $scope.next = player.next;
  $scope.prev = player.prev;
  $scope.playing = player.playing;
});

