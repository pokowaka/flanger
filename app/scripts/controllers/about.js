'use strict';

/**
 * @ngdoc function
 * @name flangerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the flangerApp
 */
angular.module('flangerApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
