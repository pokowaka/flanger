'use strict';

/**
 * @ngdoc function
 * @name flangerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the flangerApp
 */
angular.module('flangerApp')
.controller('SongCtrl', function ($scope, $timeout,uiGridConstants, audioLibraryService) {
  var data = [];
  $scope.gridOptions = {
    enableFiltering: false,
    columnDefs: [
      { field: 'displayartist' , name: 'song artist' },
      { field: 'album', name: 'album' } ,
      { field: 'label', name: 'song' }
    ]
  };

  var getSongs = function(offset, fetch, callback) {
    $scope.fetchingSongs = true;
    $scope.total = "?" ;
    audioLibraryService.getSongs( {
      limits: { start : offset, end: offset+fetch },
      properties: [ "displayartist",  "album", "rating" ],
      sort: { order: "ascending", method: "track", ignorearticle : true }
    }).success(function(res) {
      $scope.fetchingSongs = false;
      $scope.total= res.limits.total;
      for(var i = 0; i < res.songs.length; i++) {
        data.push(res.songs[i]);
      }

      if (!$scope.gridOptions.data) {
        $scope.gridOptions.data = data;
      }

      if (data.length < res.limits.total) {
        getSongs(offset  + res.songs.length, fetch);
      }
    });
  };

  getSongs(0, 3000, function(o, f) { getSongs(o, f)}); // function(o, fetch) { $timeout(getSongs(o, fetch, getSongs) , 1000)});
});

