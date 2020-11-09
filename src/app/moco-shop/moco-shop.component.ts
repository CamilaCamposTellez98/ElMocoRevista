import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-moco-shop',
  templateUrl: './moco-shop.component.html',
  styleUrls: ['./moco-shop.component.css']
})
export class MocoShopComponent implements OnInit {

  userPicture : string = "";
  userName : string = "";
  Moconauta : string = "MOCONAUTA ";
  Ingreso : string = "INGRESO";

  photo = "./../../assets/images/Barrafranjas_Header.png";
  bannerClass = 'structure-news-selected';
  constructor(private cookie: CookieService) { }

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

}
