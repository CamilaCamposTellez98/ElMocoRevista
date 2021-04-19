import { Component, OnInit, ViewEncapsulation, ɵConsole, ViewChild, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiasService } from '../services/noticias.service';
import { Noticias } from '../models/noticias';
import { Meta, Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {NgxCaptchaModule,ReCaptcha2Component} from 'ngx-captcha';
import { comentariosConNoticia } from '../models/comentarios';
import { ResizedEvent } from 'angular-resize-event';
import { especialDelMes } from '../models/especialDelMes';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-especial-mes',
  templateUrl: './especial-mes.component.html',
  styleUrls: ['./especial-mes.component.css']
})
export class EspecialMesComponent implements OnInit {
  
  Moconauta : string = "MOCONAUTA ";
  Ingreso : string = "INGRESO"
  userPicture : string = "";
  userName : string = "";
  nombreUsuario : string = "";
  porcentajeTop : number;
  height: number;

  comentariosAllow : boolean = false;
  MoconautaSuscribeteComentario : string = "MOCONAUTA";
  Suscribetee : string = "";
  siteKey : string = "6LdOrb4ZAAAAAJ6UhFDmj4SU2M_CiNfKsfoIfaI1"
  size : string = "normal";
  comentarioTextArea : string = "";

  comentariosList: comentariosConNoticia[];

  aFormGroup: FormGroup;
  repCaptcha : boolean = false;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;

  email : string = "";

  noticiasList: Noticias[];
  comentariosEliminar : string [] = [];

  photo = "./../../assets/images/Backround_Lines.jpg";
  bannerPhoto = "./../../assets/images/noticias_trump.png"

  newstittle : string = "";

  plantilla1 : boolean = false;
  plantilla2 : boolean = false;
  plantilla3 : boolean = false;
  plantilla4 : boolean = false;
  plantilla5 : boolean = false;

  youtube_url : string = '';

  especialDelMesPortada1 : string = "";
  descripcion : string = "";

  numComentarios : string = "";

  especialDelMes : especialDelMes[];
  especialDelMes3 : especialDelMes[];
  especialPrevious : especialDelMes[];
  especialNext : especialDelMes[];

  especial1key : string = "";
  especial2key : string = "";
  especial3key : string = "";

  especial1image : string = "";
  especial2image : string = "";
  especial3image : string = "";

  visibility1: boolean;
  visibility2: boolean;
  visibility3: boolean;

  anterior: boolean;
  siguiente: boolean;

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

  seccion : string = "";
  seccion2 : string = "";

  imagen1: string;
  imagen2: string;
  imagen3: string;
  imagenPrincipal: string;

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

    deletePermisson : boolean;
    userKey : string = "";
  showScroll: boolean;
  showScrollHeight = 300;
  hideScrollHeight = 10;

  pruebita : string;
  constructor(private activatedRoute: ActivatedRoute, private afAuth: AngularFireAuth, public noticiasService: NoticiasService, public meta: Meta, public title: Title, private cookie: CookieService, private formBuilder: FormBuilder, public router: Router,  private viewPortScroller: ViewportScroller) { }
  @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any>;
  ngOnInit(): void {
   
  
    var month = this.myDate.getMonth();
    var day = this.myDate.getDate();
    var hour = this.myDate.getHours();
    var minute = this.myDate.getMinutes();
    var year = this.myDate.getFullYear();
 
    this.reverttMonths(month);

    this.currentDate = this.currentMonth.toUpperCase() + " " + day + ", "+ year + " A LAS " + hour + ":" + minute;
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user && cookie === true) {
        this.comentariosAllow = true;
        this.MoconautaSuscribeteComentario = "¡Moconauta!";
        this.Suscribetee = "Queremos saber tu opinión, déjanos un comentario.";
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
         else {
       this.comentariosAllow = false;
        this.MoconautaSuscribeteComentario = "¡Suscríbete!";
        this.Suscribetee = "Si deseas dejar un comentario debes registrarte desde nuestra App.";
         }      
      });     
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
   var username : boolean = this.cookie.check("username");
   var password : boolean = this.cookie.check("password");

   if(username === true && password === true){
     this.comentariosAllow = true;
     this.MoconautaSuscribeteComentario = "¡Moconauta!";
   }
   else{
     this.comentariosAllow = false;
     this.MoconautaSuscribeteComentario = "¡Suscríbete!";
   }

   var cookie = this.cookie.check("username");
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

   //this.meta.updateTag({ property: 'og:description', content: "OPPA OPPA OPPA" });
 
   this.title.setTitle("Especial - El moco");



    this.activatedRoute.queryParams.subscribe(params => {
      this.queryParamID = params['id'];
      
      this.noticiasService.getEspecial3Last(this.queryParamID).snapshotChanges().subscribe(item => {
        this.especialDelMes3 = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.especialDelMes3.push(x as especialDelMes);
        })
        
        if(this.especialDelMes3[2] !== undefined){
          if(this.especialDelMes3[2].$key === this.queryParamID){
            this.visibility1 = false;
          }
          else{
            this.especial1key = this.especialDelMes3[2].$key;
            this.especial1image = this.especialDelMes3[2].principalImage;
            this.visibility1 = true;
          
          }
        }
        else{
          this.visibility1 =false;
        }
        if(this.especialDelMes3[1] !== undefined){
          if(this.especialDelMes3[1].$key === this.queryParamID){
            this.visibility2 = false;
          }
          else{
          this.especial2key = this.especialDelMes3[1].$key;
          this.especial2image = this.especialDelMes3[1].principalImage;
          this.visibility2 = true;
          }
        }
        else{     
          this.visibility2 = false;      
        }
        if(this.especialDelMes3[0] !== undefined){
          if(this.especialDelMes3[0].$key === this.queryParamID){
            this.visibility3 = false;
          }
          else{
          this.especial3key = this.especialDelMes3[0].$key;
          this.especial3image = this.especialDelMes3[0].principalImage;
          this.visibility3 = true;
         
          }
        }
        else{
          this.visibility3 = false;
        }
    
      });
        this.noticiasService.getEspecialSelected(this.queryParamID).snapshotChanges().subscribe(item => {
          this.especialDelMes = [];
          item.forEach(element => {
            let x = element.payload.toJSON();
            x["$key"] = element.key;
            this.especialDelMes.push(x as especialDelMes);
            this.especialDelMesPortada1 = this.especialDelMes[0].principalImage;
            this.fecha = this.especialDelMes[0].date;
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
            this.fecha = this.fechaarrary[0] + " de " + this.fechaarrary[1] + " del " + this.fechaarrary[2];
            this.autor = this.especialDelMes[0].autor;
            this.descripcion = this.especialDelMes[0].description;
          })
          this.noticiasService.getComentarioEspecial(this.queryParamID).snapshotChanges().subscribe(item => {
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

        this.noticiasService.getEspecialNext(this.queryParamID).snapshotChanges().subscribe(item => {
          this.especialNext = [];
          item.forEach(element => {
            let x = element.payload.toJSON();
            x["$key"] = element.key;
            this.especialNext.push(x as especialDelMes);
          })
          if(this.especialNext[0].$key === this.queryParamID){
            this.siguiente = false;
          }
          else{
            this.siguiente = true;
          }
        });
        this.noticiasService.getEspecialPrevious(this.queryParamID).snapshotChanges().subscribe(item => {
          this.especialPrevious = [];
          item.forEach(element => {
            let x = element.payload.toJSON();
            x["$key"] = element.key;
            this.especialPrevious.push(x as especialDelMes);
          })
         
          if(this.especialPrevious.length === 1){
            this.anterior = false;
          }
          else{
            this.anterior = true;
          }
       
        });
       
      
   
    });

  }
  public scrollToTop() {
    this.scroll.nativeElement.scrollTop = 0;
  }
  redirectTo(){
    this.router.navigate(['/home'])
    .then(() => {
      window.location.reload();
    });
  }
  app() {
    this.router.navigate(['/suscribete']);
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
  cambiarMeses(mes : string){

    if(mes === "01"){
      this.fechaarrary[1] = "Enero";
    }
    else if (mes === "02"){
      this.fechaarrary[1] = "Febrero";
    }
    else if (mes === "03"){
      this.fechaarrary[1] = "Marzo";
    }
    else if (mes === "04"){
      this.fechaarrary[1] = "Abril";
    }
    else if (mes === "05"){
      this.fechaarrary[1] = "Mayo";
    }
    else if (mes === "06"){
      this.fechaarrary[1] = "Junio";
    }
    else if (mes === "07"){
      this.fechaarrary[1] = "Julio";
    }
    else if (mes === "08"){
      this.fechaarrary[1] = "Agosto";
    }
    else if (mes === "09"){
      this.fechaarrary[1] = "Septiembre";
    }
    else if (mes === "10"){
      this.fechaarrary[1] = "Octubre";
    }
    else if (mes === "11"){
      this.fechaarrary[1] = "Noviembre";
    }
    else if (mes === "12"){
      this.fechaarrary[1] = "Diciembre";
    }
    }
  validatePlantilla(plantilla : string){
    if(plantilla === '1'){
      this.plantilla1 = true;
      this.plantilla2 = false;
      this.plantilla3 = false;
      this.plantilla4 = false;
      this.plantilla5 = false;
    }
    else if(plantilla === '2'){
      this.plantilla1 = false;
      this.plantilla2 = true;
      this.plantilla3 = false;
      this.plantilla4 = false;
      this.plantilla5 = false;
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
    }
    else if(plantilla === '5'){
      this.plantilla1 = false;
      this.plantilla2 = false;
      this.plantilla3 = false;
      this.plantilla4 = false;
      this.plantilla5 = true;
    }
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
    this.noticiasService.insertComentario(this.comentarioObject, "Especial");

      this.comentarioTextArea = "";
      this.captchaElem.resetCaptcha();
      this.repCaptcha = false;
      window.location.reload();
    
  }
  responderComentario(index : any){
    this.comentarioTextArea = "";
    this.comentarioTextArea = "Respondiendo al comentario de @"+this.comentariosList[index].username+"\n \n";
  }
  eliminarComentario(index : any){
    this.noticiasService.deleteComentarioEspecial(this.queryParamID, this.comentariosList[index].$key);
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
}
