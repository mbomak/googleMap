"use strict";
( function () {

  $( function() {

    $.each( $( '.map' ), function() {
       
      new  Map ( $( this ) );
       
    } );

  } );

    
  Map = function ( obj ) {
  
    //private properties
    var _self = this,
        _mapContainer = obj,
        _mapWrap = _mapContainer.parent(),
        _controls = $( '.controls' ),
        _map,
        _request = new XMLHttpRequest();
 
    //private methods
    var _constructor = function () {

      google.maps.event.addDomListener( window, 'load',  _getData ); 

    },
    _getData = function() {

      _request = $.ajax({
        url: 'php/data.json',
        type: 'GET',
        dataType: 'json',
        timeout: 20000,
        success: function ( data ) {
            _getUserLocation( data );
        },
        error: function ( XMLHttpRequest ) {
            if( XMLHttpRequest.statusText != 'abort' ) {
                console.log( 'Error!' );
            }
        }
      });

    },
    _getUserLocation = function (data) {

      if ( navigator.geolocation ) {

        navigator.geolocation.getCurrentPosition( function( position ) {

          var userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          _initMap( data, userLocation );

        });

      } else console.log('Geolocation is not supported for this Browser/OS version yet.');     

    },
    _initMap = function ( data, userLocation ) {

      var mapOption = {};

        mapOption = {
          center: userLocation,
          scrollwheel: false,
          zoom: 14,
              styles: [
                  {featureType: 'all',
                  stylers: [
                   { saturation: 30 }
                  ]}
                ]
        };

      _map = new google.maps.Map( _mapContainer[0], mapOption );

    };
  
    _constructor();
  
  };

} ) ();