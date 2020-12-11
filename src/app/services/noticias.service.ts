import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Noticias, NoticiasPlantilla6 } from '../models/noticias';
import { noticiasNodoGeneral } from '../models/noticiasNodoGeneral';
import { Comentarios } from '../models/comentarios';
import { especialDelMes } from '../models/especialDelMes';
import { patrocinadores, bannerTrimestral } from '../models/patrocinadores';
@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  noticiasSinNodoObject = {
    $key: '',
    id_noticia: '',
    tittle: '',
    seccion: '',
    date: ''
  }
  noticiasList: AngularFireList<any>;
  noticiasPlantilla6List: AngularFireList<any>;
  noticiasNodoGeneralList: AngularFireList<any>;
  comentarioList: AngularFireList<any>;
  especialDelMesList: AngularFireList<any>;
  patrocinadoresList: AngularFireList<any>;
  bannerList: AngularFireList<any>;
  key: string;


  constructor(private firebase: AngularFireDatabase) { }

  getNoticias(last_new: string, list: string) {
    return this.firebase.list('/noticias', ref => ref.orderByKey().equalTo(last_new));
  }
  getNoticiasSelected(id: string) {
    return this.firebase.list('/noticias', ref => ref.orderByKey().equalTo(id));
  }
  getCienciaSelected(id: string) {
    return this.firebase.list('/ciencia', ref => ref.orderByKey().equalTo(id));
  }
  getArtSelected(id: string) {
    return this.firebase.list('/arte', ref => ref.orderByKey().equalTo(id));
  }
  getOcioSelected(id: string) {
    return this.firebase.list('/ocio', ref => ref.orderByKey().equalTo(id));
  }
  getDescubreSelected(id: string) {
    return this.firebase.list('/descubre', ref => ref.orderByKey().equalTo(id));
  }
  getMocotipsSelected(id: string) {
    return this.firebase.list('/mocotips', ref => ref.orderByKey().equalTo(id));
  }

  getNoteToEdit(seccion: string, id: string) {
    if (seccion === 'Noticias') {
      return this.firebase.list('/noticias', ref => ref.orderByKey().equalTo(id));
    }
    else if (seccion === 'Ciencia') {
      return this.firebase.list('/ciencia', ref => ref.orderByKey().equalTo(id));
    }
    else if (seccion === 'Arte') {
      return this.firebase.list('/arte', ref => ref.orderByKey().equalTo(id));
    }
    else if (seccion === 'Ocio') {
      return this.firebase.list('/ocio', ref => ref.orderByKey().equalTo(id));
    }
    else if (seccion === 'Descubre') {
      return this.firebase.list('/descubre', ref => ref.orderByKey().equalTo(id));
    }
    else if (seccion === 'Mocotips') {
      return this.firebase.list('/mocotips', ref => ref.orderByKey().equalTo(id));
    }
  }
  getAllNewsNodoGeneral(limit: number) {
    return this.firebase.list('/todasLasNoticiasJuntas', ref => ref.orderByKey().limitToLast(limit));
  }

  getLastScienceNew() {
    return this.firebase.list('/ciencia', ref => ref.orderByKey().limitToLast(1));
  }
  getLastNoticeNew() {
    return this.firebase.list('/noticias', ref => ref.orderByKey().limitToLast(1));
  }
  getLastArtNew() {
    return this.firebase.list('/arte', ref => ref.orderByKey().limitToLast(1));
  }
  getLastFunNew() {
    return this.firebase.list('/ocio', ref => ref.orderByKey().limitToLast(1));
  }
  getLastFindNew() {
    return this.firebase.list('/descubre', ref => ref.orderByKey().limitToLast(1));
  }


  getFirst3News(seccion: string, id : string) {
    if (seccion === "noticias") {
      return this.firebase.list('/noticias', ref => ref.orderByKey().endAt(id).limitToLast(4));
    }
    else if (seccion === "ciencia") {
      return this.firebase.list('/ciencia', ref => ref.orderByKey().endAt(id).limitToLast(4));
    }
    else if (seccion === "arte") {
      return this.firebase.list('/arte', ref => ref.orderByKey().endAt(id).limitToLast(4));
    }
    else if (seccion === "ocio") {
      return this.firebase.list('/ocio', ref => ref.orderByKey().endAt(id).limitToLast(4));
    }
    else if (seccion === "descubre") {
      return this.firebase.list('/descubre', ref => ref.orderByKey().endAt(id).limitToLast(4));
   
    }
    else if (seccion === "mocotips") {
      return this.firebase.list('/mocotips', ref => ref.orderByKey().endAt(id).limitToLast(4));
   
    }
  }
  getFirst25News(seccion: string) {
    if (seccion === "noticias") {
      return this.firebase.list('/noticias', ref => ref.orderByKey().limitToLast(25));
    }
    else if (seccion === "ciencia") {
      return this.firebase.list('/ciencia', ref => ref.orderByKey().limitToLast(25));
    }
    else if (seccion === "arte") {
      return this.firebase.list('/arte', ref => ref.orderByKey().limitToLast(25));
    }
    else if (seccion === "ocio") {
      return this.firebase.list('/ocio', ref => ref.orderByKey().limitToLast(25));
    }
    else if (seccion === "descubre") {
      return this.firebase.list('/descubre', ref => ref.orderByKey().limitToLast(25));
    }
    else if (seccion === "mocotips") {
      return this.firebase.list('/mocotips', ref => ref.orderByKey().limitToLast(25));
    }
  }
  get25News(seccion: string, pibote: string) {
    if (seccion === "noticias") {
      return this.firebase.list('/noticias', ref => ref.orderByKey().endAt(pibote).limitToFirst(25));
    }
    else if (seccion === "ciencia") {
      return this.firebase.list('/ciencia', ref => ref.orderByKey().endAt(pibote).limitToFirst(25));
    }
    else if (seccion === "arte") {
      return this.firebase.list('/arte', ref => ref.orderByKey().endAt(pibote).limitToFirst(25));
    }
    else if (seccion === "ocio") {
      return this.firebase.list('/ocio', ref => ref.orderByKey().endAt(pibote).limitToFirst(25));
    }
    else if (seccion === "descubre") {
      return this.firebase.list('/descubre', ref => ref.orderByKey().endAt(pibote).limitToFirst(25));
    }
    else if (seccion === "mocotips") {
      return this.firebase.list('/mocotips', ref => ref.orderByKey().endAt(pibote).limitToFirst(25));
    }
  }
  getAnteriores25News(seccion: string, pibote: string) {
    if (seccion === "noticias") {
      return this.firebase.list('/noticias', ref => ref.orderByKey().startAt(pibote).limitToFirst(25));
    }
    else if (seccion === "ciencia") {
      return this.firebase.list('/ciencia', ref => ref.orderByKey().startAt(pibote).limitToFirst(25));
    }
    else if (seccion === "arte") {
      return this.firebase.list('/arte', ref => ref.orderByKey().startAt(pibote).limitToFirst(25));
    }
    else if (seccion === "ocio") {
      return this.firebase.list('/ocio', ref => ref.orderByKey().startAt(pibote).limitToFirst(25));
    }
    else if (seccion === "descubre") {
     return this.firebase.list('/descubre', ref => ref.orderByKey().startAt(pibote).limitToFirst(25));
    }
    else if (seccion === "mocotips") {
      return this.firebase.list('/mocotips', ref => ref.orderByKey().startAt(pibote).limitToFirst(25));
     }
  }
  insertNoticias(noticia: Noticias, seccion: string) { /*Inserta la noticia en una sección especifica dentro de la base de datos Firebase*/

    if (seccion === "Noticias") {
      /*Inserta en el link de noticias*/
      this.noticiasList = this.firebase.list('/noticias');
    }
    else if (seccion === "Ciencia") {
      /*Inserta en el link de ciencia*/
      this.noticiasList = this.firebase.list('/ciencia');
    }
    else if (seccion === "Arte") {
      /*Inserta en el link de arte*/
      this.noticiasList = this.firebase.list('/arte');
    }
    else if (seccion === "Ocio") {
      /*Inserta en el link de ocio*/
      this.noticiasList = this.firebase.list('/ocio');
    }
    else if (seccion === "Descubre") {
      /*Inserta en el link de descubre*/
      this.noticiasList = this.firebase.list('/descubre');
    }
    else if (seccion === "Mocotips") {
      /*Inserta en el link de mocotips*/
      this.noticiasList = this.firebase.list('/mocotips');
    }
    if (noticia) {
      this.noticiasList.push({
        tittle: noticia.tittle,
        phrase: noticia.phrase,
        autor: noticia.autor,
        plantilla: noticia.plantilla,
        date: noticia.date,
        part1: noticia.part1,
        part2: noticia.part2,
        part3: noticia.part3,
        part4: noticia.part4,
        part5: noticia.part5,
        principalImage: noticia.principalImage,
        image1: noticia.image1,
        image2: noticia.image2,
        image3: noticia.image3,
        youtube: noticia.youtube
      }).then((snap) => {
        const key = snap.key
        this.key = key;
        this.noticiasSinNodoObject.id_noticia = this.key;
        this.noticiasSinNodoObject.tittle = noticia.tittle;
        this.noticiasSinNodoObject.date = noticia.date;
        this.noticiasSinNodoObject.seccion = seccion;
        this.insertNoticiasEnNodoGeneral(this.noticiasSinNodoObject);
      });
    }
  }
  insertNoticiasPlantilla6(noticia: NoticiasPlantilla6, seccion: string) { /*Inserta la noticia en una sección especifica dentro de la base de datos Firebase*/

    if (seccion === "Noticias") {
      /*Inserta en el link de noticias*/
      this.noticiasPlantilla6List = this.firebase.list('/noticias');
    }
    else if (seccion === "Ciencia") {
      /*Inserta en el link de ciencia*/
      this.noticiasPlantilla6List = this.firebase.list('/ciencia');
    }
    else if (seccion === "Arte") {
      /*Inserta en el link de arte*/
      this.noticiasPlantilla6List = this.firebase.list('/arte');
    }
    else if (seccion === "Ocio") {
      /*Inserta en el link de ocio*/
      this.noticiasPlantilla6List = this.firebase.list('/ocio');
    }
    else if (seccion === "Descubre") {
      /*Inserta en el link de descubre*/
      this.noticiasPlantilla6List = this.firebase.list('/descubre');
    }
    else if (seccion === "Mocotips") {
      /*Inserta en el link de mocotips*/
      this.noticiasPlantilla6List = this.firebase.list('/mocotips');
    }
    if (noticia) {
      this.noticiasPlantilla6List.push({
        tittle: noticia.tittle,
        phrase: noticia.phrase,
        autor: noticia.autor,
        plantilla: noticia.plantilla,
        date: noticia.date,
        part1: noticia.part1,
        part2: noticia.part2,
        part3: noticia.part3,
        part4: noticia.part4,
        part5: noticia.part5,
        part6: noticia.part6,
        part7: noticia.part7,
        principalImage: noticia.principalImage,
        image1: noticia.image1,
        image2: noticia.image2,
        image3: noticia.image3,
        image4: noticia.image4,
        image5: noticia.image5,
        image6: noticia.image6,
        youtube: noticia.youtube
      }).then((snap) => {
        const key = snap.key
        this.key = key;
        this.noticiasSinNodoObject.id_noticia = this.key;
        this.noticiasSinNodoObject.tittle = noticia.tittle;
        this.noticiasSinNodoObject.date = noticia.date;
        this.noticiasSinNodoObject.seccion = seccion;
        this.insertNoticiasEnNodoGeneral(this.noticiasSinNodoObject);
      });
    }
  }
  insertNoticiasEnNodoGeneral(noticiaNodoGeneral: noticiasNodoGeneral) {
    /*Inserta datos básicos dentro de la base de datos Firebase sin importar en qué sección esté la noticia*/
    this.noticiasNodoGeneralList = this.firebase.list('/todasLasNoticiasJuntas');
    if (noticiaNodoGeneral) {
      this.noticiasNodoGeneralList.push({
        id_noticia: noticiaNodoGeneral.id_noticia,
        tittle: noticiaNodoGeneral.tittle,
        date: noticiaNodoGeneral.date,
        seccion: noticiaNodoGeneral.seccion,
      }).then(() => {
      });
    }
  } 
 
  deleteNoticia(key : string, seccion : string, keyNodo : string){
    if (seccion === "Noticias") {
      /*Elimina en el link de noticias*/
      this.firebase.object('/noticias/'+key).remove();
    }
    else if (seccion === "Ciencia") {
      /*Elimina en el link de ciencia*/
      this.firebase.object('/ciencia/'+key).remove();
    }
    else if (seccion === "Arte") {
      /*Elimina en el link de arte*/
      this.firebase.object('/arte/'+key).remove();
    }
    else if (seccion === "Ocio") {
      /*Elimina en el link de ocio*/
      this.firebase.object('/ocio/'+key).remove();
    }
    else if (seccion === "Descubre") {
      /*Elimina en el link de descubre*/
      this.firebase.object('/descubre/'+key).remove();
    }
    else if (seccion === "Mocotips") {
      /*Elimina en el link de mocotips*/
      this.firebase.object('/mocotips/'+key).remove();
    }
    this.firebase.object('/todasLasNoticiasJuntas/'+keyNodo).remove();
  }

  updateNoticia(noticia: Noticias, seccion: string) {
    return new Promise((resolve, reject) => {
      if (seccion === "Noticias") {
        /*Inserta en el link de noticias*/
        this.noticiasList = this.firebase.list('/noticias');
      }
      else if (seccion === "Ciencia") {
        /*Inserta en el link de ciencia*/
        this.noticiasList = this.firebase.list('/ciencia');
      }
      else if (seccion === "Arte") {
        /*Inserta en el link de arte*/
        this.noticiasList = this.firebase.list('/arte');
      }
      else if (seccion === "Ocio") {
        /*Inserta en el link de ocio*/
        this.noticiasList = this.firebase.list('/ocio');
      }
      else if (seccion === "Descubre") {
        /*Inserta en el link de descubre*/
        this.noticiasList = this.firebase.list('/descubre');
      }
      else if (seccion === "Mocotips") {
        /*Inserta en el link de mocotips*/
        this.noticiasList = this.firebase.list('/mocotips');
      }

      if (noticia) {
        this.noticiasList.update(noticia.$key, {
          tittle: noticia.tittle,
          phrase: noticia.phrase,
          autor: noticia.autor,
          plantilla: noticia.plantilla,
          date: noticia.date,
          part1: noticia.part1,
          part2: noticia.part2,
          part3: noticia.part3,
          part4: noticia.part4,
          part5: noticia.part5,
          principalImage: noticia.principalImage,
          image1: noticia.image1,
          image2: noticia.image2,
          image3: noticia.image3,
          youtube: noticia.youtube
        }).then(() => {
          resolve();
        });
      }
    });
  }
  updateNoticiaPlantilla6(noticia: NoticiasPlantilla6, seccion: string) {
    return new Promise((resolve, reject) => {
      if (seccion === "Noticias") {
        /*Inserta en el link de noticias*/
        this.noticiasList = this.firebase.list('/noticias');
      }
      else if (seccion === "Ciencia") {
        /*Inserta en el link de ciencia*/
        this.noticiasList = this.firebase.list('/ciencia');
      }
      else if (seccion === "Arte") {
        /*Inserta en el link de arte*/
        this.noticiasList = this.firebase.list('/arte');
      }
      else if (seccion === "Ocio") {
        /*Inserta en el link de ocio*/
        this.noticiasList = this.firebase.list('/ocio');
      }
      else if (seccion === "Descubre") {
        /*Inserta en el link de descubre*/
        this.noticiasList = this.firebase.list('/descubre');
      }
      else if (seccion === "Mocotips") {
        /*Inserta en el link de mocotips*/
        this.noticiasList = this.firebase.list('/mocotips');
      }

      if (noticia) {
        this.noticiasList.update(noticia.$key, {
        tittle: noticia.tittle,
        phrase: noticia.phrase,
        autor: noticia.autor,
        plantilla: noticia.plantilla,
        date: noticia.date,
        part1: noticia.part1,
        part2: noticia.part2,
        part3: noticia.part3,
        part4: noticia.part4,
        part5: noticia.part5,
        part6: noticia.part6,
        part7: noticia.part7,
        principalImage: noticia.principalImage,
        image1: noticia.image1,
        image2: noticia.image2,
        image3: noticia.image3,
        image4: noticia.image4,
        image5: noticia.image5,
        image6: noticia.image6,
        youtube: noticia.youtube
        }).then(() => {
          resolve();
        });
      }
    });
  }
  updatetNoticiasEnNodoGeneral(noticiaNodoGeneral: noticiasNodoGeneral) {
    return new Promise((resolve, reject) => {
      this.noticiasNodoGeneralList = this.firebase.list('/todasLasNoticiasJuntas');
      if (noticiaNodoGeneral) {
        this.noticiasNodoGeneralList.update(noticiaNodoGeneral.$key, {
          id_noticia: noticiaNodoGeneral.id_noticia,
          tittle: noticiaNodoGeneral.tittle,
          date: noticiaNodoGeneral.date,
          seccion: noticiaNodoGeneral.seccion,
        }).then(() => {
          resolve();
        });
      }
    });
  }

  /*deleteNoticia($key: string) {
    this.noticiasList.remove($key);
  }*/

  insertEspecialDelMes(especial: especialDelMes) {
    /*Inserta datos básicos dentro de la base de datos Firebase sin importar en qué sección esté la noticia*/
    this.especialDelMesList = this.firebase.list('/especialDelMes');
    if (especial) {
      this.especialDelMesList.push({
        tittle: especial.tittle,
        description: especial.description,
        autor: especial.autor,
        date: especial.date,
        principalImage: especial.principalImage,
        portada1: especial.portada1,
        portada2: especial.portada2
      }).then(() => {
      });
    }
  }
  getLastEspeciaDelMes() {
    return this.firebase.list('/especialDelMes', ref => ref.orderByKey().limitToLast(1));
  }
  getEspecialSelected(id: string) {
    return this.firebase.list('/especialDelMes', ref => ref.orderByKey().equalTo(id));
  }
  getEspecial3Last(id: string) {
    return this.firebase.list('/especialDelMes', ref => ref.orderByKey().endAt(id).limitToLast(4));
  }
  getEspecialNext(id: string) {
    return this.firebase.list('/especialDelMes', ref => ref.orderByKey().endAt(id).limitToLast(2));
  }
  getEspecialPrevious(id: string) {
    return this.firebase.list('/especialDelMes', ref => ref.orderByKey().startAt(id).limitToFirst(2));
  }
  getAllEspeciaDelMes() {
    return this.firebase.list('/especialDelMes', ref => ref.orderByKey());
  }
  updatetEspecialDelMes(especial: especialDelMes) {
    return new Promise((resolve, reject) => {
      this.especialDelMesList = this.firebase.list('/especialDelMes');
      if (especial) {
        this.especialDelMesList.update(especial.$key, {
          tittle: especial.tittle,
          description: especial.description,
          autor: especial.autor,
          date: especial.date,
          principalImage: especial.principalImage,
          portada1: especial.portada1,
          portada2: especial.portada2
        }).then(() => {
          resolve();
        });
      }
    });
  }
  deleteEspecial(keyNodo : string){
    this.firebase.object('/especialDelMes/'+keyNodo).remove();
  }
  insertPatrocinadores(patrocinador: patrocinadores) {
    this.patrocinadoresList = this.firebase.list('/patrocinadores');
    if (patrocinador) {
      this.patrocinadoresList.push({
        patrocinador1Image: patrocinador.patrocinador1Image,
        patrocinador2Image: patrocinador.patrocinador2Image,
        patrocinador3Image: patrocinador.patrocinador3Image,
        patrocinador4Image: patrocinador.patrocinador4Image,
        patrocinador1Url: patrocinador.patrocinador1Url,
        patrocinador2Url: patrocinador.patrocinador2Url,
        patrocinador3Url: patrocinador.patrocinador3Url,
        patrocinador4Url: patrocinador.patrocinador4Url,
      }).then(() => {
      });
    }
  }
  updatePatrocinadores(patrocinador: patrocinadores) {
    return new Promise((resolve, reject) => {
      this.patrocinadoresList = this.firebase.list('/patrocinadores');
      if (patrocinador) {
        this.patrocinadoresList.update(patrocinador.$key, {
        patrocinador1Image: patrocinador.patrocinador1Image,
        patrocinador2Image: patrocinador.patrocinador2Image,
        patrocinador3Image: patrocinador.patrocinador3Image,
        patrocinador4Image: patrocinador.patrocinador4Image,
        patrocinador1Url: patrocinador.patrocinador1Url,
        patrocinador2Url: patrocinador.patrocinador2Url,
        patrocinador3Url: patrocinador.patrocinador3Url,
        patrocinador4Url: patrocinador.patrocinador4Url,
        }).then(() => {
          resolve();
        });
      }
    });
  }
  getPatrocinadores() {
    return this.firebase.list('/patrocinadores', ref => ref.orderByKey());
  }
  insertBanner(banner: bannerTrimestral) {
    console.log(banner);
    this.bannerList = this.firebase.list('/bannerTrimestral');
    if (bannerTrimestral) {
      this.bannerList.push({
        banner1Image: banner.banner1Image,
        banner2Image: banner.banner2Image,
        banner3Image: banner.banner3Image,
        banner1Url: banner.banner1Url,
        banner2Url: banner.banner2Url,
        banner3Url: banner.banner3Url,
      }).then(() => {
      });
    }
  }
  updateBanner(banner: bannerTrimestral) {
    return new Promise((resolve, reject) => {
      this.bannerList = this.firebase.list('/bannerTrimestral');
      if (banner) {
        this.bannerList.update(banner.$key, {
          banner1Image: banner.banner1Image,
          banner2Image: banner.banner2Image,
          banner3Image: banner.banner3Image,
          banner1Url: banner.banner1Url,
          banner2Url: banner.banner2Url,
          banner3Url: banner.banner3Url,
        }).then(() => {
          resolve();
        });
      }
    });
  }
  getBanner() {
    return this.firebase.list('/bannerTrimestral', ref => ref.orderByKey());
  }
  insertComentario(comentario: Comentarios, seccion: string) {
    /*Inserta un comentario en una noticia*/
    if (seccion === "Noticias") {
      /*Inserta en el link de noticias*/
      this.comentarioList = this.firebase.list('/noticias/'+comentario.id_noticia+'/comentarios');
    }
    else if (seccion === "Ciencia") {
      /*Inserta en el link de ciencia*/
      this.comentarioList = this.firebase.list('/ciencia/'+comentario.id_noticia+'/comentarios');
    }
    else if (seccion === "Arte") {
      /*Inserta en el link de arte*/
      this.comentarioList = this.firebase.list('/arte/'+comentario.id_noticia+'/comentarios');
    }
    else if (seccion === "Ocio") {
      /*Inserta en el link de ocio*/
      this.comentarioList = this.firebase.list('/ocio/'+comentario.id_noticia+'/comentarios');
    }
    else if (seccion === "Descubre") {
      /*Inserta en el link de descubre*/
      this.comentarioList = this.firebase.list('/descubre/'+comentario.id_noticia+'/comentarios');
    }
    else if (seccion === "Mocotips") {
      /*Inserta en el link de mocotips*/
      this.comentarioList = this.firebase.list('/mocotips/'+comentario.id_noticia+'/comentarios');
    }
    else if (seccion === "Especial") {
      /*Inserta en el link de mocotips*/
      this.comentarioList = this.firebase.list('/especialDelMes/'+comentario.id_noticia+'/comentarios');
    }
    
    if (comentario) {
      this.comentarioList.push({
        username: comentario.username,
        date: comentario.date,
        comment: comentario.comment,
        userPicture: comentario.userPicture,
        uid: comentario.uid
      }).then(() => {
       
      });
    }
  }
  deleteComentario(noteKey : string, seccion : string, commentKey : string){
    if (seccion === "Noticias") {
      /*Elimina en el link de noticias*/
     this.firebase.object('/noticias/'+noteKey+'/comentarios/'+commentKey).remove();
    }
    else if (seccion === "Ciencia") {
      /*Elimina en el link de ciencia*/
      this.firebase.object('/ciencia/'+noteKey+'/comentarios/'+commentKey).remove();
    }
    else if (seccion === "Arte") {
      /*Elimina en el link de arte*/
      this.firebase.object('/arte/'+noteKey+'/comentarios/'+commentKey).remove();
    }
    else if (seccion === "Ocio") {
      /*Elimina en el link de ocio*/
      this.firebase.object('/ocio/'+noteKey+'/comentarios/'+commentKey).remove();
    }
    else if (seccion === "Descubre") {
      /*Elimina en el link de descubre*/
      this.firebase.object('/descubre/'+noteKey+'/comentarios/'+commentKey).remove();
    }
    else if (seccion === "Mocotips") {
      /*Elimina en el link de mocotips*/
      this.firebase.object('/mocotips/'+noteKey+'/comentarios/'+commentKey).remove();
    }
    
  }
  getComentarioCiencia(id: string) {
    return this.firebase.list('/ciencia/'+id+'/comentarios', ref => ref.orderByKey());
  }
  getComentarioNoticias(id: string) {
    return this.firebase.list('/noticias/'+id+'/comentarios', ref => ref.orderByKey());
  }
  getComentarioArte(id: string) {
    return this.firebase.list('/arte/'+id+'/comentarios', ref => ref.orderByKey());
  }
  getComentarioOcio(id: string) {
    return this.firebase.list('/ocio/'+id+'/comentarios', ref => ref.orderByKey());
  }
  getComentarioDescubre(id: string) {
    return this.firebase.list('/descubre/'+id+'/comentarios', ref => ref.orderByKey());
  }
  getComentarioMocotips(id: string) {
    return this.firebase.list('/mocotips/'+id+'/comentarios', ref => ref.orderByKey());
  }
  getComentarioEspecial(id: string) {
    return this.firebase.list('/especialDelMes/'+id+'/comentarios', ref => ref.orderByKey());
  }

  deleteComentarioEspecial(noteKey : string, commentKey : string){

      /*Elimina en el link de noticias*/
     this.firebase.object('/especialDelMes/'+noteKey+'/comentarios/'+commentKey).remove();
    
  }
  searchNew(busqueda: string) {
    return this.firebase.list('/todasLasNoticiasJuntas', ref => ref.orderByChild('tittle').startAt(busqueda).endAt(busqueda+'\uf8ff'));
  }
}
