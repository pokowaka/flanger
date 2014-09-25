'use strict';

angular.module('flangerApp').service('audioLibraryService', function(jsonrpc) {
  var functions = ['Clean', 'Export', 'GetAlbumDetails', 'GetAlbums', 'GetArtistDetails',
    'GetArtists', 'GetGenres', 'GetRecentlyAddedAlbums', 'GetRecentlyAddedSongs', 'GetRecentlyPlayedAlbums',
    'GetRecentlyPlayedSongs', 'GetSongDetails', 'GetSongs', 'Scan',
    'SetAlbumDetails', 'SetArtistDetails', 'SetSongDetails'];
  var service = jsonrpc.newService('AudioLibrary');
  for(var i = 0; i < functions.length; i++) {
    this[functions[i].charAt(0).toLowerCase() + functions[i].slice(1)] = service.createMethod(functions[i]);
  };
})
.service('counterService', function() {
  var counter = 0;
  this.next = function() {
    return counter++;
  };
})
.service('playerService', function(jsonrpc) {
  var functions = ['GetActivePlayers', 'GetItem', 'GetProperties', 'GoTo', 'Move', 'Open', 'PlayPause',
  'Rotate', 'Seek', 'SetAudioStream', 'SetPartymode', 'SetRepeat', 'SetShuffle', 'SetSpeed', 'SetSubtitle', 'Stop', 'Zoom'];
  var service = jsonrpc.newService('Player');
  for(var i = 0; i < functions.length; i++) {
    this[functions[i].charAt(0).toLowerCase() + functions[i].slice(1)] = service.createMethod(functions[i]);
  };
})
.service('playlistService', function(jsonrpc) {
 var functions = ['Add', 'Clear', 'GetItems', 'GetPlaylists', 'GetProperties', 'Insert', 'Remove', 'Swap'];
 var service = jsonrpc.newService('Playlist');
 for(var i = 0; i < functions.length; i++) {
   this[functions[i].charAt(0).toLowerCase() + functions[i].slice(1)] = service.createMethod(functions[i]);
 };
})
.service('player', function($rootScope, $timeout, playerService, playlistService, PLAYER_EVENTS) {
  var scope = this;
  var pollaggression = 50000;
  this.currentItem = null;
  this.playerid = null;
  this.properties = null;
  this.playing = true;
  this.togglePlay = function() {
    playerService.playPause( {
      playerid : scope.playerid
    });
  };
  this.next = function() {
    playerService.goTo({
      playerid : scope.playerid,
      to : 'next'
    });
  };
  this.prev = function() { 
    playerService.goTo({
      playerid : scope.playerid,
      to : 'previous'
    });
  };


  // TODO(ErwinJ): Please do this over websockets vs polling..
  var getStatus = function() {
    $timeout(getStatus, pollaggression);
    playerService.getActivePlayers().success(function(res) {
      if (res.length > 0) {
        // Okay we only support 1 for now..
        scope.playerid  = res[0].playerid;
        playerService.getProperties( {
          playerid : scope.playerid,
          properties: [ 'time', 'totaltime', 'percentage', 'position', 'playlistid', 'speed' ]
        }).success(function(p) {
          // Again, this is to detect if there is a pause.. swith to websockets!!

          // XBMC messes up the milliseconds pretty bad on pause, so let's just ditch it.
          p.time.milliseconds = 0;
          p.totaltime.millseconds = 0;
          if (!angular.equals(p, scope.properties)) {
            scope.properties = p;
            // Note, these need to be fired when the time change as well :-)
            $rootScope.$broadcast(PLAYER_EVENTS.properties, scope.properties);
          }

          // Well, this would be a lot better with websockets as well...
          if ( (scope.playing && p.speed == 0) || (!scope.playing && p.speed != 0)) {
            scope.playing = !scope.playing;
            $rootScope.$broadcast(PLAYER_EVENTS.play, scope.playing);
          }
          scope.oldtime = p.time;

          playerService.getItem({
            playerid : scope.playerid,
            properties: [ 'displayartist', 'title', 'thumbnail', 'track', 'album']
          }).success(function(item) {
            if (!angular.equals(scope.currentItem, item.item)) {
              scope.currentItem = item.item;
              $rootScope.$broadcast(PLAYER_EVENTS.item, scope.currentItem);
            }
          });
        });
      }
    });
  };
  $timeout(getStatus);
});


