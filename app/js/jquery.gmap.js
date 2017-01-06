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
        _controls = $( '.controls' ),
        _buttons = _controls.children(),
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

      var mapOption = {},
          finishPointLocation = data[0].latLng,
          directionsService,
          directionsDisplay,
          markers= [];

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

      _initMarkers( data,userLocation,finishPointLocation,markers );

      directionsService = new google.maps.DirectionsService;

      directionsDisplay = new google.maps.DirectionsRenderer({map: _map});

      _addEvents( markers,directionsService,directionsDisplay,userLocation,finishPointLocation );

    },
    _initMarkers = function( data,userLocation,finishPointLocation,markers ) {

      var markerStart = new google.maps.Marker({
            position: userLocation,
            title: 'Start point',
            label: 'S',
            map: _map
          }),
          markerFinish = new google.maps.Marker({
            position: finishPointLocation,
            title: "Finish point",
            label: "F",
            map: _map
          }); 

      markers.push( markerStart,markerFinish ); 

    },
    _calculateDisplayRoute = function ( 
                              directionsService,
                              directionsDisplay,
                              userLocation,
                              finishPointLocation,
                              directionsOptions ) {

      directionsService.route( directionsOptions, function ( response,status ) {

        if ( status == google.maps.DirectionsStatus.OK ) {

          directionsDisplay.setDirections( response );

        } else {

          console.log( 'Directions request failed due to ' + status );

        }

      });

    },
    _addEvents = function ( markers,directionsService,directionsDisplay,userLocation,finishPointLocation ) {

      _buttons.on( 'click', function(){

        var button = $( this ),
            directionsOptions = {};

        if ( button.hasClass( 'controls__car' ) ) {

          directionsOptions = {
            origin: userLocation,
            destination: finishPointLocation,
            travelMode: google.maps.TravelMode.DRIVING
          };
          
        } else if ( button.hasClass( 'controls__bus' ) ) {

          directionsOptions = {
            origin: userLocation,
            destination: finishPointLocation,
            travelMode: google.maps.TravelMode.TRANSIT,
            transitOptions: {
                modes: [google.maps.TransitMode.BUS],
                routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
              }
          };

        } else if ( button.hasClass( 'controls__walk' ) ) {

          directionsOptions = {
            origin: userLocation,
            destination: finishPointLocation,
            travelMode: google.maps.TravelMode.WALKING
          };

        }

        for ( var i = 0; i < markers.length; i++ ) {

          markers[i].setMap(null);

        }

        _calculateDisplayRoute( 
                                directionsService,
                                directionsDisplay,
                                userLocation,
                                finishPointLocation,
                                directionsOptions
                              );

      } );

    };

    _constructor();
  
  };

} ) ();