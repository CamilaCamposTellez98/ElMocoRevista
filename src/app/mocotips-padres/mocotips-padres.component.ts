import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NoticiasService } from '../services/noticias.service';
import { Noticias } from '../models/noticias';
import { ResizedEvent } from 'angular-resize-event';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mocotips-padres',
  templateUrl: './mocotips-padres.component.html',
  styleUrls: ['./mocotips-padres.component.css']
})
export class MocotipsPadresComponent implements OnInit {
  bannerClass = 'structure-news-selected';
  smallNewsStyles : string[] = ['new-top-design-new','new-top-design-science','new-top-design-art','new-top-design-fun', 'new-top-design-find']; 
  smallNewsLogoStyles : string[] = ['new-top-moco-design-new','new-top-moco-design-science','new-top-moco-design-art','new-top-moco-design-fun', 'new-top-moco-design-find']; 
  principalMenu = true;
  photo = "./../../assets/images/Barrafranjas_Header.png";
  newsPhoto = "./../../assets/images/NoticiaTrump.png";

  newsPhoto2 = "./../../assets/images/Imagen_PlanetaGigante.png";
  newsPhoto3 = "./../../assets/images/Noticia_Arte.png";
  newsPhoto4 = "./../../assets/images/Noticia_Ocio.png";
  newsPhoto5 = "./../../assets/images/Noticia_Descubre.png";

  userPicture : string = "";
  userName : string = "";
  Moconauta : string = "MOCONAUTA ";
  Ingreso : string = "INGRESO";

  noticiasListFind: Noticias[];
  noticias25List: Noticias[];

  anteriores: boolean = false;
  siguientes: boolean = false;
  pibote : string = "";
  seccionActual : string = "";

  width: number;
  height: number;
  hidden1 : string = "hidden";
  secondNews : string;

  noticiasPagina2Existe: boolean;
  noticiasPagina3Existe: boolean;

  arrayIndexNoticia : number[] = [0, 1, 2, 3, 4, 5, 6, 7];
  arrayVisibility : string[] = ["", "", "", "", "", "", "", ""];
  arrayDisplay : string[] = ["", "", "", "", "", "", "", ""];
  piboteNoticias : number;
  arrayPibotes : string [] = [];

  piboteSiguiente : string = "";
  piboteAnterior : string = "";

  noticiasTitulo: string[] = ["", "", "", "", "", "", "", ""];
  noticiasImage: string[] = ["", "", "", "", "", "", "", ""];
  noticiasKey: string[] = ["", "", "", "", "", "", "", ""];
  noticiasParamsSection : string[] = ["Mocotips", "Mocotips", "Mocotips", "Mocotips", "Mocotips", "Mocotips", "Mocotips", "Mocotips"];

  contadorPaginas: number[] = [];
  colorPaginas: string[] = [];

  photoColor = "249, 250, 248, 0.719";


  constructor(private cookie: CookieService, public noticiasService: NoticiasService, public router: Router) { }

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

   this.search25News("mocotips");
  }

  search25News(seccion : string){
    this.anteriores = false;
    this.siguientes = false;
    this.colorPaginas[0]="rgb(11, 61, 10)";
    this.noticiasService.getFirst25News(seccion).snapshotChanges().subscribe(item => {
      var lengthItem = item.length;
      this.piboteNoticias = lengthItem - 1;
      var contador = 0;
      this.noticias25List = [];
      item.forEach(element => {
        let x = element.payload.toJSON();
        x["$key"] = element.key;
        this.noticias25List.push(x as Noticias);
          this.noticiasTitulo[lengthItem - 1] = this.noticias25List[contador].tittle;
          this.noticiasImage[lengthItem - 1] = this.noticias25List[contador].principalImage;
          this.noticiasKey[lengthItem - 1] = this.noticias25List[contador].$key;    
        contador++;
        lengthItem--;
      })
      if (this.noticias25List.length > 0) {
        this.contadorPaginas[0] = 1;
        this.noticiasPagina2Existe = false;
        this.noticiasPagina3Existe = false;
      }
      if (this.noticias25List.length > 8) {
        this.noticiasPagina2Existe = true;
        this.noticiasPagina3Existe = false;
        this.contadorPaginas[1] = 2;
      }
      if (this.noticias25List.length > 16) {
        this.noticiasPagina3Existe = true;
        this.contadorPaginas[2] = 3;
      }
      if (this.noticias25List.length > 24) {
        this.siguientes = true;
        this.pibote = this.noticiasKey[24];        
        this.piboteSiguiente = this.noticiasKey[24];
        this.piboteAnterior = this.noticiasKey[24];
       

        this.seccionActual = seccion;
      }
      console.log(this.noticiasTitulo)
      this.changePage(1)
    });
  }

  search25NewsSiguientes(direccion : string){
    
    if(direccion === "siguientes"){
   
      this.anteriores = false;
      this.siguientes = false;
  
      this.colorPaginas[0]="rgb(11, 61, 10)";
      this.noticiasService.get25News(this.seccionActual, this.piboteSiguiente).snapshotChanges().subscribe(item => {
        var lengthItem = item.length;
        this.piboteNoticias = lengthItem - 1;
        var contador = 0;
        this.noticias25List = [];
       
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.noticias25List.push(x as Noticias);
            this.noticiasTitulo[lengthItem - 1] = this.noticias25List[contador].tittle;
            this.noticiasImage[lengthItem - 1] = this.noticias25List[contador].principalImage;
            this.noticiasKey[lengthItem - 1] = this.noticias25List[contador].$key;    
          contador++;
          lengthItem--;
        })
        if (this.noticias25List.length > 0) {
          this.anteriores = true;
          this.contadorPaginas[0] = this.contadorPaginas[0] + 3;
          this.noticiasPagina2Existe = false;
          this.noticiasPagina3Existe = false;
          this.piboteAnterior = this.noticiasKey[0];
        }
        if (this.noticias25List.length > 8) {
          this.noticiasPagina2Existe = true;
          this.noticiasPagina3Existe = false;
          this.contadorPaginas[1] = this.contadorPaginas[0] + 1;
          this.piboteAnterior = this.noticiasKey[0];
        }
        if (this.noticias25List.length > 16) {
          this.noticiasPagina3Existe = true;
          this.contadorPaginas[2] = this.contadorPaginas[0] + 2;
          this.piboteAnterior = this.noticiasKey[0];
        }
        if (this.noticias25List.length > 24) {
        
         
          this.siguientes = true;
          this.pibote = this.noticiasKey[24];
          this.piboteSiguiente = this.noticiasKey[24];
          this.piboteAnterior = this.noticiasKey[0];
        
          this.seccionActual = this.seccionActual;
        }
       
        this.changePage(1)
      });
    }

    else if (direccion === "anteriores"){
      this.anteriores = false;
      this.siguientes = false;
  
     
      this.colorPaginas[0]="rgb(11, 61, 10)";
      this.noticiasService.getAnteriores25News(this.seccionActual, this.piboteAnterior).snapshotChanges().subscribe(item => {
        var lengthItem = item.length;
        this.piboteNoticias = lengthItem - 1;
        var contador = 0;
        this.noticias25List = [];
        
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.noticias25List.push(x as Noticias);
            this.noticiasTitulo[lengthItem - 1] = this.noticias25List[contador].tittle;
            this.noticiasImage[lengthItem - 1] = this.noticias25List[contador].principalImage;
            this.noticiasKey[lengthItem - 1] = this.noticias25List[contador].$key;    
          contador++;
          lengthItem--;
        })
        var contadorPaginas = this.contadorPaginas[0];
        if (this.noticias25List.length > 0) {
          console.log(contadorPaginas + " - 3 = "+ (contadorPaginas - 3))
          this.contadorPaginas[0] = contadorPaginas - 3;
         
          if( this.contadorPaginas[0] === 1){
            this.anteriores = false;
          }
         else{
          this.anteriores = true;
         }
          this.noticiasPagina2Existe = false;
          this.noticiasPagina3Existe = false;
        }
        if (this.noticias25List.length > 8) {
          this.noticiasPagina2Existe = true;
          this.noticiasPagina3Existe = false;
          console.log(contadorPaginas + " - 3 = "+ (contadorPaginas - 1))
          this.contadorPaginas[1] = contadorPaginas - 2;
        }
        if (this.noticias25List.length > 16) {
          this.noticiasPagina3Existe = true;
          console.log(contadorPaginas + " - 3 = "+ (contadorPaginas - 2))
          this.contadorPaginas[2] = contadorPaginas - 1;
        }
        if (this.noticias25List.length > 24) {
        
         
          this.siguientes = true;
          this.pibote = this.noticiasKey[24];
          this.piboteSiguiente = this.noticiasKey[24];
         
          this.seccionActual = this.seccionActual;
           this.piboteAnterior = this.noticiasKey[0];
          
        }
       
        this.changePage(1)
      });
    }
  }
  redirectTo(){
    this.router.navigate(['/home'])
    .then(() => {
      window.location.reload();
    });
  }
  changePage(section: number) {
    var index : number;
    var piboteTemporal;
    if (section === 1) {
      index = 0;
      piboteTemporal = this.piboteNoticias;
      this.colorPaginas[0]="rgb(11, 61, 10)";
      this.colorPaginas[1]="";
      this.colorPaginas[2]="";
    }
    else if (section === 2) {
      index = 8;
      piboteTemporal = this.piboteNoticias - 8;
      this.colorPaginas[0]="";
      this.colorPaginas[1]="rgb(11, 61, 10)";
      this.colorPaginas[2]="";
    }
    else if (section === 3) {
    index = 16;
    piboteTemporal = this.piboteNoticias - 16;
    this.colorPaginas[0]="";
    this.colorPaginas[1]="";
    this.colorPaginas[2]="rgb(11, 61, 10)";
    }
    for( var x = 0; x <= 7; x++){
      this.arrayIndexNoticia[x] = index;
     if( x > piboteTemporal ){
      this.arrayVisibility[x] = "hidden";
     }
     else {
      this.arrayVisibility[x] = "visible";
     }
      index++;
    }
    if(this.arrayVisibility[4] === "hidden"){
      this.secondNews = "none";
    }
    else if(this.arrayVisibility[4] === "visible"){
      this.secondNews = "";
    }
    this.verificarAnchura();
  }
  verificarAnchura(){
    if(this.width < 670){
      console.log(this.width +" <")
      for( var x = 0; x <= 7; x++){   
        if(this.arrayVisibility[x] === "hidden"){
          this.arrayDisplay[x] = "none";
        }
        else if(this.arrayVisibility[x] === "visible"){
          this.arrayDisplay[x] = "";
        }
      }   
    }
    else if(this.width > 670){
      console.log(this.width+" >")
      for( var x = 0; x <= 7; x++){    
        if(this.arrayDisplay[x] === "none"){
          this.arrayDisplay[x] = "";
        }
      }
    }
  }
  onResized(event: ResizedEvent) {
  // console.log("Entro a width")
    this.width = event.newWidth;
    this.verificarAnchura();
  }

  
}
