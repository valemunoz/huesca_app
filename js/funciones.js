window.onload = function() {
 
    var alto=$("#contenido").height();
    var ancho=$("#contenido").width();
 		$('.body_inicio').css('width',ancho);
 		$('.body_inicio').css('height',alto);
 		var alto_h=$("#header_fondo").height();
		/*$('.fondo_h').css('width',ancho);*/
 		//$('.fondo_h').css('height',alto_h);
 		
}
window.onresize = function() {
        var alto=$("#contenido").height();
    var ancho=$("#contenido").width();
 		$('.body_inicio').css('width',ancho);
 		$('.body_inicio').css('height',alto);
 		var alto_h=$("#header_fondo").height();
 		//$('.fondo_h').css('height',alto_h);
 		}
 		
function deviceListo()
{
	//alert("paso");
	navigator.splashscreen.hide();
}