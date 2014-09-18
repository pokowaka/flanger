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
  $scope.$on(PLAYER_EVENTS.properties, function() {
    $scope.info = player.properties; 
    $scope.time = moment(player.properties.time);
    $scope.timeleft = moment(player.properties.totaltime).subtract(moment(player.properties.time));  });
  $scope.$on(PLAYER_EVENTS.play, function() { $scope.playing = player.playing; });
  $scope.$on(PLAYER_EVENTS.item, function() { $scope.current = player.currentItem; } );
  $scope.togglePlay = player.togglePlay;
  $scope.next = player.next;
  $scope.prev = player.prev;
  $scope.playing = player.playing;
});

