import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-revista-trimestral',
  templateUrl: './revista-trimestral.component.html',
  styleUrls: ['./revista-trimestral.component.css']
})
export class RevistaTrimestralComponent implements OnInit {

  userPicture : string = "";
  userName : string = "";
  Moconauta : string = "MOCONAUTA ";
  Ingreso : string = "INGRESO";

  bannerClass = 'structure-news-selected';
  photo = "./../../assets/images/Backround_Lines.jpg";
  eje_top: string[] = ['0rem', '15rem', '30rem', '45rem'];
  eje_top_descripcion: string[] = ['8rem', '23rem', '38rem', '53rem'];
  imagenes_elementos1columna : string[] = ["./../../assets/images/HurgaDatos.png"]; //prueba, luego tomara los datos del storgae
  imagenes_elementos2columna : string[] = ["./../../assets/images/EcoMoco.png"]; //prueba, luego tomara los datos del storgae
  descripcion_elementos1columna : string[] = ['Datos raros sobre distintos temas para alimentar la mente curiosa de un niño ']; //prueba, luego tomara los datos del storgae
  descripcion_elementos2columna : string[] = ['Encontrarás tips e historias para despertar una conciencia ecológica']; //prueba, luego tomara los datos del storgae
  revista_elementos: number[] = [];
  elementos : number;
  top_medida : number;


  images = ["./../../assets/images/Revista_Banner.png", "./../../assets/images/Revista_Banner.png", "./../../assets/images/Revista_Banner.png"];
  constructor(private cookie: CookieService, public router: Router) { }

  ngOnInit(): void {
    var cookie = this.cookie.check("username");
    if(cookie === true){
     this.userPicture =  this.cookie.get("image");
     this.userName =  this.cookie.get("username");
     this.Ingreso = "CERRAR SESIÓN"
     this.Moconauta =  this.cookie.get("username").toUpperCase()+" ";
    }
    else{
      this.userPicture = "./../../assets/images/Boton_Moconauta.png";
    }
    this.elementos = 4;
    for(let i = 0; i <this.elementos; i++){
      this.revista_elementos.push(i);
      this.top_medida = i + 1;
      this.eje_top.push(i+'9rem');
    } 

    console.log("medidas: :v");
    console.log(this.eje_top);
  }
  primeraColumna(number : any) {
    
    if(number==0){
      let styles = {
        'top': this.eje_top[0],
        'background-image': 'url('+this.imagenes_elementos1columna[number]+')'
      };   
      console.log( 'background-image: '+ this.imagenes_elementos1columna[number]) ;
      return styles;
    }
    else{
      let styles = {
        'top': this.eje_top[number],
        'background-color': 'lawngreen'
      };
      return styles;     
    }
  }
  segundaColumna(number : any) {
    
    if(number==0){
      let styles = {
        'top': this.eje_top[0],
        'right': '10%',
        'background-image': 'url('+this.imagenes_elementos2columna[number]+')'

      };    
      return styles;
    }
    else{
      let styles = {
        'top': this.eje_top[number],
        'right': '10%',
        'background-color': 'lawngreen'
      };
      return styles;     
    }
  }
  redirectRevista() {
    var revista = window.open(
      'https://mocoshop.mx/producto/la-locura/',
    );
    if (revista.focus) {
      revista.focus();
    }
    return false;
  }

  primeraColumnaDescripcion(number : any) {
    
    if(number==0){
      let styles = {
        'top': this.eje_top_descripcion[0],  
      };   
      return styles;
    }
    else{
      let styles = {
        'top': this.eje_top_descripcion[number],
        'background-color': 'pink'
      };
      return styles;     
    }
  }
  segundaColumnaDescripcion(number : any) {
    
    if(number==0){
      let styles = {
        'top': this.eje_top_descripcion[0],
        'right': '0%'
      };    
      return styles;
    }
    else{
      let styles = {
        'top': this.eje_top_descripcion[number],
        'right': '0%',
        'background-color': 'pink'
      };
      return styles;     
    }
  }
  copiarEnlace(){
    let url = "revista@elmoco.com.mx"
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    window.alert("¡Correo copiado en portapapeles! Escríbenos un correo.");


    var mail = window.open(
      'mailto:revista@elmoco.com.mx?subject=¿Cómo%20anunciarse%20en%20el%20moco?'
    );
    if (mail.focus) {
      mail.focus();
    }
    return false; 
    
  }
  redirectTo(){
    this.router.navigate(['/home'])
    .then(() => {
      window.location.reload();
    });
  }
}
/* 

top:1rem;
right: 0%;



top:1rem;
left: 0%;

*/