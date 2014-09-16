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
    'ngResource',
    'ngRoute',
    'ngTouch',
    'jsonrpc'
  ])
  .config(function ($routeProvider, jsonrpcProvider) {
    jsonrpcProvider.setBasePath('http://mubunti:8080/jsonrpc');
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
