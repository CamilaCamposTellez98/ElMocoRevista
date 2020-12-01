import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
@Component({
  selector: 'app-contactanos',
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.css']
})
export class ContactanosComponent implements OnInit {


  userPicture : string = "";
  userName : string = "";
  Moconauta : string = "MOCONAUTA ";
  Ingreso : string = "INGRESO";
  correoEnviado : boolean = true;

  bannerClass = 'structure-news-selected';
  photo = "./../../assets/images/Backround_Lines.jpg";
  
  constructor(private cookie: CookieService, public router: Router) { }

  ngOnInit(): void {
    this.correoEnviado = false;
   
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
    this.correoEnviado = true;
  }
  redirectTo(){
    this.router.navigate(['/home'])
    .then(() => {
      window.location.reload();
    });
  }
  public sendEmail(e: Event) {
    e.preventDefault();
    emailjs.sendForm('service_13guwoc', 'template_c71563d', e.target as HTMLFormElement, 'user_OiZtB86H8xEdOTWVlLdXy')
      .then((result: EmailJSResponseStatus) => {
      }, (error) => {
      }); 
     this.correoEnviado = false; 
  }
  QuitMessage(){
    this.correoEnviado = true; 
  }
}
//serviceID: service_13guwoc, templateID: template_c71563d, userID: user_OiZtB86H8xEdOTWVlLdXy