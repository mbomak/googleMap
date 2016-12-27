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
        _request = new XMLHttpRequest(),
        _btn = '.btn',
        _groupValue = 0;
 
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
            _initMap( data );
        },
        error: function ( XMLHttpRequest ) {
            if( XMLHttpRequest.statusText != 'abort' ) {
                console.log( 'Error!' );
            }
        }
      });

    },
    _initMap = function (data) {

      var dataAttrCenterMap = _mapContainer.attr( 'data-center-map' ),
          centerMap,
          dataAttrZoom = _mapContainer.attr( 'data-zoom-map' ),
          zoom,
          bounds = [],
          group,
          mapOption;

      var takeCenterMap = function ( dataAttr ) {

        var center = dataAttr.split(',');

        center = {lat:parseFloat(center[0]), lng:parseFloat(center[1])};

        return center;

      },
      initArrayGroup = function ( valueGroup ) {

        var array = [];

        for ( var i = 0; i < valueGroup; i++ ) {

          array[i] = new Array(); 

        }

        return array;

      }; 

      _groupValue = data.length;

      group = initArrayGroup( _groupValue );

      centerMap = takeCenterMap( dataAttrCenterMap );

      zoom = parseInt( dataAttrZoom );

    	mapOption = {
    		center: centerMap,
    		scrollwheel: false,
    		zoom: zoom,
            styles: [
                {featureType: 'all',
                stylers: [
                 { saturation: 30 }
                ]}
              ]
    	};

      _map = new google.maps.Map( _mapContainer[0], mapOption );

      _addMarkersPolygons( data, group, bounds );

      _addClusters( group );

      _createButton();

      _eventsButton( group, bounds, centerMap, zoom );

    },
    _addMarkersPolygons = function( data, group, bounds ) {

      var addPolygons = function () {

        var polygonGroup = new google.maps.Polygon({
              paths: data[i].polygon,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35
            }),
            polygonInfo = $( data[i].polygonInfo );

        var addListenersOnPolygon = function( polygon, infoWindow ) {

          polygon.addListener( 'mouseover', function(){

            this.setOptions({fillColor: '#00FF00'});
                             
            infoWindow.show();

          }); 

          polygon.addListener( 'mouseout', function(){

            this.setOptions({fillColor: '#FF0000'});

            infoWindow.hide();

          }); 

        },
        movePolygonInfo = function ( infoWindow ) {

          _mapWrap.on( 'mousemove', function ( e ) {

            infoWindow.css({
              'top':e.pageY-60,
              'left':e.pageX-30
              });

          } );

        };

        _mapWrap.append( polygonInfo );

        polygonGroup.setMap( _map );

        addListenersOnPolygon( polygonGroup, polygonInfo );

        movePolygonInfo( polygonInfo );

      },
      addMarkers = function () {

        for ( var k = 0; k < data[i].latLng.length; k++) {

          var marker = new google.maps.Marker({
                position: data[i].latLng[k],
                map: _map,
                icon: {
                  url: 'img/pin.png',
                  scaledSize: new google.maps.Size(40, 61),
                  anchor: new google.maps.Point(20, 61)
                }
              });

          group[i].push( marker );        

          boundsTmp.extend( marker.getPosition() );

          var infoWindow = new google.maps.InfoWindow({
  
            content: data[i].infoContent[k]
  
          });

          marker.addListener( 'click', function() {

            infoWindow.open( _map, this );

          });

          google.maps.event.addDomListener( _map, 'click', function(){

            infoWindow.close();

          });

        } 

      };   

      for ( var i = 0; i < data.length; i++ ) {   

        var boundsTmp = new google.maps.LatLngBounds(); 
        
        addMarkers();

        bounds.push( boundsTmp );

        addPolygons();

      }

    },
    _addClusters = function ( group ) {

      for ( var i = 0; i < _groupValue; i++ ) {

        var markerCluster = new MarkerClusterer( _map, group[i], {styles:[{
              url: 'img/cluster1.png',
              textColor: 'white',
              height: 50,
              width: 50,
              textSize: 20              
            }]});
      }

    },
    _createButton = function () {

      var marginTop = 70;

      for ( var i = 1; i < _groupValue + 1; i++) {

        var button = $( '<button class="btn" type="button">группа-'+i+'</button>' );

        button.css( 'top',marginTop );

        _controls.append( button );

        marginTop+=50;

        if ( i == _groupValue ) {

            var button = $( '<button class="btn" type="button">все точки</button>' );

            button.css( 'top', marginTop );

            _controls.append( button );

        }

      } 

    },
    _eventsButton = function ( group, bounds, centerMap, zoom ) {

      _controls.on ( 'click', _btn, function () {

        var button = $( this ),
            dataAttr = button.attr( 'data-group' ),
            indexButton = button.index();

        for  (var i = 0; i < _groupValue; i++) {

          for ( var k =0; k < group[i].length; k++) group[i][k].setMap( null );

          if ( indexButton == i ) {

            for ( var j = 0; j < group[i].length; j++ ) group[i][j].setMap( _map );

            _map.fitBounds( bounds[i] );

          } else if ( indexButton == _groupValue ) {

            _map.setZoom( zoom );
                 
            _map.panTo( centerMap );

          }

        }

      } );

    };
  
    _constructor ();
  
  };

} ) ();