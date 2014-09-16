'use strict';

/**
 * @ngdoc function
 * @name flangerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the flangerApp
 */
angular.module('flangerApp')
  .controller('MainCtrl', function ($scope, kodiService) {
      kodiService.getRecentAlbums( {
       arg1 : ["title","artist","albumartist","genre","year","rating","album","track","duration","playcount","fanart","thumbnail","file","albumid","lastplayed","disc","genreid","artistid","displayartist","albumartistid"],
       arg2 : {"start":0,"end":500}}).success(function(res) {
         console.log(res);
       });

  });
