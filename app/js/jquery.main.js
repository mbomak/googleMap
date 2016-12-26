"use strict";

( function () {

  $( function() {

    $.each( $( '.site__menu' ), function() {
       
      new  Menu ( $( this ) );
       
    } );

  } );

    
  var Menu = function ( obj ) {
  
    //private properties
    var _self = this,
        _menu = obj,
        _btn = $( '.btn-menu' ),
        _window = $( window );

    //private methods
    var _constructor = function () {
    
            _menu[ 0 ].obj = _self;
            _onEvents();
    
        },
    _onEvents = function () {
    
        _btn.on ( {
            click: function () {
             
             _toggleMenu();

            }
        } );

        _window.on ( {
            resize: function () {
             
             _resizeWindow();

            }
        } );   
    },
  
    _toggleMenu = function () {

      _btn.toggleClass( 'btn-menu_active' );

      _menu.toggleClass( 'site__menu_visible' );

    },

    _resizeWindow = function () {

      _btn.removeClass( 'btn-menu_active' );      

      _menu.removeClass( 'site__menu_visible' );

    };
  
    _constructor ();
  
  }

 
} ) ();
