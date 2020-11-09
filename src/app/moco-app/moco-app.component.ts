import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-moco-app',
  templateUrl: './moco-app.component.html',
  styleUrls: ['./moco-app.component.css']
})
export class MocoAppComponent implements OnInit {

  userPicture : string = "";
  userName : string = "";
  Moconauta : string = "MOCONAUTA ";
  Ingreso : string = "INGRESO"

  bannerClass = 'structure-news-selected';
  photo = "./../../assets/images/Backround_Lines.jpg";
  
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
  }
  redirectTo(){
    this.router.navigate(['/home'])
    .then(() => {
      window.location.reload();
    });
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

  
}
