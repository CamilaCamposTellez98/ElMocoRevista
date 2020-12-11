import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ResizedEvent } from 'angular-resize-event';
@Component({
  selector: 'app-suscribete',
  templateUrl: './suscribete.component.html',
  styleUrls: ['./suscribete.component.css']
})
export class SuscribeteComponent implements OnInit {
  userPicture : string = "";
  userName : string = "";
  Moconauta : string = "MOCONAUTA ";
  Ingreso : string = "INGRESO";

  porcentajeTop: number;
  width: number;
  heigth: number;
  left: number;
  constructor( public router: Router, private cookie: CookieService) { }

  ngOnInit(): void {
    let cookie = this.cookie.check("username");
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
  onResizedPhoto(event: ResizedEvent) {
    this.width = event.newHeight;
    let square = this.width / 2;
    let form = this.heigth / 2;
    this.left = form - square;
    console.log("width: "+this.width)
    console.log("middle: "+square)
    console.log("left:"+ this.left + " " + form + " - " + square)
  }
  onResizedForm(event: ResizedEvent) {
    console.log("ola")
    this.heigth = event.newWidth;
    let square = this.width / 2;
    let form = this.heigth / 2;
    this.left = form - square;
  }
}
