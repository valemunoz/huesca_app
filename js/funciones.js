var map;

var ONLINE=100;
var _wsUrl = "http://comerciohuescaws.e-osca.com/WebService.asmx";
var ticket=0;
var db = openDatabase('MyDB', '1.0', 'My Sample DB', 10000 * 1024);
var BD_USER=0;
var BD_TICKET=0;
var comercio_detalle=Array();
var COM_ID=Array();
var COM_NOMBRE=Array();
var COM_DIRECCION=Array();
var COM_WEB=Array();
var COM_MAIL=Array();
var COM_TELEFONO=Array();
var COM_FAX=Array();
var COM_DESCRIPCION=Array();
var COM_LOGO=Array();
var COM_IMG1=Array();
var COM_IMG2=Array();
var IMG_WIDTH=200;
var IMG_HEIGHT=150;
function offline()
{
	
	ONLINE=false;
	window.location.href='offline.html';
}
function online()
{
	
	if(ONLINE==false && ONLINE !=100)
	{
		ONLINE=true;
		window.location.href='index.html';
	}
	ONLINE=true;
}
function openPopstatic(contenido,tiempo)
{
	$("#cont_static").html(contenido);
	$("#myPopup_static").popup("open");
	
	if(tiempo>0)
	{
		setTimeout(function() {

       $("#myPopup_static").popup("close");

    }, tiempo);
  }
}
function deviceListoInicio()
{
	var ancho=$("#contenido").width();
	ancho=Math.round((ancho*25)/100);
	IMG_WIDTH=ancho;
	IMG_HEIGHT=ancho+10;
	try
	{
		navigator.splashscreen.hide();
	}catch(e)
	{
	}
	loadBD();
	getSesionBD();
	loadComerciosWS();		 
	setTimeout("getComerciosBD();",1500);
	//setTimeout("getSesionBD();",300);
	setTimeout("loadLogin();",500);
	
	
}
function loadLogin()
{
	if(BD_TICKET!=0)
	{
		window.location.href='logeado.html';		
	}
}
function deviceListo()
{
	
	$.mobile.loading( 'show', {
				text: 'Cargando...',
				textVisible: true,
				theme: 'a',
				html: ""
			});
			var ancho=$("#contenido").width();
	ancho=Math.round((ancho*25)/100);
	IMG_WIDTH=ancho;
	IMG_HEIGHT=ancho+10;
	loadBD();
	getSesionBD();
	loadComerciosWS();	
	 
	setTimeout("getComerciosBD();",1000);
	setTimeout("loadUserMenu(0);",500);
	
}
function deviceListoNoSesion()
{
	//alert($("#contenido").width());
	var ancho=$("#contenido").width();
	ancho=Math.round((ancho*25)/100);
	IMG_WIDTH=ancho;
	IMG_HEIGHT=ancho+10;
	//alert("paso:dev");
	$.mobile.loading( 'show', {
				text: 'Cargando...',
				textVisible: true,
				theme: 'a',
				html: ""
			});
	loadBD();
	loadComerciosWS();		 
	setTimeout("getComerciosBD();",1000);
	setTimeout("getSesionBD();",200);
	setTimeout("loadUserMenu(1);",500);
	
}
function loadUserMenu(tip)
{
	

	//alert("tick:"+BD_TICKET);
		var pl = new SOAPClientParameters();
			pl.add("ticket", BD_TICKET);
			
     SOAPClient.invoke(_wsUrl, "getUsuario", pl, true, function(_respuesta) {
                           //alert("tick:"+JSON.stringify(_respuesta));  
                           if(_respuesta.error ==0)
                           {
                           	//alert("paso");
                           	loadMenu();
                           	$("#barra_izq").html("Bienvenido "+_respuesta.resultado.nombre.toUpperCase()+" "+_respuesta.resultado.apellidos.toUpperCase());                           	
                           	$("#barra_der").html('<a href="javascript:salir();" class="link_op">Cerrar Sesion<img width=13% src="img/login.png"></a>');
                           	addSesionBD(BD_TICKET,""+_respuesta.resultado.nombre.toUpperCase()+" "+_respuesta.resultado.apellidos.toUpperCase()+"");                           	
                           		
														
														
														$.mobile.loading( 'hide');	
													 }else
													 {
													 	if(tip==0)
													 	{
													 		openPopstatic("Su sesi&oacute;n ha caducado.",0);													 		
													 		deleteSessionBD();
													 		setTimeout("loadSesion();",1500);
													 		
													 	}else
													 		{
													 			
                           			$("#barra_der").html('<a href="javascript:loadSesion();" class="link_op">Inicia Sesion<img width=13% src="img/login.png"></a>');
													 			loadMenuOff();
													 		}
													 }
													//loadSesion
                    });
                    
                    $.mobile.loading( 'hide');	

}
function openCondiciones()
{
	
	$.mobile.changePage('#mod_condiciones', {transition: 'pop', role: 'dialog'});
}
function initMap() 
{
	$.mobile.loading( 'show', {
				text: 'Cargando...',
				textVisible: true,
				theme: 'a',
				html: ""
			});
	
  // Create a map object and specify the DOM element for display.
   map = new google.maps.Map(document.getElementById('mapa'), {
    center: {lat: 42.135587, lng: -0.409196},
    scrollwheel: false,
    zoom: 14
  });
  var pl = new SOAPClientParameters();
                    SOAPClient.invoke(_wsUrl, "getComercios", pl, true, function(_respuesta) {
                          // alert(JSON.stringify(_respuesta));
                           /*alert(_respuesta.error);
                           alert(_respuesta.resultado);*/
 													//alert(JSON.stringify(_respuesta));
                           var _numResultados = _respuesta.resultado.length;
                           for (i = 0; i<_numResultados; i++) {
                           	try
                           	{
                           		//alert(_respuesta.resultado[i].gps.latitud);
                           	    marcadorGoogle(_respuesta.resultado[i].gps.longitud,_respuesta.resultado[i].gps.latitud,'<strong>'+_respuesta.resultado[i].nombre.toUpperCase()+'</strong><br>Direcci&oacute;n: '+_respuesta.resultado[i].direccion);
                           	}catch(e){}
                          }
                          $.mobile.loading( 'hide');	
  });
   //marcadorGoogle(-0.409196,42.135587,'<strong>NOMBRE COMERCIO</strong><br>Direcci&oacute;n:xxxx');
   
  
  
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
	window.location.href='mapa.html';
	//$.mobile.changePage('mapa.html', {transition: 'flow',reverse: true,changeHash: true });
	
}
function marcadorGoogle(lon,lat,texto)
{
	var myLatLng = {lat: lat, lng: lon};
	var image = 'img/map.png';
	var marker = new google.maps.Marker({
    map: map,
    position: myLatLng,
    icon:image,
    title: texto
  });
  
  var contentString = texto;

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
	
	var user=$.trim(document.getElementById("user").value);
	var pass=$.trim(document.getElementById("pass").value);
	
	if(user!="" && pass!="")
	{
		$.mobile.loading( 'show', {
				text: 'Validando...',
				textVisible: true,
				theme: 'a',
				html: ""
			});
			var pl = new SOAPClientParameters();
			pl.add("email", user);
			pl.add("pass", pass);
			
			
     SOAPClient.invoke(_wsUrl, "loginUsuario", pl, true, function(_respuesta) {
                           //alert(JSON.stringify(_respuesta));  
                           if(_respuesta.error!=0)
                           {
                           	openPopstatic(_respuesta.mensajeError,0);
                           }else
                           	{                           		
                           		
                           		var ticket=_respuesta.resultado.ticket;
                     
                           		var usuario=_respuesta.resultado.nombre;
                           		addSesionBD(ticket,usuario);
                           		setTimeout("window.location.href='logeado.html';",300);
                           		
                           	}                         
													$.mobile.loading( 'hide');	
													//loadSesion
                    });
		
	}else
		{
			openPopstatic("Todos los campos son obligatorios.",0);
		}
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
	$.mobile.changePage('comercios_asociados.html', {transition: 'flow',reverse: true,changeHash: true });
	
}
function validaUsuario()
{
	nombre=$.trim(document.getElementById("nombre").value);
	app=$.trim(document.getElementById("app").value);
	mail=$.trim(document.getElementById("mail").value);
	fec=$.trim(document.getElementById("fec").value);
	clv=$.trim(document.getElementById("clv").value);
	sexo=$.trim(document.getElementById("sexo").value);
	var valida=true;
	var msg="";
	if(nombre=="" || app=="" || mail=="" || fec=="" || sexo=="" || clv=="")
	{
		valida=false;
		msg +="Todos los campos son obligatorios.<br>";
	}
	if(!validarEmail(mail))
	{
		valida=false;
		msg +="Correo electronico no es valido.<br>";
	}
	if(clv.length < 4)
	{
		valida=false;
		msg +="La contrase&ntilde;a debe contener al menos 4 caracteres.<br>";
	}
	//alert(fec);
	  /*fecha=fec.split("-");
		fec_nac=fecha[2]+"/"+fecha[1]+"/"+fecha[0];
	if(!validarFormatoFecha(fec))
	{
		
		//AAAAMMDD
		valida=false;
		msg +="Fecha de nacimiento no es valida.<br>";
	}*/
	if(!document.getElementById("checkbox-1a").checked)
	{
		valida=false;
		msg +="Debe aceptar las condiciones de uso y protecci&oacute;n de datos.<br>";
	}
	if(valida)
	{
		fec_nac=fec.replace("/","");
		fec_nac=fec_nac.replace("/","");
		fec_nac=fec_nac.replace("/","");
		
		fec_nac=fec_nac.replace("-","");
		fec_nac=fec_nac.replace("-","");
		fec_nac=fec_nac.replace("-","");
		//alert(fec_nac);
	
		$.mobile.loading( 'show', {
				text: 'Validando...',
				textVisible: true,
				theme: 'a',
				html: ""
			});
		
			var pl = new SOAPClientParameters();
			pl.add("email", mail);
			pl.add("pass", clv);
			pl.add("nombre", nombre);
			pl.add("apellidos", app);
			pl.add("sexo", sexo);
			pl.add("fnac", fec_nac);
			
     SOAPClient.invoke(_wsUrl, "setUsuarioNuevo", pl, true, function(_respuesta) {
                           
                           if(_respuesta.error!=0)
                           {
                           	openPopstatic(_respuesta.mensajeError,0);
                           }else
                           	{
                           		openPopstatic("Registro Exitoso",0);
                           		ticket=_respuesta.ticket;
                           		setTimeout("loadSesion();",2000);
                           	}                         
													$.mobile.loading( 'hide');	
													//loadSesion
                    });
			
		
	}else
		{
			openPopstatic(msg,0);
			
		}
	
	
}
function validarFormatoFecha(campo) {
      var RegExPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
      if ((campo.match(RegExPattern)) && (campo!='')) {
            return true;
      } else {
            return false;
      }
}
function validarEmail( email ) {
	  var valido=true;
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if ( !expr.test(email) )
        valido=false;
        
   return valido;     
}

function loadComerciosAsos()
{
	$.mobile.loading( 'show', {
				text: 'Cargando...',
				textVisible: true,
				theme: 'a',
				html: ""
			});

			
			var txt="";
			var pl = new SOAPClientParameters();
                    SOAPClient.invoke(_wsUrl, "getComercios", pl, true, function(_respuesta) {
                           //alert(JSON.stringify(_respuesta));
                           /*alert(_respuesta.error);
                           alert(_respuesta.resultado);*/
 													//alert(JSON.stringify(_respuesta));
                           var _numResultados = _respuesta.resultado.length;
                           for (i = 0; i<_numResultados; i++) {                                 
                           				var imagen_com="";
		  														
		  														imagen_com=$.trim(_respuesta.resultado[i].logo.urlFormateada);
		  														//var imagen_com="http://comerciohuesca.e-osca.com/imagen/{modo}/{ancho}/{alto}/01022016103822.jpg";
		  														imagen_com=imagen_com.replace("{modo}","miniatura");
		  														imagen_com=imagen_com.replace("{ancho}",IMG_WIDTH);
		  														imagen_com=imagen_com.replace("{alto}",IMG_HEIGHT);
		  														
		  														var descrip=_respuesta.resultado[i].descripcion;
		  														if(descrip==null)
		  														{
		  															descrip="No hay descripci&oacute;n no disponible.";
		  														}
                                  txt +='<div class="separador"></div>';
        													txt +='<div class="cabecera_resultado_busqueda" onclick="loadComercioDetalleID('+_respuesta.resultado[i].id+');">'+_respuesta.resultado[i].nombre+'</div>';
        													txt +='<div class="resultado_busqueda"><img src="'+imagen_com+'" /></div>';
        													txt +='<div class="resultado_busquedaL2">';
        													txt +='    <p>'+descrip+'</p>';
        													txt +='    <p>';
        													txt +='        <strong>';
        													txt +='            Direcci&oacute;n:';
        													txt +='        </strong>'+_respuesta.resultado[i].direccion+'';
        													txt +='    </p>';
        													txt +='    <a href="'+_respuesta.resultado[i].web+'" class="sitio_web">Sitio web</a>';
        													txt +='</div>';
        													txt +='<br />&nbsp;';        
        													
                                  
                                 
                           }
                           
                          // alert(img_com);
                           $("#centro_cont").html(txt);
                           //$("<div></div>").html(txt).appendTo("#centro_cont");
                           $('#centro_cont').trigger('create');
													$.mobile.loading( 'hide');	
                           
                    });
			
}
function loadComerciosAsociados()
{
	//$.mobile.changePage('comercios_asociados.html', {transition: 'flow',reverse: true, changeHash: true });
	window.location.href='comercios_asociados.html';
}
function loadFiltroBuscador()
{
	$.mobile.loading( 'show', {
				text: 'Cargando...',
				textVisible: true,
				theme: 'a',
				html: ""
			});
			var pl = new SOAPClientParameters();	
			
     SOAPClient.invoke(_wsUrl, "getComerciosActividades", pl, true, function(_respuesta) {
                           //alert("tick:"+JSON.stringify(_respuesta)); 
                           var _numResultados = _respuesta.resultado.length;
                           if(_respuesta.error==0)
                           {
                           	var html_txt='<select name="act" id="act">';
                           	 html_txt +='<option value=0>SELECCIONE UNA OPCI&Oacute;N</option>';
                           		for (i = 0; i<_numResultados; i++) { 
                           			html_txt +="<option value='"+_respuesta.resultado[i].id+"'>"+_respuesta.resultado[i].nombre.toUpperCase()+"</option>";                           			                                
		  														
		  												}
		  												
		  													$("#opt_act").html(html_txt);
		  													$('#contendor_contenido').trigger('create');
		  											}
		  											$.mobile.loading( 'hide');
		 });
}
function buscarComercio()
{
	var query=$.trim(document.getElementById("qry").value);
	var act=$.trim(document.getElementById("act").value);
	
	/*if(query=="" && act==0)
	{
		openPopstatic("Debe ingresar una consulta o actividad.",0);
	}else
		{*/
			$.mobile.loading( 'show', {
				text: 'Buscando...',
				textVisible: true,
				theme: 'a',
				html: ""
			});
			var pl = new SOAPClientParameters();	
			if(query!="")
			{
				pl.add("nombre", query);
			}
			if(act !=0)
			{
				pl.add("actividadId", act);
			}
			
     SOAPClient.invoke(_wsUrl, "getComercios", pl, true, function(_respuesta) {
                           //alert("tick:"+JSON.stringify(_respuesta)); 
                           var paso=true;
                           try
                           {
                           	var _numResultados = _respuesta.resultado.length;
                           }catch(e){paso=false;}
                           
                           if(_respuesta.error==0 && paso==true)
                           {
                           	//alert(_numResultados);
                           	var html_txt="";
                           		for (i = 0; i<_numResultados; i++) { 
                           			                                
                           			var imagen_com="";
                           			try{
		  															imagen_com=$.trim(_respuesta.resultado[i].logo.urlFormateada);		  															
		  															imagen_com=imagen_com.replace("{modo}","miniatura");
		  															imagen_com=imagen_com.replace("{ancho}",IMG_WIDTH);
		  															imagen_com=imagen_com.replace("{alto}",IMG_HEIGHT);
		  															
		  														}catch(e){}
		  															var descrip=_respuesta.resultado[i].descripcion;
		  															if(descrip==null)
		  															{
		  																descrip="No hay descripci&oacute;n disponible.";
		  															}
		  															html_txt +='<div class="separador"></div>';
        														html_txt +='<div class="cabecera_resultado_busqueda" onclick="loadComercioDetalleID('+_respuesta.resultado[i].id+');">'+_respuesta.resultado[i].nombre.toUpperCase()+'</div>';
        														if(imagen_com!="")
        														{
        															html_txt +='<div class="resultado_busqueda"><img src="'+imagen_com+'" /></div>';
        														}
        														html_txt +='<div class="resultado_busquedaL2">';
        														html_txt +='    <p>'+descrip+'</p>';
        														html_txt +='    <p>';
        														html_txt +='        <strong>';
        														html_txt +='            Direcci&oacute;n:';
        														html_txt +='        </strong>'+_respuesta.resultado[i].direccion+'';
        														html_txt +='    </p>';
        														html_txt +='    <a href="'+_respuesta.resultado[i].web+'" class="sitio_web">Sitio web</a>';
        														html_txt +='</div>';
        														html_txt +='<br />&nbsp;';

		  														
		  													}
		  												
		  													$("#resultado").html(html_txt);
		  												}else
		  													{
		  														$("#resultado").html("No Hay Resultados.");
		  													}
		  												$.mobile.loading( 'hide');
		});
		  															
			/*$("#resultado").load(PATH_QUERY, 
			{tipo:4, actividad:act, query:query} 
				,function(){
					$('#resultado').trigger('create');
					$.mobile.loading( 'hide');	
					
				}
			);*/
			
		//}
}


/** 
Funciones BD
**/
function successCB(e)
{
	//alert("exitoso bd");
}
function errorCB(e)
{
	alert("error bd "+e.code);
}
function loadBD()
{
	
 db.transaction(function(tx) 
 {
 	
 	//tx.executeSql('DROP TABLE jornada');
 		//tx.executeSql('DROP TABLE IF EXISTS comercios');
    tx.executeSql('create table if not exists sesion(ticket,usuario)'); 
    tx.executeSql('create table if not exists comercios(id,nombre,direccion,descripcion,telefono,mail,fax,web,logo,img1,img2)'); 
  
	}, errorCB, successCB);    

}
function delComerciosBD()
{
	
 db.transaction(function(tx) 
 {
 	
 	
 		tx.executeSql('DROP TABLE IF EXISTS comercios');
    
  
	}, errorCB, successCB);    

}
function addComerciosBD(id,nombre,direccion,descripcion,telefono,mail,fax,web,logo, img1, img2)
{
	
	
	 db.transaction(function(tx) {
 			//tx.executeSql('DROP TABLE IF EXISTS comercios');
 			 tx.executeSql('create table if not exists comercios(id,nombre,direccion,descripcion,telefono,mail,fax,web,logo,img1,img2)'); 
			 tx.executeSql('insert into comercios(id,nombre,direccion,descripcion,telefono,mail,fax,web,logo,img1,img2) values (?,?,?,?,?,?,?,?,?,?,?)',[id,nombre,direccion,descripcion,telefono,mail,fax,web,logo,img1,img2]);
	
	}, errorCB, successCBInicio);
	
}
function getComerciosBD()
{
	db.transaction(function(tx) {  
 		tx.executeSql('SELECT * FROM comercios', [], selectComercios, errorCB);
 		
    
	}, errorCB, successCB); 
}
function selectComercios(tx, results)
{
	COM_ID=Array();
	COM_NOMBRE=Array();
	COM_DIRECCION=Array();
	COM_WEB=Array();
	COM_MAIL=Array();
	COM_TELEFONO=Array();
	COM_FAX=Array();
	COM_DESCRIPCION=Array();
	COM_LOGO=Array();    
  COM_IMG1=Array();    
  COM_IMG2=Array();    

	if (results.rows.length < 1) 
  {
  	//alert("no hay resultados");
  	
  }  
 	for (var i = 0; i < results.rows.length; i++) 
 	{
 		
 				
 				
 	    	COM_ID[i]=results.rows.item(i).id;
				COM_NOMBRE[i]=results.rows.item(i).nombre;
				//alert(COM_NOMBRE[i]);
				COM_DIRECCION[i]=results.rows.item(i).direccion;
				COM_WEB[i]=results.rows.item(i).web;
				COM_MAIL[i]=results.rows.item(i).mail;
				COM_TELEFONO[i]=results.rows.item(i).telefono;
				COM_FAX[i]=results.rows.item(i).fax;
				COM_DESCRIPCION[i]=results.rows.item(i).descripcion;
				COM_LOGO[i]=results.rows.item(i).logo;    
				COM_IMG1[i]=results.rows.item(i).img1;    
				COM_IMG2[i]=results.rows.item(i).img2;    

 	  }
 	    
}
function addSesionBD(ticket,usuario)
{
	//alert(ticket+":"+usuario);
	
	 db.transaction(function(tx) {
 			tx.executeSql('DROP TABLE IF EXISTS sesion');
 			 tx.executeSql('create table if not exists sesion(ticket,usuario)'); 
			 tx.executeSql('insert into sesion(ticket,usuario) values (?,?)',[ticket,usuario]);
	}, errorCB, successCBInicio);
	
}
function successCBInicio(e)
{
//	window.location.href='logeado.html';
}
function getSesionBD()
{
	db.transaction(function(tx) {  
 		tx.executeSql('SELECT * FROM sesion', [], selectSesion, errorCB);
 		
    
	}, errorCB, successCB); 
}
function selectSesion(tx, results)
{
	
	if (results.rows.length < 1) 
  {
  	//alert("no hay resultados");
  	
  }  
 	for (var i = 0; i < results.rows.length; i++) 
 	{
 		
 				BD_TICKET = results.rows.item(i).ticket; 				 	    	
 				//alert("::"+BD_TICKET);
 	    	BD_USER = results.rows.item(i).usuario;
 	    	
 	  }
 	    
}
function deleteSessionBD()
{
	
	 db.transaction(function(tx) {
 			tx.executeSql('DROP TABLE IF EXISTS sesion');
 			 tx.executeSql('create table if not exists sesion(ticket,usuario)'); 
			 
	}, errorCB, successCBInicio);
	
}	
function salir()
{
	deleteSessionBD();
	var pl = new SOAPClientParameters();
			pl.add("ticket", BD_TICKET);
     SOAPClient.invoke(_wsUrl, "logoutUsuario", pl, true, function(_respuesta) {
                           //alert("tick:"+JSON.stringify(_respuesta));                             
													 window.location.href='index.html';

                    });
}

function loadBuscador()
{
	 window.location.href='buscador.html';
}
function loadComercio()
{	
	//window.location.href='comercio.html';
	window.location.href='comercio_dia.html';
}
function loadOferta()
{
	window.location.href='oferta_detalle.html';
}
function loadMenu()
{
	
	var menu ="<div data-role='navbar'><ul>";
	 menu +="		<li><a class='li_a' href='javascript:loadComercio();' data-transition='flow'><img width=50px src='img/comercio_dia.png'></a></li>";
	menu +="		<li><a class='li_b' href='javascript:loadOferta();' data-transition='flow'><img width=50px src='img/ofertas.png'></a></li>";
	menu +="		<li><a class='li_a' href='javascript:loadComerciosAsociados();' data-transition='flow'><img width=50px src='img/comercios.png'></a></li>";
	menu +="		<li><a class='li_b' href='javascript:loadMapa();'><img width=50px src='img/mapa.png'></a></li>";
	menu +="		<li><a class='li_a' href='javascript:loadBuscador();' data-transition='flow'><img width=50px src='img/buscador.png'></a></li>	";
	
	menu +="</ul></div>";
	$("#menuNav").html(menu);
	$('#menuNav').trigger('create');
}
function loadMenuOff()
{
	
	
	var menu ="<div data-role='navbar'><ul>";
	 menu +="		<li><a class='li_a li_opaco' href='#' data-transition='flow'><img width=50px src='img/comercio_dia.png'></a></li>";
	menu +="		<li><a class='li_b li_opaco' href='#' data-transition='flow'><img width=50px src='img/ofertas.png'></a></li>";
	menu +="		<li><a class='li_a' href='javascript:loadComerciosAsociados();' data-transition='flow'><img width=50px src='img/comercios.png'></a></li>";
	menu +="		<li><a class='li_b' href='javascript:loadMapa();'><img width=50px src='img/mapa.png'></a></li>";
	menu +="		<li><a class='li_a' href='javascript:loadBuscador();' data-transition='flow'><img width=50px src='img/buscador.png'></a></li>	";
	menu +="</ul></div>";
	$("#menuNav").html(menu);
	$('#menuNav').trigger('create');
}
function loadOfertasDia() //getOfertasDia
{
	
	var pl = new SOAPClientParameters();
			pl.add("ticket", BD_TICKET);
			
     SOAPClient.invoke(_wsUrl, "getOfertasDia", pl, true, function(_respuesta) {
                           //alert("tick:"+JSON.stringify(_respuesta)); 
                           
                           var _numResultados = _respuesta.resultado.length;
                           
                           if(_numResultados > 1)
                           {
                           	$("#num_oferta").html(_numResultados+" Oferta del d&iacute;a nuevas");
                          }else
                          	{
                          		$("#num_oferta").html("1 Oferta del d&iacute;a nueva");
                          	}
													 
                    });
                    
	
}
function loadComerciosDia()
{
	var pl = new SOAPClientParameters();
			pl.add("ticket", BD_TICKET);
			
     SOAPClient.invoke(_wsUrl, "getComerciosDia", pl, true, function(_respuesta) {
                           //alert("tick:"+JSON.stringify(_respuesta)); 
                           
                           var _numResultados = _respuesta.resultado.length;
                           
                           if(_numResultados > 1)
                           {
                           	$("#comer").html(_numResultados+" Comercio del d&iacute;a nuevas");
                          }else
                          	{
                          		$("#comer").html("1 Comercio del d&iacute;a nueva");
                          	}
													 
                    });
                    $.mobile.loading( 'hide');
}
function loadOfertasLista() //getOfertasDia
{
	//alert(BD_TICKET);
	
	var pl = new SOAPClientParameters();
			pl.add("ticket", BD_TICKET);
			
     SOAPClient.invoke(_wsUrl, "getOfertasDia", pl, true, function(_respuesta) {
                           //alert("tick:"+JSON.stringify(_respuesta)); 
                           var _numResultados = _respuesta.resultado.length;
                           if(_respuesta.error==0)
                           {
                           	var texto="";
                           	if(_numResultados>1)
                           	{
                           		for (i = 0; i<_numResultados; i++) {   
                           			var imagen_com=_respuesta.resultado.Oferta.imagenes[0].urlFormateada;
		  														imagen_com=imagen_com.replace("{modo}","miniatura");
		  														imagen_com=imagen_com.replace("{ancho}",IMG_WIDTH);
		  														imagen_com=imagen_com.replace("{alto}",IMG_HEIGHT);
                           			texto +='<div class="separador"></div>';
        												texto +='<div class="cabecera_resultado_busqueda">'+_respuesta.resultado.Oferta[i].nombre+'';
        												texto +='</div>';
        												texto +='<div class="imagen_oferta"><img src="'+imagen_com+'" width="100%" /></div>';
        												texto +='<div class="texto_oferta">';
        												texto +='    <p><br />';
        												texto +='    '+_respuesta.resultado.Oferta.descripcion.slice(0,200);+' ...</p>';
        												texto +='    <p>&nbsp;</p>';
        												texto +='    <p><a href="oferta_detalle.html" class="boton_login">VER OFERTA</a>            </p>';
        												texto +='</div>';
        												texto +='<br />&nbsp;';                              
		  										 		
                          		}
                          	}else
                          		{
                          			var imagen_com=_respuesta.resultado.Oferta.imagenes[0].urlFormateada;
		  														imagen_com=imagen_com.replace("{modo}","miniatura");
		  														imagen_com=imagen_com.replace("{ancho}",IMG_WIDTH);
		  														imagen_com=imagen_com.replace("{alto}",IMG_HEIGHT);
		  														
        												texto ='<div class="separador"></div>';
        												texto +='<div class="cabecera_resultado_busqueda">'+_respuesta.resultado.Oferta.nombre+'';
        												texto +='</div>';
        												texto +='<div class="imagen_oferta"><img src="'+imagen_com+'" width="100%" /></div>';
        												texto +='<div class="texto_oferta">';
        												texto +='    <p><br />';
        												texto +='    '+_respuesta.resultado.Oferta.descripcion.slice(0,200);+' ...</p>';
        												texto +='    <p>&nbsp;</p>';
        												texto +='    <p><a href="oferta_detalle.html" class="boton_login">VER OFERTA</a>            </p>';
        												texto +='</div>';
        												texto +='<br />&nbsp;';
                          		}
                          		$("#listado_oferta").html(texto);
                           }
                    });
                    
	
}

function loadComerciosLista()
{
	//alert(BD_TICKET);
	
	var pl = new SOAPClientParameters();
			pl.add("ticket", BD_TICKET);
			
     SOAPClient.invoke(_wsUrl, "getComerciosDia", pl, true, function(_respuesta) {
                          // alert("tick:"+JSON.stringify(_respuesta)); 
                           var _numResultados = _respuesta.resultado.length;
                           if(_respuesta.error==0)
                           {
                           	var texto="";
                           	
                           	if(_numResultados>1)
                           	{
                           		for (i = 0; i<_numResultados; i++) {   
                           			var imagen_com=_respuesta.resultado.Comercio[i].imagenes[0].urlFormateada;
		  														imagen_com=imagen_com.replace("{modo}","miniatura");
		  														imagen_com=imagen_com.replace("{ancho}",IMG_WIDTH);
		  														imagen_com=imagen_com.replace("{alto}",IMG_HEIGHT);
		  														var descrip=_respuesta.resultado.Comercio[i].descripcion;
		  														if(descrip=='null')
		  														{
		  															descrip="";
		  														}
                           			texto +='<div class="separador"></div>';
        												texto +='<div class="cabecera_resultado_busqueda">'+_respuesta.resultado.Comercio[i].nombre+'';
        												texto +='</div>';
        												texto +='<div class="imagen_oferta"><img src="'+imagen_com+'" width="100%" /></div>';
        												texto +='<div class="texto_oferta">';
        												texto +='    <p><br />';
        												try{
        													texto +=''+descrip.slice(0,70);+'...</p>';
        												}catch(e){texto +='No hay descripci&oacute;n disponible.</p>';}
        												for(a=0; a < COM_ID.length; a++)
        												{
																		if(COM_ID[a]==_respuesta.resultado.Comercio[i].id)
																		{
        															texto +='<p><strong>Direcci&oacute;n: </strong>'+COM_DIRECCION[a]+'<span id="dir_com"></span></p>';
        															break;
        														}
        												}
        												texto +='    <p><a href="javascript:loadComercioDetalleID('+_respuesta.resultado.Comercio[i].id+');" class="boton_login">VER COMERCIO</a>            </p>';
        												texto +='</div>';
        												texto +='<br />&nbsp;';                              
		  										 		
                          		}
                          	}else
                          		{
                          			getDatosComercio(_respuesta.resultado.Comercio.id);
                          			
                          			var imagen_com=_respuesta.resultado.Comercio.logo.urlFormateada;
		  														imagen_com=imagen_com.replace("{modo}","miniatura");
		  														imagen_com=imagen_com.replace("{ancho}",IMG_WIDTH);
		  														imagen_com=imagen_com.replace("{alto}",IMG_HEIGHT);
		  														//alert(imagen_com);
		  														var descrip=_respuesta.resultado.Comercio.descripcion;
		  														if(descrip==null)
		  														{
		  															descrip="No hay descripci&oacute;n.";
		  														}
        												texto ='<div class="separador"></div>';
        												texto +='<div class="cabecera_resultado_busqueda">'+_respuesta.resultado.Comercio.nombre+'';
        												texto +='</div>';
        												texto +='<div class="imagen_oferta"><img src="'+imagen_com+'" width="100%" /></div>';
        												texto +='<div class="texto_oferta">';
        												texto +='    <p><br />';
        												try{
        													texto +=''+descrip.slice(0,70);+'...</p>';
        												}catch(e){texto +='No hay descripci&oacute;n disponible.</p>';}
        												for(a=0; a < COM_ID.length; a++)
        												{
																		if(COM_ID[a]==_respuesta.resultado.Comercio.id)
																		{
        															texto +='<p><strong>Direcci&oacute;n: </strong>'+COM_DIRECCION[a]+'<span id="dir_com"></span></p>';
        															break;
        														}
        												}
        												//setTimeout("$('#dir_com').html(comercio_detalle[2]);",1000);
        												texto +='    <p><a href="javascript:loadComercioDetalleID('+_respuesta.resultado.Comercio.id+');" class="boton_login">VER COMERCIO</a></p>';
        												texto +='</div>';
        												texto +='<br />&nbsp;';
        												
        												
        											
                          		}
                          		$("#listado_oferta").html(texto);
                          		$.mobile.loading( 'hide');	
                           }
                    });
                    
	
}
function contenidoWS()
{

	var pl = new SOAPClientParameters();
			pl.add("ticket", BD_TICKET);
			
     SOAPClient.invoke(_wsUrl, "getComerciosDia", pl, true, function(_respuesta) {
                           //alert("tick:"+JSON.stringify(_respuesta)); 
                           var _numResultados = _respuesta.resultado.length;
                           if(_respuesta.error==0)
                           {
                           	
                           	
                          			var imagen_com=_respuesta.resultado.Comercio.logo.urlFormateada;
		  														imagen_com=imagen_com.replace("{modo}","miniatura");
		  														imagen_com=imagen_com.replace("{ancho}",IMG_WIDTH);
		  														imagen_com=imagen_com.replace("{alto}",IMG_HEIGHT);
		  														//alert(imagen_com);
		  														var descrip=_respuesta.resultado.Comercio.descripcion;
		  														if(descrip==null)
		  														{
		  															descrip="No hay descripci&oacute;n disponible.";
		  														}
        												var html_esp='<div id="titulo_div">';
																html_esp+=''+_respuesta.resultado.Comercio.nombre.toUpperCase()+'';
																html_esp+='</div>';
																html_esp+='	</br>';
		  													html_esp+='<div id="div_contenido_com">';
																html_esp+='<div id="left_cont"> '+descrip;
		  													
																html_esp+='</div>';
																html_esp+='<div id="rig_cont"><img width=100px src="img/mensaje_alerta.png"></div>';
																html_esp+='</div>';
																try
																{
                           				var imagen_b=_respuesta.resultado.Comercio.imagenes[0].urlFormateada;
                           			
		  														imagen_b=imagen_b.replace("{modo}","miniatura");
		  														imagen_b=imagen_b.replace("{ancho}",IMG_WIDTH);
		  														imagen_com=imagen_b.replace("{alto}",IMG_HEIGHT);	
		  														html_esp+='<div id="foto1"><img class=img_com src="'+imagen_b+'"></div>';
																	
																}catch(e){}
															try
																{
                           				var imagen_b=_respuesta.resultado.Comercio.imagenes[1].urlFormateada;
                           			
		  														imagen_b=imagen_b.replace("{modo}","miniatura");
		  														imagen_b=imagen_b.replace("{ancho}",IMG_WIDTH);
		  														imagen_com=imagen_b.replace("{alto}",IMG_HEIGHT);	
		  														html_esp+='<div id="foto2"><img class=img_com src="'+imagen_b+'"></div>';
																}catch(e){}
																html_esp+='<div id="espacio"><br>';
																html_esp+='</div>';
        											 $("#contenido_ws").html(html_esp);
                          		
                          		
                           }else
                           	{
                           		$("#contenido_ws").html("Ocurrio un Error.");
                           	}
                    });
	
			
			
		
}
function loadOfertaDia() //getOfertasDia
{
	//alert(BD_TICKET);
	
	var pl = new SOAPClientParameters();
			pl.add("ticket", BD_TICKET);
			
     SOAPClient.invoke(_wsUrl, "getOfertasDia", pl, true, function(_respuesta) {
                           //alert("tick:"+JSON.stringify(_respuesta)); 
                           var _numResultados = _respuesta.resultado.length;
                           if(_respuesta.error==0)
                           {
                           	var texto="";
                           	
                          			var imagen_com=_respuesta.resultado.Oferta.imagenes[0].urlFormateada;
		  														imagen_com=imagen_com.replace("{modo}","miniatura");
		  														imagen_com=imagen_com.replace("{ancho}",IMG_WIDTH);
		  														imagen_com=imagen_com.replace("{alto}",IMG_HEIGHT);
		  														//alert(imagen_com);
        												texto +='<div class="titulo_oferta">'+_respuesta.resultado.Oferta.nombre+'</div>';
																texto +='<div class="evalucacion">     ';
																
																for (i = 0; i<_respuesta.resultado.Oferta.valoracion; i++)
																{
																	texto +='<img src="img/star_ac.png" width="35"  />';
																}
																var resto=5-_respuesta.resultado.Oferta.valoracion;
																for (i = 0; i<resto; i++)
																{
																	texto +='<img src="img/star_in.png" width="35"  />';
																}
																
																texto +='<p>'+_respuesta.resultado.Oferta.descripcion+'</p><div class="separador"></div>';
                                texto +='<img src="'+imagen_com+'" />';
      													texto +='<div class="flota_der_oferta">';
      													texto +='	<img src="img/punto.png" width="20%" />';
            										texto +='	<img src="img/punto.png" width="20%" />';
            										texto +='	<img src="img/punto.png" width="20%" />';
      													texto +='</div>';
																texto +='<div class="separador"></div>	';
																texto +='<strong>     Precio Anterior:</strong> <span class="precio_antes">'+_respuesta.resultado.Oferta.precioAntes+' &#8364;</span><br />';
																texto +='<strong> Precio Actual: </strong><span class="precio_despues" >'+_respuesta.resultado.Oferta.precio+' &#8364;</span>';
              									texto +='<div class="flota_der_oferta">  <a  href="javascript:loadComercioDetalleID('+_respuesta.resultado.Oferta.comercio.id+');" data-transition="flow" class="boton_login">VER COMERCIO</a></div>';
												        texto +='<div class="separador"></div>';
												        
                          		  
                          			$("#contendor_contenido").html(texto);
                           }
                    });
                    
	
}
function loadComercioDetalleID(id_comercio)
{
//alert(id_comercio +":"+COM_ID.length);
if(COM_ID.length >0)
{
		for(a=0; a < COM_ID.length; a++)
    {
			if(COM_ID[a]==id_comercio)
			{
				
      	$("#titulo_div").html(COM_NOMBRE[a].toUpperCase());
		  	try
		  	{
		  		var imagen_com=COM_LOGO[a];
		  		//var imagen_com="http://comerciohuesca.e-osca.com/imagen/{modo}/{ancho}/{alto}/01022016103822.jpg";
		  		imagen_com=imagen_com.replace("{modo}","miniatura");
		  		imagen_com=imagen_com.replace("{ancho}",IMG_WIDTH);
		  		imagen_com=imagen_com.replace("{alto}",IMG_HEIGHT);
		  	}catch(e){}
		  	
		  														
        											
				var html_esp='	</br>';
		  	html_esp+='<div id="div_contenido_com">';
				html_esp+='<div id="left_cont"> '+COM_DESCRIPCION[a];		  												
				
				html_esp+='</div>';
				//alert(COM_DESCRIPCION[a]);
				html_esp+='</br></br><br>';
		  	html_esp+='<strong>Tel&eacute;fono:</strong> '+COM_TELEFONO[a];
				html_esp+='<br><strong>Fax:</strong> '+COM_FAX[a];
				
				html_esp+='<br><strong>email:</strong> '+COM_MAIL[a];
				html_esp+='<br><strong>web:</strong> '+COM_WEB[a];
				html_esp+='<br><strong>Direcci&oacute;n:</strong> '+COM_DIRECCION[a];
				
				
				html_esp+='</div>';
				try
				{
        	var imagen_b=COM_IMG1[a];
        
		  		imagen_b=imagen_b.replace("{modo}","miniatura");
		  		imagen_b=imagen_b.replace("{ancho}",IMG_WIDTH);
		  		imagen_com=imagen_b.replace("{alto}",IMG_HEIGHT);	
		  		//alert(imagen_com);
		  		html_esp+='<div id="foto1"><img class=img_com src="'+COM_IMG1[a]+'"></div>';
					
				}catch(e){}
				try
					{
        		var imagen_b=COM_IMG2[a];
        	
		  			imagen_b=imagen_b.replace("{modo}","miniatura");
		  			imagen_b=imagen_b.replace("{ancho}",IMG_WIDTH);
		  			imagen_com=imagen_b.replace("{alto}",IMG_HEIGHT);	
		  			html_esp+='<div id="foto2"><img class=img_com src="'+COM_IMG2[a]+'"></div>';
					}catch(e){}
					html_esp+='<div id="espacio"><br>';
					html_esp+='</div>';
				 $("#contendor_contenido").html(html_esp);
     }
  }
}else
{
	setTimeout("loadComercioDetalleID(id_comercio);",500);
}
		  															
		  															
		  													
}
function getDatosComercio(id_comercio)// a WS
{
	
	//titulo_div

	comercio_detalle=Array();
	
	var pl = new SOAPClientParameters();	
			
     SOAPClient.invoke(_wsUrl, "getComercios", pl, true, function(_respuesta) {
                           //alert("tick:"+JSON.stringify(_respuesta)); 
                           var _numResultados = _respuesta.resultado.length;
                           if(_respuesta.error==0)
                           {
                           		for (i = 0; i<_numResultados; i++) {                                 
		  														if(_respuesta.resultado[i].id==id_comercio)
		  														{
		  															comercio_detalle[0]=_respuesta.resultado[i].id;
		  															comercio_detalle[1]=_respuesta.resultado[i].nombre;
		  															comercio_detalle[2]=_respuesta.resultado[i].direccion;
		  															try
		  															{
		  																comercio_detalle[3]=_respuesta.resultado[i].descripcion;
		  															}catch(e){comercio_detalle[3]="No hay descripcion disponible";}
		  															comercio_detalle[4]=_respuesta.resultado[i].telefono;
		  															comercio_detalle[5]=_respuesta.resultado[i].fax;
		  															comercio_detalle[6]=_respuesta.resultado[i].email;
		  															
		  															
		  															
		  														}
		  												}
		  												
                           }
     });
     
     
}
function loadComerciosWS()
{
	comercio_detalle=Array();
	
	var pl = new SOAPClientParameters();	
			
     SOAPClient.invoke(_wsUrl, "getComercios", pl, true, function(_respuesta) {
                           //alert("tick:"+JSON.stringify(_respuesta)); 
                           var _numResultados = _respuesta.resultado.length;
                           if(_respuesta.error==0)
                           {
                           	delComerciosBD();
                           		for (i = 0; i<_numResultados; i++) {
                           			try
		  															{
		  																var descrip=_respuesta.resultado[i].descripcion;
		  																if(descrip==null)
		  																{
		  																	descrip="No hay descripcion disponible";
		  																}
		  															}catch(e){var descrip="No hay descripcion disponible";}
		  																try
		  															{
		  																var logo=$.trim(_respuesta.resultado[i].logo.urlFormateada);
		  															}catch(e){var logo="";}
		  															try
		  															{
		  																var img1=_respuesta.resultado[i].imagenes[0].urlFormateada;
		  															}catch(e){var img1="";}
		  															try
		  															{
		  																var img2=_respuesta.resultado[i].imagenes[1].urlFormateada;
		  															}catch(e){var img2="";}
                           					addComerciosBD(_respuesta.resultado[i].id,_respuesta.resultado[i].nombre,_respuesta.resultado[i].direccion, descrip,_respuesta.resultado[i].telefono,_respuesta.resultado[i].email,_respuesta.resultado[i].fax,_respuesta.resultado[i].web,logo, img1, img2);                                 
                           					
		  														
		  														
		  												}
		  												
                           }
     });
     
	
}