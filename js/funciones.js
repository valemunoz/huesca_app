var map;

function deviceListo()
{
	//alert("paso");
	navigator.splashscreen.hide();
}

function openCondiciones()
{
	
	$.mobile.changePage('#mod_condiciones', {transition: 'pop', role: 'dialog'});
}
function initMap() 
{
	
	
  // Create a map object and specify the DOM element for display.
   map = new google.maps.Map(document.getElementById('mapa'), {
    center: {lat: 42.135587, lng: -0.409196},
    scrollwheel: false,
    zoom: 14
  });
  
  //currentLocation();
  marcadorGoogle(-0.409196,42.135587,'Nombre comercio');
  $.mobile.loading( 'hide');
}
function currentLocation()
{
	if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

    
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

 
function loadMapa()
{
	//window.location.href='mapa.html';
	$.mobile.changePage('mapa.html', {transition: 'flow',reverse: true,
  changeHash: true });
	
}
function marcadorGoogle(lon,lat,texto)
{
	var myLatLng = {lat: lat, lng: lon};
	var image = 'img/icon.png';
	var marker = new google.maps.Marker({
    map: map,
    position: myLatLng,
    icon:image,
    title: texto
  });
  
  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">NOMBRE COMERCIO</h1>'+
      '<div id="bodyContent">'+
      '<p><b>cOMERCIO</b>, tEXTO.</p>'+
      '</div>'+
      '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
   marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}
function loadRegistro()
{
	window.location.href='registro.html';
	
}
function validaLogin()
{
	
	window.location.href='logeado.html';
}
function loadSesion()
{
	window.location.href='sesion.html';
}

function resizeFondo()
{
	       var alto=$("#contenido").height();
    var ancho=$("#contenido").width();
 		$('.body_inicio').css('width',ancho);
 		$('.body_inicio').css('height',alto);
 		var alto_h=$("#header_fondo").height();
 		//$('.fondo_h').css('height',alto_h);
}
function loadListaComercio()
{
	//window.location.href='mapa.html';
	$.mobile.changePage('comercios_asociados.html', {transition: 'flow',reverse: true,
  changeHash: true });
	
}