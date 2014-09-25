'use strict';

angular.module('flangerApp')
.directive('album', function(playlistService, playerService) {
  return {
    restrict: 'E',
    templateUrl: 'views/templates/album.html',
    scope: { album: '=album', subtitle: '=subtitle', onselect: '=onselect' },
    link: function link(scope, element, attrs) {
      //TODO(ErwinJ): This has to be fixed before releasing..
         var full = location.protocol+'//'+location.hostname + ':9292'; //+(location.port ? ':'+location.port: '');
         var baseUrl = full + '/192.168.1.146:8080';
         scope.albumimg = baseUrl + '/image/' + encodeURIComponent(scope.album.thumbnail);
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
         scope.select = function() {
           if (angular.isUndefined(scope.album.selected)) {
             scope.album.selected = true;
           } else {
             scope.album.selected = !scope.album.selected;
           }
           if (scope.onselect)
             scope.onselect(scope.album, element[0].children[0]);
         }
    }
  };
})
.directive('fallbackSrc', function () {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", iAttrs.fallbackSrc);
      });
    }
   }
   return fallbackSrc;
})
.directive('cycler', function() {
  // Cycles through a set of values when you click on the element.
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
         if (scope.onselect) scope.onselect(idx);
       };
    }
  };
})
.directive('timecycle', function($timeout) {
  // Cycles through a set of values when you click on the element.
  return {
    restrict: 'E',
    template: '<span>{{label}}</span>',
    scope: { set : '=set' , delay: '=delay' },
    link: function link(scope, element, attrs) {
       var idx  = 0;
       var loop = 0;
       scope.$watch('set', function() {
         idx = 0;
         cycle(true);
       });

       var cycle = function(refresh) {
         // We need to detect that there is only on active in this loop!
         // So that we only update the label according to the delay..
         if (refresh)
           loop++;
         else {
           if (loop > 1) {
             loop--;
             return;
           }
         }

         scope.label = scope.set[idx];
         idx = (idx + 1) % scope.set.length;
         $timeout(cycle, scope.delay);
       };
    }
  };
})
// Add this directive where you keep your directives
.directive('onLongPress', function($timeout) {
	return {
		restrict: 'A',
		link: function($scope, $elm, $attrs) {
			$elm.bind('onmousedown', function(evt) {
        console.log('touchstart!');
				// Locally scoped variable that will keep track of the long press
				$scope.longPress = true;

				// We'll set a timeout for 600 ms for a long press
				$timeout(function() {
					if ($scope.longPress) {
						// If the touchend event hasn't fired,
						// apply the function given in on the element's on-long-press attribute
						$scope.$apply(function() {
							$scope.$eval($attrs.onLongPress);
						});
					}
				}, 600);
			});

			$elm.bind('onmouseup', function(evt) {
				// Prevent the onLongPress event from firing
				$scope.longPress = false;
				// If there is an on-touch-end function attached to this element, apply it
				if ($attrs.onTouchEnd) {
					$scope.$apply(function() {
						$scope.$eval($attrs.onTouchEnd);
					});
				}
			});
		}
	};
})
;

