import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NoticiasService } from '../services/noticias.service';
import { bannerTrimestral } from '../models/patrocinadores';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-revista-trimestral',
  templateUrl: './revista-trimestral.component.html',
  styleUrls: ['./revista-trimestral.component.css']
})
export class RevistaTrimestralComponent implements OnInit {

  userPicture: string = "";
  userName: string = "";
  Moconauta: string = "MOCONAUTA ";
  Ingreso: string = "INGRESO";

  bannerClass = 'structure-news-selected';
  photo = "./../../assets/images/Backround_Lines.jpg";
  eje_top: string[] = ['0rem', '15rem', '30rem', '45rem'];
  eje_top_descripcion: string[] = ['8rem', '23rem', '38rem', '53rem'];
  imagenes_elementos1columna: string[] = ["./../../assets/images/HurgaDatos.png"]; //prueba, luego tomara los datos del storgae
  imagenes_elementos2columna: string[] = ["./../../assets/images/EcoMoco.png"]; //prueba, luego tomara los datos del storgae
  descripcion_elementos1columna: string[] = ['Datos raros sobre distintos temas para alimentar la mente curiosa de un niño ']; //prueba, luego tomara los datos del storgae
  descripcion_elementos2columna: string[] = ['Encontrarás tips e historias para despertar una conciencia ecológica']; //prueba, luego tomara los datos del storgae
  revista_elementos: number[] = [];
  elementos: number;
  top_medida: number;
  bannerList: bannerTrimestral[];
  banner1: boolean = false;
  banner2: boolean = false;
  banner3: boolean = false;

  banner1Image: string = "";
  banner2Image: string = "";
  banner3Image: string = "";

  banner1Url: string = "";
  banner2Url: string = "";
  banner3Url: string = "";

  images = ["./../../assets/images/Revista_Banner.png", "./../../assets/images/Revista_Banner.png", "./../../assets/images/Revista_Banner.png"];
  constructor(private cookie: CookieService, public router: Router, public noticiasService: NoticiasService, private meta: Meta,
    private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle("Revista Trimestral");

    this.meta.updateTag({ 'name': 'keywords', 'content': 'Revista Trimestral' });
    this.meta.updateTag({ 'name': 'description', 'content': 'Revista Trimestral' });
    this.meta.updateTag({ 'name': 'twitter:card', 'content': 'summary_large_image' });
    this.meta.updateTag({ 'name': 'twitter:title', 'content': '¡Conoce nuestra revista trimestral!' });
    this.meta.updateTag({ 'name': 'twitter:text:title', 'content': '¡Conoce nuestra revista trimestral!' });
    this.meta.updateTag({ 'name': 'twitter:description', 'content': 'Revista para mentes curiosas' });
    this.meta.updateTag({ 'name': 'twitter:image', 'content': 'asd' });
    this.meta.updateTag({ 'name': 'twitter:image:alt', 'content': 'asdasd' });
    this.meta.updateTag({ 'property': 'og:title', 'content': '¡Conoce nuestra revista trimestral!' });
    this.meta.updateTag({ 'property': 'og:image', 'content': 'asdsad' });
    this.meta.updateTag({ 'property': 'og:image:alt', 'content': 'asdasd' });
    this.meta.updateTag({ 'property': 'og:description', 'content': 'Revista para mentes curiosas' });

    var cookie = this.cookie.check("username");
    if (cookie === true) {
      this.userPicture = this.cookie.get("image");
      this.userName = this.cookie.get("username");
      this.Ingreso = "CERRAR SESIÓN"
      this.Moconauta = this.cookie.get("username").toUpperCase() + " ";
    }
    else {
      this.userPicture = "./../../assets/images/Boton_Moconauta.png";
    }
    this.elementos = 4;
    for (let i = 0; i < this.elementos; i++) {
      this.revista_elementos.push(i);
      this.top_medida = i + 1;
      this.eje_top.push(i + '9rem');
    }
    this.noticiasService.getBanner().snapshotChanges().subscribe(item => {
      this.bannerList = [];
      item.slice().reverse().forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        this.bannerList.push(json as bannerTrimestral);
      });
      this.setMetaTags();
      if (this.bannerList[0].banner1Image !== "") {
        this.banner1 = true;
        this.banner1Image = this.bannerList[0].banner1Image;
        this.banner1Url = this.bannerList[0].banner1Url;
      }
      if (this.bannerList[0].banner2Image !== "") {
        this.banner2 = true;
        this.banner2Image = this.bannerList[0].banner2Image;
        this.banner2Url = this.bannerList[0].banner2Url;
      }
      if (this.bannerList[0].banner3Image !== "") {
        this.banner3 = true;
        this.banner3Image = this.bannerList[0].banner3Image;
        this.banner3Url = this.bannerList[0].banner3Url;
      }

    });
  }
  setMetaTags(): void {

  }
  primeraColumna(number: any) {

    if (number == 0) {
      let styles = {
        'top': this.eje_top[0],
        'background-image': 'url(' + this.imagenes_elementos1columna[number] + ')'
      };
      return styles;
    }
    else {
      let styles = {
        'top': this.eje_top[number],
        'background-color': 'lawngreen'
      };
      return styles;
    }
  }
  segundaColumna(number: any) {

    if (number == 0) {
      let styles = {
        'top': this.eje_top[0],
        'right': '10%',
        'background-image': 'url(' + this.imagenes_elementos2columna[number] + ')'

      };
      return styles;
    }
    else {
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

  primeraColumnaDescripcion(number: any) {

    if (number == 0) {
      let styles = {
        'top': this.eje_top_descripcion[0],
      };
      return styles;
    }
    else {
      let styles = {
        'top': this.eje_top_descripcion[number],
        'background-color': 'pink'
      };
      return styles;
    }
  }
  segundaColumnaDescripcion(number: any) {

    if (number == 0) {
      let styles = {
        'top': this.eje_top_descripcion[0],
        'right': '0%'
      };
      return styles;
    }
    else {
      let styles = {
        'top': this.eje_top_descripcion[number],
        'right': '0%',
        'background-color': 'pink'
      };
      return styles;
    }
  }
  copiarEnlace() {
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
  redirectTo() {
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