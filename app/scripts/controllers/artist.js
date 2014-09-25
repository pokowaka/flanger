'use strict';

/**
 * @ngdoc function
 * @name flangerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the flangerApp
 */
angular.module('flangerApp')
.controller('ArtistCtrl', function ($scope, $timeout, audioLibraryService, $q) {
  var artistFilter = null;
  var albumFilter = null;
  var incsize = 10;

  $scope.albums  = { limits : {}, albums : [] };
  $scope.artists = { limits : {}, artists : []};
  $scope.songs  = { limits : {}, songs : []};

  $scope.fetchingSongs = false;
  $scope.fetching = true;

  $scope.test = function(start, count) {
    var def = $q.defer();
    var data = { 
      limits : { total : 500},
     items : [],
    } ;
    for(var i = 0; i < 500; i++) {
      data.items.push({ label : "Idx: " + (start + i) });
    }
    $timeout( function() {
      def.resolve(data) }, 
      2000);
    return def.promise;
}

  $scope.artistSort = { selected : 0,
    set : [
    { label : 'A-Z', sort : { order: 'ascending', method: 'artist', ignorearticle: true  } },
    { label : 'Z-A', sort : { order: 'descending', method: 'artist', ignorearticle: true  } },
  ]};

  $scope.songSort = { selected : 0,
    set : [
    { label : 'A-Z', sort : { order: 'ascending', method: 'title', ignorearticle: true } },
    { label : 'BY RATING', sort : { order : 'descending', method: 'rating' } },
  ]};

  $scope.albumSort = { selected : 0,
    set : [
    { label : 'A-Z', sort : { order: 'ascending', method: 'album', ignorearticle: true }},
    { label : 'BY RELEASE YEAR', sort : { order: 'ascending', method: 'year'} },
    { label : 'BY ARTIST', sort : { order: 'ascending', method: 'artist', ignorearticle: true}}, // Group By in angular cannot deal with ignoringarticle  yet..
    { label : 'BY DATE ADDED', sort : { order: 'ascending', method: 'dateadded'}},
  ]};

  $scope.$watch('artistSort.selected', function() { 
    // Now kick the directive..
  });

  $scope.getArtists = function(start, size) {
    $scope.fetchingArtists = true;
    var deferred = $q.defer();
    var filter = {
      limits : {start: start, end: start + size},
      sort : $scope.artistSort.set[$scope.artistSort.selected].sort,
     //filter : scope.filter
    };

    audioLibraryService.getArtists( filter ).success(function(res) {
      $scope.fetchingArtists = false;
      res.items = res.artists;
      res.total = res.limits.total;
      $scope.artists.limits = res.limits;
      deferred.resolve(res);
    }).error(function() {
      $scope.fetchingArtists = false;
      deferred.reject();
    });

    return deferred.promise;
  };
  $scope.getAlbums = function(start, size) {
    var deferred = $q.defer();
    $scope.fetchingAlbums = true;

    var filter = {
      properties : ['title','displayartist', 'thumbnail', 'year'],
      sort :  $scope.albumSort.set[$scope.albumSort.selected].sort,
      limits : {start:start, end: start + size}
    };

    audioLibraryService.getAlbums( filter ).success(function(res) {
      $scope.fetchingAlbums = false;
      $scope.albums.limits = res.limits;
      // Fix up the year..
      for(var i = 0; i < res.albums.length; i++) {
        if (res.albums[i].year == 65535) {
          res.albums[i].year = '0 - Unknown';
        }
      }
      res.items = res.albums;
      deferred.resolve(res);
    }).error(function(){
      $scope.fetchingAlbums = false; 
      deferred.reject();
    });

    return deferred.promise;
  };

  $scope.getSongs = function(start, size) {
    $scope.fetchingSongs = true;
    var deferred = $q.defer();
    var filter = {
      properties : ['track', 'rating'],
      limits : {start: start, end: start + size},
      sort : $scope.songSort.set[$scope.songSort.selected].sort,
     //filter : scope.filter
    };

    audioLibraryService.getSongs( filter ).success(function(res) {
      res.items = res.songs;
      res.total = res.limits.total;
      $scope.songs.limits = res.limits;
      $scope.fetchingSongs = false;
      deferred.resolve(res);
    }).error(function() {
      $scope.fetchingSongs = false;
      deferred.reject();
    });

    return deferred.promise;
  };



  $scope.selectArtistSort = function(idx) {
    audioLibraryService.getArtists( { sort : $scope.artistSort.set[idx].sort }).success(function(res) {
      $scope.artists = res;
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
    artistFilter = null;
    albumFilter = null;
    if (oldSelect)
      oldSelect.classList.remove("list-group-item-success");
    if (oldSelect != $event.target) {
      oldSelect = $event.target;
      oldSelect.classList.add("list-group-item-success");
      artistFilter = id;
    } else {
      oldSelect = null;
    }

    $scope.fetching = false;
    $scope.fetchingSongs = false;
    $scope.loadMoreAlbums(0);
    $scope.loadMoreSongs(0);
  };

  var oldAlbum = null;
  $scope.selectAlbum = function(album, element) {
    albumFilter = null;
    if (oldAlbum)
      oldAlbum.selected = false;

    if (album.selected)
      albumFilter = album.albumid;

    oldAlbum = album;
    $scope.fetchingSongs = false;
    $scope.loadMoreSongs(0);
  }


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
      if (res.limits.total > res.limits.end)
        $scope.loadMoreAlbums(res.limits.end);
    }).error(function(){
      $scope.fetching = false; 
    });
  };

  $scope.loadMoreAlbums(0);
});
