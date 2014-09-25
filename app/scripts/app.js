'use strict';

/**
 * @ngdoc overview
 * @name flangerApp
 * @description
 * # flangerApp
 *
 * Main module of the application.
 */
angular
  .module('flangerApp', [
    'angular.filter',
    'jsonrpc',
    'ngResource',
    'ngRoute',
    'ngTouch',
    'pasvaz.bindonce',
    'rt.encodeuri',
    'ui.bootstrap',
    'ui.bootstrap-slider',
    'ui.grid',
    'pokowaka.ng-infinite-iscroll'
  ])
  .constant('PLAYER_EVENTS', {
    properties : 'player-events-properties',
    item       : 'player-events-item',
    play       : 'player-events-play',
  })
  .config(function ($routeProvider, jsonrpcProvider) {
    var full = location.protocol+'//'+location.hostname + ':9292'; //+(location.port ? ':'+location.port: '');
    var baseUrl = full + '/192.168.1.146:8080';

    jsonrpcProvider.setBasePath(baseUrl + '/jsonrpc');
    $routeProvider
      .when('/artist', {
        templateUrl: 'views/artist.html',
        controller: 'ArtistCtrl'
      })
      .when('/songs', {
        templateUrl: 'views/songs.html',
        controller: 'SongCtrl'
      })
      .otherwise({
        redirectTo: '/artist'
      });
  })
  .run(function($location) {
    //FastClick.attach(document.body);
  });
 
