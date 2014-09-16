'use strict';

 angular.module('flangerApp').service('kodiService', function(jsonrpc) {
      var service = jsonrpc.newService('kodisvc');
      this.getRecentAlbums = service.createMethod('AudioLibrary.GetRecentlyPlayedAlbums');
    });

