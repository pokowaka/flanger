'use strict';

/**
 * @ngdoc function
 * @name flangerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the flangerApp
 */
angular.module('flangerApp')
.controller('ArtistCtrl', function ($scope, $timeout, audioLibraryService, $http) {
  var artistFilter = null;
  var albumFilter = null;

  var incsize = 10;
  var incsongsize = 100;

  $scope.albums = { limits : {}, albums : [] };
  $scope.artists = { limits : {}, artists : []};
  $scope.songs = { limits : {}, songs : []};

  $scope.fetchingSongs = false;
  $scope.fetching = false;

  $scope.artistSort = { selected : 0,
    set : [
    { label : 'A-Z', sort : { order: 'ascending', method: 'artist', ignorearticle: true  } },
    { label : 'Z-A', sort : { order: 'descending', method: 'artist', ignorearticle: true  } },
  ]} ;
  $scope.songSort = { selected : 0,
    set : [
    { label : 'A-Z', sort : { order: 'ascending', method: 'title', ignorearticle: true }},
    { label : 'BY RATING', sort : { order : 'descending', method: 'rating' }},
  ]};
  $scope.albumSort = { selected : 0,
    set : [
    { label : 'A-Z', sort : { order: 'ascending', method: 'album', ignorearticle: true }},
    { label : 'BY RELEASE YEAR', sort : { order: 'ascending', method: 'year'} },
    { label : 'BY ARTIST', sort : { order: 'ascending', method: 'artist', ignorearticle: false}}, // Group By in angular cannot deal with ignoringarticle  yet..
    { label : 'BY DATE ADDED', sort : { order: 'ascending', method: 'dateadded'}},
  ]};

  $scope.selectArtistSort = function(idx) {
    audioLibraryService.getArtists( { sort : $scope.artistSort[idx].sort }).success(function(res) {
      $scope.artists = res.artists;
    });
  };

  $scope.selectAlbumSort = function(idx) {
    $scope.albums = { limits : {}, albums : [] };
    $scope.loadMoreAlbums(0);
  };
  $scope.selectSongSort = function(idx) {
    $scope.loadMoreSongs(0);
  };

  var oldSelect = null;
  $scope.selectArtist = function(id, $event) {
    artistFilter = id;
    albumFilter = null;
    $scope.fetching = false;
    if (oldSelect)
      oldSelect.fontWeight = "";
    oldSelect = $event.target.style;
    oldSelect.fontWeight= "Bold";
    $scope.loadMoreAlbums(0);
  };


  $scope.loadMoreSongs = function(offset) {
    if ($scope.fetchingSongs)
      return;
    $scope.fetchingSongs = true;

    var songoffset = offset === undefined ? $scope.songs.songs.length : offset;
    var filter = {
      properties : ['title','track', 'duration', 'rating'],
      limits : {start:songoffset, end: songoffset + incsongsize},
      sort : $scope.songSort.set[$scope.songSort.selected].sort
    };
    if (artistFilter) { 
      filter.filter = { artistid :  artistFilter};
    }
    audioLibraryService.getSongs( filter ).success(function(res) {
      $scope.fetchingSongs = false;
      if (songoffset == 0) {
        $scope.songs = res;
        return;
      }

      $scope.songs.limits = res.limits;
      for(var i = 0; i < res.songs.length; i++) {
        $scope.songs.songs.push(res.songs[i]);
      }

    }).error(function(){
      $scope.fetchingSongs = false; 
    });
  };

  $scope.loadMoreAlbums = function(offset) {
    if ($scope.fetching) {
      return;
    }
    $scope.fetching = true;

    var albumOffset = offset === undefined ? $scope.albums.albums.length : offset;
    var filter = {
      properties : ['title','displayartist', 'thumbnail', 'year'],
      sort :  $scope.albumSort.set[$scope.albumSort.selected].sort,
      limits : {start:albumOffset, end: albumOffset + incsize}
    };
    if (artistFilter) { 
      filter.filter = { artistid :  artistFilter};
      $scope.fetchingSongs = false;
      $scope.loadMoreSongs(0);
    }
    audioLibraryService.getAlbums( filter ).success(function(res) {
      $scope.fetching = false;
      $scope.albums.limits = res.limits;
      if (albumOffset == 0) {
          $scope.albums.albums = [];
      }

      for(var i = 0; i < res.albums.length; i++) {
        // Fix up the year..
        if (res.albums[i].year == 65535) {
          res.albums[i].year = '0 - Unknown';
        }
        $scope.albums.albums.push(res.albums[i]);
      }
    }).error(function(){
      $scope.fetching = false; 
    });
  };

 // Now let us load some data!
  audioLibraryService.getArtists().success(function(res) {
    $scope.artists = res;
  });

  $scope.loadMoreAlbums(0);
  // If you have a big library (> 20k songs, the query will take WAYYYY TOO LONG on the XBMC server)
  $timeout($scope.loadMoreSongs(0), 500);
});
