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
    'ngResource',
    'ngRoute',
    'ngTouch',
    'jsonrpc',
    'rt.encodeuri',
    'ui.bootstrap',
    'infinite-scroll',
    'pasvaz.bindonce',
    'bgDirectives'
  ])
  .constant('PLAYER_EVENTS', {
    properties : 'player-events-properties',
    item       : 'player-events-item',
    play       : 'player-events-play',
  })
  .constant('config', {
    baseUrl : 'http://192.168.1.178:9292/mubunti:8080'
  })
  .config(function ($routeProvider, jsonrpcProvider, config) {
    jsonrpcProvider.setBasePath(config.baseUrl + '/jsonrpc');
    $routeProvider
      .when('/', {
        templateUrl: 'views/artist.html',
        controller: 'ArtistCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  ;
