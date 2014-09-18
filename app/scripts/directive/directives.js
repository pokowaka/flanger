'use strict';

angular.module('flangerApp')
.directive('album', function(config, playlistService, playerService) {
  return {
    restrict: 'E',
    templateUrl: 'views/templates/album.html',
    scope: { album: '=album', subtitle: '=subtitle' },
    link: function link(scope, element, attrs) {
      console.log('Directive: ' + scope.album.albumid);
         scope.albumimg = config.baseUrl + '/image/' + encodeURIComponent(scope.album.thumbnail);
         scope.play = function() {
           playlistService.clear({ playlistid : 0 }).success(function() { 
             playlistService.add({ playlistid : 0, item : { albumid : scope.album.albumid }}).success( function() {
               playerService.open({ item : { playlistid : 0, position : 0}});
             });
           });
         };
         scope.add = function() {
           playlistService.add({ playlistid : 0, item : { albumid : scope.album.albumid }});
         };
    }
  };
})
.directive('cycler', function() {
  return {
    restrict: 'E',
    template: '<a ng-click="cycle()">{{label}}</a>',
    scope: { set : '=set' , onselect : '=onselect' },
    link: function link(scope, element, attrs) {
       var idx  = 0;
       scope.label = scope.set.set[idx].label;
       scope.cycle = function() {
         idx = (idx + 1) % scope.set.set.length;
         scope.label = scope.set.set[idx].label;
         scope.set.selected = idx;
         scope.onselect(idx);
       };
    }
  };
})
;

