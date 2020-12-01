import { Component, OnInit, ApplicationRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoticiasService } from '../services/noticias.service';
import { Noticias } from '../models/noticias';
import { noticiasNodoGeneral } from '../models/noticiasNodoGeneral';
import { NoticiasNavar } from '../models/noticias-navar';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { ResizedEvent } from 'angular-resize-event';
import { CookieService } from 'ngx-cookie-service';
import { especialDelMes } from '../models/especialDelMes';
import { patrocinadores } from '../models/patrocinadores'
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userPicture : string = "";
  userName : string = "";
  Moconauta : string = "MOCONAUTA ";
  Ingreso : string = "INGRESO";

  noticiasList: Noticias[];
  noticiasNodoGeneralList: noticiasNodoGeneral[];

  noticiasListScience: Noticias[];
  noticiasListNews: Noticias[];
  noticiasListArt: Noticias[];
  noticiasListFun: Noticias[];
  noticiasListFind: Noticias[];
  
  patrocinadoresList: patrocinadores[];
  patrocinador1 : boolean = false;
  patrocinador2 : boolean = false;
  patrocinador3 : boolean = false;
  patrocinador4 : boolean = false;

  patrocinador1Image : string = "";
  patrocinador2Image : string = "";
  patrocinador3Image : string = "";
  patrocinador4Image : string = "";

  patrocinador1Url : string = "";
  patrocinador2Url : string = "";
  patrocinador3Url : string = "";
  patrocinador4Url : string = "";

  carousel : boolean;

  especialDelMes : especialDelMes[];

  noticias25List: Noticias[];

  publicacionesEnTurno: number[] = [0, 1, 2, 3, 4, 5, 6, 7];

  noticiasTitulo: string[] = ["", "", "", "", "", "", "", ""];
  noticiasImage: string[] = ["", "", "", "", "", "", "", ""];
  noticiasKey: string[] = ["", "", "", "", "", "", "", ""];
  noticiasParamsSection : string[] = ["", "", "", "", "", "", "", ""];


  arrayIndexNoticia : number[] = [0, 1, 2, 3, 4, 5, 6, 7];
  arrayVisibility : string[] = ["", "", "", "", "", "", "", ""];
  arrayDisplay : string[] = ["", "", "", "", "", "", "", ""];
  piboteNoticias : number;
  arrayPibotes : string [] = [];

  piboteSiguiente : string = "";
  piboteAnterior : string = "";

  width: number;
  height: number;
  hidden1 : string = "hidden";
  secondNews : string;

  noticiasPagina2Existe: boolean;
  noticiasPagina3Existe: boolean;

  contadorPaginas: number[] = [];
  colorPaginas: string[] = [];

  anteriores: boolean = false;
  siguientes: boolean = false;
  pibote : string = "";
  seccionActual : string = "";

  newstittleNew: string = "";
  newstittleScience: string = "";
  newstittleArt: string = "";
  newstittleFun: string = "";
  newstittleFind: string = "";

  newsImageNew: string = "";
  newsImageScience: string = "";
  newsImageArt: string = "";
  newsImageFun: string = "";
  newsImageFind: string = "";

  bannerImage: string = "";
  imagenPrincipal : string = "";
  bannerFranja: string = "";
  bannerHover: string = "";
  bannerTittle: string = "";
  bannerPhrase: string = "";
  bannerKey : string = "";
  bannerSeccion : string = "";
  bannerRouterLink : string = "";

  especialDelMesPortada1 : string = "";
  especialDelMesPortada2 : string = "";
  portadaEspecialDelMes : string;
  especialDelMesID : string = "";

  seccionPrincipal = "";



  newsKey: string = "";
  scienceKey: string = "";
  artKey: string = "";
  funKey: string = "";
  findKey: string = "";

  bannerClass = 'structure';
  smallNewsStyles: string[] = ['new-top-design-new', 'new-top-design-science', 'new-top-design-art', 'new-top-design-fun', 'new-top-design-find'];
  smallNewsLogoStyles: string[] = ['new-top-moco-design-new', 'new-top-moco-design-science', 'new-top-moco-design-art', 'new-top-moco-design-fun', 'new-top-moco-design-find'];
  hoverStyles: string[] = ['read-orange-hover', 'read-blue-hover', 'read-pink-hover', 'read-yellow-hover', 'read-purple-hover'];
  principalMenu = true;
  photo = "./../../assets/images/Barrafranjas_Header.png";
  newsPhoto = "./../../assets/images/NoticiaTrump.png";

  newsPhoto2 = "./../../assets/images/Imagen_PlanetaGigante.png";
  newsPhoto3 = "./../../assets/images/Noticia_Arte.png";
  newsPhoto4 = "./../../assets/images/Noticia_Ocio.png";
  newsPhoto5 = "./../../assets/images/Noticia_Descubre.png";

  newsPhotoPatron1 = "./../../assets/images/Patrocinador_Translimita.png";
  newsPhotoPatron2 = "./../../assets/images/Patrocinador_Educando.png";

  queryParam: string = 'blank';


  photoColor = "149, 207, 12, 0.719";


  constructor(private activatedRoute: ActivatedRoute, public router: Router, public noticiasService: NoticiasService, private cookie: CookieService, public appRef: ApplicationRef) { }

  ngOnInit(): void {
   
    this.carousel = true;
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
    this.noticiasService.getLastEspeciaDelMes().snapshotChanges().subscribe(item => {
      this.especialDelMes = [];
      item.forEach(element => {
        let x = element.payload.toJSON();
        x["$key"] = element.key;
        this.especialDelMes.push(x as especialDelMes);
        this.especialDelMesPortada1 = this.especialDelMes[0].portada1;
        this.especialDelMesPortada2 = this.especialDelMes[0].portada2;
        this.portadaEspecialDelMes = this.especialDelMesPortada1;
        this.portadaEspecialDelMes = this.especialDelMesPortada2;
        this.portadaEspecialDelMes = this.especialDelMesPortada1;
        this.especialDelMesID = this.especialDelMes[0].$key;
      })
    });
    this.noticiasService.getPatrocinadores().snapshotChanges().subscribe(item => {
      this.patrocinadoresList = [];
        item.slice().reverse().forEach(element => {
          let json = element.payload.toJSON();
          json["$key"] = element.key;
          this.patrocinadoresList.push(json as patrocinadores);
        });
      
      if(this.patrocinadoresList[0].patrocinador1Image !== ""){
        this.patrocinador1 = true;
        this.patrocinador1Image = this.patrocinadoresList[0].patrocinador1Image;
        this.patrocinador1Url = this.patrocinadoresList[0].patrocinador1Url;
      }
      if(this.patrocinadoresList[0].patrocinador2Image !== ""){
        this.patrocinador2 = true;
        this.patrocinador2Image = this.patrocinadoresList[0].patrocinador2Image;
        this.patrocinador2Url = this.patrocinadoresList[0].patrocinador2Url;
      }
      if(this.patrocinadoresList[0].patrocinador3Image !== ""){
        this.patrocinador3 = true;
        this.patrocinador3Image = this.patrocinadoresList[0].patrocinador3Image;
        this.patrocinador3Url = this.patrocinadoresList[0].patrocinador3Url;
      }
      if(this.patrocinadoresList[0].patrocinador4Image !== ""){
        this.patrocinador4 = true;
        this.patrocinador4Image = this.patrocinadoresList[0].patrocinador4Image;
        this.patrocinador4Url = this.patrocinadoresList[0].patrocinador4Url;
      }
      this.appRef.tick();
    });
  
    this.activatedRoute.queryParams.subscribe(params => {
      this.queryParam = params['news'];
      if (this.queryParam === 'noticias') {
        this.noticiasParamsSection  = ["noticias", "noticias", "noticias", "noticias", "noticias", "noticias", "noticias", "noticias"];
        this.changeSection("N");
      }
      else if (this.queryParam === 'ciencia') {     
        this.changeSection("C")
        this.noticiasParamsSection  = ["ciencia", "ciencia", "ciencia", "ciencia", "ciencia", "ciencia", "ciencia", "ciencia"];
      }
      else if (this.queryParam === 'arte') {
        this.changeSection("A")
        this.noticiasParamsSection  = ["arte", "arte", "arte", "arte", "arte", "arte", "arte", "arte"];
      }
      else if (this.queryParam === 'ocio') {
        this.changeSection("O") 
        this.noticiasParamsSection  = ["ocio", "ocio", "ocio", "ocio", "ocio", "ocio", "ocio", "ocio"];
      }
      else if (this.queryParam === 'descubre') {
        this.changeSection("D")
        this.noticiasParamsSection  = ["descubre", "descubre", "descubre", "descubre", "descubre", "descubre", "descubre", "descubre"];
      }
      else{
        this.changeSection("M")
        this.bannerRouterLink = "news";
        this.noticiasParamsSection  = ["noticias", "ciencia", "arte", "ocio", "descubre", "", "", ""];
        var contador = 0;
        var contadorFirebase = 10;
        var contadorArray =  0;
       
        this.noticiasService.getAllNewsNodoGeneral(contadorFirebase).snapshotChanges().subscribe(item => {
          this.noticiasNodoGeneralList = [];
          item.slice().reverse().forEach(element => {
            let json = element.payload.toJSON();
            json["$key"] = element.key;
            this.noticiasNodoGeneralList.push(json as noticiasNodoGeneral);


            if(contador === 9){

              for(var x = 0; x <=9; x++){   
               
                if(this.noticiasNodoGeneralList[x].seccion!=="Mocotips"){
                  contadorArray = x;
                  break;
                }

              }
           
            this.seccionPrincipal = this.noticiasNodoGeneralList[contadorArray].seccion;

            if (this.seccionPrincipal === "Noticias") {
          
              this.noticiasService.getLastNoticeNew().snapshotChanges().subscribe(item => {
                this.noticiasListNews = [];
                item.forEach(element => {
                  let x = element.payload.toJSON();
                  x["$key"] = element.key;
                  this.noticiasListNews.push(x as Noticias);
                  this.bannerImage = this.noticiasListNews[0].principalImage;
                  this.imagenPrincipal = this.noticiasListNews[0].principalImage;
                  this.bannerFranja = "franja-new";
                  this.bannerHover = "image-hover-news";
                  this.bannerTittle = this.noticiasListNews[0].tittle;
                  this.bannerKey = this.noticiasListNews[0].$key;
                  this.bannerSeccion = 'noticias'
                  var moreThanLimit = this.noticiasListNews[0].phrase.length-7;
                  var limitatedPhrase = this.noticiasListNews[0].phrase.substring(3, 120);
                  var limitLength = limitatedPhrase.length;
                  var limitatedPhrase = limitatedPhrase.substring(0, limitLength-4);
                  if( moreThanLimit > 120){
                    this.bannerPhrase = limitatedPhrase + " ... leer más";
                  }
                  else if( moreThanLimit < 120 ){
                    this.bannerPhrase = limitatedPhrase; 
                  }
                })
              });
            }
            else if (this.seccionPrincipal === "Ciencia") {
              this.noticiasService.getLastScienceNew().snapshotChanges().subscribe(item => {
                this.noticiasListScience = [];
                item.forEach(element => {
                  let x = element.payload.toJSON();
                  x["$key"] = element.key;
                  this.noticiasListScience.push(x as Noticias);
                  this.bannerImage = this.noticiasListScience[0].principalImage;
                  this.imagenPrincipal = this.noticiasListScience[0].principalImage;
                  this.bannerFranja = "franja-science";
                  this.bannerHover = "image-hover-science";
                  this.bannerTittle = this.noticiasListScience[0].tittle;
                  this.bannerKey = this.noticiasListScience[0].$key;
                  this.bannerSeccion = 'ciencia';
                  var moreThanLimit = this.noticiasListScience[0].phrase.length-7;
                  var limitatedPhrase = this.noticiasListScience[0].phrase.substring(3, 120);
                  var limitLength = limitatedPhrase.length;
                  var limitatedPhrase = limitatedPhrase.substring(0, limitLength-4);
                  if( moreThanLimit > 120){
                    this.bannerPhrase = limitatedPhrase + " ... leer más";
                  }
                  else if( moreThanLimit < 120 ){
                    this.bannerPhrase = limitatedPhrase; 
                  }
                })
              });
            }
            else if (this.seccionPrincipal === "Arte") {
              this.noticiasService.getLastArtNew().snapshotChanges().subscribe(item => {
                this.noticiasListArt = [];
                item.forEach(element => {
                  let x = element.payload.toJSON();
                  x["$key"] = element.key;
                  this.noticiasListArt.push(x as Noticias);
                  this.bannerImage = this.noticiasListArt[0].principalImage;
                  this.imagenPrincipal = this.noticiasListArt[0].principalImage;
                  this.bannerFranja = "franja-art";
                  this.bannerHover = "image-hover-art";
                  this.bannerTittle = this.noticiasListArt[0].tittle;
                  this.bannerKey = this.noticiasListArt[0].$key;
                  this.bannerSeccion = 'arte';
                  var moreThanLimit = this.noticiasListArt[0].phrase.length-7;
                  var limitatedPhrase = this.noticiasListArt[0].phrase.substring(3, 120);
                  var limitLength = limitatedPhrase.length;
                  var limitatedPhrase = limitatedPhrase.substring(0, limitLength-4);
                  if( moreThanLimit > 120){
                    this.bannerPhrase = limitatedPhrase + " ... leer más";
                  }
                  else if( moreThanLimit < 120 ){
                    this.bannerPhrase = limitatedPhrase; 
                  }
                })
              });
            }
            else if (this.seccionPrincipal === "Ocio") {
              this.noticiasService.getLastFunNew().snapshotChanges().subscribe(item => {
                this.noticiasListFun = [];
                item.forEach(element => {
                  let x = element.payload.toJSON();
                  x["$key"] = element.key;
                  this.noticiasListFun.push(x as Noticias);
                  this.bannerImage = this.noticiasListFun[0].principalImage;
                  this.imagenPrincipal = this.noticiasListFun[0].principalImage;
                  this.bannerFranja = "franja-fun";
                  this.bannerHover = "image-hover-fun";
                  this.bannerTittle = this.noticiasListFun[0].tittle;
                  this.bannerKey = this.noticiasListFun[0].$key;
                  this.bannerSeccion = 'ocio';
                  var moreThanLimit = this.noticiasListFun[0].phrase.length-7;
                  var limitatedPhrase = this.noticiasListFun[0].phrase.substring(3, 120);
                  var limitLength = limitatedPhrase.length;
                  var limitatedPhrase = limitatedPhrase.substring(0, limitLength-4);
                  if( moreThanLimit > 120){
                    this.bannerPhrase = limitatedPhrase + " ... leer más";
                  }
                  else if( moreThanLimit < 120 ){
                    this.bannerPhrase = limitatedPhrase; 
                  }
                })
              });
            }
            else if (this.seccionPrincipal === "Descubre") {
           
              this.noticiasService.getLastFindNew().snapshotChanges().subscribe(item => {
                this.noticiasListFind = [];
                item.forEach(element => {
                  let x = element.payload.toJSON();
                  x["$key"] = element.key;
                  this.noticiasListFind.push(x as Noticias);
                  this.bannerImage = this.noticiasListFind[0].principalImage;
                  this.imagenPrincipal = this.noticiasListFind[0].principalImage;
                  this.bannerFranja = "franja-find";
                  this.bannerHover = "image-hover-find";
                  this.bannerTittle = this.noticiasListFind[0].tittle;
                  this.bannerKey = this.noticiasListFind[0].$key;
                  this.bannerSeccion = 'descubre';
                  var moreThanLimit = this.noticiasListFind[0].phrase.length-7;
                  var limitatedPhrase = this.noticiasListFind[0].phrase.substring(3, 120);
                  var limitLength = limitatedPhrase.length;
                  var limitatedPhrase = limitatedPhrase.substring(0, limitLength-4);
                  if( moreThanLimit > 120){
                    this.bannerPhrase = limitatedPhrase + " ... leer más";
                  }
                  else if( moreThanLimit < 120 ){
                    this.bannerPhrase = limitatedPhrase; 
                  }
                })
              });
            }
            else if (this.seccionPrincipal === "Mocotips") {
          
            }
          }
      
          contador++;
          });
        
          
       
        
        });
       
      
      
      


        this.get5LastNotes();
      }

    });

    
  }

  changeSection(section: string) {
    if (section === "N") { /* NOTICIAS */
      this.search25News("noticias");
      this.bannerClass = 'structure-news-selected';
      this.principalMenu = false;
      this.smallNewsStyles = ['new-top-design-new', 'new-top-design-new', 'new-top-design-new', 'new-top-design-new', 'new-top-design-new'];
      this.smallNewsLogoStyles = ['new-top-moco-design-new', 'new-top-moco-design-new', 'new-top-moco-design-new', 'new-top-moco-design-new', 'new-top-moco-design-new'];
      this.hoverStyles = ['read-orange-hover', 'read-orange-hover', 'read-orange-hover', 'read-orange-hover', 'read-orange-hover'];
      this.photoColor = "249, 250, 248, 0.719";
      this.bannerImage = "./../../assets/images/noticias-new.png";
      
      this.bannerRouterLink = "";
      this.noticiasParamsSection  = ["noticias", "noticias", "noticias", "noticias", "noticias", "noticias", "noticias", "noticias"];
    }
    else if (section === "C") { /* CIENCIA */
      this.search25News("ciencia");
      this.bannerClass = 'structure-science-selected';
      this.principalMenu = false;
      this.smallNewsStyles = ['new-top-design-science', 'new-top-design-science', 'new-top-design-science', 'new-top-design-science', 'new-top-design-science'];
      this.smallNewsLogoStyles = ['new-top-moco-design-science', 'new-top-moco-design-science', 'new-top-moco-design-science', 'new-top-moco-design-science', 'new-top-moco-design-science'];
      this.hoverStyles = ['read-blue-hover', 'read-blue-hover', 'read-blue-hover', 'read-blue-hover', 'read-blue-hover'];
      this.photoColor = "249, 250, 248, 0.719";
      this.bannerImage = "./../../assets/images/Ciencia_Slide.png";
     
      this.bannerRouterLink = "";
      this.noticiasParamsSection  = ["ciencia", "ciencia", "ciencia", "ciencia", "ciencia", "ciencia", "ciencia", "ciencia"];
    }
    else if (section === "A") { /* ARTE */
      this.search25News("arte");
      this.bannerClass = 'structure-art-selected';
      this.principalMenu = false;
      this.smallNewsStyles = ['new-top-design-art', 'new-top-design-art', 'new-top-design-art', 'new-top-design-art', 'new-top-design-art'];
      this.smallNewsLogoStyles = ['new-top-moco-design-art', 'new-top-moco-design-art', 'new-top-moco-design-art', 'new-top-moco-design-art', 'new-top-moco-design-art'];
      this.hoverStyles = ['read-pink-hover', 'read-pink-hover', 'read-pink-hover', 'read-pink-hover', 'read-pink-hover'];
      this.photoColor = "249, 250, 248, 0.719";
      this.bannerImage = "./../../assets/images/arte-new.png";
      
      this.bannerRouterLink = "";
      this.noticiasParamsSection  = ["arte", "arte", "arte", "arte", "arte", "arte", "arte", "arte"];
    }
    else if (section === "O") { /* OCIO */
      this.search25News("ocio");
      this.bannerClass = 'structure-fun-selected';
      this.principalMenu = false;
      this.smallNewsStyles = ['new-top-design-fun', 'new-top-design-fun', 'new-top-design-fun', 'new-top-design-fun', 'new-top-design-fun'];
      this.smallNewsLogoStyles = ['new-top-moco-design-fun', 'new-top-moco-design-fun', 'new-top-moco-design-fun', 'new-top-moco-design-fun', 'new-top-moco-design-fun'];
      this.hoverStyles = ['read-yellow-hover', 'read-yellow-hover', 'read-yellow-hover', 'read-yellow-hover', 'read-yellow-hover'];
      this.photoColor = "249, 250, 248, 0.719";
      this.bannerImage = "./../../assets/images/ocio-new.png";
      

     
      this.bannerRouterLink = "";
      this.noticiasParamsSection  = ["ocio", "ocio", "ocio", "ocio", "ocio", "ocio", "ocio", "ocio"];

    }
    else if (section === "D") { /* DESCUBRE */
      this.search25News("descubre");
      this.bannerClass = 'structure-find-selected';
      this.principalMenu = false;
      this.smallNewsStyles = ['new-top-design-find', 'new-top-design-find', 'new-top-design-find', 'new-top-design-find', 'new-top-design-find'];
      this.smallNewsLogoStyles = ['new-top-moco-design-find', 'new-top-moco-design-find', 'new-top-moco-design-find', 'new-top-moco-design-find', 'new-top-moco-design-find'];
      this.hoverStyles = ['read-purple-hover', 'read-purple-hover', 'read-purple-hover', 'read-purple-hover', 'read-purple-hover'];
      this.photoColor = "249, 250, 248, 0.719";
      this.bannerImage = "./../../assets/images/descubre-new.png";
      
      this.bannerRouterLink = "";
      this.noticiasParamsSection  = ["descubre", "descubre", "descubre", "descubre", "descubre", "descubre", "descubre", "descubre"];
      //this.search25NewsSiguientes("descubre");
    }
    else if (section === "M") { /* HOME */
      this.get5LastNotes();
      this.bannerClass = 'structure';
      this.principalMenu = true;
      this.smallNewsStyles = ['new-top-design-new', 'new-top-design-science', 'new-top-design-art', 'new-top-design-fun', 'new-top-design-find'];
      this.smallNewsLogoStyles = ['new-top-moco-design-new', 'new-top-moco-design-science', 'new-top-moco-design-art', 'new-top-moco-design-fun', 'new-top-moco-design-find'];
      this.hoverStyles = ['read-orange-hover', 'read-blue-hover', 'read-pink-hover', 'read-yellow-hover', 'read-purple-hover'];
      this.photoColor = "149, 207, 12, 0.719";
      this.bannerImage = this.imagenPrincipal;
      this.noticiasParamsSection  = ["noticias", "ciencia", "arte", "ocio", "descubre", "", "", ""];
      
      this.bannerRouterLink = "news";
     
    }

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
          this.contadorPaginas[1] = contadorPaginas - 2;
        }
        if (this.noticias25List.length > 16) {
          this.noticiasPagina3Existe = true;
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
  get5LastNotes(){
    this.noticiasService.getLastScienceNew().snapshotChanges().subscribe(item => {
      this.noticiasListScience = [];
      item.forEach(element => {
        let x = element.payload.toJSON();
        x["$key"] = element.key;
        this.noticiasListScience.push(x as Noticias);
        this.noticiasTitulo[1] = this.noticiasListScience[0].tittle;
        this.noticiasImage[1] = this.noticiasListScience[0].principalImage;
        this.noticiasKey[1] = this.noticiasListScience[0].$key;
        this.arrayVisibility[1] = "visible"
      })
    });

    this.noticiasService.getLastNoticeNew().snapshotChanges().subscribe(item => {
      this.noticiasListNews = [];
      item.forEach(element => {
        let x = element.payload.toJSON();
        x["$key"] = element.key;
        this.noticiasListNews.push(x as Noticias);
        this.noticiasTitulo[0] = this.noticiasListNews[0].tittle;
        this.noticiasImage[0] = this.noticiasListNews[0].principalImage;
        this.noticiasKey[0] = this.noticiasListNews[0].$key;
        this.arrayVisibility[0] = "visible"
      })
    });
    this.noticiasService.getLastArtNew().snapshotChanges().subscribe(item => {
      this.noticiasListArt = [];
      item.forEach(element => {
        let x = element.payload.toJSON();
        x["$key"] = element.key;
        this.noticiasListArt.push(x as Noticias);
        this.noticiasTitulo[2] = this.noticiasListArt[0].tittle;
        this.noticiasImage[2] = this.noticiasListArt[0].principalImage;
        this.noticiasKey[2] = this.noticiasListArt[0].$key;
        this.arrayVisibility[2] = "visible"
      })
    });
    this.noticiasService.getLastFunNew().snapshotChanges().subscribe(item => {
      this.noticiasListFun = [];
      item.forEach(element => {
        let x = element.payload.toJSON();
        x["$key"] = element.key;
        this.noticiasListFun.push(x as Noticias);
        this.noticiasTitulo[3] = this.noticiasListFun[0].tittle;
        this.noticiasImage[3] = this.noticiasListFun[0].principalImage;
        this.noticiasKey[3] = this.noticiasListFun[0].$key;
        this.arrayVisibility[3] = "visible"
      })
    });
    this.noticiasService.getLastFindNew().snapshotChanges().subscribe(item => {
      this.noticiasListFind = [];
      item.forEach(element => {
        let x = element.payload.toJSON();
        x["$key"] = element.key;
        this.noticiasListFind.push(x as Noticias);
        this.noticiasTitulo[4] = this.noticiasListFind[0].tittle;
        this.noticiasImage[4] = this.noticiasListFind[0].principalImage;
        this.noticiasKey[4] = this.noticiasListFind[0].$key;
        this.arrayVisibility[4] = "visible"
      })
    });
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
  ola(){
  }
  verificarAnchura(){
    if(this.width < 670){
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
      for( var x = 0; x <= 7; x++){    
        if(this.arrayDisplay[x] === "none"){
          this.arrayDisplay[x] = "";
        }
      }
    }
  }
  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.verificarAnchura();
  }
}
