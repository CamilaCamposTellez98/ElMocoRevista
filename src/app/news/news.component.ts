import { Component, OnInit, ViewEncapsulation, ɵConsole, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiasService } from '../services/noticias.service';
import { Noticias, NoticiasPlantilla6 } from '../models/noticias';
import { Meta, Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {NgxCaptchaModule,ReCaptcha2Component} from 'ngx-captcha';
import { comentariosConNoticia } from '../models/comentarios';
import { ResizedEvent } from 'angular-resize-event';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  Moconauta : string = "MOCONAUTA ";
  Ingreso : string = "INGRESO"
  userPicture : string = "";
  userName : string = "";
  nombreUsuario : string = "";

  porcentajeTop : number;
  height: number;
  comentsHeight: number;
  latestHeight: number;
  structureHeight: number;
  menuHeight: number;
  bannerHeight: number;

  comentariosAllow : boolean = false;

  MoconautaSuscribeteComentario : string = "MOCONAUTA";
  Suscribetee : string = "";
  siteKey : string = "6LdOrb4ZAAAAAJ6UhFDmj4SU2M_CiNfKsfoIfaI1"
  size : string = "normal";
  comentarioTextArea : string = "";

  comentariosList: comentariosConNoticia[];
  comentariosEliminar : string [] = [];
  numComentarios:string ="";

  aFormGroup: FormGroup;
  repCaptcha : boolean = false;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

  email : string = "";

  noticiasList: NoticiasPlantilla6[];

  bannerClass = 'structure';
  smallNewsStyles: string[] = ['new-top-design-new', 'new-top-design-science', 'new-top-design-art', 'new-top-design-fun', 'new-top-design-find'];
  smallNewsLogoStyles: string[] = ['new-top-moco-design-new', 'new-top-moco-design-science', 'new-top-moco-design-art', 'new-top-moco-design-fun', 'new-top-moco-design-find'];
  hoverStyles: string[] = ['read-orange-hover', 'read-blue-hover', 'read-pink-hover', 'read-yellow-hover', 'read-purple-hover'];
  principalMenu = true;
  photo = "./../../assets/images/Backround_Lines.jpg";
  newsPhoto = "./../../assets/images/NoticiaTrump.png";
  topLineClass: string;
  phraseClass: string;
  secondPartNotice: string;
  secondPartNotice2: string;
  secondPartNoticeRight: string;

  bannerPhoto = "./../../assets/images/noticias_trump.png"

  newstittle : string = "";

  plantilla1 : boolean = false;
  plantilla2 : boolean = false;
  plantilla3 : boolean = false;
  plantilla4 : boolean = false;
  plantilla5 : boolean = false;
  plantilla6 : boolean = false;

  youtube_url : string = '';

  newsPhoto2 = "./../../assets/images/Imagen_PlanetaGigante.png";
  newsPhoto3 = "./../../assets/images/Noticia_Arte.png";
  newsPhoto4 = "./../../assets/images/Noticia_Ocio.png";
  newsPhoto5 = "./../../assets/images/Noticia_Descubre.png";

  queryParam: string = 'blank';
  queryParamID: string = 'blank';

  phrase_new: string = '';
  autor: string = '';
  fecha : string = "";
  fechaarrary : string [];

  noticia1_new: string;
  noticia2_new: string;
  noticia3_new: string;
  noticia4_new: string;
  noticia5_new: string;
  noticia6_new: string;
  noticia7_new: string;

<<<<<<< HEAD
  appStore : string;

  seccion: string = "";
  seccion2: string = "";
=======
  seccion : string = "";
  seccion2 : string = "";
>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA

  imagen1: string;
  imagen2: string;
  imagen3: string;
  imagen4: string;
  imagen5: string;
  imagen6: string;
  imagenPrincipal: string;

  visibility1: boolean;
  visibility2: boolean;
  visibility3: boolean;

  noticias3List: Noticias[];

  noticiasTitulo: string[] = ["", "", ""];
  noticiasImage: string[] = ["", "", ""];
  noticiasKey: string[] = ["", "", ""];

    /*Variables para conocer  la fecha actual*/
    myDate: any = new Date();
    currentDate: string; //Fecha final
    currentMonth : string;
  comentarioObject = {
    $key: '',
    id_noticia: '',
    username: '',
    date: '',
    comment: '',
    userPicture: '',
    uid: ''
  }
///

  pruebita : string;
  constructor(private activatedRoute: ActivatedRoute, private afAuth: AngularFireAuth,  public noticiasService: NoticiasService, public meta: Meta, public title: Title, private cookie: CookieService, private formBuilder: FormBuilder, public router: Router) { }
  @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any>;
  ngOnInit(): void {
<<<<<<< HEAD
=======

   /* this.aFormGroup = new FormGroup({
      'recaptcha': new FormControl(null)
    }) */

>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA
    var month = this.myDate.getMonth();
    var day = this.myDate.getDate();
    var hour = this.myDate.getHours();
    var minute = this.myDate.getMinutes();
    var year = this.myDate.getFullYear();
 
    this.reverttMonths(month);
    var cookie = this.cookie.check("username");
    this.currentDate = this.currentMonth.toUpperCase() + " " + day + ", "+ year + " A LAS " + hour + ":" + minute;
    this.afAuth.auth.onAuthStateChanged((user) => {
<<<<<<< HEAD
      if (user && cookie === true) {
        this.comentariosAllow = true;
        this.MoconautaSuscribeteComentario = "¡Moconauta!";
        this.iniciaSesion = false;
        this.topComment = "28%";
        this.Suscribetee = "Queremos saber tu opinión, déjanos un comentario.";

        this.userKey = this.authService.getUid();
        if(this.userKey === "3yptKKtJeKbgkVNSvZKmOKxURHY2"){ //key de itzel
          this.deletePermisson = true;
        }
        else if(this.userKey === "P7lq9Wlxe0f8ct3dXKntD5GB3he2"){ //key de paco
          this.deletePermisson = true;
        }
        else {
          this.deletePermisson = false;
        }
      }
=======
    if (user && cookie === true) {
     this.comentariosAllow = true;
     this.MoconautaSuscribeteComentario = "¡Moconauta!";
     this.Suscribetee = "Queremos saber tu opinión, déjanos un comentario.";
      } 
>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA
      else {
    this.comentariosAllow = false;
     this.MoconautaSuscribeteComentario = "¡Suscríbete!";
     this.Suscribetee = "Si deseas dejar un comentario debes registrarte desde nuestra App.";
      }     
    });  
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
   if(cookie === true){
    this.Moconauta = this.cookie.get("username").toUpperCase()+" ";
    this.Ingreso = "CERRAR SESIÓN";
    this.userPicture =  this.cookie.get("image");
    this.userName =  this.cookie.get("username");
    this.nombreUsuario = this.cookie.get("username");
   }
   else{
    this.userPicture = "./../../assets/images/Boton_Moconauta.png";
  }

   this.title.setTitle("Noticias - El moco");



    this.activatedRoute.queryParams.subscribe(params => {
      this.queryParam = params['news'];
      this.queryParamID = params['id'];
      if (this.queryParam === 'noticias' || this.queryParam === 'Noticias') {
        this.noticiasService.getNoticiasSelected(this.queryParamID).snapshotChanges().subscribe(item => {
          this.noticiasList = [];
          item.forEach(element => {
            let x = element.payload.toJSON();
            x["$key"] = element.key;
            this.noticiasList.push(x as NoticiasPlantilla6);
            this.phrase_new = this.noticiasList[0].phrase;
            this.noticia1_new = this.noticiasList[0].part1
            this.noticia2_new = this.noticiasList [0].part2;
            this.noticia3_new = this.noticiasList [0].part3;
            this.noticia4_new = this.noticiasList[0].part4;
            this.noticia5_new = this.noticiasList[0].part5;
            if(this.noticiasList[0].part6 !== undefined){
              this.noticia6_new = this.noticiasList[0].part6;
              this.noticia7_new = this.noticiasList[0].part7;
<<<<<<< HEAD
              this.imagen4 = this.noticiasList[0].image4;
              this.imagen5 = this.noticiasList[0].image5;
              this.imagen6 = this.noticiasList[0].image6;
            }
            if (this.noticiasList[0].youtube !== "") {
              this.youtubeVisible = true;
              this.youtube_url = this.noticiasList[0].youtube;
            }
            else{
              this.youtubeVisible = false;
            }
=======
              this.imagen4 = this.noticiasList[0].image1;
              this.imagen5 = this.noticiasList[0].image2;
              this.imagen6 = this.noticiasList[0].image3;
            } 
            this.youtube_url = this.noticiasList[0].youtube;
>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA
            this.imagen1 = this.noticiasList[0].image1;
            this.imagen2 = this.noticiasList[0].image2;
            this.imagen3 = this.noticiasList[0].image3;
            this.imagenPrincipal = this.noticiasList[0].principalImage;
            this.autor = this.noticiasList[0].autor;
            this.fecha = this.noticiasList[0].date;
            
            var posicion = this.fecha.search("-");
            var contador = 1;
            while(posicion !== -1){
              var var1 = this.fecha.substring(0, posicion);
              var var2 = this.fecha.substring(posicion+1, this.fecha.length);
              this.fecha = var1 + ' ' + var2;
              var posicion = this.fecha.search("-");
            }
            this.fechaarrary = this.fecha.split(" ");
            this.cambiarMeses(this.fechaarrary[1]);
            this.fecha = this.fechaarrary[1] + " " + this.fechaarrary[0] + " de " + this.fechaarrary[2];

            this.newstittle = this.noticiasList [0].tittle;
            this.meta.updateTag({ property: 'og:title', content: this.newstittle });
            this.validatePlantilla(this.noticiasList[0].plantilla);   
          })
          this.noticiasService.getComentarioNoticias(this.queryParamID).snapshotChanges().subscribe(item => {
            this.comentariosList = [];
            item.forEach(element => {
              let x = element.payload.toJSON();
              x["$key"] = element.key;
              this.comentariosList.push(x as comentariosConNoticia);
              
            })
          
            for(let i = 0; i < this.comentariosList.length; i++){        
             if(this.MoconautaSuscribeteComentario === "¡Moconauta!"){
              if(this.comentariosList[i].uid === this.afAuth.auth.currentUser.uid){
                this.comentariosEliminar.push("block")
               }
               else{ 
                console.log("no pertece "+ i + "uid "+ this.comentariosList[i].uid)
                this.comentariosEliminar.push("none")
               }
             }
             else{ 
              this.comentariosEliminar.push("none")
             }
            }
           
            this.numComentarios = this.comentariosList.length+"";
          }) 
        });
        this.search25News("noticias");
      }
      else if (this.queryParam === 'ciencia' || this.queryParam === 'Ciencia') {
        this.noticiasService.getCienciaSelected(this.queryParamID).snapshotChanges().subscribe(item => {
          this.noticiasList = [];
          this.comentariosList = [];
          item.forEach(element => {
            let x = element.payload.toJSON();
            
            x["$key"] = element.key;
            this.noticiasList.push(x as NoticiasPlantilla6);
            this.phrase_new = this.noticiasList[0].phrase;
            this.noticia1_new = this.noticiasList[0].part1
<<<<<<< HEAD
            this.noticia2_new = this.noticiasList[0].part2;
            this.noticia3_new = this.noticiasList[0].part3;
            this.noticia4_new = this.noticiasList[0].part4;
            this.noticia5_new = this.noticiasList[0].part5;
            if (this.noticiasList[0].youtube !== "") {
              this.youtubeVisible = true;
              this.youtube_url = this.noticiasList[0].youtube;
            }
            else{
              this.youtubeVisible = false;
            }
            this.newstittle = this.noticiasList[0].tittle;
=======
            this.noticia2_new = this.noticiasList [0].part2;
            this.noticia3_new = this.noticiasList [0].part3;
            this.noticia4_new = this.noticiasList [0].part4;
            this.noticia5_new = this.noticiasList [0].part5;
            this.youtube_url = this.noticiasList[0].youtube;
            this.newstittle = this.noticiasList [0].tittle;
>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA
            this.imagenPrincipal = this.noticiasList[0].principalImage;
            this.autor = this.noticiasList[0].autor;
            this.fecha = this.noticiasList[0].date;
            if(this.noticiasList[0].part6 !== undefined){
              this.noticia6_new = this.noticiasList[0].part6;
              this.noticia7_new = this.noticiasList[0].part7;
              this.imagen4 = this.noticiasList[0].image1;
              this.imagen5 = this.noticiasList[0].image2;
              this.imagen6 = this.noticiasList[0].image3;
            } 
            var posicion = this.fecha.search("-");
            var contador = 1;
            while(posicion !== -1){
              var var1 = this.fecha.substring(0, posicion);
              var var2 = this.fecha.substring(posicion+1, this.fecha.length);
              this.fecha = var1 + ' ' + var2;
              var posicion = this.fecha.search("-");
            }
            this.fechaarrary = this.fecha.split(" ");
            this.cambiarMeses(this.fechaarrary[1]);
            this.fecha = this.fechaarrary[1] + " " + this.fechaarrary[0] + " de " + this.fechaarrary[2];
            this.validatePlantilla(this.noticiasList[0].plantilla);  
          })
         
      
          this.noticiasService.getComentarioCiencia(this.queryParamID).snapshotChanges().subscribe(item => {
            this.comentariosList = [];
            item.forEach(element => {
              let x = element.payload.toJSON();
              x["$key"] = element.key;
              this.comentariosList.push(x as comentariosConNoticia);
            }) 
            for(let i = 0; i < this.comentariosList.length; i++){        
              if(this.MoconautaSuscribeteComentario === "¡Moconauta!"){
               if(this.comentariosList[i].uid === this.afAuth.auth.currentUser.uid){
                 this.comentariosEliminar.push("block")
                }
                else{ 
                 console.log("no pertece "+ i + "uid "+ this.comentariosList[i].uid)
                 this.comentariosEliminar.push("none")
                }
              }
              else{ 
               this.comentariosEliminar.push("none")
              }
             }
            this.numComentarios = this.comentariosList.length+"";
          }) 
        });
       
        this.search25News("ciencia");
      }
      else if (this.queryParam === 'arte' || this.queryParam === 'Arte') {
    
        this.noticiasService.getArtSelected(this.queryParamID).snapshotChanges().subscribe(item => {
          this.noticiasList = [];
          item.forEach(element => {
            let x = element.payload.toJSON();
            x["$key"] = element.key;
            this.noticiasList.push(x as NoticiasPlantilla6);
            this.phrase_new = this.noticiasList[0].phrase;
            this.noticia1_new = this.noticiasList[0].part1
<<<<<<< HEAD
            this.noticia2_new = this.noticiasList[0].part2;
            this.noticia3_new = this.noticiasList[0].part3;
            this.noticia4_new = this.noticiasList[0].part4;
            this.noticia5_new = this.noticiasList[0].part5;
            if (this.noticiasList[0].youtube !== "") {
              this.youtubeVisible = true;
              this.youtube_url = this.noticiasList[0].youtube;
            }
            else{
              this.youtubeVisible = false;
            }
            this.newstittle = this.noticiasList[0].tittle;
=======
            this.noticia2_new = this.noticiasList [0].part2;
            this.noticia3_new = this.noticiasList [0].part3;
            this.noticia4_new = this.noticiasList [0].part4;
            this.noticia5_new = this.noticiasList [0].part5;
            this.youtube_url = this.noticiasList[0].youtube;
            this.newstittle = this.noticiasList [0].tittle;
>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA
            this.imagenPrincipal = this.noticiasList[0].principalImage;
            this.autor = this.noticiasList[0].autor;
            this.fecha = this.noticiasList[0].date;
            
            if(this.noticiasList[0].part6 !== undefined){
              this.noticia6_new = this.noticiasList[0].part6;
              this.noticia7_new = this.noticiasList[0].part7;
              this.imagen4 = this.noticiasList[0].image1;
              this.imagen5 = this.noticiasList[0].image2;
              this.imagen6 = this.noticiasList[0].image3;
            } 
            var posicion = this.fecha.search("-");
            var contador = 1;
            while(posicion !== -1){
              var var1 = this.fecha.substring(0, posicion);
              var var2 = this.fecha.substring(posicion+1, this.fecha.length);
              this.fecha = var1 + ' ' + var2;
              var posicion = this.fecha.search("-");
            }
            this.fechaarrary = this.fecha.split(" ");
            this.cambiarMeses(this.fechaarrary[1]);
            this.fecha = this.fechaarrary[1] + " " + this.fechaarrary[0] + " de " + this.fechaarrary[2];
            this.validatePlantilla(this.noticiasList[0].plantilla);   
          })
          this.noticiasService.getComentarioArte(this.queryParamID).snapshotChanges().subscribe(item => {
            this.comentariosList = [];
            item.forEach(element => {
              let x = element.payload.toJSON();
              x["$key"] = element.key;
              this.comentariosList.push(x as comentariosConNoticia);
            }) 
            for(let i = 0; i < this.comentariosList.length; i++){        
              if(this.MoconautaSuscribeteComentario === "¡Moconauta!"){
               if(this.comentariosList[i].uid === this.afAuth.auth.currentUser.uid){
                 this.comentariosEliminar.push("block")
                }
                else{ 
                 console.log("no pertece "+ i + "uid "+ this.comentariosList[i].uid)
                 this.comentariosEliminar.push("none")
                }
              }
              else{ 
               this.comentariosEliminar.push("none")
              }
             }
            this.numComentarios = this.comentariosList.length+"";
          }) 
        });
        this.search25News("arte");
      }
      else if (this.queryParam === 'ocio' || this.queryParam === 'Ocio') {
        this.noticiasService.getOcioSelected(this.queryParamID).snapshotChanges().subscribe(item => {
          this.noticiasList = [];
          item.forEach(element => {
            let x = element.payload.toJSON();
            x["$key"] = element.key;
            this.noticiasList.push(x as NoticiasPlantilla6);
            this.phrase_new = this.noticiasList[0].phrase;
            this.noticia1_new = this.noticiasList[0].part1
<<<<<<< HEAD
            this.noticia2_new = this.noticiasList[0].part2;
            this.noticia3_new = this.noticiasList[0].part3;
            this.noticia4_new = this.noticiasList[0].part4;
            this.noticia5_new = this.noticiasList[0].part5;
            if (this.noticiasList[0].youtube !== "") {
              this.youtubeVisible = true;
              this.youtube_url = this.noticiasList[0].youtube;
            }
            else{
              this.youtubeVisible = false;
            }
            this.newstittle = this.noticiasList[0].tittle;
=======
            this.noticia2_new = this.noticiasList [0].part2;
            this.noticia3_new = this.noticiasList [0].part3;
            this.noticia4_new = this.noticiasList [0].part4;
            this.noticia5_new = this.noticiasList [0].part5;
            this.youtube_url = this.noticiasList[0].youtube;
            this.newstittle = this.noticiasList [0].tittle;
>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA
            this.imagenPrincipal = this.noticiasList[0].principalImage;
            this.autor = this.noticiasList[0].autor;
            this.fecha = this.noticiasList[0].date;
            if(this.noticiasList[0].part6 !== undefined){
              this.noticia6_new = this.noticiasList[0].part6;
              this.noticia7_new = this.noticiasList[0].part7;
              this.imagen4 = this.noticiasList[0].image1;
              this.imagen5 = this.noticiasList[0].image2;
              this.imagen6 = this.noticiasList[0].image3;
            } 
            var posicion = this.fecha.search("-");
            var contador = 1;
            while(posicion !== -1){
              var var1 = this.fecha.substring(0, posicion);
              var var2 = this.fecha.substring(posicion+1, this.fecha.length);
              this.fecha = var1 + ' ' + var2;
              var posicion = this.fecha.search("-");
            }
            this.fechaarrary = this.fecha.split(" ");
            this.cambiarMeses(this.fechaarrary[1]);
            this.fecha = this.fechaarrary[1] + " " + this.fechaarrary[0] + " de " + this.fechaarrary[2];


            this.validatePlantilla(this.noticiasList[0].plantilla);   
          
          })
          this.noticiasService.getComentarioOcio(this.queryParamID).snapshotChanges().subscribe(item => {
            this.comentariosList = [];
            item.forEach(element => {
              let x = element.payload.toJSON();
              x["$key"] = element.key;
              this.comentariosList.push(x as comentariosConNoticia);
            }) 
            for(let i = 0; i < this.comentariosList.length; i++){        
              if(this.MoconautaSuscribeteComentario === "¡Moconauta!"){
               if(this.comentariosList[i].uid === this.afAuth.auth.currentUser.uid){
                 this.comentariosEliminar.push("block")
                }
                else{ 
                 console.log("no pertece "+ i + "uid "+ this.comentariosList[i].uid)
                 this.comentariosEliminar.push("none")
                }
              }
              else{ 
               this.comentariosEliminar.push("none")
              }
             }
            this.numComentarios = this.comentariosList.length+"";
           
          }) 
        });
        this.search25News("ocio");
      }
      else if (this.queryParam === 'descubre' || this.queryParam === 'Descubre') {
        this.noticiasService.getDescubreSelected(this.queryParamID).snapshotChanges().subscribe(item => {
          this.noticiasList = [];
          item.forEach(element => {
            let x = element.payload.toJSON();
            x["$key"] = element.key;
            this.noticiasList.push(x as NoticiasPlantilla6);
            this.phrase_new = this.noticiasList[0].phrase;
            this.noticia1_new = this.noticiasList[0].part1
<<<<<<< HEAD
            this.noticia2_new = this.noticiasList[0].part2;
            this.noticia3_new = this.noticiasList[0].part3;
            this.noticia4_new = this.noticiasList[0].part4;
            this.noticia5_new = this.noticiasList[0].part5;
            if (this.noticiasList[0].youtube !== "") {
              this.youtubeVisible = true;
              this.youtube_url = this.noticiasList[0].youtube;
            }
            else{
              this.youtubeVisible = false;
            }
            this.newstittle = this.noticiasList[0].tittle;
=======
            this.noticia2_new = this.noticiasList [0].part2;
            this.noticia3_new = this.noticiasList [0].part3;
            this.noticia4_new = this.noticiasList [0].part4;
            this.noticia5_new = this.noticiasList [0].part5;
            this.youtube_url = this.noticiasList[0].youtube;
            this.newstittle = this.noticiasList [0].tittle;
>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA
            this.imagenPrincipal = this.noticiasList[0].principalImage;
            this.autor = this.noticiasList[0].autor;
            this.fecha = this.noticiasList[0].date;
            if(this.noticiasList[0].part6 !== undefined){
              this.noticia6_new = this.noticiasList[0].part6;
              this.noticia7_new = this.noticiasList[0].part7;
              this.imagen4 = this.noticiasList[0].image1;
              this.imagen5 = this.noticiasList[0].image2;
              this.imagen6 = this.noticiasList[0].image3;
            } 
            var posicion = this.fecha.search("-");
            var contador = 1;
            while(posicion !== -1){
              var var1 = this.fecha.substring(0, posicion);
              var var2 = this.fecha.substring(posicion+1, this.fecha.length);
              this.fecha = var1 + ' ' + var2;
              var posicion = this.fecha.search("-");
            }
            this.fechaarrary = this.fecha.split(" ");
            this.cambiarMeses(this.fechaarrary[1]);
            this.fecha = this.fechaarrary[1] + " " + this.fechaarrary[0] + " de " + this.fechaarrary[2];


            this.validatePlantilla(this.noticiasList[0].plantilla);   
          })
          this.noticiasService.getComentarioDescubre(this.queryParamID).snapshotChanges().subscribe(item => {
            this.comentariosList = [];
            item.forEach(element => {
              let x = element.payload.toJSON();
              x["$key"] = element.key;
              this.comentariosList.push(x as comentariosConNoticia);
            }) 
            for(let i = 0; i < this.comentariosList.length; i++){        
              if(this.MoconautaSuscribeteComentario === "¡Moconauta!"){
               if(this.comentariosList[i].uid === this.afAuth.auth.currentUser.uid){
                 this.comentariosEliminar.push("block")
                }
                else{ 
                 console.log("no pertece "+ i + "uid "+ this.comentariosList[i].uid)
                 this.comentariosEliminar.push("none")
                }
              }
              else{ 
               this.comentariosEliminar.push("none")
              }
             }
            this.numComentarios = this.comentariosList.length+"";
           
          }) 
        });
        this.search25News("descubre");
      }
      else if (this.queryParam === 'moco-tips' || this.queryParam === 'Mocotips') {
        this.noticiasService.getMocotipsSelected(this.queryParamID).snapshotChanges().subscribe(item => {
          this.noticiasList = [];
          item.forEach(element => {
            let x = element.payload.toJSON();
            x["$key"] = element.key;
            this.noticiasList.push(x as NoticiasPlantilla6);
            this.phrase_new = this.noticiasList[0].phrase;
            this.noticia1_new = this.noticiasList[0].part1
<<<<<<< HEAD
            this.noticia2_new = this.noticiasList[0].part2;
            this.noticia3_new = this.noticiasList[0].part3;
            this.noticia4_new = this.noticiasList[0].part4;
            this.noticia5_new = this.noticiasList[0].part5;
            if (this.noticiasList[0].youtube !== "") {
              this.youtubeVisible = true;
              this.youtube_url = this.noticiasList[0].youtube;
            }
            else{
              this.youtubeVisible = false;
            }
            this.newstittle = this.noticiasList[0].tittle;
=======
            this.noticia2_new = this.noticiasList [0].part2;
            this.noticia3_new = this.noticiasList [0].part3;
            this.noticia4_new = this.noticiasList [0].part4;
            this.noticia5_new = this.noticiasList [0].part5;
            this.youtube_url = this.noticiasList[0].youtube;
            this.newstittle = this.noticiasList [0].tittle;
>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA
            this.imagenPrincipal = this.noticiasList[0].principalImage;
            this.autor = this.noticiasList[0].autor;
            this.fecha = this.noticiasList[0].date;
            if(this.noticiasList[0].part6 !== undefined){
              this.noticia6_new = this.noticiasList[0].part6;
              this.noticia7_new = this.noticiasList[0].part7;
              this.imagen4 = this.noticiasList[0].image1;
              this.imagen5 = this.noticiasList[0].image2;
              this.imagen6 = this.noticiasList[0].image3;
            } 
            var posicion = this.fecha.search("-");
            var contador = 1;
            while(posicion !== -1){
              var var1 = this.fecha.substring(0, posicion);
              var var2 = this.fecha.substring(posicion+1, this.fecha.length);
              this.fecha = var1 + ' ' + var2;
              var posicion = this.fecha.search("-");
            }
            this.fechaarrary = this.fecha.split(" ");
            this.cambiarMeses(this.fechaarrary[1]);
         
            this.fecha = this.fechaarrary[1] + " " + this.fechaarrary[0] + " de " + this.fechaarrary[2];
            
            this.validatePlantilla(this.noticiasList[0].plantilla);   
          })
          this.noticiasService.getComentarioMocotips(this.queryParamID).snapshotChanges().subscribe(item => {
            this.comentariosList = [];
            item.forEach(element => {
              let x = element.payload.toJSON();
              x["$key"] = element.key;
              this.comentariosList.push(x as comentariosConNoticia);
            }) 
            for(let i = 0; i < this.comentariosList.length; i++){        
              if(this.MoconautaSuscribeteComentario === "¡Moconauta!"){
               if(this.comentariosList[i].uid === this.afAuth.auth.currentUser.uid){
                 this.comentariosEliminar.push("block")
                }
                else{ 
                 console.log("no pertece "+ i + "uid "+ this.comentariosList[i].uid)
                 this.comentariosEliminar.push("none")
                }
              }
              else{ 
               this.comentariosEliminar.push("none")
              }
             }
            this.numComentarios = this.comentariosList.length+"";
       
            
          }) 
         
        });
        this.search25News("mocotips");
      }
      
   
    });






    this.activatedRoute.queryParams.subscribe(params => {
      this.queryParam = params['news'];
      if (this.queryParam === 'noticias' || this.queryParam === 'Noticias') {
        this.bannerClass = 'structure-news-selected';
        this.smallNewsStyles = ['new-top-design-new', 'new-top-design-new', 'new-top-design-new', 'new-top-design-new', 'new-top-design-new'];
        this.smallNewsLogoStyles = ['new-top-moco-design-new', 'new-top-moco-design-new', 'new-top-moco-design-new', 'new-top-moco-design-new', 'new-top-moco-design-new'];
        this.hoverStyles = ['read-orange-hover', 'read-orange-hover', 'read-orange-hover', 'read-orange-hover', 'read-orange-hover'];
        this.topLineClass = "top-line-news";
        this.phraseClass = "phrase-news";
        this.secondPartNotice = "second-part-notice-news";
        this.secondPartNotice2 = "second-part-notice-news2";
        this.secondPartNoticeRight = "second-part-notice-news-right";
        this.seccion = "NOTICIAS";
        this.seccion2 = "Noticias";



      }
      else if (this.queryParam === 'ciencia' || this.queryParam === 'Ciencia') {
        this.bannerClass = 'structure-science-selected';
        this.smallNewsStyles = ['new-top-design-science', 'new-top-design-science', 'new-top-design-science', 'new-top-design-science', 'new-top-design-science'];
        this.smallNewsLogoStyles = ['new-top-moco-design-science', 'new-top-moco-design-science', 'new-top-moco-design-science', 'new-top-moco-design-science', 'new-top-moco-design-science'];
        this.hoverStyles = ['read-blue-hover', 'read-blue-hover', 'read-blue-hover', 'read-blue-hover', 'read-blue-hover'];
        this.topLineClass = "top-line-science";
        this.phraseClass = "phrase-science";
        this.secondPartNotice = "second-part-notice-science";
        this.secondPartNotice2 = "second-part-notice-science2";
        this.secondPartNoticeRight = "second-part-notice-science-right";
        this.seccion = "CIENCIA";
        this.seccion2 = "Ciencia";
      }
      else if (this.queryParam === 'arte' || this.queryParam === 'Arte') {
        this.bannerClass = 'structure-art-selected';
        this.smallNewsStyles = ['new-top-design-art', 'new-top-design-art', 'new-top-design-art', 'new-top-design-art', 'new-top-design-art'];
        this.smallNewsLogoStyles = ['new-top-moco-design-art', 'new-top-moco-design-art', 'new-top-moco-design-art', 'new-top-moco-design-art', 'new-top-moco-design-art'];
        this.hoverStyles = ['read-pink-hover', 'read-pink-hover', 'read-pink-hover', 'read-pink-hover', 'read-pink-hover'];
        this.topLineClass = "top-line-art";
        this.phraseClass = "phrase-art";
        this.secondPartNotice = "second-part-notice-art";
        this.secondPartNotice2 = "second-part-notice-art2";
        this.secondPartNoticeRight = "second-part-notice-art-right";
        this.seccion = "ARTE";
        this.seccion2 = "Arte";
      }

      else if (this.queryParam === 'ocio' || this.queryParam === 'Ocio') {
        this.bannerClass = 'structure-fun-selected';
        this.smallNewsStyles = ['new-top-design-fun', 'new-top-design-fun', 'new-top-design-fun', 'new-top-design-fun', 'new-top-design-fun'];
        this.smallNewsLogoStyles = ['new-top-moco-design-fun', 'new-top-moco-design-fun', 'new-top-moco-design-fun', 'new-top-moco-design-fun', 'new-top-moco-design-fun'];
        this.hoverStyles = ['read-yellow-hover', 'read-yellow-hover', 'read-yellow-hover', 'read-yellow-hover', 'read-yellow-hover'];
        this.topLineClass = "top-line-fun";
        this.phraseClass = "phrase-fun";
        this.secondPartNotice = "second-part-notice-fun";
        this.secondPartNotice2 = "second-part-notice-fun2";
        this.secondPartNoticeRight = "second-part-notice-fun-right";
        this.seccion = "OCIO";
        this.seccion2 = "Ocio";
      }
      else if (this.queryParam === 'descubre' || this.queryParam === 'Descubre') {
        this.bannerClass = 'structure-find-selected';
        this.smallNewsStyles = ['new-top-design-find', 'new-top-design-find', 'new-top-design-find', 'new-top-design-find', 'new-top-design-find'];
        this.smallNewsLogoStyles = ['new-top-moco-design-find', 'new-top-moco-design-find', 'new-top-moco-design-find', 'new-top-moco-design-find', 'new-top-moco-design-find'];
        this.hoverStyles = ['read-purple-hover', 'read-purple-hover', 'read-purple-hover', 'read-purple-hover', 'read-purple-hover'];
        this.topLineClass = "top-line-find";
        this.phraseClass = "phrase-find";
        this.secondPartNotice = "second-part-notice-find";
        this.secondPartNotice2 = "second-part-notice-find2";
        this.secondPartNoticeRight = "second-part-notice-find-right";
        this.seccion = "DESCUBRE";
        this.seccion2 = "Descubre";
      }
      else if (this.queryParam === 'moco-tips' || this.queryParam === 'Mocotips') {
        this.bannerClass = 'structure-mocotips-selected';
        this.smallNewsStyles = ['new-top-design-mocotips', 'new-top-design-mocotips', 'new-top-design-mocotips', 'new-top-design-mocotips', 'new-top-design-mocotips'];
        this.smallNewsLogoStyles = ['', '', '', '', ''];
        this.hoverStyles = ['read-brown-hover', 'read-brown-hover', 'read-brown-hover', 'read-brown-hover', 'read-brown-hover'];
        this.topLineClass = "top-line-mocotips";
        this.phraseClass = "phrase-mocotips";
        this.secondPartNotice = "second-part-notice-mocotips";
        this.secondPartNotice2 = "second-part-notice-mocotips2";
        this.secondPartNoticeRight = "second-part-notice-mocotips-right";
        this.seccion = "MOCOTIPS";
        this.seccion2 = "Mocotips";
      }
    });



  }
  redirectTo(){
    this.router.navigate(['/home'])
    .then(() => {
      window.location.reload();
    });
  }

  search25News(seccion : string){
    var contador = 0;
    this.noticiasService.getFirst3News(seccion, this.queryParamID).snapshotChanges().subscribe(item => {
      var lengthItem = 0;
      this.noticias3List = [];
      item.forEach(element => {
        let x = element.payload.toJSON();
        x["$key"] = element.key;
        this.noticias3List.push(x as Noticias);
          this.noticiasTitulo[lengthItem] = this.noticias3List[contador].tittle;
          this.noticiasImage[lengthItem] = this.noticias3List[contador].principalImage;
          this.noticiasKey[lengthItem] = this.noticias3List[contador].$key;    
        contador++;
        lengthItem++;
        console.log("OLA "+lengthItem)
      })
      console.log(this.noticiasTitulo[1])
      if(this.noticiasTitulo[0] === "" || this.noticiasTitulo[0] === this.newstittle){
        this.visibility1 = false;
      }
      else{
        this.visibility1 = true;
      }
      if(this.noticiasTitulo[1] === "" || this.noticiasTitulo[1] === this.newstittle){
        this.visibility2 = false;
      }
      else{
        this.visibility2 = true;
      }
      if(this.noticiasTitulo[2] === "" || this.noticiasTitulo[2] === this.newstittle){
        this.visibility3 = false;
      }
      else{
        this.visibility3 = true;
      }
    });
  }
  public scrollToTop() {
    this.scroll.nativeElement.scrollTop = 0;
  }
  public scrollToComments(scroll : number) {
    this.scroll.nativeElement.scrollTop = scroll;
  }
  cambiarMeses(mes : string){

    if(mes === "01"){
      this.fechaarrary[1] = "enero";
    }
    else if (mes === "02"){
      this.fechaarrary[1] = "febrero";
    }
    else if (mes === "03"){
      this.fechaarrary[1] = "marzo";
    }
    else if (mes === "04"){
      this.fechaarrary[1] = "abril";
    }
    else if (mes === "05"){
      this.fechaarrary[1] = "mayo";
    }
    else if (mes === "06"){
      this.fechaarrary[1] = "junio";
    }
    else if (mes === "07"){
      this.fechaarrary[1] = "julio";
    }
    else if (mes === "08"){
      this.fechaarrary[1] = "agosto";
    }
    else if (mes === "09"){
      this.fechaarrary[1] = "septiembre";
    }
    else if (mes === "10"){
      this.fechaarrary[1] = "octubre";
    }
    else if (mes === "11"){
      this.fechaarrary[1] = "noviembre";
    }
    else if (mes === "12"){
      this.fechaarrary[1] = "diciembre";
    }
    }
  validatePlantilla(plantilla : string){
    if(plantilla === '1'){
      this.plantilla1 = true;
      this.plantilla2 = false;
      this.plantilla3 = false;
      this.plantilla4 = false;
      this.plantilla5 = false;
      this.plantilla6 = false;
    }
    else if(plantilla === '2'){
      this.plantilla1 = false;
      this.plantilla2 = true;
      this.plantilla3 = false;
      this.plantilla4 = false;
      this.plantilla5 = false;
      this.plantilla6 = false;
    }
    else if(plantilla === '3'){
      this.plantilla1 = false;
      this.plantilla2 = false;
      this.plantilla3 = true;
      this.plantilla4 = false;
      this.plantilla5 = false;
      
    }
    else if(plantilla === '4'){
      this.plantilla1 = false;
      this.plantilla2 = false;
      this.plantilla3 = false;
      this.plantilla4 = true;
      this.plantilla5 = false;
      this.plantilla6 = false;
    }
    else if(plantilla === '5'){
      this.plantilla1 = false;
      this.plantilla2 = false;
      this.plantilla3 = false;
      this.plantilla4 = false;
      this.plantilla5 = true;
      this.plantilla6 = false;
    }
    else if(plantilla === '6'){
      this.plantilla1 = false;
      this.plantilla2 = false;
      this.plantilla3 = false;
      this.plantilla4 = false;
      this.plantilla5 = false;
      this.plantilla6 = true;
    }
  }
<<<<<<< HEAD
  inicioSesion() {
    this.router.navigate(['/ingreso']);
=======
  app() {
    window.open('https://apps.apple.com/mx/app/el-moco/id1528073445');
    window.open('https://play.google.com/store/apps/developer?id=El+Moco&hl=es_MX');
>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA
  }

  fb() {

    let url = window.location.href;
    var facebookWindow = window.open(
      'https://www.facebook.com/sharer/sharer.php?u='+url,
    );
    if (facebookWindow.focus) {
      facebookWindow.focus();
    }
    return false;
  }
  tw(){
    var val = window.location.href;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    window.alert("¡Enlace copiado! Compártelo en Twitter.");

    var twitterWindow = window.open(
      'https://twitter.com/intent/tweet?text=',   
    );
    if (twitterWindow.focus) {
      twitterWindow.focus();
    }
    return false; 
    
  }
  mail(){
    let url = window.location.href;
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
    window.alert("¡Enlace copiado! Compártelo en tu Correo.");

    var mail = window.open(
      'mailto:example@gmail.com?subject=¡Mira%20la%20noticia%20que%20encontre!&body='+url,
    );
    if (mail.focus) {
      mail.focus();
    }
    return false; 
  }
  resolved(response: Event){
    this.repCaptcha = true;
  }
  handleReset(){
    this.captchaElem.resetCaptcha();
  }
  publicarComentario(){
    this.comentarioObject.id_noticia = this.queryParamID;
    this.comentarioObject.username = this.nombreUsuario;
    this.comentarioObject.comment = this.comentarioTextArea;
    this.comentarioObject.date = this.currentDate;
    this.comentarioObject.userPicture = this.userPicture;
    this.comentarioObject.uid = this.afAuth.auth.currentUser.uid;
    this.noticiasService.insertComentario(this.comentarioObject, this.seccion2);
      this.comentarioTextArea = "";
      this.captchaElem.resetCaptcha();
      this.repCaptcha = false; 
      window.location.reload();
     
  }
  responderComentario(index : any){
    this.comentarioTextArea = "";
    var calculo = this.bannerHeight + this.menuHeight + this.structureHeight + this.latestHeight;
    this.scrollToComments(calculo);
    this.comentarioTextArea = "Respondiendo al comentario de @"+this.comentariosList[index].username+"\n \n";
  }
  eliminarComentario(index : any){
    this.noticiasService.deleteComentario(this.queryParamID, this.seccion2, this.comentariosList[index].$key);
    window.location.reload();
  }
  reverttMonths(mes: number) {
    if (mes === 0) {
      this.currentMonth = 'Enero';
    }
    else if (mes === 1) {
      this.currentMonth = 'Febrero';
    }
    else if (mes === 2) {
      this.currentMonth = 'Marzo';
    }
    else if (mes === 3) {
      this.currentMonth = 'Abril';
    }
    else if (mes === 4) {
      this.currentMonth = 'Mayo';
    }
    else if (mes === 5) {
      this.currentMonth = 'Junio';
    }
    else if (mes === 6) {
      this.currentMonth = 'Julio';
    }
    else if (mes === 7) {
      this.currentMonth = 'Agosto';
    }
    else if (mes === 8) {
      this.currentMonth = 'Septiembre';
    }
    else if (mes === 9) {
      this.currentMonth = 'Octubre';
    }
    else if (mes === 10) {
      this.currentMonth = 'Noviembre';
    }
    else if (mes === 11) {
      this.currentMonth = 'Diciembre';
    }
  }
  onResized(event: ResizedEvent) {
      this.height = event.newWidth;
      if(event.newWidth < 35){
        this.porcentajeTop = this.height / 1.5;
      } 
      else if(event.newWidth > 35){
        this.porcentajeTop = this.height / 3;
      }
    }
    onResizedComments(event: ResizedEvent) {
      this.comentsHeight = event.newHeight;
    }
    onResizedLatest(event: ResizedEvent) {
      this.latestHeight = event.newHeight;
    }
    onResizedStructure(event: ResizedEvent) {
      this.structureHeight = event.newHeight;
    }
    onResizedMenu(event: ResizedEvent) {
      this.menuHeight = event.newHeight;
    }
    onResizedBanner(event: ResizedEvent) {
      this.bannerHeight = event.newHeight;
    }
<<<<<<< HEAD

  }
  app() {
    this.router.navigate(['/suscribete']);
  }
  onResizedComments(event: ResizedEvent) {
    this.comentsHeight = event.newHeight;
  }
  onResizedLatest(event: ResizedEvent) {
    this.latestHeight = event.newHeight;
  }
  onResizedStructure(event: ResizedEvent) {
    this.structureHeight = event.newHeight;
  }
  onResizedMenu(event: ResizedEvent) {
    this.menuHeight = event.newHeight;
  }
  onResizedBanner(event: ResizedEvent) {
    this.bannerHeight = event.newHeight;
  }
=======
>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA
}
