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
        _map;
 
    //private methods
    var _constructor = function () {

      google.maps.event.addDomListener( window, 'load',  _getUserLocation ); 

    },
    _getUserLocation = function () {

      if ( navigator.geolocation ) {

        navigator.geolocation.getCurrentPosition( function( position ) {

          var userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          _initMap( userLocation );

        });

      } else console.log('Geolocation is not supported for this Browser/OS version yet.');     

    },
    _initMap = function ( userLocation ) {

      var mapOption = {},
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

      _initMarkers( userLocation,markers );

      directionsService = new google.maps.DirectionsService;

      directionsDisplay = new google.maps.DirectionsRenderer({map: _map});

      _addEvents( markers,directionsService,directionsDisplay,userLocation );

    },
    _initMarkers = function( userLocation,markers ) {

      var markerStart = new google.maps.Marker({
            position: userLocation,
            title: 'Start point',
            label: 'S',
            map: _map
          }); 

      markers.push( markerStart ); 

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
            destination: 'кривой рог кропивницкого 87 80',
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

        markers[0].setMap(null);

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