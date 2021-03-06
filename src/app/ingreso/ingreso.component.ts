import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ResizedEvent } from 'angular-resize-event';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {

  ingreso : boolean = false;
  recuperar : boolean = false;
  codigo : boolean = false;
  cambiar : boolean = false;
  logueado : boolean = false;
  height: number;
  classLogueado : string = "";
  userPicture : string = "";
  userName : string = "";
  Moconauta : string = "MOCONAUTA ";
  Ingreso : string = "INGRESO";

  emailRecovery : string = "";

  ingresoTexto : string = "Por favor ingresa tu correo y contraseña.";
  ingresoColor : string = "black";
  botonDisabled : string = "visible";

  porcentajeLeft : string;
  userData = [];
  usuario : string;
  contra : string;
  constructor(private authService: AuthService, private cookie: CookieService, public router: Router, private storage: AngularFireStorage, private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    var cookie = this.cookie.check("username");
    if(cookie === true){
     this.logueado = true;
     this.ingreso = false;
     this.recuperar = false;
     this.codigo = false;
     this.cambiar = false;
     this.classLogueado = "500px";
     this.userPicture =  this.cookie.get("image");
     this.userName =  this.cookie.get("username");
     this.Ingreso = "CERRAR SESIÓN"
     this.Moconauta =  this.cookie.get("username").toUpperCase()+" ";
    }
    else{
      this.ingreso = true;
      this.recuperar = false;
      this.codigo = false;
      this.cambiar = false;
      this.logueado = false;
      this.classLogueado = "";
      this.userPicture = "./../../assets/images/Boton_Moconauta.png";
    }
  }
  redirectTo(){
    this.router.navigate(['/home'])
    .then(() => {
      window.location.reload();
    });
  }
  openTwoLink(){
    this.router.navigate(['/suscribete']);
  }
  changeSection(section : number){
    if(section === 0){
      this.ingreso = true;
      this.recuperar = false;
      this.codigo = false;
      this.cambiar = false;
      this.emailRecovery = "";
    }
    else if(section === 1){
      this.ingreso = false;
      this.recuperar = true;
      this.codigo = false;
      this.cambiar = false;
    }
    else if(section === 2){
      this.ingreso = false;
      this.recuperar = false;
      this.codigo = true;
      this.cambiar = false;
      this.reestablecerContra();
    }
  }
  register(e: any){
    this.usuario = e.target.user_name.value;
    this.contra = e.target.pass_name.value;
    this.authService.SignOut();
    this.authService.loggeo(this.usuario, this.contra).then(r => {
      if(r.code === "auth/wrong-password" || r.code === "auth/user-not-found"){
        this.ingresoColor = "darkred";
        this.ingresoTexto = "Correo o contraseña incorrectos";
      }
      else if(r.code === "auth/invalid-email"){
        this.ingresoColor = "darkred";
        this.ingresoTexto = "Favor de usar un correo válido";
      }
      else if (r.user){
        this.ingresoColor = "green";
        this.ingresoTexto = "Cargando...";
        this.botonDisabled = "hidden";
        this.storage.storage.ref("private/users/"+r.user.uid+"/profile").getDownloadURL().then((url) => {
          this.authService.getUserData(r.user.uid).subscribe(item =>{
            this.cookie.set("image", url);
            this.cookie.set("username", item.payload.data()['user']);
            this.cookie.set("mail", this.usuario);
            this.cookie.set("name", item.payload.data()['name']);
            this.cookie.set("country", item.payload.data()['country']);
            this.cookie.set("gender", item.payload.data()['gender']);
            this.cookie.set("age", item.payload.data()['age']);
            window.location.reload(); 
          })
        }); 
      } 
      else{
        this.ingresoColor = "darkred";
        this.ingresoTexto = "Ocurrió un error, por favor inténtalo más tarde.";
      } 
    });
  }
  reestablecerContra(){
    this.authService.resetPassword(this.emailRecovery);
  }
  cerrarSesion(){
    this.cookie.deleteAll();
    this.authService.SignOut();
    window.location.reload();
  }
  suscribete(){
    this.router.navigate(['/suscripciones']);
  }
  editar(){
    this.router.navigate(['/editar-perfil']);
  }
  onResized(event: ResizedEvent) {
      this.height = event.newHeight;
      var width = event.newWidth;
      var widthNew = this.height;
      var porcentaje = (widthNew * 100) / width;
      var porcentajeFinal = (100 - porcentaje) / 2;
      this.porcentajeLeft = porcentajeFinal.toFixed(1);
    }
   
}
