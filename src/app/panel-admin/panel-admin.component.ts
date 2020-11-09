import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormControl } from '@angular/forms';
import { NoticiasService } from '../services/noticias.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { noticiasNodoGeneral } from '../models/noticiasNodoGeneral';
import { Noticias } from '../models/noticias';
import { NoticiasNodoGeneralInterface } from '../interfaces/NoticiasNodoGeneral';
import { revistaDigitalInterface } from '../interfaces/RevistasDigital';
import { EspecialDelMesInterface } from '../interfaces/EspecialDelMes';
import { AuthService } from '../services/auth.service';
import { revistaDigital } from '../models/revistaDigital';
import { especialDelMes } from '../models/especialDelMes';
import { patrocinadores } from '../models/patrocinadores';
import { CookieService } from 'ngx-cookie-service';



@Component({
  selector: 'app-panel-admin',
  templateUrl: './panel-admin.component.html',
  styleUrls: ['./panel-admin.component.css']
})

export class PanelAdminComponent implements OnInit {


  /*Definición de las opciónes que contendra el editor QuillJS*/
  editorOptions = {

    toolbar: {
      container:
        [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction
          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{
            'color': ['#132b1b', '#cd771a', '#00606f', '#8b2861', '#c8b721', '#732f79', '#51491c',
              '#63c748', '#e67a03', '#00b0b9', '#cc3d8f', '#edaa28', '#814d95', '#87722b',
              '#86cf42', '#f69c3f', '#68cecf', '#f8629f', '#fbd414', '#a668a3', '#ca8e2c',
              '#b6e093', '#fae2c7', '#c5eaeb', '#ffd1dc', '#f5e5aa', '#efbacf', '#d5cd96',
              '#1b1919', '#6d6e6d', '#9e9f9e', 'white']
          }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'align': [] }],
          ['clean']                                         // remove formatting button                                // remove formatting button
        ]
    }

  };
  /*Variables para el inicio de sesió*/
  usuarioLogueado: boolean;
  ingresoSesion: string = "";
  usuario: string = "";
  contra: string = "";
  /*Variables para conocer  la fecha actual*/
  myDate: any = new Date();
  currentDay: number;
  currentMonth: number;
  currentYear: number;
  currentDate: string; //Fecha final
  /*Opciones del select HTML*/
  selectedValue: string[] = ['Noticias', 'Ciencia', 'Arte', 'Ocio', 'Descubre', 'Mocotips'];
  selectedDia: number[] = [];
  selectedMes: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  selectedAnio: number[] = [];
  selectedItem: string;
  selectedItemDia: string;
  selectedItemMes: string;
  selectedItemAnio: string;
  /*Definición de los QuillJS editores para las notas*/
  editorForm: FormGroup;
  editorForm2: FormGroup;
  editorForm3: FormGroup;
  editorForm4: FormGroup;
  editorForm5: FormGroup;
  editorForm6: FormGroup;
  editorForm7: FormGroup;
  editorForm8: FormGroup;
  /*Definición del QuillJS editor para el especial del mes*/
  editorFormEspecial: FormGroup;
  /*Variables que contendrán el texto de cada editor QuillJS*/
  editorContent: string;
  editorContent2: string;
  editorContent3: string;
  editorContent4: string;
  editorContent5: string;
  editorContent6: string;
  editorContent7: string;
  editorContent8: string;
  /*----  REVISTA PARA PADRES ----*/
  /*Definición de los QuillJS editores para la revista para padres*/
  editorFormRevista: FormGroup;
  editorFormRevista2: FormGroup;
  editorFormRevista3: FormGroup;
  editorFormRevista4: FormGroup;
  editorFormRevista5: FormGroup;
  editorFormRevista6: FormGroup;
  editorFormRevista7: FormGroup;
  editorFormRevista8: FormGroup;
  editorFormRevista9: FormGroup;
  editorFormRevista10: FormGroup;
  /*Validadores para saber en qué sección de la revista para padres se está*/
  seccionRevista1: boolean = false;
  seccionRevista2: boolean = false;
  seccionRevista3: boolean = false;
  seccionRevista4: boolean = false;
  seccionRevista5: boolean = false;
  seccionRevista6: boolean = false;
  seccionRevista7: boolean = false;
  seccionRevista8: boolean = false;
  seccionRevista9: boolean = false;
  seccionRevista10: boolean = false;
  /*Variable para conocer el estado de progreso en la edición de textos en la revista para padres*/

  /*Variables para guardar los títulos que llevará cada sección de la revista para padres*/
  tituloRevistaMocotips: string = "";
  tituloRevistaMocotips2: string = "";
  tituloRevistaMocotips3: string = "";
  tituloRevistaMocotips4: string = "";
  tituloRevistaMocotips5: string = "";
  tituloRevistaMocotips6: string = "";
  tituloRevistaMocotips7: string = "";
  tituloRevistaMocotips8: string = "";
  tituloRevistaMocotips9: string = "";
  tituloRevistaMocotips10: string = "";
  /*Variables para la definición de revistas*/
  tituloRevistaMocotipsPrincipal: string = "";
  descripcionRevistaMocotipsPrincipal: string = "";
  anioRevistaMocotipsPrincipal: string = "";
  numeroRevistaMocotipsPrincipal: string = "";
  costoRevistaMocotipsPrincipal: string = "";
  /*Variables para los patrocinadores*/
  urlPatrocinador1: string = "";
  urlPatrocinador2: string = "";
  urlPatrocinador3: string = "";
  urlPatrocinador4: string = "";
  urlPatrocinador1Delete: boolean = false;
  urlPatrocinador2Delete: boolean = false;
  urlPatrocinador3Delete: boolean = false;
  urlPatrocinador4Delete: boolean = false;
  /*Variable para saber en qué sección están de la revista para padres*/
  parteRevistaMocotips: string;
  /*Variables para inicializar la tabla de angular con las noticias creadas*/
  displayedColumnsNotas: string[] = ['select', 'tittle', 'date', 'seccion'];
  displayedColumnsRevistas: string[] = ['select', 'tittle', 'anio', 'numero'];
  displayedColumnsEspeciales: string[] = ['select', 'tittle', 'autor', 'date'];
  selectedRows: number[] = [];
  notSelectedRows: number[] = [];
  selection = new SelectionModel<NoticiasNodoGeneralInterface>(true, []);
  selectionRevista = new SelectionModel<revistaDigitalInterface>(true, []);
  selectionEspecial = new SelectionModel<EspecialDelMesInterface>(true, []);

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  /*Variables para cambiar de opciones en el menú principañ*/
  secciones: boolean = false;
  revista: boolean = false;
  mocotips: boolean = false;
  especial: boolean = false;
  menuPrincipal: boolean = true;
  entradaNueva: boolean = false;
  revistaImagenes: boolean = false;
  revistaImagenesElegir: boolean = false;
  revistaMocotipsElegir: boolean = false;
  crearRevistaDigital: boolean = false;
  crearRevistaDigitalMocotips: boolean = false;
  patrocinador: boolean = false;
  subirDatosRevistaMocotips: boolean = false;
  especialDelMes: boolean = false;
  seccionEspecialDelMes: boolean = false;
  especialDelMesImagenes: boolean = false;
  especialDelMesSubirImagen: boolean = false;

  tituloEspecial: string = "";
  autorEspecial: string = "";

  redactarNueva: boolean = false;
  redactarNueva2: boolean = false;
  redactarNueva3: boolean = false;
  redactarNueva4: boolean = false;
  redactarNueva5: boolean = false;
  redactarNueva6: boolean = false;

  publicarplantilla1: boolean = false;
  publicarplantilla2: boolean = false;
  publicarplantilla3: boolean = false;
  publicarplantilla4: boolean = false;
  publicarplantilla5: boolean = false;
  publicarplantilla6: boolean = false;

  redactarInsertarImagenes: boolean = false;
  redactarInsertarImagenesPlantilla6: boolean = false;
  part3AndYoutubeImagenes: boolean = false;

  plantillaSubirImagen1: boolean = false;
  plantillaSubirImagen2: boolean = false;
  plantillaSubirImagen3: boolean = false;
  plantillaSubirImagen4: boolean = false;
  plantillaSubirImagen5: boolean = false;
  plantillaSubirImagen6: boolean = false;

  progressBar: number = 25;
  progressBar2: number = 25;
  progressBar3: number = 25;
  progressBar4: number = 25;
  progressBar5: number = 25;
  progressBar6: number = 25;

  plantilla1parte: number = 1;
  plantilla2parte: number = 1;
  plantilla3parte: number = 1;
  plantilla4parte: number = 1;
  plantilla5parte: number = 1;
  plantilla6parte: number = 1;

  titulo: string = "";
  titulo2: string = "";
  titulo3: string = "";
  titulo4: string = "";
  titulo5: string = "";
  titulo6: string = "";

  titulo_youtube: string = "";

  autor: string = "";
  autor2: string = "";
  autor3: string = "";
  autor4: string = "";
  autor5: string = "";
  autor6: string = "";

  redactarPlantilla1_1: boolean = true;
  redactarPlantilla1_2: boolean = false;
  redactarPlantilla1_3: boolean = false;
  redactarPlantilla1_4: boolean = false;

  redactarPlantilla2_1: boolean = true;
  redactarPlantilla2_2: boolean = false;
  redactarPlantilla2_3: boolean = false;

  redactarPlantilla3_1: boolean = true;
  redactarPlantilla3_2: boolean = false;
  redactarPlantilla3_3: boolean = false;
  redactarPlantilla3_4: boolean = false;
  redactarPlantilla3_5: boolean = false;

  redactarPlantilla4_1: boolean = true;
  redactarPlantilla4_2: boolean = false;
  redactarPlantilla4_3: boolean = false;
  redactarPlantilla4_4: boolean = false;
  redactarPlantilla4_5: boolean = false;
  redactarPlantilla4_6: boolean = false;

  redactarPlantilla5_1: boolean = true;
  redactarPlantilla5_2: boolean = false;
  redactarPlantilla5_3: boolean = false;
  redactarPlantilla5_4: boolean = false;
  redactarPlantilla5_5: boolean = false;

  redactarPlantilla6_1: boolean = true;
  redactarPlantilla6_2: boolean = false;
  redactarPlantilla6_3: boolean = false;
  redactarPlantilla6_4: boolean = false;
  redactarPlantilla6_5: boolean = false;
  redactarPlantilla6_6: boolean = false;
  redactarPlantilla6_7: boolean = false;
  redactarPlantilla6_8: boolean = false;

  plantilla1_imagen_1: string = "./../../assets/images/plantilla1-parte1.png";
  plantilla2_imagen_1: string = "./../../assets/images/plantilla2-parte1.png";
  plantilla3_imagen_1: string = "./../../assets/images/plantilla3-parte1.png";
  plantilla4_imagen_1: string = "./../../assets/images/plantilla4-parte1.png";
  plantilla5_imagen_1: string = "./../../assets/images/plantilla5-parte1.png";
  plantilla6_imagen_1: string = "./../../assets/images/plantilla6-parte1.png";

  imageClick1: boolean = false;
  imageClick2: boolean = false;
  imageClick3: boolean = false;
  imageClick4: boolean = false;
  imageClick5: boolean = false;

  fileToUpload1: File = null;
  fileToUpload2: File = null;
  fileToUpload3: File = null;

  fileToUpload4_6: File = null;
  fileToUpload5_6: File = null;
  fileToUpload6_6: File = null;

  fileToUpload4: File = null;
  fileToUploadPrincipal: File = null;

  fileToUpload1Name1: string = "Selecciona una imagen";
  fileToUpload1Name2: string = "Selecciona una imagen";
  fileToUpload1Name3: string = "Selecciona una imagen";
  fileToUpload1Name4: string = "Selecciona una imagen";

  fileToUpload1Name1_6: string = "Imagen 1";
  fileToUpload1Name2_6: string = "Imagen 2";
  fileToUpload1Name3_6: string = "Imagen 3";
  fileToUpload1Name4_6: string = "Imagen 4";
  fileToUpload1Name5_6: string = "Imagen 5";
  fileToUpload1Name6_6: string = "Imagen 6";



  imagenTamanio1: boolean = false;
  imagenTamanio2: boolean = false;
  imagenTamanio3: boolean = false;

  imagenTamanio1CSS: string = "";
  imagenTamanio2CSS: string = "";
  imagenTamanio3CSS: string = "";

  imagenTamanio1Full: boolean = false;
  imagenTamanio2Full: boolean = false;
  imagenTamanio3Full: boolean = false;

  urlImage1: string = "";
  urlImage2: string = "";
  urlImage3: string = "";
  urlImage4: string = "";
  urlImage5: string = "";
  urlImage6: string = "";
  urlImagePrincipal: string = "";

  keyToEdit: string = "";
  keyToEditSeccion: string = "";
  keyNodoGeneral: string = "";

  keysSelected: string[] = [];
  seccionSelected: string[] = [];
  nodoGeneralSelected: string[] = [];
  revistastKey: string[] = [];
  revistastKeySelected: string = "";
  idImagenesRevistaDig: string[] = ["", "", "", "", "", "", "", "", "", ""];
  idTipsRevistaDig: string[] = ["", "", "", "", "", "", "", "", "", ""];

  editarVisibilidad: string = "hidden";
  eliminarVisibilidad: string = "hidden";
  editarNota: boolean = false;
  selectSeccionNotaDisabled: boolean = false;
  agregarImagenesRevista: boolean = false;
  permisoEliminarRevista: boolean[] = [false, false, false, false, false, false, false, false, false, false,];
  image1UploadPercent: Observable<number>;

  revistaMocotips1 : boolean = false;
  statusUploadImage1: string = "";

  buttondisabled: string = "";
  buttonActualizaDisabled: string = "";

  imagenesRevistaDigital: string[] = [];
  actualRevistaDigitalSection: string = "";
  actualRevistaDigital: string = "";
  imagenesSubidasColor: string[] = [];
  revistaMocotips: boolean = false;
  cargandoRevistas: string = "Cargando..."
  eliminandoRevistas: string = "Revistas digitales (imágenes)";
  eliminandoRevistasMocotips: string = "Revistas digitales (mocotips)";

  actualizarMocotip : boolean = false;

  numeroDeImagenesRevistaDigital: number = 1;

  mensajeError: string = "";
  olvidarcontra : boolean = false;

  editorStyle = {
    height: '300px'
  }

  noticiasObject = {
    $key: '',
    tittle: '',
    phrase: '',
    autor: '',
    plantilla: '',
    date: '',
    part1: '',
    part2: '',
    part3: '',
    part4: '',
    part5: '',
    principalImage: '',
    image1: '',
    image2: '',
    image3: '',
    youtube: ''
  }
  noticiasObjectPlantilla6 = {
    $key: '',
    tittle: '',
    phrase: '',
    autor: '',
    plantilla: '',
    date: '',
    part1: '',
    part2: '',
    part3: '',
    part4: '',
    part5: '',
    part6: '',
    part7: '',
    principalImage: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    image5: '',
    image6: '',
    youtube: ''
  }
  noticiasNodoGeneralObject = {
    $key: '',
    id_noticia: '',
    tittle: '',
    seccion: '',
    date: '',
  }
  especialDelMesObject = {
    $key: '',
    tittle: '',
    description: '',
    autor: '',
    date: '',
    principalImage: '',
    portada1: '',
    portada2: '',
  }
  revistaDigitalObject = {
    key: '',
    tittle: '',
    description: '',
    anio: '',
    numero: '',
    costo: '',
    imagenPrincipal: '',
    idioma: ''
  }
  mocotipsObject = {
    key: '',
    tittle: '',
    contenido: ''
  }
  patrocinadoresObject = {
    $key: '',
    patrocinador1Image: '',
    patrocinador2Image: '',
    patrocinador3Image: '',
    patrocinador4Image: '',
    patrocinador1Url: '',
    patrocinador2Url: '',
    patrocinador3Url: '',
    patrocinador4Url: '',
  }
  imagenesRevistaObject = {
    key: '',
  }

  noticiasNodoGeneralList: noticiasNodoGeneral[];
  notaParaEditar: Noticias[];
  userData = [];
  
  revistaDigital: revistaDigital[];
  revistaDigitalMocotips: revistaDigital[];

  especialDelMesList: especialDelMes[];
  patrocinadoresList: patrocinadores[];
  especialParaEditar: especialDelMes[];
  patrocinadoresParaEditar: patrocinadores[];
  revistaDigitalParaEditar: revistaDigital[];

  dataSource = new MatTableDataSource(this.noticiasNodoGeneralList);
  dataSourceRevista = new MatTableDataSource(this.revistaDigital);
  dataSourceEspecial = new MatTableDataSource(this.especialDelMesList);
  dataSourceRevistaMocotips = new MatTableDataSource(this.revistaDigitalMocotips);

  cats = [];
  constructor(private authService: AuthService, public noticiasService: NoticiasService, private storage: AngularFireStorage, private cloudfirestore: AuthService, private cookie: CookieService) {

  }

  ngOnInit(): void {
    var cookie = this.cookie.check("loggin-status");
    this.authService.checkAuthStatus();
    if (cookie === true) {
      this.usuarioLogueado = false;
      this.ingresoSesion = "CERRAR SESIÓN"
      console.log("si entro")
    }
    else {
      this.usuarioLogueado = true;
      this.ingresoSesion = "INICIAR SESIÓN"
    }
    this.currentYear = this.myDate.getFullYear();
    this.currentMonth = this.myDate.getMonth() + 1;
    this.currentDay = this.myDate.getDate();

    for (let i = this.currentYear; i >= 2010; i--) {
      this.selectedAnio.push(i);
    }
    for (let i = 1; i <= 31; i++) {
      this.selectedDia.push(i);
    }

    if (this.currentMonth === 13) {
      this.currentMonth = 12;
    }
    this.currentDate = this.currentYear + '-' + this.currentMonth + '-' + this.currentDay;
    console.log(this.currentDate)

    // this.dataSource.paginator = this.paginator;

    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSourceRevista.paginator = this.paginator.toArray()[1];
    this.dataSourceRevistaMocotips.paginator = this.paginator.toArray()[3];

  }
  register(e: any) {
    this.usuario = e.target.user_name.value;
    this.contra = e.target.pass_name.value;
      this.authService.loggeo(this.usuario, this.contra).then(r => this.getUserUid());
  }
  reestablecerContra(){
    console.log(this.usuario);
    this.authService.resetPassword(this.usuario);
    this.olvidarcontra = false;
    this.mensajeError = "Correo enviado"
  }
  getUserUid(){
    var uID;
    if(this.authService.getUid() === "no"){
      console.log("NO existo");
      this.mensajeError = "Correo o contraseña incorrectos";
      this.olvidarcontra = true;
    }
    else{
      
      uID = this.authService.getUid();
      console.log(uID);
      this.mensajeError = "Cargando...";
          this.cookie.set("loggin-status", "true");
          window.location.reload();
    }
  }
  cerrarSesion() {
    if (this.usuarioLogueado === false) {
      this.cookie.deleteAll();
      window.location.reload();
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilterRevista(event: Event) {
    const filterValue1 = (event.target as HTMLInputElement).value;
    this.dataSourceRevista.filter = filterValue1.trim().toLowerCase();
  }
  applyFilterEspecial(event: Event) {
    const filterValue2 = (event.target as HTMLInputElement).value;
    this.dataSourceEspecial.filter = filterValue2.trim().toLowerCase();
  }
  changeSection(section: string) {
    if (section === "S") {
      this.restartAll();
      this.hideAllRevistaEditors();
      this.seccionesFalse();
      this.secciones = true;
      this.redactNuevaFalse();
      this.variableSinUsoMenu();
      this.keysSelected = [];
      this.seccionSelected = [];
      this.nodoGeneralSelected = [];
      console.log(this.nodoGeneralSelected);
      this.editarVisibilidad = "hidden";
      this.eliminarVisibilidad = "hidden";
      this.selectSeccionNotaDisabled = false;
      this.noticiasService.getAllNewsNodoGeneral(100000).snapshotChanges().subscribe(item => {
        this.noticiasNodoGeneralList = [];
        item.slice().reverse().forEach(element => {
          let json = element.payload.toJSON();
          json["$key"] = element.key;
          this.noticiasNodoGeneralList.push(json as noticiasNodoGeneral);
        });
        this.dataSource = new MatTableDataSource(this.noticiasNodoGeneralList);
        this.dataSource.paginator = this.paginator.toArray()[0];
      });
    }
    else if (section === "M") {
      this.restartAll();
      this.hideAllRevistaEditors();
      this.nodoGeneralSelected = [];
      this.editarVisibilidad = "hidden";
      this.eliminarVisibilidad = "hidden";
      this.seccionesFalse();
      this.especial = true;
      this.redactNuevaFalse();
      this.variableSinUsoMenu();
      this.cleanTittle();
      this.editorFormEspecial = new FormGroup({
        'editorEspecial': new FormControl(null)
      })
      this.seccionEspecialDelMes = true;
      this.noticiasService.getAllEspeciaDelMes().snapshotChanges().subscribe(item => {
        this.especialDelMesList = [];
        item.slice().reverse().forEach(element => {
          let json = element.payload.toJSON();
          json["$key"] = element.key;
          this.especialDelMesList.push(json as especialDelMes);
        });
        this.dataSourceEspecial = new MatTableDataSource(this.especialDelMesList);
        this.dataSourceEspecial.paginator = this.paginator.toArray()[1];

      });
    }
    else if (section === "R") {
      this.restartAll();
      this.seccionesFalse();
      this.revista = true;
      this.redactNuevaFalse();
      this.variableSinUsoMenu();
      this.hideAllRevistaEditors();
      this.nodoGeneralSelected = [];
      this.idImagenesRevistaDig = [];
      this.revistastKey = [];
      this.editarVisibilidad = "hidden";
      this.eliminarVisibilidad = "hidden";
      this.cloudfirestore.getRevistas().subscribe(item => {
        console.log("olita")

        this.revistaDigital = [];
        item.forEach((revista: any) => {

          this.revistaDigital.push({
            key: revista.payload.doc.data().key,
            id: revista.payload.doc.id,
            anio: revista.payload.doc.data().anio,
            costo: revista.payload.doc.data().costo,
            description: revista.payload.doc.data().description,
            imagenPrincipal: revista.payload.doc.data().imagenPrincipal,
            numero: revista.payload.doc.data().numero,
            idioma: revista.payload.doc.data().idioma,
            tittle: revista.payload.doc.data().tittle,
            //tittle: revista.payload.doc.id,

          });

        })

        this.dataSourceRevista = new MatTableDataSource(this.revistaDigital);
        this.dataSourceRevista.paginator = this.paginator.toArray()[2];
      })
    }
    else if (section === "P") {
      this.seccionesFalse();

      //this.mocotips = true;
      this.restartAll();
      this.nodoGeneralSelected = [];
      this.revistastKey = [];

      this.idTipsRevistaDig = [];
      this.editarVisibilidad = "hidden";
      this.eliminarVisibilidad = "hidden";
      this.redactNuevaFalse();
      this.redactarInsertarImagenes = false;
      this.redactarInsertarImagenesPlantilla6 = false;
      this.subirDatosRevistaMocotips = false;

      this.hideAllRevistaEditors();
      this.tituloRevistaMocotips = "";
      this.tituloRevistaMocotips2 = "";
      this.tituloRevistaMocotips3 = "";
      this.tituloRevistaMocotips4 = "";
      this.tituloRevistaMocotips5 = "";
      this.tituloRevistaMocotips6 = "";
      this.tituloRevistaMocotips7 = "";
      this.tituloRevistaMocotips8 = "";
      this.tituloRevistaMocotips9 = "";
      this.tituloRevistaMocotips10 = "";
      this.editorFormRevista = new FormGroup({
        'editorRevista': new FormControl(null)
      })
      this.editorFormRevista2 = new FormGroup({
        'editorRevista2': new FormControl(null)
      })
      this.editorFormRevista3 = new FormGroup({
        'editorRevista3': new FormControl(null)
      })
      this.editorFormRevista4 = new FormGroup({
        'editorRevista4': new FormControl(null)
      })
      this.editorFormRevista5 = new FormGroup({
        'editorRevista5': new FormControl(null)
      })
      this.editorFormRevista6 = new FormGroup({
        'editorRevista6': new FormControl(null)
      })
      this.editorFormRevista7 = new FormGroup({
        'editorRevista7': new FormControl(null)
      })
      this.editorFormRevista8 = new FormGroup({
        'editorRevista8': new FormControl(null)
      })
      this.editorFormRevista9 = new FormGroup({
        'editorRevista9': new FormControl(null)
      })
      this.editorFormRevista10 = new FormGroup({
        'editorRevista10': new FormControl(null)
      })
      this.variableSinUsoMenu();
     
      this.revistaMocotips = true;
      this.cloudfirestore.getRevistasMocotips().subscribe(item => {
        console.log("olita")
        this.revistaDigitalMocotips = [];
        item.forEach((revista: any) => {
          this.revistaDigitalMocotips.push({
            key: revista.payload.doc.data().key,
            id: revista.payload.doc.id,
            anio: revista.payload.doc.data().anio,
            costo: revista.payload.doc.data().costo,
            description: revista.payload.doc.data().description,
            imagenPrincipal: revista.payload.doc.data().imagenPrincipal,
            numero: revista.payload.doc.data().numero,
            tittle: revista.payload.doc.data().tittle,
            idioma: revista.payload.doc.data().idioma,
            //tittle: revista.payload.doc.id,
          });
        })
        this.dataSourceRevistaMocotips = new MatTableDataSource(this.revistaDigitalMocotips);
        this.dataSourceRevistaMocotips.paginator = this.paginator.toArray()[3];
      })
      console.log(this.revistaMocotips)
    }
    else if (section === "T") {
      this.restartAll();
      this.hideAllRevistaEditors();
      this.seccionesFalse();
      this.patrocinador = true;
      this.redactNuevaFalse();
      this.variableSinUsoMenu();
      this.noticiasService.getPatrocinadores().snapshotChanges().subscribe(item => {
        this.patrocinadoresList = [];
        item.slice().reverse().forEach(element => {
          let json = element.payload.toJSON();
          json["$key"] = element.key;
          this.patrocinadoresList.push(json as patrocinadores);
        });
        if (this.patrocinadoresList[0].patrocinador1Image !== "") {
          this.fileToUpload1Name1 = "Imagen ya cargada";
          this.urlPatrocinador1Delete = true;
        }
        if (this.patrocinadoresList[0].patrocinador2Image !== "") {
          this.fileToUpload1Name2 = "Imagen ya cargada";
          this.urlPatrocinador2Delete = true;
        }
        if (this.patrocinadoresList[0].patrocinador3Image !== "") {
          this.fileToUpload1Name3 = "Imagen ya cargada";
          this.urlPatrocinador3Delete = true;
        }
        if (this.patrocinadoresList[0].patrocinador4Image !== "") {
          this.fileToUpload1Name4 = "Imagen ya cargada";
          this.urlPatrocinador4Delete = true;
        }
        this.urlPatrocinador1 = this.patrocinadoresList[0].patrocinador1Url;
        this.urlPatrocinador2 = this.patrocinadoresList[0].patrocinador2Url;
        this.urlPatrocinador3 = this.patrocinadoresList[0].patrocinador3Url;
        this.urlPatrocinador4 = this.patrocinadoresList[0].patrocinador4Url;

      });
    }
    else if (section === "C") {
      this.cerrarSesion();
      this.seccionesFalse();
      this.menuPrincipal = true;
      this.redactNuevaFalse();
      this.variableSinUsoMenu();
      this.hideAllRevistaEditors();
    }
    else if (section === "E") {
      this.seccionesFalse();
      this.redactNuevaFalse();
      this.variableSinUsoMenu();
      this.entradaNueva = true;
      console.log(this.entradaNueva);
      this.hideAllRevistaEditors();
    }
    else if (section === "RE1") {
      this.seccionesFalse();
      this.redactNuevaFalse();
      this.redactarNueva = true;
      this.cleanTittle();
      this.editorForm = new FormGroup({
        'editor': new FormControl(null)
      })
      this.editorForm2 = new FormGroup({
        'editor2': new FormControl(null)
      })
      this.editorForm3 = new FormGroup({
        'editor3': new FormControl(null)
      })
      this.editorForm4 = new FormGroup({
        'editor4': new FormControl(null)
      })
      this.changePartRedact(1);
    }
    else if (section === "RE2") {
      this.seccionesFalse();
      this.redactNuevaFalse();
      this.redactarNueva2 = true;
      this.cleanTittle();
      this.editorForm = new FormGroup({
        'editor': new FormControl(null)
      })
      this.editorForm2 = new FormGroup({
        'editor2': new FormControl(null)
      })
      this.editorForm3 = new FormGroup({
        'editor3': new FormControl(null)
      })
      this.changePartRedact2(1);
    }
    else if (section === "RE3") {
      this.seccionesFalse();
      this.redactNuevaFalse();
      this.redactarNueva3 = true;
      this.cleanTittle();
      this.editorForm = new FormGroup({
        'editor': new FormControl(null)
      })
      this.editorForm2 = new FormGroup({
        'editor2': new FormControl(null)
      })
      this.editorForm3 = new FormGroup({
        'editor3': new FormControl(null)
      })
      this.editorForm4 = new FormGroup({
        'editor4': new FormControl(null)
      })
      this.editorForm5 = new FormGroup({
        'editor5': new FormControl(null)
      })
      this.changePartRedact3(1);
    }
    else if (section === "RE4") {
      this.seccionesFalse();
      this.redactNuevaFalse();
      this.redactarNueva4 = true;
      this.cleanTittle();
      this.editorForm = new FormGroup({
        'editor': new FormControl(null)
      })
      this.editorForm2 = new FormGroup({
        'editor2': new FormControl(null)
      })
      this.editorForm3 = new FormGroup({
        'editor3': new FormControl(null)
      })
      this.editorForm4 = new FormGroup({
        'editor4': new FormControl(null)
      })
      this.editorForm5 = new FormGroup({
        'editor5': new FormControl(null)
      })
      this.editorForm6 = new FormGroup({
        'editor6': new FormControl(null)
      })
      this.changePartRedact4(1);
    }
    else if (section === "RE5") {
      this.seccionesFalse();
      this.redactNuevaFalse();
      this.redactarNueva5 = true;
      this.cleanTittle();
      this.editorForm = new FormGroup({
        'editor': new FormControl(null)
      })
      this.editorForm2 = new FormGroup({
        'editor2': new FormControl(null)
      })
      this.editorForm3 = new FormGroup({
        'editor3': new FormControl(null)
      })
      this.editorForm4 = new FormGroup({
        'editor4': new FormControl(null)
      })
      this.editorForm5 = new FormGroup({
        'editor5': new FormControl(null)
      })
      this.changePartRedact5(1);
      this.restartAll();
    }
    else if (section === "RE6") {
      this.seccionesFalse();
      this.redactNuevaFalse();
      this.redactarNueva6 = true;
      this.cleanTittle();
      this.editorForm = new FormGroup({
        'editor': new FormControl(null)
      })
      this.editorForm2 = new FormGroup({
        'editor2': new FormControl(null)
      })
      this.editorForm3 = new FormGroup({
        'editor3': new FormControl(null)
      })
      this.editorForm4 = new FormGroup({
        'editor4': new FormControl(null)
      })
      this.editorForm5 = new FormGroup({
        'editor5': new FormControl(null)
      })
      this.editorForm6 = new FormGroup({
        'editor6': new FormControl(null)
      })
      this.editorForm7 = new FormGroup({
        'editor7': new FormControl(null)
      })
      this.editorForm8 = new FormGroup({
        'editor8': new FormControl(null)
      })
      this.changePartRedact6(1);
      this.restartAll();
    }
  }
  seccionesFalse() {
    this.secciones = false;
    this.revista = false;
    this.especial = false;
    this.menuPrincipal = false;
    this.mocotips = false;
    this.entradaNueva = false;
    this.patrocinador = false;
  }
  redactNuevaFalse() {
    this.redactarNueva = false;
    this.redactarNueva2 = false;
    this.redactarNueva3 = false;
    this.redactarNueva4 = false;
    this.redactarNueva5 = false;
    this.redactarNueva6 = false;
  }
  variablesSinUsoNotas() {
    this.redactarInsertarImagenes = false;
    this.redactarInsertarImagenesPlantilla6 = false;
    this.revistaMocotips = false;
    this.subirDatosRevistaMocotips = false;
    this.especialDelMes = false;
    this.seccionEspecialDelMes = false;
    this.especialDelMesSubirImagen = false;
    this.revistaImagenesElegir = false;
    this.revistaMocotipsElegir = false;
    this.crearRevistaDigital = false;
    this.crearRevistaDigitalMocotips = false;
  }
  variableSinUsoMenu() {
    this.redactarInsertarImagenes = false;
    this.redactarInsertarImagenesPlantilla6 = false;
    this.revistaMocotips = false;
    this.subirDatosRevistaMocotips = false;
    this.especialDelMes = false;
    this.seccionEspecialDelMes = false;
    this.especialDelMesSubirImagen = false;
    this.revistaImagenesElegir = false;
    this.revistaMocotipsElegir = false;
    this.crearRevistaDigital = false;
    this.crearRevistaDigitalMocotips = false;
    this.revistaImagenes = false;
  }
  publicarPatrocinadores(opcion: string) {
    this.patrocinadoresObject.patrocinador1Url = this.urlPatrocinador1;
    this.patrocinadoresObject.patrocinador2Url = this.urlPatrocinador2;
    this.patrocinadoresObject.patrocinador3Url = this.urlPatrocinador3;
    this.patrocinadoresObject.patrocinador4Url = this.urlPatrocinador4;
    this.subirimagenPatrocinador_1().then(res => this.subirimagenPatrocinador_2().then(res => this.subirimagenPatrocinador_3().then(res => this.subirimagenPatrocinador_4().then(res => {
      if (opcion === "editar") {
        this.patrocinadoresObject.$key = this.patrocinadoresList[0].$key;
        this.buttondisabled = "none";
        this.noticiasService.updatePatrocinadores(this.patrocinadoresObject).then(res => {
          window.alert('Patrocinadores actualizados con éxito');
          this.changeSection("T")
          this.restartAll();
        });
      }
    }))));
  }
  borrarPatrocinadores(opcion: string) {
    this.patrocinadoresObject.patrocinador1Url = this.urlPatrocinador1;
    this.patrocinadoresObject.patrocinador2Url = this.urlPatrocinador2;
    this.patrocinadoresObject.patrocinador3Url = this.urlPatrocinador3;
    this.patrocinadoresObject.patrocinador4Url = this.urlPatrocinador4;
    this.patrocinadoresObject.patrocinador1Image = this.patrocinadoresList[0].patrocinador1Image;
    this.patrocinadoresObject.patrocinador2Image = this.patrocinadoresList[0].patrocinador2Image;
    this.patrocinadoresObject.patrocinador3Image = this.patrocinadoresList[0].patrocinador3Image;
    this.patrocinadoresObject.patrocinador4Image = this.patrocinadoresList[0].patrocinador4Image;
    if (opcion === "1") {
      this.patrocinadoresObject.patrocinador1Url = "";
      this.patrocinadoresObject.patrocinador1Image = "";
      this.patrocinadoresObject.$key = this.patrocinadoresList[0].$key;
      this.buttondisabled = "none";
      this.noticiasService.updatePatrocinadores(this.patrocinadoresObject).then(res => {
        window.alert('Patrocinadores actualizados con éxito');
        this.changeSection("T");
        this.restartAll();
      });
    }
    if (opcion === "2") {
      this.patrocinadoresObject.patrocinador2Url = "";
      this.patrocinadoresObject.patrocinador2Image = "";
      this.patrocinadoresObject.$key = this.patrocinadoresList[0].$key;
      this.buttondisabled = "none";
      this.noticiasService.updatePatrocinadores(this.patrocinadoresObject).then(res => {
        window.alert('Patrocinadores actualizados con éxito');
        this.changeSection("T");
        this.restartAll();
      });
    }
    if (opcion === "3") {
      this.patrocinadoresObject.patrocinador3Url = "";
      this.patrocinadoresObject.patrocinador3Image = "";
      this.patrocinadoresObject.$key = this.patrocinadoresList[0].$key;
      this.buttondisabled = "none";
      this.noticiasService.updatePatrocinadores(this.patrocinadoresObject).then(res => {
        window.alert('Patrocinadores actualizados con éxito');
        this.changeSection("T")
        this.restartAll();
      });
    }
    if (opcion === "4") {
      this.patrocinadoresObject.patrocinador4Url = "";
      this.patrocinadoresObject.patrocinador4Image = "";
      this.patrocinadoresObject.$key = this.patrocinadoresList[0].$key;
      this.buttondisabled = "none";
      this.noticiasService.updatePatrocinadores(this.patrocinadoresObject).then(res => {
        window.alert('Patrocinadores actualizados con éxito');
        this.changeSection("T")
        this.restartAll();
      });
    }
  }
  subirimagenPatrocinador_1() {

    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name1 === "Imagen ya cargada") {
        console.log("la imagen ya estaba cargada no se modificará");
        this.patrocinadoresObject.patrocinador1Image = this.patrocinadoresList[0].patrocinador1Image;
        resolve();
      }
      else if (this.fileToUpload1Name1 !== "Selecciona una imagen") {
        if (this.patrocinadoresList[0] !== undefined) {
          if (this.patrocinadoresList[0].patrocinador1Image !== "") {
            console.log("si se encontró un registro previo y se eliminará 1");
            this.storage.storage.refFromURL(this.patrocinadoresList[0].patrocinador1Image).delete();
          }
          else {
            console.log("no se encontró un registro previo 1");
          }
        }
        console.log("la imagen no existe, se creará");
        const id = Math.random().toString(36).substring(2);
        const filePath = `patrocinadores/${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.fileToUpload1);
        this.image1UploadPercent = task.percentageChanges();
        this.statusUploadImage1 = "Actualizando patrocinador 1"
        task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(url => {
              this.urlImage1 = url;
              this.patrocinadoresObject.patrocinador1Image = this.urlImage1;
              resolve();
            });
          })
        ).subscribe();
      }
      else {
        console.log("ola");
        resolve();

      }
    });
  }
  subirimagenPatrocinador_2() {
    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name2 === "Imagen ya cargada") {
        console.log("la imagen 2 ya estaba cargada no se modificará");
        this.patrocinadoresObject.patrocinador2Image = this.patrocinadoresList[0].patrocinador2Image;
        resolve();
      }
      else if (this.fileToUpload1Name2 !== "Selecciona una imagen") {
        if (this.patrocinadoresList[0] !== undefined) {
          if (this.patrocinadoresList[0].patrocinador2Image !== "") {
            console.log("si se encontró un registro previo y se eliminará 2");
            this.storage.storage.refFromURL(this.patrocinadoresList[0].patrocinador2Image).delete();
          }
          else {
            console.log("no se encontró un registro previo 2");
          }
        }
        console.log("la imagen 2 no existe, se creará");
        const id2 = Math.random().toString(36).substring(2);
        const filePath2 = `patrocinadores/${id2}`;
        const ref2 = this.storage.ref(filePath2);
        const task2 = this.storage.upload(filePath2, this.fileToUpload2);
        this.image1UploadPercent = task2.percentageChanges();
        this.statusUploadImage1 = "Actualizando patrocinador 2"
        task2.snapshotChanges().pipe(
          finalize(() => {
            ref2.getDownloadURL().subscribe(url => {
              this.urlImage2 = url;
              this.patrocinadoresObject.patrocinador2Image = this.urlImage2;
              resolve();
            });
          })
        ).subscribe();
      }
      else {
        console.log("ola no se subira nda 2");
        resolve();
      }
    });
  }
  subirimagenPatrocinador_3() {
    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name3 === "Imagen ya cargada") {
        console.log("la imagen 3 ya estaba cargada no se modificará");
        this.patrocinadoresObject.patrocinador3Image = this.patrocinadoresList[0].patrocinador3Image;
        resolve();
      }
      else if (this.fileToUpload1Name3 !== "Selecciona una imagen") {
        if (this.patrocinadoresList[0] !== undefined) {
          if (this.patrocinadoresList[0].patrocinador3Image !== "") {
            console.log("si se encontró un registro previo y se eliminará 3");
            this.storage.storage.refFromURL(this.patrocinadoresList[0].patrocinador3Image).delete();
          }
          else {
            console.log("no se encontró un registro previo 3");
          }
        }
        console.log("la imagen 3 no existe, se creará");
        const id3 = Math.random().toString(36).substring(2);
        const filePath3 = `patrocinadores/${id3}`;
        const ref3 = this.storage.ref(filePath3);
        const task3 = this.storage.upload(filePath3, this.fileToUpload3);
        this.image1UploadPercent = task3.percentageChanges();
        this.statusUploadImage1 = "Actualizando patrocinador 3"
        task3.snapshotChanges().pipe(
          finalize(() => {
            ref3.getDownloadURL().subscribe(url => {
              this.urlImage3 = url;
              console.log(this.urlImage3)
              this.patrocinadoresObject.patrocinador3Image = this.urlImage3;
              resolve();
            });
          })
        ).subscribe();
      }
      else {
        console.log("ola no se subira nda 3");
        resolve();
      }
    });
  }
  subirimagenPatrocinador_4() {
    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name4 === "Imagen ya cargada") {
        console.log("la imagen 4 ya estaba cargada no se modificará");
        this.patrocinadoresObject.patrocinador4Image = this.patrocinadoresList[0].patrocinador4Image;
        resolve();

      }
      else if (this.fileToUpload1Name4 !== "Selecciona una imagen") {
        if (this.patrocinadoresList[0] !== undefined) {
          if (this.patrocinadoresList[0].patrocinador4Image !== "") {
            console.log("si se encontró un registro previo y se eliminará 4");
            this.storage.storage.refFromURL(this.patrocinadoresList[0].patrocinador4Image).delete();
          }
          else {
            console.log("no se encontró un registro previo 4");
          }
        }
        console.log("la imagen 4 no existe, se creará");
        const id4 = Math.random().toString(36).substring(2);
        const filePath4 = `patrocinadores/${id4}`;
        const ref4 = this.storage.ref(filePath4);
        const task4 = this.storage.upload(filePath4, this.fileToUploadPrincipal);
        this.image1UploadPercent = task4.percentageChanges();
        this.statusUploadImage1 = "Actualizando patrocinador 4"
        task4.snapshotChanges().pipe(
          finalize(() => {
            ref4.getDownloadURL().subscribe(url => {
              this.urlImagePrincipal = url;
              this.patrocinadoresObject.patrocinador4Image = this.urlImagePrincipal;
              resolve();
            });
          })
        ).subscribe();
      }
      else {
        console.log("ola no se subira nda 4");
        resolve();
      }
    });
  }
  seleccionarSeccionRevista() {
    this.revista = false;
    this.revistaImagenes = false;
    this.revistaImagenesElegir = false;
    this.revistaMocotipsElegir = false;
    this.crearRevistaDigital = true;
    this.patrocinador = false;
    this.revistaMocotips = false;
    this.crearRevistaDigitalMocotips = false;
  }
  seleccionarSeccionRevistaMocotips() {
    this.revista = false;
    this.revistaImagenes = false;
    this.revistaImagenesElegir = false;
    this.revistaMocotipsElegir = false;
    this.crearRevistaDigital = false;
    this.patrocinador = false;
    this.revistaMocotips = false;
    this.crearRevistaDigitalMocotips = true;
  }
  seccionesRevistaDigital() {
    this.revista = false;
    this.revistaImagenes = false;
    this.patrocinador = false;
    this.revistaImagenesElegir = true;
    this.revistaMocotipsElegir = false;
    this.crearRevistaDigital = false;
    this.crearRevistaDigitalMocotips = false;
    this.revistaMocotips = false;
    console.log("NODO GENERAL");
    console.log(this.nodoGeneralSelected[0]);
    this.cloudfirestore.getSeccionPuroCuento(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idImagenesRevistaDig[0] = id;
        this.imagenesSubidasColor[0] = "greenyellow";
      }
      else {
        this.idImagenesRevistaDig[0] = "";
        this.imagenesSubidasColor[0] = "black";
      }
      console.log("id se purocuento: " + this.idImagenesRevistaDig[0])
    })
    this.cloudfirestore.getSeccionEcoMoco(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idImagenesRevistaDig[1] = id;
        this.imagenesSubidasColor[1] = "greenyellow";
      }
      else {
        this.idImagenesRevistaDig[1] = "";
        this.imagenesSubidasColor[1] = "black";
      }
      console.log("id se ecomoco: " + this.idImagenesRevistaDig[1])
    })
    this.cloudfirestore.getSeccionSePega(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idImagenesRevistaDig[2] = id;
        this.imagenesSubidasColor[2] = "greenyellow";
      }
      else {
        this.idImagenesRevistaDig[2] = "";
        this.imagenesSubidasColor[2] = "black";
      }
      console.log("id se pega: " + this.idImagenesRevistaDig[2])
    })
    this.cloudfirestore.getSeccionHurgaDatos(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idImagenesRevistaDig[3] = id;
        this.imagenesSubidasColor[3] = "greenyellow";
      }
      else {
        this.idImagenesRevistaDig[3] = "";
        this.imagenesSubidasColor[3] = "black";
      }
      console.log("id hurga: " + this.idImagenesRevistaDig[3])
    })
    this.cloudfirestore.getSeccionEspacio(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idImagenesRevistaDig[4] = id;
        this.imagenesSubidasColor[4] = "greenyellow";
      }
      else {
        this.idImagenesRevistaDig[4] = "";
        this.imagenesSubidasColor[4] = "black";
      }
      console.log("id espacio: " + this.idImagenesRevistaDig[4])
    })
    this.cloudfirestore.getSeccionBioAventura(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idImagenesRevistaDig[5] = id;
        this.imagenesSubidasColor[5] = "greenyellow";
      }
      else {
        this.idImagenesRevistaDig[5] = "";
        this.imagenesSubidasColor[5] = "black";
      }
      console.log("id bio: " + this.idImagenesRevistaDig[5])
    })
    this.cloudfirestore.getSeccionPromos(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idImagenesRevistaDig[6] = id;
        this.imagenesSubidasColor[6] = "greenyellow";
      }
      else {
        this.idImagenesRevistaDig[6] = "";
        this.imagenesSubidasColor[6] = "black";
      }
      console.log("id promos: " + this.idImagenesRevistaDig[6]);
    })
    this.cloudfirestore.getSeccionArte(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idImagenesRevistaDig[7] = id;
        this.imagenesSubidasColor[7] = "greenyellow";
      }
      else {
        this.idImagenesRevistaDig[7] = "";
        this.imagenesSubidasColor[7] = "black";
      }
      console.log("id arte y manias: " + this.idImagenesRevistaDig[7]);
    })
    this.cloudfirestore.getSeccionEspecial(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idImagenesRevistaDig[8] = id;
        this.imagenesSubidasColor[8] = "greenyellow";
      }
      else {
        this.idImagenesRevistaDig[8] = "";
        this.imagenesSubidasColor[8] = "black";
      }
      console.log("id especiaal: " + this.idImagenesRevistaDig[8]);
    })
    this.cloudfirestore.getSeccionDoctor(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idImagenesRevistaDig[9] = id;
        this.imagenesSubidasColor[9] = "greenyellow";
      }
      else {
        this.idImagenesRevistaDig[9] = "";
        this.imagenesSubidasColor[9] = "black";
      }
      console.log("id doctor: " + this.idImagenesRevistaDig[9]);
      this.cargandoRevistas = "Elija la sección que desee (las secciones en verde ya contienen imágenes)"
    })
  }
  seccionesRevistaDigitalMocotips() {
    this.revista = false;
    this.revistaImagenes = false;
    this.patrocinador = false;
    this.revistaImagenesElegir = false;
    this.revistaMocotipsElegir = true;
    this.crearRevistaDigital = false;
    this.crearRevistaDigitalMocotips = false;
    this.revistaMocotips = false;
    console.log("NODO GENERAL");
    console.log(this.nodoGeneralSelected[0]);
    this.cloudfirestore.getSeccionPuroCuentoTips(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idTipsRevistaDig[0] = id;
        this.imagenesSubidasColor[0] = "greenyellow";
      }
      else {
        this.idTipsRevistaDig[0] = "";
        this.imagenesSubidasColor[0] = "black";
      }
      console.log("id se purocuento: " + this.idTipsRevistaDig[0])
    })
    this.cloudfirestore.getSeccionEcoMocoTips(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idTipsRevistaDig[1] = id;
        this.imagenesSubidasColor[1] = "greenyellow";
      }
      else {
        this.idTipsRevistaDig[1] = "";
        this.imagenesSubidasColor[1] = "black";
      }
      console.log("id se ecomoco: " + this.idTipsRevistaDig[1])
    })
    this.cloudfirestore.getSeccionSePegaTips(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idTipsRevistaDig[2] = id;
        this.imagenesSubidasColor[2] = "greenyellow";
      }
      else {
        this.idTipsRevistaDig[2] = "";
        this.imagenesSubidasColor[2] = "black";
      }
      console.log("id se pega: " + this.idTipsRevistaDig[2])
    })
    this.cloudfirestore.getSeccionHurgaDatosTips(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idTipsRevistaDig[3] = id;
        this.imagenesSubidasColor[3] = "greenyellow";
      }
      else {
        this.idTipsRevistaDig[3] = "";
        this.imagenesSubidasColor[3] = "black";
      }
      console.log("id hurga: " + this.idTipsRevistaDig[3])
    })
    this.cloudfirestore.getSeccionIntroTips(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idTipsRevistaDig[4] = id;
        this.imagenesSubidasColor[4] = "greenyellow";
      }
      else {
        this.idTipsRevistaDig[4] = "";
        this.imagenesSubidasColor[4] = "black";
      }
      console.log("id promos: " + this.idTipsRevistaDig[4]);
    })
    this.cloudfirestore.getSeccionBioAventuraTips(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idTipsRevistaDig[5] = id;
        this.imagenesSubidasColor[5] = "greenyellow";
      }
      else {
        this.idTipsRevistaDig[5] = "";
        this.imagenesSubidasColor[5] = "black";
      }
      console.log("id bio: " + this.idTipsRevistaDig[5])
    })
    this.cloudfirestore.getSeccionConclusionTips(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idTipsRevistaDig[6] = id;
        this.imagenesSubidasColor[6] = "greenyellow";
      }
      else {
        this.idTipsRevistaDig[6] = "";
        this.imagenesSubidasColor[6] = "black";
      }
      console.log("id espacio: " + this.idTipsRevistaDig[6])
    })

    this.cloudfirestore.getSeccionArteTips(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idTipsRevistaDig[7] = id;
        this.imagenesSubidasColor[7] = "greenyellow";
      }
      else {
        this.idTipsRevistaDig[7] = "";
        this.imagenesSubidasColor[7] = "black";
      }
      console.log("id arte y manias: " + this.idTipsRevistaDig[7]);
    })
    this.cloudfirestore.getSeccionEspecialTips(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idTipsRevistaDig[8] = id;
        this.imagenesSubidasColor[8] = "greenyellow";
      }
      else {
        this.idTipsRevistaDig[8] = "";
        this.imagenesSubidasColor[8] = "black";
      }
      console.log("id especiaal: " + this.idTipsRevistaDig[8]);
    })
    this.cloudfirestore.getSeccionDoctorTips(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      item.forEach((revista: any) => {
        id = revista.payload.doc.id;
      })
      if (item.length !== 0) {
        this.idTipsRevistaDig[9] = id;
        this.imagenesSubidasColor[9] = "greenyellow";
      }
      else {
        this.idTipsRevistaDig[9] = "";
        this.imagenesSubidasColor[9] = "black";
      }
      console.log("id doctor: " + this.idTipsRevistaDig[9]);
      this.cargandoRevistas = "Elija la sección que desee (las secciones en verde ya contienen mocotips)";
    })
  }
  eliminarRevista() {

    this.editarVisibilidad = "hidden";
    console.log("NODO GENERAL");
    console.log(this.nodoGeneralSelected[0]);
    if (window.confirm("¿Estás seguro de eliminar la revista ?")) {
    this.eliminandoRevistas = "Eliminando revista ...";
    this.cloudfirestore.getSeccionPuroCuento(this.nodoGeneralSelected[0]).subscribe(item => {
      if (item.length !== 0) {
        console.log("si se va a eliminar 1")
          var idSeccion;
          item.forEach((revista: any) => {
            idSeccion = revista.payload.doc.id;
          })
        this.cloudfirestore.getSeccionPuroCuentoImages(idSeccion).subscribe(item => {
          for (let x = 0; x < 30; x++) {
            if (item.payload.data()['image' + x] === undefined) {
              this.cloudfirestore.deleteSeccionPuroCuento(idSeccion);
              break;
            }
            else {
              this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
            }
          }
        })
      }
      this.cloudfirestore.getSeccionEcoMoco(this.nodoGeneralSelected[0]).subscribe(item => {
        if (item.length !== 0) {
          console.log("si se va a eliminar 2")
          var idSeccion;
          item.forEach((revista: any) => {
            idSeccion = revista.payload.doc.id;
          })
          this.cloudfirestore.getSeccionEcoMocoImages(idSeccion).subscribe(item => {
            for (let x = 0; x < 30; x++) {
              if (item.payload.data()['image' + x] === undefined) {
                this.cloudfirestore.deleteSeccionEcoMoco(idSeccion);
                break;
              }
              else {
                this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
              }
            }
          })
        }
       this.cloudfirestore.getSeccionSePega(this.nodoGeneralSelected[0]).subscribe(item => {
          if (item.length !== 0) {
            console.log("si se va a eliminar 3")
            var idSeccion;
          item.forEach((revista: any) => {
            idSeccion = revista.payload.doc.id;
          })
            
            this.cloudfirestore.getSeccionSePegaImages(idSeccion).subscribe(item => {
              for (let x = 0; x < 30; x++) {
                if (item.payload.data()['image' + x] === undefined) {
                  this.cloudfirestore.deleteSeccionSePega(idSeccion);
                  break;
                }
                else {
                  this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
                }
              }
            })
          }
          this.cloudfirestore.getSeccionHurgaDatos(this.nodoGeneralSelected[0]).subscribe(item => {
            if (item.length !== 0) {
              console.log("si se va a eliminar 4")
              var idSeccion;
          item.forEach((revista: any) => {
            idSeccion = revista.payload.doc.id;
          })
              this.cloudfirestore.getSeccionHurgaDatosImages(idSeccion).subscribe(item => {
                for (let x = 0; x < 30; x++) {
                  if (item.payload.data()['image' + x] === undefined) {
                    this.cloudfirestore.deleteSeccionHurgaDatos(idSeccion);
                    break;
                  }
                  else {
                    this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
                  }
                }
              })
            }
            this.cloudfirestore.getSeccionEspacio(this.nodoGeneralSelected[0]).subscribe(item => {
              if (item.length !== 0) {
                console.log("si se va a eliminar 5")
                var idSeccion;
          item.forEach((revista: any) => {
            idSeccion = revista.payload.doc.id;
          })
                this.cloudfirestore.getSeccionEspacioImages(idSeccion).subscribe(item => {
                  for (let x = 0; x < 30; x++) {
                    if (item.payload.data()['image' + x] === undefined) {
                      this.cloudfirestore.deleteSeccionEspacio(idSeccion);
                      break;
                    }
                    else {
                      this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
                    }
                  }
                })
              }
              this.cloudfirestore.getSeccionBioAventura(this.nodoGeneralSelected[0]).subscribe(item => {
                if (item.length !== 0) {
                  console.log("si se va a eliminar 6")
                  var idSeccion;
          item.forEach((revista: any) => {
            idSeccion = revista.payload.doc.id;
          })
                  this.cloudfirestore.getSeccionBioAventuraImages(idSeccion).subscribe(item => {
                    for (let x = 0; x < 30; x++) {
                      if (item.payload.data()['image' + x] === undefined) {
                        this.cloudfirestore.deleteSeccionBioAventura(idSeccion);
                        break;
                      }
                      else {
                        this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
                      }
                    }
                  })
                }
                
                this.cloudfirestore.getSeccionPromos(this.nodoGeneralSelected[0]).subscribe(item => {
                  if (item.length !== 0) {
                    console.log("si se va a eliminar 7");
                    var idSeccion;
                    item.forEach((revista: any) => {
                      idSeccion = revista.payload.doc.id;
                    })
                    this.cloudfirestore.getSeccionPromosImages(idSeccion).subscribe(item => {
                      for (let x = 0; x < 30; x++) {
                        if (item.payload.data()['image' + x] === undefined) {
                          this.cloudfirestore.deleteSeccionPromos(idSeccion);
                          break;
                        }
                        else {
                          this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
                        }
                      }
                    })
                  }
                  this.cloudfirestore.getSeccionArte(this.nodoGeneralSelected[0]).subscribe(item => {
                    if (item.length !== 0) {
                      console.log("si se va a eliminar 8")
                      var idSeccion;
          item.forEach((revista: any) => {
            idSeccion = revista.payload.doc.id;
          })
                      this.cloudfirestore.getSeccionArteImages(idSeccion).subscribe(item => {
                        for (let x = 0; x < 30; x++) {
                          if (item.payload.data()['image' + x] === undefined) {
                            this.cloudfirestore.deleteSeccionArte(idSeccion);
                            break;
                          }
                          else {
                            this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
                          }
                        }
                      })
                    }
                    this.cloudfirestore.getSeccionEspecial(this.nodoGeneralSelected[0]).subscribe(item => {
                      if (item.length !== 0) {
                        console.log("si se va a eliminar 9")
                        var idSeccion;
          item.forEach((revista: any) => {
            idSeccion = revista.payload.doc.id;
          })
                        this.cloudfirestore.getSeccionEspecialImages(idSeccion).subscribe(item => {
                          for (let x = 0; x < 30; x++) {
                            if (item.payload.data()['image' + x] === undefined) {
                              this.cloudfirestore.deleteSeccionEspecial(idSeccion);
                              break;
                            }
                            else {
                              this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
                            }
                          }
                        })
                      }
                      this.cloudfirestore.getSeccionDoctor(this.nodoGeneralSelected[0]).subscribe(item => {
                        if (item.length !== 0) {
                          console.log("si se va a eliminar 10")
                          var idSeccion;
          item.forEach((revista: any) => {
            idSeccion = revista.payload.doc.id;
          })
                          this.cloudfirestore.getSeccionDoctorImages(idSeccion).subscribe(item => {
                            for (let x = 0; x < 30; x++) {
                              if (item.payload.data()['image' + x] === undefined) {
                                this.cloudfirestore.deleteSeccionDoctor(idSeccion);
                                break;
                              }
                              else {
                                this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
                              }
                            }
                          })
                        } 
                        this.cloudfirestore.deleteRevistaDigital(this.revistastKey[0]);
                        window.alert('Revista eliminada con éxito');
                        this.restartAll();
                        this.eliminandoRevistas = "Revistas digitales (imágenes)";
                        this.changeSection("R");
                      })
                   })
                  })
                })
              })
            })
          })
        })
      })
    })
  }
  }
  eliminarRevistaMocotips() {

    this.editarVisibilidad = "hidden";
    console.log("NODO GENERAL");
    console.log(this.nodoGeneralSelected[0]);
    if (window.confirm("¿Estás seguro de eliminar la revista ?")) {
      this.eliminandoRevistasMocotips = "Eliminando revista ...";
    this.cloudfirestore.getSeccionPuroCuentoTips(this.nodoGeneralSelected[0]).subscribe(item => {
      var id;
      if (item.length !== 0) {
        item.forEach((revista: any) => {
          id = revista.payload.doc.id;
        })
        this.cloudfirestore.deleteRevistaPuroCuento(id);
      }
      this.cloudfirestore.getSeccionEcoMocoTips(this.nodoGeneralSelected[0]).subscribe(item => {
        if (item.length !== 0) {
          item.forEach((revista: any) => {
            id = revista.payload.doc.id;
          })
          this.cloudfirestore.deleteRevistaEcoMoco(id);
        }
        this.cloudfirestore.getSeccionSePegaTips(this.nodoGeneralSelected[0]).subscribe(item => {
          if (item.length !== 0) {
            item.forEach((revista: any) => {
              id = revista.payload.doc.id;
            })
            this.cloudfirestore.deleteRevistaSePega(id);
          }
          this.cloudfirestore.getSeccionHurgaDatosTips(this.nodoGeneralSelected[0]).subscribe(item => {
            if (item.length !== 0) {
              item.forEach((revista: any) => {
                id = revista.payload.doc.id;
              })
              this.cloudfirestore.deleteRevistaHurgaDatos(id);
            }
            this.cloudfirestore.getSeccionConclusionTips(this.nodoGeneralSelected[0]).subscribe(item => {
              if (item.length !== 0) {
                item.forEach((revista: any) => {
                  id = revista.payload.doc.id;
                })
                this.cloudfirestore.deleteRevistaConclusion(id);
              }
              else {
                this.permisoEliminarRevista[4] = true;
              }
              this.cloudfirestore.getSeccionBioAventuraTips(this.nodoGeneralSelected[0]).subscribe(item => {
                if (item.length !== 0) {
                  item.forEach((revista: any) => {
                    id = revista.payload.doc.id;
                  })
                  this.cloudfirestore.deleteRevistaBioAventura(id);
                }
                this.cloudfirestore.getSeccionIntroTips(this.nodoGeneralSelected[0]).subscribe(item => {
                  if (item.length !== 0) {
                    item.forEach((revista: any) => {
                      id = revista.payload.doc.id;
                    })
                    this.cloudfirestore.deleteRevistaIntro(id);
                  }
                  this.cloudfirestore.getSeccionArteTips(this.nodoGeneralSelected[0]).subscribe(item => {
                    if (item.length !== 0) {
                      item.forEach((revista: any) => {
                        id = revista.payload.doc.id;
                      })
                      this.cloudfirestore.deleteRevistaArte(id); 
                    }
                    this.cloudfirestore.getSeccionEspecialTips(this.nodoGeneralSelected[0]).subscribe(item => {
                      if (item.length !== 0) {
                        item.forEach((revista: any) => {
                          id = revista.payload.doc.id;
                        })
                        this.cloudfirestore.deleteRevistaEspecial(id); 
                      }
                      this.cloudfirestore.getSeccionDoctorTips(this.nodoGeneralSelected[0]).subscribe(item => {
                        if (item.length !== 0) {
                          item.forEach((revista: any) => {
                            id = revista.payload.doc.id;
                          })
                          this.cloudfirestore.deleteRevistaDoctor(id);  
                        }
                          this.cloudfirestore.deleteRevistaDigitalMocotips(this.revistastKey[0]);
                          window.alert('Revista eliminada con éxito');
                          this.restartAll();
                          this.eliminandoRevistasMocotips = "Revistas digitales (mocotips)";
                          this.changeSection("P");
                         
                        
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  }
  }
  revistaSeccion(section: string) {
    window.alert('SE INICIARÁ UNA GALERÍA NUEVA');
    this.secciones = false;
    this.revista = false;
    this.especial = false;
    this.menuPrincipal = false;
    this.mocotips = false;
    this.entradaNueva = false;
    this.redactarNueva = false;
    this.redactarNueva2 = false;
    this.redactarNueva3 = false;
    this.redactarNueva4 = false;
    this.redactarNueva5 = false;
    this.redactarNueva6 = false;
    this.redactarInsertarImagenes = false;
    this.redactarInsertarImagenesPlantilla6 = false;
    this.revistaMocotips = false;
    this.subirDatosRevistaMocotips = false;
    this.revistaImagenesElegir = false;
    this.revistaMocotipsElegir = false;
    this.especialDelMes = false;
    this.seccionEspecialDelMes = false;
    this.especialDelMesSubirImagen = false;
    this.revistaImagenes = true;
    if (section === '1') {
      this.actualRevistaDigitalSection = "puro";
      this.actualRevistaDigital = "Puro cuento";
      if(this.idImagenesRevistaDig[0] !== ""){
      this.cloudfirestore.getSeccionPuroCuentoImages(this.idImagenesRevistaDig[0]).subscribe(item => {
        for (let x = 0; x < 30; x++) {
          if (item.payload.data()['image' + x] === undefined) {
            this.cloudfirestore.deleteSeccionPuroCuento(this.idImagenesRevistaDig[0]);
            break;
          }
          else {
            this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
          }
        }
      })
    }
    }
    else if (section === '2') {
      this.actualRevistaDigitalSection = "eco";
      this.actualRevistaDigital = "Eco moco";
      if(this.idImagenesRevistaDig[1] !== ""){
      this.cloudfirestore.getSeccionEcoMocoImages(this.idImagenesRevistaDig[1]).subscribe(item => {
        for (let x = 0; x < 30; x++) {
          if (item.payload.data()['image' + x] === undefined) {
            this.cloudfirestore.deleteSeccionEcoMoco(this.idImagenesRevistaDig[1]);
            break;
          }
          else {
            this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
          }
        }
      })
    }
    }
    else if (section === '3') {
      this.actualRevistaDigitalSection = "pega";
      this.actualRevistaDigital = "Lo que se pega";
      if(this.idImagenesRevistaDig[2] !== ""){
      this.cloudfirestore.getSeccionSePegaImages(this.idImagenesRevistaDig[2]).subscribe(item => {
        for (let x = 0; x < 30; x++) {
          if (item.payload.data()['image' + x] === undefined) {
            this.cloudfirestore.deleteSeccionSePega(this.idImagenesRevistaDig[2]);
            break;
          }
          else {
            this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
          }
        }
      })
    }
    }
    else if (section === '4') {
      this.actualRevistaDigitalSection = "hurga";
      this.actualRevistaDigital = "Hurga datos";
      if(this.idImagenesRevistaDig[3] !== ""){
      this.cloudfirestore.getSeccionHurgaDatosImages(this.idImagenesRevistaDig[3]).subscribe(item => {
        for (let x = 0; x < 30; x++) {
          if (item.payload.data()['image' + x] === undefined) {
            this.cloudfirestore.deleteSeccionHurgaDatos(this.idImagenesRevistaDig[3]);
            break;
          }
          else {
            this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
          }
        }
      })
    }
    }
    else if (section === '5') {
      this.actualRevistaDigitalSection = "espacio";
      this.actualRevistaDigital = "Tu espacio";
      if(this.idImagenesRevistaDig[4] !== ""){
      this.cloudfirestore.getSeccionEspacioImages(this.idImagenesRevistaDig[4]).subscribe(item => {
        for (let x = 0; x < 30; x++) {
          if (item.payload.data()['image' + x] === undefined) {
            this.cloudfirestore.deleteSeccionEspacio(this.idImagenesRevistaDig[4]);
            break;
          }
          else {
            this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
          }
        }
      })
    }
    }
    else if (section === '6') {
      this.actualRevistaDigitalSection = "bio";
      this.actualRevistaDigital = "Bio aventura";
      if(this.idImagenesRevistaDig[5] !== ""){
      this.cloudfirestore.getSeccionBioAventuraImages(this.idImagenesRevistaDig[5]).subscribe(item => {
        for (let x = 0; x < 30; x++) {
          if (item.payload.data()['image' + x] === undefined) {
            this.cloudfirestore.deleteSeccionBioAventura(this.idImagenesRevistaDig[5]);
            break;
          }
          else {
            this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
          }
        }
      })
    }
    }
    else if (section === '7') {
      this.actualRevistaDigitalSection = "promo";
      this.actualRevistaDigital = "Anuncios y promociones";
      if(this.idImagenesRevistaDig[6] !== ""){
      this.cloudfirestore.getSeccionPromosImages(this.idImagenesRevistaDig[6]).subscribe(item => {
        for (let x = 0; x < 30; x++) {
          if (item.payload.data()['image' + x] === undefined) {
            this.cloudfirestore.deleteSeccionPromos(this.idImagenesRevistaDig[6]);
            break;
          }
          else {
            this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
          }
        }
      })
    }
    }
    else if (section === '8') {
      this.actualRevistaDigitalSection = "arte";
      this.actualRevistaDigital = "Arte y mañas";
      if(this.idImagenesRevistaDig[7] !== ""){
      this.cloudfirestore.getSeccionArteImages(this.idImagenesRevistaDig[7]).subscribe(item => {
        for (let x = 0; x < 30; x++) {
          if (item.payload.data()['image' + x] === undefined) {
            this.cloudfirestore.deleteSeccionArte(this.idImagenesRevistaDig[7]);
            break;
          }
          else {
            this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
          }
        }
      })
    }
    }
    else if (section === '9') {
      this.actualRevistaDigitalSection = "especial";
      this.actualRevistaDigital = "Especial";
      if(this.idImagenesRevistaDig[8] !== ""){
      this.cloudfirestore.getSeccionEspecialImages(this.idImagenesRevistaDig[8]).subscribe(item => {
        for (let x = 0; x < 30; x++) {
          if (item.payload.data()['image' + x] === undefined) {
            this.cloudfirestore.deleteSeccionEspecial(this.idImagenesRevistaDig[8]);
            break;
          }
          else {
            this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
          }
        }
      })
      }
    }
    else if (section === '10') {
      this.actualRevistaDigitalSection = "dr";
      this.actualRevistaDigital = "Dr. Bakterium";
      if(this.idImagenesRevistaDig[9] !== ""){
      this.cloudfirestore.getSeccionDoctorImages(this.idImagenesRevistaDig[9]).subscribe(item => {
        for (let x = 0; x < 30; x++) {
          if (item.payload.data()['image' + x] === undefined) {
            this.cloudfirestore.deleteSeccionDoctor(this.idImagenesRevistaDig[9]);
            break;
          }
          else {
            this.storage.storage.refFromURL(item.payload.data()['image' + x]).delete();
          }
        }
      })
    }
    }
    console.log(this.actualRevistaDigitalSection)
  }
  aniadirImagenRevista() {
    const id = Math.random().toString(36).substring(2);
    const filePath = this.actualRevistaDigitalSection + `/${id}`;
    console.log(filePath)
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.fileToUpload1);
    this.image1UploadPercent = task.percentageChanges();
    this.statusUploadImage1 = "Subiendo imagen " + this.numeroDeImagenesRevistaDigital;
    task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.imagenesRevistaDigital.push(url);
          console.log(this.imagenesRevistaDigital);
          this.statusUploadImage1 = "Imágen subida con éxito";
          this.numeroDeImagenesRevistaDigital = this.imagenesRevistaDigital.length + 1;
          this.restartAll();
        });

      })
    ).subscribe();

  }
  cancelarImagenes() {
    this.imagenesRevistaDigital = [];
    this.numeroDeImagenesRevistaDigital = 1;
    for (var i = 0; i < this.imagenesRevistaDigital.length; i++) {
      this.storage.storage.refFromURL(this.imagenesRevistaDigital[i]).delete();
    };
    this.seccionesRevistaDigital();
  }
  finalizarImagenesRevista() {
    console.log(this.imagenesRevistaDigital);
    this.editarVisibilidad = "hidden";
    for (var i = 0; i < this.imagenesRevistaDigital.length; i++) {
      this.imagenesRevistaObject['image' + i] = this.imagenesRevistaDigital[i];
    };
    this.numeroDeImagenesRevistaDigital = 1;
    this.imagenesRevistaObject.key = this.nodoGeneralSelected[0];
    if (this.actualRevistaDigitalSection === "puro") {
      console.log(this.imagenesRevistaObject);
      this.cloudfirestore.registerImagenesPuroCuento(this.imagenesRevistaObject).then(response => {
        console.log("entro a promo")
        console.log(response);
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      })
    }
    else if (this.actualRevistaDigitalSection === "eco") {
      this.cloudfirestore.registerImagenesEcoMoco(this.imagenesRevistaObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      })
    }
    else if (this.actualRevistaDigitalSection === "pega") {
      this.cloudfirestore.registerImagenesSePega(this.imagenesRevistaObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      })
    }
    else if (this.actualRevistaDigitalSection === "hurga") {
      this.cloudfirestore.registerImagenesHurgaDatos(this.imagenesRevistaObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      })
    }
    else if (this.actualRevistaDigitalSection === "espacio") {
      this.cloudfirestore.registerImagenesEspacio(this.imagenesRevistaObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      })
    }
    else if (this.actualRevistaDigitalSection === "bio") {
      this.cloudfirestore.registerImagenesBioAventura(this.imagenesRevistaObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      })
    }
    else if (this.actualRevistaDigitalSection === "promo") {
      console.log("entro a promo")
      this.cloudfirestore.registerImagenesPromos(this.imagenesRevistaObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      })
    }
    else if (this.actualRevistaDigitalSection === "arte") {
      this.cloudfirestore.registerImagenesArte(this.imagenesRevistaObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      })
    }
    else if (this.actualRevistaDigitalSection === "especial") {
      if (this.imagenesSubidasColor[0] === "greenyellow") {
        console.log("entro" + this.nodoGeneralSelected)

      }
      this.cloudfirestore.registerImagenesEspecial(this.imagenesRevistaObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      })
    }
    else if (this.actualRevistaDigitalSection === "dr") {
      this.cloudfirestore.registerImagenesDoctor(this.imagenesRevistaObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("R");
        this.imagenesRevistaDigital = [];
        this.editarVisibilidad = "hidden";
      })
    }

  }
  changePartRedact(part: number) {
    this.plantilla1False();
    this.variablesSinUsoNotas();
    if (part === 1) {
      this.redactarPlantilla1_1 = true;
      this.progressBar = 25;
      this.plantilla1parte = 1;
      this.plantilla1_imagen_1 = "./../../assets/images/plantilla1-parte1.png";
    }
    else if (part === 2) {
      this.redactarPlantilla1_2 = true;
      this.progressBar = 50;
      this.plantilla1parte = 2;
      this.plantilla1_imagen_1 = "./../../assets/images/plantilla1-parte2.png";
    }
    else if (part === 3) {
      this.redactarPlantilla1_3 = true;
      this.progressBar = 75;
      this.plantilla1parte = 3;
      this.plantilla1_imagen_1 = "./../../assets/images/plantilla1-parte3.png";
    }
    else if (part === 4) {
      this.redactarPlantilla1_4 = true;
      this.progressBar = 100;
      this.plantilla1parte = 4;
      this.plantilla1_imagen_1 = "./../../assets/images/plantilla1-parte4.png";
    }
  }
  plantilla1False() {
    this.redactarPlantilla1_1 = false;
    this.redactarPlantilla1_2 = false;
    this.redactarPlantilla1_3 = false;
    this.redactarPlantilla1_4 = false;
  }
  changePartRedact2(part: number) {
    this.plantilla2False();
    this.variablesSinUsoNotas();
    if (part === 1) {
      this.redactarPlantilla2_1 = true;
      this.progressBar2 = 33;
      this.plantilla2parte = 1;
      this.plantilla2_imagen_1 = "./../../assets/images/plantilla2-parte1.png";
    }
    else if (part === 2) {
      this.redactarPlantilla2_2 = true;
      this.progressBar2 = 66;
      this.plantilla2parte = 2;
      this.plantilla2_imagen_1 = "./../../assets/images/plantilla2-parte2.png";
    }
    else if (part === 3) {
      this.redactarPlantilla2_3 = true;
      this.progressBar2 = 100;
      this.plantilla2parte = 3;
      this.plantilla2_imagen_1 = "./../../assets/images/plantilla2-parte3.png";
    }
  }
  plantilla2False() {
    this.redactarPlantilla2_1 = false;
    this.redactarPlantilla2_2 = false;
    this.redactarPlantilla2_3 = false;
  }
  changePartRedact3(part: number) {
    this.plantilla3False();
    this.variablesSinUsoNotas();
    if (part === 1) {
      this.redactarPlantilla3_1 = true;
      this.progressBar3 = 20;
      this.plantilla3parte = 1;
      this.plantilla3_imagen_1 = "./../../assets/images/plantilla3-parte1.png";
    }
    else if (part === 2) {
      this.redactarPlantilla3_2 = true;
      this.progressBar3 = 40;
      this.plantilla3parte = 2;
      this.plantilla3_imagen_1 = "./../../assets/images/plantilla3-parte2.png";
    }
    else if (part === 3) {
      this.redactarPlantilla3_3 = true;
      this.progressBar3 = 60;
      this.plantilla3parte = 3;
      this.plantilla3_imagen_1 = "./../../assets/images/plantilla3-parte3.png";
    }
    else if (part === 4) {
      this.redactarPlantilla3_4 = true;
      this.progressBar3 = 80;
      this.plantilla3parte = 4;
      this.plantilla3_imagen_1 = "./../../assets/images/plantilla3-parte4.png";
    }
    else if (part === 5) {
      this.redactarPlantilla3_5 = true;
      this.progressBar3 = 100;
      this.plantilla3parte = 5;
      this.plantilla3_imagen_1 = "./../../assets/images/plantilla3-parte5.png";
    }
  }
  plantilla3False() {
    this.redactarPlantilla3_1 = false;
    this.redactarPlantilla3_2 = false;
    this.redactarPlantilla3_3 = false;
    this.redactarPlantilla3_4 = false;
    this.redactarPlantilla3_5 = false;
  }
  changePartRedact4(part: number) {
    this.plantilla4False();
    this.variablesSinUsoNotas();
    if (part === 1) {
      this.redactarPlantilla4_1 = true;
      this.progressBar4 = 16;
      this.plantilla4parte = 1;
      this.plantilla4_imagen_1 = "./../../assets/images/plantilla4-parte1.png";
    }
    else if (part === 2) {
      this.redactarPlantilla4_2 = true;
      this.progressBar4 = 32;
      this.plantilla4parte = 2;
      this.plantilla4_imagen_1 = "./../../assets/images/plantilla4-parte2.png";
    }
    else if (part === 3) {
      this.redactarPlantilla4_3 = true;
      this.progressBar4 = 48;
      this.plantilla4parte = 3;
      this.plantilla4_imagen_1 = "./../../assets/images/plantilla4-parte3.png";
    }
    else if (part === 4) {
      this.redactarPlantilla4_4 = true;
      this.progressBar4 = 64;
      this.plantilla4parte = 4;
      this.plantilla4_imagen_1 = "./../../assets/images/plantilla4-parte4.png";
    }
    else if (part === 5) {
      this.redactarPlantilla4_5 = true;
      this.progressBar4 = 80;
      this.plantilla4parte = 5;
      this.plantilla4_imagen_1 = "./../../assets/images/plantilla4-parte5.png";
    }
    else if (part === 6) {
      this.redactarPlantilla4_6 = true;
      this.progressBar4 = 100;
      this.plantilla4parte = 6;
      this.plantilla4_imagen_1 = "./../../assets/images/plantilla4-parte6.png";
    }
  }
  plantilla4False() {
    this.redactarPlantilla4_1 = false;
    this.redactarPlantilla4_2 = false;
    this.redactarPlantilla4_3 = false;
    this.redactarPlantilla4_4 = false;
    this.redactarPlantilla4_5 = false;
    this.redactarPlantilla4_6 = false;
  }
  changePartRedact5(part: number) {
    this.plantilla5False();
    this.variablesSinUsoNotas();
    if (part === 1) {
      this.redactarPlantilla5_1 = true;
      this.progressBar5 = 20;
      this.plantilla5parte = 1;
      this.plantilla5_imagen_1 = "./../../assets/images/plantilla5-parte1.png";
    }
    else if (part === 2) {
      this.redactarPlantilla5_2 = true;
      this.progressBar5 = 40;
      this.plantilla5parte = 2;
      this.plantilla5_imagen_1 = "./../../assets/images/plantilla5-parte2.png";
    }
    else if (part === 3) {
      this.redactarPlantilla5_3 = true;
      this.progressBar5 = 60;
      this.plantilla5parte = 3;
      this.plantilla5_imagen_1 = "./../../assets/images/plantilla5-parte3.png";
    }
    else if (part === 4) {
      this.redactarPlantilla5_4 = true;
      this.progressBar5 = 80;
      this.plantilla5parte = 4;
      this.plantilla5_imagen_1 = "./../../assets/images/plantilla5-parte4.png";
    }
    else if (part === 5) {
      this.redactarPlantilla5_5 = true;
      this.progressBar5 = 100;
      this.plantilla5parte = 5;
      this.plantilla5_imagen_1 = "./../../assets/images/plantilla5-parte5.png";
    }
  }
  plantilla5False() {
    this.redactarPlantilla5_1 = false;
    this.redactarPlantilla5_2 = false;
    this.redactarPlantilla5_3 = false;
    this.redactarPlantilla5_4 = false;
    this.redactarPlantilla5_5 = false;
  }
  changePartRedact6(part: number) {
    this.plantilla6False();
    this.variablesSinUsoNotas();
    if (part === 1) {
      this.redactarPlantilla6_1 = true;
      this.progressBar6 = 12;
      this.plantilla6parte = 1;
      this.plantilla6_imagen_1 = "./../../assets/images/plantilla6-parte1.png";
    }
    else if (part === 2) {
      this.redactarPlantilla6_2 = true;
      this.progressBar6 = 25;
      this.plantilla6parte = 2;
      this.plantilla6_imagen_1 = "./../../assets/images/plantilla6-parte2.png";
    }
    else if (part === 3) {
      this.redactarPlantilla6_3 = true;
      this.progressBar6 = 37;
      this.plantilla6parte = 3;
      this.plantilla6_imagen_1 = "./../../assets/images/plantilla6-parte3.png";
    }
    else if (part === 4) {
      this.redactarPlantilla6_4 = true;
      this.progressBar6 = 50;
      this.plantilla6parte = 4;
      this.plantilla6_imagen_1 = "./../../assets/images/plantilla6-parte4.png";
    }
    else if (part === 5) {
      this.redactarPlantilla6_5 = true;
      this.progressBar6 = 62;
      this.plantilla6parte = 5;
      this.plantilla6_imagen_1 = "./../../assets/images/plantilla6-parte5.png";
    }
    else if (part === 6) {
      this.redactarPlantilla6_6 = true;
      this.progressBar6 = 75;
      this.plantilla6parte = 6;
      this.plantilla6_imagen_1 = "./../../assets/images/plantilla6-parte6.png";
    }
    else if (part === 7) {
      this.redactarPlantilla6_7 = true;
      this.progressBar6 = 90;
      this.plantilla6parte = 7;
      this.plantilla6_imagen_1 = "./../../assets/images/plantilla6-parte7.png";
    }
    else if (part === 8) {
      this.redactarPlantilla6_8 = true;
      this.progressBar6 = 100;
      this.plantilla6parte = 8;
      this.plantilla6_imagen_1 = "./../../assets/images/plantilla7-parte8.png";
    }
  }
  plantilla6False() {
    this.redactarPlantilla6_1 = false;
    this.redactarPlantilla6_2 = false;
    this.redactarPlantilla6_3 = false;
    this.redactarPlantilla6_4 = false;
    this.redactarPlantilla6_5 = false;
    this.redactarPlantilla6_6 = false;
    this.redactarPlantilla6_7 = false;
    this.redactarPlantilla6_8 = false;
  }
  redactEspecialMes() {
    this.redactarInsertarImagenes = false;
    this.redactarInsertarImagenesPlantilla6 = false;
    this.revistaMocotips = false;
    this.subirDatosRevistaMocotips = false;
    this.especialDelMes = true;
    this.seccionEspecialDelMes = false;
    this.especialDelMesSubirImagen = false;
    this.revistaImagenesElegir = false;
    this.revistaMocotipsElegir = false;
    this.crearRevistaDigital = false;
    this.crearRevistaDigitalMocotips = false;
  }
  publicarEspecial() {
    this.editorContent = this.editorFormEspecial.get('editorEspecial').value;
    this.especialDelMesObject.description = this.editorContent;
    this.especialDelMesObject.tittle = this.tituloEspecial;
    this.especialDelMesObject.autor = this.autorEspecial;
    this.convertMonths(this.selectedItemMes + '');
    this.currentDate = this.selectedItemDia + '-' + this.selectedItemMes + '-' + this.selectedItemAnio;
    this.especialDelMesObject.date = this.currentDate;
    this.cleanSpacesEditor1(this.editorContent);
    const id = Math.random().toString(36).substring(2);
    const filePath = `infografias/${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.fileToUpload1);
    this.image1UploadPercent = task.percentageChanges();
    this.statusUploadImage1 = "Subiendo infografía";
    task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.urlImagePrincipal = url;
          this.especialDelMesObject.principalImage = this.urlImagePrincipal;
          const id2 = Math.random().toString(36).substring(2);
          const filePath2 = `portadas1/${id2}`;
          const ref2 = this.storage.ref(filePath2);
          const task2 = this.storage.upload(filePath2, this.fileToUpload2);
          this.image1UploadPercent = task2.percentageChanges();
          this.statusUploadImage1 = "Subiendo portada 1";
          task2.snapshotChanges().pipe(
            finalize(() => {
              ref2.getDownloadURL().subscribe(url => {
                this.urlImage2 = url;
                this.especialDelMesObject.portada1 = this.urlImage2;
                const id3 = Math.random().toString(36).substring(2);
                const filePath3 = `portadas2/${id3}`;
                const ref3 = this.storage.ref(filePath3);
                const task3 = this.storage.upload(filePath3, this.fileToUpload3);
                this.image1UploadPercent = task3.percentageChanges();
                this.statusUploadImage1 = "Subiendo portada 2";
                task3.snapshotChanges().pipe(
                  finalize(() => {
                    ref3.getDownloadURL().subscribe(url => {
                      this.urlImage3 = url;
                      this.especialDelMesObject.portada2 = this.urlImage3;
                      this.noticiasService.insertEspecialDelMes(this.especialDelMesObject);
                      this.restartAll();
                      this.changeSection("M");
                    });
                  })
                ).subscribe();
              });
            })
          ).subscribe();
        });
      })
    ).subscribe();
  }
  publicarRevistaDigital() {

    this.revistaDigitalObject.tittle = this.tituloRevistaMocotipsPrincipal;
    this.revistaDigitalObject.description = this.descripcionRevistaMocotipsPrincipal;
    this.revistaDigitalObject.anio = this.anioRevistaMocotipsPrincipal;
    this.revistaDigitalObject.numero = this.numeroRevistaMocotipsPrincipal;
    this.revistaDigitalObject.costo = this.costoRevistaMocotipsPrincipal;

    this.revistaDigitalObject.idioma = this.selectedItem;


    var tituloLower = this.tituloRevistaMocotipsPrincipal.toLowerCase();
    var posicion = tituloLower.search(" ");
    while (posicion !== -1) {
      var var1 = tituloLower.substring(0, posicion);
      var var2 = tituloLower.substring(posicion + 1, tituloLower.length);
      tituloLower = var1 + '_' + var2;
      var posicion = tituloLower.search(" ");
    }
    this.tituloRevistaMocotipsPrincipal = tituloLower;
    this.revistaDigitalObject.key = this.tituloRevistaMocotipsPrincipal + "_" + this.numeroRevistaMocotipsPrincipal + "_" + this.anioRevistaMocotipsPrincipal;
    const id = Math.random().toString(36).substring(2);
    const filePath = `revistaDigital/${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.fileToUpload1);
    this.image1UploadPercent = task.percentageChanges();
    this.statusUploadImage1 = "Subiendo portada";
    task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.urlImagePrincipal = url;
          this.revistaDigitalObject.imagenPrincipal = this.urlImagePrincipal;
          console.log(this.revistaDigitalObject);
          this.cloudfirestore.registerRevista(this.revistaDigitalObject).then(response => {
            console.log(response);
            this.restartAll();
            this.changeSection("R");
          }, error => {
            console.log(error)
            this.restartAll();
            this.changeSection("R");
          })

        });
      })
    ).subscribe(); 
  }
  publicarRevistaDigitalMocotips() {
    this.revistaDigitalObject.tittle = this.tituloRevistaMocotipsPrincipal;
    this.revistaDigitalObject.description = this.descripcionRevistaMocotipsPrincipal;
    this.revistaDigitalObject.anio = this.anioRevistaMocotipsPrincipal;
    this.revistaDigitalObject.numero = this.numeroRevistaMocotipsPrincipal;
    this.revistaDigitalObject.costo = this.costoRevistaMocotipsPrincipal;
    this.revistaDigitalObject.idioma = this.selectedItem;
    var tituloLower = this.tituloRevistaMocotipsPrincipal.toLowerCase();
    var posicion = tituloLower.search(" ");
    while (posicion !== -1) {
      var var1 = tituloLower.substring(0, posicion);
      var var2 = tituloLower.substring(posicion + 1, tituloLower.length);
      tituloLower = var1 + '_' + var2;
      var posicion = tituloLower.search(" ");
    }
    this.tituloRevistaMocotipsPrincipal = tituloLower;
    this.revistaDigitalObject.key = this.tituloRevistaMocotipsPrincipal + "_" + this.numeroRevistaMocotipsPrincipal + "_" + this.anioRevistaMocotipsPrincipal;
    const id = Math.random().toString(36).substring(2);
    const filePath = `revistaDigital/${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.fileToUpload1);
    this.image1UploadPercent = task.percentageChanges();
    this.statusUploadImage1 = "Subiendo portada";
    task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.urlImagePrincipal = url;
          this.revistaDigitalObject.imagenPrincipal = this.urlImagePrincipal;
          console.log(this.revistaDigitalObject);
          this.cloudfirestore.registerRevistaMocotips(this.revistaDigitalObject).then(response => {
            console.log(response);
            this.restartAll();
            this.changeSection("P");
          }, error => {
            console.log(error)
            this.restartAll();
            this.changeSection("P");
          })

        });
      })
    ).subscribe();
  }

  hidePlantillas() {
    this.redactarNueva = false;
    this.redactarNueva2 = false;
    this.redactarNueva3 = false;
    this.redactarNueva4 = false;
    this.redactarNueva5 = false;
    this.redactarNueva6 = false;
  }
  onSubmit(option: number) {
    this.buttondisabled = "none";/*Para desactivar el botón de subir la noticia publicada*/
    if (option === 1) { /*Si fue seleccionada la plantilla 1*/
      this.editorContent = this.editorForm.get('editor').value;
      this.editorContent2 = this.editorForm2.get('editor2').value;
      this.editorContent3 = this.editorForm3.get('editor3').value;
      this.editorContent4 = this.editorForm4.get('editor4').value;
      this.noticiasObject.tittle = this.titulo;
      this.noticiasObject.autor = this.autor;
      this.noticiasObject.part3 = this.editorContent4;
      this.noticiasObject.plantilla = '1';
      this.convertMonths(this.selectedItemMes + '');
      this.currentDate = this.selectedItemDia + '-' + this.selectedItemMes + '-' + this.selectedItemAnio;
      this.noticiasObject.date = this.currentDate;
      this.cleanSpacesEditor1(this.editorContent);
      this.noticiasObject.phrase = this.editorContent;
      this.cleanSpacesEditor2(this.editorContent2);
      this.cleanSpacesEditor3(this.editorContent3);
      this.cleanSpacesEditor4(this.editorContent4);
      const id = Math.random().toString(36).substring(2);
      const filePath = `plantilla1Imagenes/${id}`;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.fileToUpload1);
      this.image1UploadPercent = task.percentageChanges();
      this.statusUploadImage1 = "Subiendo imagen 1"
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(url => {
            this.urlImage1 = url;
            var posicion = this.editorContent2.search("-image-");
            if (posicion !== -1) {
              var b = '<div class="plantilla1-1" style="background-image: url(' + this.urlImage1 + ');"> </div>'
              this.editorContent2 = [this.editorContent2.slice(0, posicion), b, this.editorContent2.slice(posicion)].join('');
              posicion = this.editorContent2.search("-image-");
              var var1 = this.editorContent2.substring(0, posicion);
              var var2 = this.editorContent2.substring(posicion + 7, this.editorContent2.length);
              this.editorContent2 = var1 + var2;
              this.noticiasObject.part1 = this.editorContent2;
            }
            else {
              this.noticiasObject.part1 = this.editorContent2;
            }
            const id2 = Math.random().toString(36).substring(2);
            const filePath2 = `plantilla1Imagenes/${id2}`;
            const ref2 = this.storage.ref(filePath2);
            const task2 = this.storage.upload(filePath2, this.fileToUpload2);
            this.image1UploadPercent = task2.percentageChanges();
            this.statusUploadImage1 = "Subiendo imagen 2"
            task2.snapshotChanges().pipe(
              finalize(() => {
                ref2.getDownloadURL().subscribe(url => {
                  this.urlImage2 = url;
                  this.editorContent3 = '<div class="plantilla1-2" style="background-image: url(' + this.urlImage2 + ');"></div> ' + this.editorContent3;
                  this.noticiasObject.part2 = this.editorContent3;
                  const idPrincipal = Math.random().toString(36).substring(2);
                  const filePathPrincipal = `portadasNotas/${idPrincipal}`;
                  const refPrincipal = this.storage.ref(filePathPrincipal);
                  const taskPrincipal = this.storage.upload(filePathPrincipal, this.fileToUploadPrincipal);
                  this.image1UploadPercent = taskPrincipal.percentageChanges();
                  this.statusUploadImage1 = "Subiendo imagen 3"
                  taskPrincipal.snapshotChanges().pipe(
                    finalize(() => {
                      refPrincipal.getDownloadURL().subscribe(url => {
                        this.urlImagePrincipal = url;
                        this.noticiasObject.image1 = this.urlImage1;
                        this.noticiasObject.image2 = this.urlImage2;
                        this.noticiasObject.principalImage = this.urlImagePrincipal;
                        if (this.selectedItem === 'Noticias') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Noticias");
                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Ciencia') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Ciencia");
                          window.alert('Nota publicada con éxito');
                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Arte') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Arte");
                          window.alert('Nota publicada con éxito');
                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Ocio') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Ocio");
                          window.alert('Nota publicada con éxito');
                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Descubre') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Descubre");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Mocotips') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Mocotips");
                          window.alert('Nota publicada con éxito');
                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                      });
                    })
                  ).subscribe();
                });
              })
            ).subscribe();
          });
        })
      ).subscribe();
    }
    else if (option === 2) { /*Si fue seleccionada la plantilla 2*/
      this.editorContent = this.editorForm.get('editor').value;
      this.editorContent2 = this.editorForm2.get('editor2').value;
      this.editorContent3 = this.editorForm3.get('editor3').value;
      this.noticiasObject.tittle = this.titulo2;
      this.noticiasObject.plantilla = '2';
      this.noticiasObject.autor = this.autor2;
      this.convertMonths(this.selectedItemMes + '');
      this.currentDate = this.selectedItemDia + '-' + this.selectedItemMes + '-' + this.selectedItemAnio;
      this.noticiasObject.date = this.currentDate;
      this.cleanSpacesEditor1(this.editorContent);
      this.noticiasObject.phrase = this.editorContent;
      this.cleanSpacesEditor2(this.editorContent2);
      this.cleanSpacesEditor3(this.editorContent3);
      const id = Math.random().toString(36).substring(2);
      const filePath = `plantilla2Imagenes/${id}`;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.fileToUpload1);
      this.image1UploadPercent = task.percentageChanges();
      this.statusUploadImage1 = "Subiendo imagen 1"
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(url => {
            this.urlImage1 = url;
            if (this.imagenTamanio1CSS === "chico") {
              if (this.imagenTamanio1Full === true) {
                this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
              }
              else {
                this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
              }
            }
            else if (this.imagenTamanio1CSS === "mediano") {
              if (this.imagenTamanio1Full === true) {
                this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
              }
              else {
                this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
              }
            }
            else if (this.imagenTamanio1CSS === "grande") {
              if (this.imagenTamanio1Full === true) {
                this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
              }
              else {
                this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
              }
            }
            else {
              this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage1 + ');"></div>';
            }
            this.noticiasObject.part1 = this.editorContent2;
            const id2 = Math.random().toString(36).substring(2);
            const filePath2 = `plantilla2Imagenes/${id2}`;
            const ref2 = this.storage.ref(filePath2);
            const task2 = this.storage.upload(filePath2, this.fileToUpload2);
            this.image1UploadPercent = task2.percentageChanges();
            this.statusUploadImage1 = "Subiendo imagen 2"
            task2.snapshotChanges().pipe(
              finalize(() => {
                ref2.getDownloadURL().subscribe(url => {
                  this.urlImage2 = url;
                  if (this.imagenTamanio2CSS === "chico") {
                    if (this.imagenTamanio2Full === true) {
                      this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.urlImage2 + '); background-size: cover;"></div> ';
                    }
                    else {
                      this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.urlImage2 + '); background-size: contain;"></div> ';
                    }
                  }
                  else if (this.imagenTamanio2CSS === "mediano") {
                    if (this.imagenTamanio2Full === true) {
                      this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage2 + '); background-size: cover;"></div> ';
                    }
                    else {
                      this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage2 + '); background-size: contain;"></div> ';
                    }
                  }
                  else if (this.imagenTamanio2CSS === "grande") {
                    if (this.imagenTamanio2Full === true) {
                      this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.urlImage2 + '); background-size: cover;"></div> ';
                    }
                    else {
                      this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.urlImage2 + '); background-size: contain;"></div> ';
                    }
                  }
                  else {
                    this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage2 + ');"></div>';
                  }
                  this.noticiasObject.part2 = this.editorContent3;
                  const idPrincipal = Math.random().toString(36).substring(2);
                  const filePathPrincipal = `portadasNotas/${idPrincipal}`;
                  const refPrincipal = this.storage.ref(filePathPrincipal);
                  const taskPrincipal = this.storage.upload(filePathPrincipal, this.fileToUploadPrincipal);
                  this.image1UploadPercent = taskPrincipal.percentageChanges();
                  this.statusUploadImage1 = "Subiendo imagen 3"
                  taskPrincipal.snapshotChanges().pipe(
                    finalize(() => {
                      refPrincipal.getDownloadURL().subscribe(url => {
                        this.urlImagePrincipal = url;
                        this.noticiasObject.image1 = this.urlImage1;
                        this.noticiasObject.image2 = this.urlImage2;
                        this.noticiasObject.principalImage = this.urlImagePrincipal;
                        if (this.selectedItem === 'Noticias') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Noticias");
                          window.alert('Nota publicada con éxito');
                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Ciencia') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Ciencia");
                          window.alert('Nota publicada con éxito');
                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Arte') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Arte");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Ocio') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Ocio");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Descubre') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Descubre");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Mocotips') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Mocotips");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                      });
                    })
                  ).subscribe();
                });
              })
            ).subscribe();
          });
        })
      ).subscribe();
    }
    else if (option === 3) {

      this.editorContent = this.editorForm.get('editor').value;
      this.editorContent2 = this.editorForm2.get('editor2').value;
      this.editorContent3 = this.editorForm3.get('editor3').value;
      this.editorContent4 = this.editorForm4.get('editor4').value;
      this.editorContent5 = this.editorForm5.get('editor5').value;
      this.noticiasObject.tittle = this.titulo3;
      this.noticiasObject.part2 = this.editorContent3;
      this.noticiasObject.part4 = this.editorContent5;
      this.noticiasObject.plantilla = '3';
      this.noticiasObject.autor = this.autor3;
      this.convertMonths(this.selectedItemMes + '');
      this.currentDate = this.selectedItemDia + '-' + this.selectedItemMes + '-' + this.selectedItemAnio;
      this.noticiasObject.date = this.currentDate;
      this.cleanSpacesEditor1(this.editorContent);
      this.noticiasObject.phrase = this.editorContent;
      this.cleanSpacesEditor2(this.editorContent2);
      this.cleanSpacesEditor3(this.editorContent3);
      this.cleanSpacesEditor4(this.editorContent4);
      this.cleanSpacesEditor5(this.editorContent5);
      const id = Math.random().toString(36).substring(2);
      const filePath = `plantilla3Imagenes/${id}`;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.fileToUpload1);
      this.image1UploadPercent = task.percentageChanges();
      this.statusUploadImage1 = "Subiendo imagen 1"
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(url => {
            this.urlImage1 = url;
            if (this.imagenTamanio1CSS === "chico") {
              if (this.imagenTamanio1Full === true) {
                this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-chica"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
              }
              else {
                this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-chica"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
              }
            }
            else if (this.imagenTamanio1CSS === "mediano") {
              if (this.imagenTamanio1Full === true) {
                this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-mediana"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
              }
              else {
                this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-mediana"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
              }
            }
            else if (this.imagenTamanio1CSS === "grande") {
              if (this.imagenTamanio1Full === true) {
                this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-grande"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
              }
              else {
                this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-grande"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
              }
            }
            else {
              this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-mediana"  style="background-image: url(' + this.urlImage1 + ');"></div>';
            }
            this.noticiasObject.part1 = this.editorContent2;
            const id2 = Math.random().toString(36).substring(2);
            const filePath2 = `plantilla3Imagenes/${id2}`;
            const ref2 = this.storage.ref(filePath2);
            const task2 = this.storage.upload(filePath2, this.fileToUpload2);
            this.image1UploadPercent = task2.percentageChanges();
            this.statusUploadImage1 = "Subiendo imagen 2"
            task2.snapshotChanges().pipe(
              finalize(() => {
                ref2.getDownloadURL().subscribe(url => {
                  this.urlImage2 = url;
                  this.editorContent4 = '<div class="plantilla1-2" style="background-image: url(' + this.urlImage2 + ');"></div> ' + this.editorContent4;
                  this.noticiasObject.part3 = this.editorContent4;
                  const idPrincipal = Math.random().toString(36).substring(2);
                  const filePathPrincipal = `portadasNotas/${idPrincipal}`;
                  const refPrincipal = this.storage.ref(filePathPrincipal);
                  const taskPrincipal = this.storage.upload(filePathPrincipal, this.fileToUploadPrincipal);
                  this.image1UploadPercent = taskPrincipal.percentageChanges();
                  this.statusUploadImage1 = "Subiendo imagen 3"
                  taskPrincipal.snapshotChanges().pipe(
                    finalize(() => {
                      refPrincipal.getDownloadURL().subscribe(url => {
                        this.urlImagePrincipal = url;
                        this.noticiasObject.image1 = this.urlImage1;
                        this.noticiasObject.image2 = this.urlImage2;
                        this.noticiasObject.principalImage = this.urlImagePrincipal;
                        if (this.selectedItem === 'Noticias') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Noticias");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Ciencia') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Ciencia");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Arte') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Arte");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Ocio') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Ocio");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Descubre') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Descubre");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Mocotips') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Mocotips");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                      });
                    })
                  ).subscribe();
                });
              })
            ).subscribe();
          });
        })
      ).subscribe();
    }
    else if (option === 4) {
      this.editorContent = this.editorForm.get('editor').value;
      this.editorContent2 = this.editorForm2.get('editor2').value;
      this.editorContent3 = this.editorForm3.get('editor3').value;
      this.editorContent4 = this.editorForm4.get('editor4').value;
      this.editorContent5 = this.editorForm5.get('editor5').value;
      this.editorContent6 = this.editorForm6.get('editor6').value;
      this.noticiasObject.tittle = this.titulo4;
      this.noticiasObject.youtube = "https://www.youtube.com/embed/" + this.titulo_youtube;
      this.noticiasObject.phrase = this.editorContent;
      this.noticiasObject.part1 = this.editorContent2;
      this.noticiasObject.part5 = this.editorContent6;
      this.noticiasObject.plantilla = '4';
      this.noticiasObject.autor = this.autor4;
      this.convertMonths(this.selectedItemMes + '');
      this.currentDate = this.selectedItemDia + '-' + this.selectedItemMes + '-' + this.selectedItemAnio;
      this.noticiasObject.date = this.currentDate;
      this.cleanSpacesEditor1(this.editorContent);
      this.noticiasObject.phrase = this.editorContent;
      this.cleanSpacesEditor2(this.editorContent2);
      this.cleanSpacesEditor3(this.editorContent3);
      this.cleanSpacesEditor4(this.editorContent4);
      this.cleanSpacesEditor5(this.editorContent5);
      this.cleanSpacesEditor6(this.editorContent6);
      const id = Math.random().toString(36).substring(2);
      const filePath = `plantilla4Imagenes/${id}`;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.fileToUpload1);
      this.image1UploadPercent = task.percentageChanges();
      this.statusUploadImage1 = "Subiendo imagen 1"
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(url => {
            this.urlImage1 = url;
            this.editorContent3 = this.editorContent3 + '<div class="plantilla4-1"  style="background-image: url(' + this.urlImage1 + ');"></div>';
            this.noticiasObject.part2 = this.editorContent3;
            const id2 = Math.random().toString(36).substring(2);
            const filePath2 = `plantilla4Imagenes/${id2}`;
            const ref2 = this.storage.ref(filePath2);
            const task2 = this.storage.upload(filePath2, this.fileToUpload2);
            this.image1UploadPercent = task2.percentageChanges();
            this.statusUploadImage1 = "Subiendo imagen 2"
            task2.snapshotChanges().pipe(
              finalize(() => {
                ref2.getDownloadURL().subscribe(url => {
                  this.urlImage2 = url;
                  var posicion = this.editorContent4.search("-image-");
                  if (posicion !== -1) {
                    var b = '<div class="plantilla4-2" style="background-image: url(' + this.urlImage2 + ');"> </div>'
                    this.editorContent4 = [this.editorContent4.slice(0, posicion), b, this.editorContent4.slice(posicion)].join('');
                    posicion = this.editorContent4.search("-image-");
                    var var1 = this.editorContent4.substring(0, posicion);
                    var var2 = this.editorContent4.substring(posicion + 7, this.editorContent4.length);
                    this.editorContent4 = var1 + var2;
                    this.noticiasObject.part3 = this.editorContent4;
                  }
                  else {
                    this.noticiasObject.part3 = this.editorContent4;
                  }
                  const id3 = Math.random().toString(36).substring(2);
                  const filePath3 = `plantilla4Imagenes/${id3}`;
                  const ref3 = this.storage.ref(filePath3);
                  const task3 = this.storage.upload(filePath3, this.fileToUpload3);
                  this.image1UploadPercent = task3.percentageChanges();
                  this.statusUploadImage1 = "Subiendo imagen 3"
                  task3.snapshotChanges().pipe(
                    finalize(() => {
                      ref3.getDownloadURL().subscribe(url => {
                        this.urlImage3 = url;
                        if (this.imagenTamanio3CSS === "chico") {
                          if (this.imagenTamanio3Full === true) {
                            this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.urlImage3 + '); background-size: cover;"></div> ';
                          }
                          else {
                            this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.urlImage3 + '); background-size: contain;"></div> ';
                          }
                        }
                        else if (this.imagenTamanio3CSS === "mediano") {
                          if (this.imagenTamanio3Full === true) {
                            this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage3 + '); background-size: cover;"></div> ';
                          }
                          else {
                            this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage3 + '); background-size: contain;"></div> ';
                          }
                        }
                        else if (this.imagenTamanio3CSS === "grande") {
                          if (this.imagenTamanio3Full === true) {
                            this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.urlImage3 + '); background-size: cover;"></div> ';
                          }
                          else {
                            this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.urlImage3 + '); background-size: contain;"></div> ';
                          }
                        }
                        else {
                          this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage3 + ');"></div>';
                        }
                        this.noticiasObject.part4 = this.editorContent5;
                        const idPrincipal = Math.random().toString(36).substring(2);
                        const filePathPrincipal = `portadasNotas/${idPrincipal}`;
                        const refPrincipal = this.storage.ref(filePathPrincipal);
                        const taskPrincipal = this.storage.upload(filePathPrincipal, this.fileToUploadPrincipal);
                        this.image1UploadPercent = taskPrincipal.percentageChanges();
                        this.statusUploadImage1 = "Subiendo imagen 4"
                        taskPrincipal.snapshotChanges().pipe(
                          finalize(() => {
                            refPrincipal.getDownloadURL().subscribe(url => {
                              this.urlImagePrincipal = url;
                              this.noticiasObject.image1 = this.urlImage1;
                              this.noticiasObject.image2 = this.urlImage2;
                              this.noticiasObject.image3 = this.urlImage3;
                              this.noticiasObject.principalImage = this.urlImagePrincipal;
                              if (this.selectedItem === 'Noticias') {
                                this.noticiasService.insertNoticias(this.noticiasObject, "Noticias");
                                window.alert('Nota publicada con éxito');
                                this.redactarInsertarImagenes = false;
                                this.secciones = true;
                                this.restartAll();
                              }
                              else if (this.selectedItem === 'Ciencia') {
                                this.noticiasService.insertNoticias(this.noticiasObject, "Ciencia");
                                window.alert('Nota publicada con éxito');
                                this.redactarInsertarImagenes = false;
                                this.secciones = true;
                                this.restartAll();
                              }
                              else if (this.selectedItem === 'Arte') {
                                this.noticiasService.insertNoticias(this.noticiasObject, "Arte");
                                window.alert('Nota publicada con éxito');
                                this.redactarInsertarImagenes = false;
                                this.secciones = true;
                                this.restartAll();
                              }
                              else if (this.selectedItem === 'Ocio') {
                                this.noticiasService.insertNoticias(this.noticiasObject, "Ocio");
                                window.alert('Nota publicada con éxito');
                                this.redactarInsertarImagenes = false;
                                this.secciones = true;
                                this.restartAll();
                              }
                              else if (this.selectedItem === 'Descubre') {
                                this.noticiasService.insertNoticias(this.noticiasObject, "Descubre");
                                window.alert('Nota publicada con éxito');
                                this.redactarInsertarImagenes = false;
                                this.secciones = true;
                                this.restartAll();
                              }
                              else if (this.selectedItem === 'Mocotips') {
                                this.noticiasService.insertNoticias(this.noticiasObject, "Mocotips");
                                window.alert('Nota publicada con éxito');
                                this.redactarInsertarImagenes = false;
                                this.secciones = true;
                                this.restartAll();
                              }
                            });
                          })
                        ).subscribe();
                      });
                    })
                  ).subscribe();
                });
              })
            ).subscribe();
          });
        })
      ).subscribe();
    }
    else if (option === 5) {
      this.editorContent = this.editorForm.get('editor').value;
      this.editorContent2 = this.editorForm2.get('editor2').value;
      this.editorContent3 = this.editorForm3.get('editor3').value;
      this.editorContent4 = this.editorForm4.get('editor4').value;
      this.editorContent5 = this.editorForm5.get('editor5').value;
      this.noticiasObject.tittle = this.titulo5;
      this.editorContent2 = this.editorContent2;
      this.noticiasObject.part1 = this.editorContent2;
      this.noticiasObject.part3 = this.editorContent4;
      this.noticiasObject.plantilla = '5';
      this.noticiasObject.autor = this.autor5;
      this.convertMonths(this.selectedItemMes + '');
      this.currentDate = this.selectedItemDia + '-' + this.selectedItemMes + '-' + this.selectedItemAnio;
      this.noticiasObject.date = this.currentDate;
      this.cleanSpacesEditor1(this.editorContent);
      this.noticiasObject.phrase = this.editorContent;
      this.cleanSpacesEditor2(this.editorContent2);
      this.cleanSpacesEditor3(this.editorContent3);
      this.cleanSpacesEditor4(this.editorContent4);
      this.cleanSpacesEditor5(this.editorContent5);
      const id = Math.random().toString(36).substring(2);
      const filePath = `plantilla5Imagenes/${id}`;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.fileToUpload1);
      this.image1UploadPercent = task.percentageChanges();
      this.statusUploadImage1 = "Subiendo imagen 1"
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(url => {
            this.urlImage1 = url;
            if (this.imagenTamanio1CSS === "chico") {
              if (this.imagenTamanio1Full === true) {
                this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-chica"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
              }
              else {
                this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-chica"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
              }
            }
            else if (this.imagenTamanio1CSS === "mediano") {
              if (this.imagenTamanio1Full === true) {
                this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-mediana"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
              }
              else {
                this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-mediana"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
              }
            }
            else if (this.imagenTamanio1CSS === "grande") {
              if (this.imagenTamanio1Full === true) {
                this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-grande"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
              }
              else {
                this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-grande"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
              }
            }
            else {
              this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-mediana"  style="background-image: url(' + this.urlImage1 + ');"></div>';
            }
            const id2 = Math.random().toString(36).substring(2);
            const filePath2 = `plantilla5Imagenes/${id2}`;
            const ref2 = this.storage.ref(filePath2);
            const task2 = this.storage.upload(filePath2, this.fileToUpload2);
            this.image1UploadPercent = task2.percentageChanges();
            this.statusUploadImage1 = "Subiendo imagen 2"
            task2.snapshotChanges().pipe(
              finalize(() => {
                ref2.getDownloadURL().subscribe(url => {
                  this.urlImage2 = url;
                  this.noticiasObject.part4 = '<div class="plantilla5-2" style="background-image: url(' + this.urlImage2 + ');"></div> ' + this.editorContent5;
                  const idPrincipal = Math.random().toString(36).substring(2);
                  const filePathPrincipal = `portadasNotas/${idPrincipal}`;
                  const refPrincipal = this.storage.ref(filePathPrincipal);
                  const taskPrincipal = this.storage.upload(filePathPrincipal, this.fileToUploadPrincipal);
                  this.image1UploadPercent = taskPrincipal.percentageChanges();
                  this.statusUploadImage1 = "Subiendo imagen 3"
                  taskPrincipal.snapshotChanges().pipe(
                    finalize(() => {
                      refPrincipal.getDownloadURL().subscribe(url => {
                        this.urlImagePrincipal = url;
                        this.noticiasObject.image1 = this.urlImage1;
                        this.noticiasObject.image2 = this.urlImage2;
                        this.noticiasObject.principalImage = this.urlImagePrincipal;
                        if (this.selectedItem === 'Noticias') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Noticias");
                          window.alert('Nota publicada con éxito');
                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Ciencia') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Ciencia");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Arte') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Arte");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Ocio') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Ocio");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Descubre') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Descubre");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                        else if (this.selectedItem === 'Mocotips') {
                          this.noticiasService.insertNoticias(this.noticiasObject, "Mocotips");
                          window.alert('Nota publicada con éxito');

                          this.redactarInsertarImagenes = false;
                          this.secciones = true;
                          this.restartAll();
                        }
                      });
                    })
                  ).subscribe();
                });
              })
            ).subscribe();
          });
        })
      ).subscribe();
    }
    else if (option === 6) {
      this.editorContent = this.editorForm.get('editor').value;
      this.editorContent2 = this.editorForm2.get('editor2').value;
      this.editorContent3 = this.editorForm3.get('editor3').value;
      this.editorContent4 = this.editorForm4.get('editor4').value;
      this.editorContent5 = this.editorForm5.get('editor5').value;
      this.editorContent6 = this.editorForm6.get('editor6').value;
      this.editorContent7 = this.editorForm7.get('editor7').value;
      this.editorContent8 = this.editorForm8.get('editor8').value;
      console.log("editor 6: " + this.editorContent6)
      this.noticiasObjectPlantilla6.tittle = this.titulo6;
      if (this.titulo_youtube !== "") {
        this.noticiasObjectPlantilla6.youtube = "https://www.youtube.com/embed/" + this.titulo_youtube;
      }
      else {
        this.noticiasObjectPlantilla6.youtube = "";
      }
      this.noticiasObjectPlantilla6.plantilla = '6';
      this.noticiasObjectPlantilla6.autor = this.autor6;
      this.convertMonths(this.selectedItemMes + '');
      this.currentDate = this.selectedItemDia + '-' + this.selectedItemMes + '-' + this.selectedItemAnio;
      this.noticiasObjectPlantilla6.date = this.currentDate;
      this.cleanSpacesEditor1(this.editorContent);
      this.noticiasObjectPlantilla6.phrase = this.editorContent;
      this.cleanSpacesEditor2(this.editorContent2);
      this.noticiasObjectPlantilla6.part1 = this.editorContent2;
      this.cleanSpacesEditor3(this.editorContent3);
      this.cleanSpacesEditor4(this.editorContent4);
      this.cleanSpacesEditor5(this.editorContent5);
      this.cleanSpacesEditor6(this.editorContent6);
      this.cleanSpacesEditor7(this.editorContent7);
      this.cleanSpacesEditor8(this.editorContent8);
      console.log("editor 6: " + this.editorContent6)
      const id = Math.random().toString(36).substring(2);
      const filePath = `plantilla6Imagenes/${id}`;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.fileToUpload1);
      this.image1UploadPercent = task.percentageChanges();
      this.statusUploadImage1 = "Subiendo imagen 1"
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(url => {
            this.urlImage1 = url;
            var posicion = this.editorContent3.search("-image-");
            var posicion2 = this.editorContent3.search("-image2-");
            console.log("editor3: " + this.editorContent3)
            if (posicion !== -1 || posicion2 !== -1) {
              if (posicion !== -1) {
                var b = '<div class="plantilla6-derecha" style="background-image: url(' + this.urlImage1 + ');"> </div>'
                this.editorContent3 = [this.editorContent3.slice(0, posicion), b, this.editorContent3.slice(posicion)].join('');
                posicion = this.editorContent3.search("-image-");
                var var1 = this.editorContent3.substring(0, posicion);
                var var2 = this.editorContent3.substring(posicion + 7, this.editorContent3.length);
                this.editorContent3 = var1 + var2;
                this.noticiasObjectPlantilla6.part2 = this.editorContent3;
              }
              else if (posicion2 !== -1) {
                var b = '<div class="plantilla6-izquierda" style="background-image: url(' + this.urlImage1 + ');"> </div>'
                this.editorContent3 = [this.editorContent3.slice(0, posicion2), b, this.editorContent3.slice(posicion2)].join('');
                console.log(this.editorContent3);
                posicion2 = this.editorContent3.search("-image2-");
                var var1 = this.editorContent3.substring(0, posicion2);
                var var2 = this.editorContent3.substring(posicion2 + 8, this.editorContent3.length);
                this.editorContent3 = var1 + var2;
                this.noticiasObjectPlantilla6.part2 = this.editorContent3;
              }
            }
            else {
              this.noticiasObjectPlantilla6.part2 = this.editorContent3;
            }



            const id2 = Math.random().toString(36).substring(2);
            const filePath2 = `plantilla6Imagenes/${id2}`;
            const ref2 = this.storage.ref(filePath2);
            const task2 = this.storage.upload(filePath2, this.fileToUpload2);
            this.image1UploadPercent = task2.percentageChanges();
            this.statusUploadImage1 = "Subiendo imagen 2"
            task2.snapshotChanges().pipe(
              finalize(() => {
                ref2.getDownloadURL().subscribe(url => {
                  this.urlImage2 = url;
                  var posicion = this.editorContent4.search("-image-");
                  var posicion2 = this.editorContent4.search("-image2-");
                  if (posicion !== -1 || posicion2 !== -1) {
                    if (posicion !== -1) {
                      var b = '<div class="plantilla6-derecha" style="background-image: url(' + this.urlImage2 + ');"> </div>'
                      this.editorContent4 = [this.editorContent4.slice(0, posicion), b, this.editorContent4.slice(posicion)].join('');
                      posicion = this.editorContent4.search("-image-");
                      var var1 = this.editorContent4.substring(0, posicion);
                      var var2 = this.editorContent4.substring(posicion + 7, this.editorContent4.length);
                      this.editorContent4 = var1 + var2;
                      this.noticiasObjectPlantilla6.part3 = this.editorContent4;
                      console.log("detecto -image- en la parte 3:");
                      console.log(this.noticiasObjectPlantilla6.part3);
                    }
                    else if (posicion2 !== -1) {
                      var b = '<div class="plantilla6-izquierda" style="background-image: url(' + this.urlImage2 + ');"> </div>'
                      this.editorContent4 = [this.editorContent4.slice(0, posicion2), b, this.editorContent4.slice(posicion2)].join('');
                      posicion2 = this.editorContent4.search("-image2-");
                      var var1 = this.editorContent4.substring(0, posicion2);
                      var var2 = this.editorContent4.substring(posicion2 + 8, this.editorContent4.length);
                      this.editorContent4 = var1 + var2;
                      this.noticiasObjectPlantilla6.part3 = this.editorContent4;
                    }
                  }
                  else {
                    this.noticiasObjectPlantilla6.part3 = this.editorContent4;
                  }
                  const id3 = Math.random().toString(36).substring(2);
                  const filePath3 = `plantilla6Imagenes/${id3}`;
                  const ref3 = this.storage.ref(filePath3);
                  const task3 = this.storage.upload(filePath3, this.fileToUpload3);
                  this.image1UploadPercent = task3.percentageChanges();
                  this.statusUploadImage1 = "Subiendo imagen 3"
                  task3.snapshotChanges().pipe(
                    finalize(() => {
                      ref3.getDownloadURL().subscribe(url => {
                        this.urlImage3 = url;
                        var posicion = this.editorContent5.search("-image-");
                        var posicion2 = this.editorContent5.search("-image2-");
                        if (posicion !== -1 || posicion2 !== -1) {
                          if (posicion !== -1) {
                            var b = '<div class="plantilla6-derecha" style="background-image: url(' + this.urlImage3 + ');"> </div>'
                            this.editorContent5 = [this.editorContent5.slice(0, posicion), b, this.editorContent5.slice(posicion)].join('');
                            posicion = this.editorContent5.search("-image-");
                            var var1 = this.editorContent5.substring(0, posicion);
                            var var2 = this.editorContent5.substring(posicion + 7, this.editorContent5.length);
                            this.editorContent5 = var1 + var2;
                            this.noticiasObjectPlantilla6.part4 = this.editorContent5;
                          }
                          else if (posicion2 !== -1) {
                            var b = '<div class="plantilla6-izquierda" style="background-image: url(' + this.urlImage3 + ');"> </div>'
                            this.editorContent5 = [this.editorContent5.slice(0, posicion2), b, this.editorContent5.slice(posicion2)].join('');
                            posicion2 = this.editorContent5.search("-image2-");
                            var var1 = this.editorContent5.substring(0, posicion2);
                            var var2 = this.editorContent5.substring(posicion2 + 8, this.editorContent5.length);
                            this.editorContent5 = var1 + var2;
                            this.noticiasObjectPlantilla6.part4 = this.editorContent5;
                          }
                        }
                        else {
                          this.noticiasObjectPlantilla6.part4 = this.editorContent5;
                        }
                        const id4 = Math.random().toString(36).substring(2);
                        const filePath4 = `plantilla6Imagenes/${id4}`;
                        const ref4 = this.storage.ref(filePath4);
                        const task4 = this.storage.upload(filePath4, this.fileToUpload4_6);
                        this.image1UploadPercent = task4.percentageChanges();
                        this.statusUploadImage1 = "Subiendo imagen 4"
                        task4.snapshotChanges().pipe(
                          finalize(() => {
                            ref4.getDownloadURL().subscribe(url => {
                              this.urlImage4 = url;
                              var posicion = this.editorContent6.search("-image-");
                              var posicion2 = this.editorContent6.search("-image2-");
                              if (posicion !== -1 || posicion2 !== -1) {
                                if (posicion !== -1) {
                                  var b = '<div class="plantilla6-derecha" style="background-image: url(' + this.urlImage4 + ');"> </div>'
                                  this.editorContent6 = [this.editorContent6.slice(0, posicion), b, this.editorContent6.slice(posicion)].join('');
                                  posicion = this.editorContent6.search("-image-");
                                  var var1 = this.editorContent6.substring(0, posicion);
                                  var var2 = this.editorContent6.substring(posicion + 7, this.editorContent6.length);
                                  this.editorContent6 = var1 + var2;
                                  this.noticiasObjectPlantilla6.part5 = this.editorContent6;
                                }
                                else if (posicion2 !== -1) {
                                  var b = '<div class="plantilla6-izquierda" style="background-image: url(' + this.urlImage4 + ');"> </div>'
                                  this.editorContent6 = [this.editorContent6.slice(0, posicion2), b, this.editorContent6.slice(posicion2)].join('');
                                  posicion2 = this.editorContent6.search("-image2-");
                                  var var1 = this.editorContent6.substring(0, posicion2);
                                  var var2 = this.editorContent6.substring(posicion2 + 8, this.editorContent6.length);
                                  this.editorContent6 = var1 + var2;
                                  this.noticiasObjectPlantilla6.part5 = this.editorContent6;
                                }
                              }
                              else {
                                this.noticiasObjectPlantilla6.part5 = this.editorContent6;
                              }
                              console.log(this.editorContent6)
                              //imagen 5
                              const id5 = Math.random().toString(36).substring(2);
                              const filePath5 = `plantilla6Imagenes/${id5}`;
                              const ref5 = this.storage.ref(filePath5);
                              const task5 = this.storage.upload(filePath5, this.fileToUpload5_6);
                              this.image1UploadPercent = task5.percentageChanges();
                              this.statusUploadImage1 = "Subiendo imagen 5"
                              task5.snapshotChanges().pipe(
                                finalize(() => {
                                  ref5.getDownloadURL().subscribe(url => {
                                    this.urlImage5 = url;
                                    var posicion = this.editorContent7.search("-image-");
                                    var posicion2 = this.editorContent7.search("-image2-");
                                    if (posicion !== -1 || posicion2 !== -1) {
                                      if (posicion !== -1) {
                                        var b = '<div class="plantilla6-derecha" style="background-image: url(' + this.urlImage5 + ');"> </div>'
                                        this.editorContent7 = [this.editorContent7.slice(0, posicion), b, this.editorContent7.slice(posicion)].join('');
                                        posicion = this.editorContent7.search("-image-");
                                        var var1 = this.editorContent7.substring(0, posicion);
                                        var var2 = this.editorContent7.substring(posicion + 7, this.editorContent7.length);
                                        this.editorContent7 = var1 + var2;
                                        this.noticiasObjectPlantilla6.part6 = this.editorContent7;
                                      }
                                      else if (posicion2 !== -1) {
                                        var b = '<div class="plantilla6-izquierda" style="background-image: url(' + this.urlImage5 + ');"> </div>'
                                        this.editorContent7 = [this.editorContent7.slice(0, posicion2), b, this.editorContent7.slice(posicion2)].join('');
                                        posicion2 = this.editorContent7.search("-image2-");
                                        var var1 = this.editorContent7.substring(0, posicion2);
                                        var var2 = this.editorContent7.substring(posicion2 + 8, this.editorContent7.length);
                                        this.editorContent7 = var1 + var2;
                                        this.noticiasObjectPlantilla6.part6 = this.editorContent7;
                                      }
                                    }
                                    else {
                                      this.noticiasObjectPlantilla6.part6 = this.editorContent7;
                                    }
                                    //imagen6
                                    const id6 = Math.random().toString(36).substring(2);
                                    const filePath6 = `plantilla6Imagenes/${id6}`;
                                    const ref6 = this.storage.ref(filePath6);
                                    const task6 = this.storage.upload(filePath6, this.fileToUpload6_6);
                                    this.image1UploadPercent = task6.percentageChanges();
                                    this.statusUploadImage1 = "Subiendo imagen 6"
                                    task6.snapshotChanges().pipe(
                                      finalize(() => {
                                        ref6.getDownloadURL().subscribe(url => {
                                          this.urlImage6 = url;
                                          this.editorContent8 = '<div class="plantilla1-2" style="background-image: url(' + this.urlImage6 + ');"></div> ' + this.editorContent8;
                                          this.noticiasObjectPlantilla6.part7 = this.editorContent8;
                                          //imagen principal
                                          const idPrincipal = Math.random().toString(36).substring(2);
                                          const filePathPrincipal = `portadasNotas/${idPrincipal}`;
                                          const refPrincipal = this.storage.ref(filePathPrincipal);
                                          const taskPrincipal = this.storage.upload(filePathPrincipal, this.fileToUploadPrincipal);
                                          this.image1UploadPercent = taskPrincipal.percentageChanges();
                                          this.statusUploadImage1 = "Subiendo imagen principal"
                                          taskPrincipal.snapshotChanges().pipe(
                                            finalize(() => {
                                              refPrincipal.getDownloadURL().subscribe(url => {
                                                this.urlImagePrincipal = url;
                                                this.noticiasObjectPlantilla6.image1 = this.urlImage1;
                                                this.noticiasObjectPlantilla6.image2 = this.urlImage2;
                                                this.noticiasObjectPlantilla6.image3 = this.urlImage3;
                                                this.noticiasObjectPlantilla6.image4 = this.urlImage4;
                                                this.noticiasObjectPlantilla6.image5 = this.urlImage5;
                                                this.noticiasObjectPlantilla6.image6 = this.urlImage6;
                                                this.noticiasObjectPlantilla6.principalImage = this.urlImagePrincipal;
                                                console.log(this.noticiasObjectPlantilla6);
                                                if (this.selectedItem === 'Noticias') {
                                                  this.noticiasService.insertNoticiasPlantilla6(this.noticiasObjectPlantilla6, "Noticias");
                                                  window.alert('Nota publicada con éxito');
                                                  this.redactarInsertarImagenes = false;
                                                  this.secciones = true;
                                                  this.restartAll();
                                                }
                                                else if (this.selectedItem === 'Ciencia') {
                                                  this.noticiasService.insertNoticiasPlantilla6(this.noticiasObjectPlantilla6, "Ciencia");
                                                  window.alert('Nota publicada con éxito');

                                                  this.redactarInsertarImagenes = false;
                                                  this.secciones = true;
                                                  this.restartAll();
                                                }
                                                else if (this.selectedItem === 'Arte') {
                                                  this.noticiasService.insertNoticiasPlantilla6(this.noticiasObjectPlantilla6, "Arte");
                                                  window.alert('Nota publicada con éxito');

                                                  this.redactarInsertarImagenes = false;
                                                  this.secciones = true;
                                                  this.restartAll();
                                                }
                                                else if (this.selectedItem === 'Ocio') {
                                                  this.noticiasService.insertNoticiasPlantilla6(this.noticiasObjectPlantilla6, "Ocio");
                                                  window.alert('Nota publicada con éxito');

                                                  this.redactarInsertarImagenes = false;
                                                  this.secciones = true;
                                                  this.restartAll();
                                                }
                                                else if (this.selectedItem === 'Descubre') {
                                                  this.noticiasService.insertNoticiasPlantilla6(this.noticiasObjectPlantilla6, "Descubre");
                                                  window.alert('Nota publicada con éxito');

                                                  this.redactarInsertarImagenes = false;
                                                  this.secciones = true;
                                                  this.restartAll();
                                                }
                                                else if (this.selectedItem === 'Mocotips') {
                                                  this.noticiasService.insertNoticiasPlantilla6(this.noticiasObjectPlantilla6, "Mocotips");
                                                  window.alert('Nota publicada con éxito');

                                                  this.redactarInsertarImagenes = false;
                                                  this.secciones = true;
                                                  this.restartAll();
                                                }
                                              });
                                            })
                                          ).subscribe();
                                        });
                                      })
                                    ).subscribe();
                                  });
                                })
                              ).subscribe();
                            });
                          })
                        ).subscribe();
                      });
                    })
                  ).subscribe();
                });
              })
            ).subscribe();
          });
        })
      ).subscribe();
    }

  }
  continue(plantilla: number) {
    if (plantilla === 1) {
      this.hidePlantillas();
      this.imagenTamanio1 = false;
      this.imagenTamanio2 = false;
      this.imagenTamanio3 = false;
      this.publicarplantilla1 = true;
      this.publicarplantilla2 = false;
      this.publicarplantilla3 = false;
      this.publicarplantilla4 = false;
      this.publicarplantilla5 = false;
      this.publicarplantilla6 = false;
      this.part3AndYoutubeImagenes = false;
      this.redactarInsertarImagenes = true;
      this.redactarInsertarImagenesPlantilla6 = false;

      this.plantillaSubirImagen1 = true;
      this.plantillaSubirImagen2 = false;
      this.plantillaSubirImagen3 = false;
      this.plantillaSubirImagen4 = false;
      this.plantillaSubirImagen5 = false;
      this.plantillaSubirImagen6 = false;

    }
    else if (plantilla === 2) {
      this.imagenTamanio1 = true;
      this.imagenTamanio2 = true;
      this.imagenTamanio3 = false;
      this.publicarplantilla2 = true;
      this.publicarplantilla1 = false;
      this.publicarplantilla3 = false;
      this.publicarplantilla4 = false;
      this.publicarplantilla5 = false;
      this.publicarplantilla6 = false;
      this.hidePlantillas();
      this.part3AndYoutubeImagenes = false;
      this.redactarInsertarImagenes = true;
      this.redactarInsertarImagenesPlantilla6 = false;

      this.plantillaSubirImagen1 = false;
      this.plantillaSubirImagen2 = true;
      this.plantillaSubirImagen3 = false;
      this.plantillaSubirImagen4 = false;
      this.plantillaSubirImagen5 = false;
      this.plantillaSubirImagen6 = false;
    }
    else if (plantilla === 3) {
      this.hidePlantillas();
      this.imagenTamanio1 = true;
      this.imagenTamanio2 = false;
      this.imagenTamanio3 = false;
      this.publicarplantilla3 = true;
      this.publicarplantilla2 = false;
      this.publicarplantilla1 = false;
      this.publicarplantilla4 = false;
      this.publicarplantilla5 = false;
      this.publicarplantilla6 = false;
      this.part3AndYoutubeImagenes = false;
      this.publicarplantilla3 = true;
      this.redactarInsertarImagenes = true;
      this.redactarInsertarImagenesPlantilla6 = false;

      this.plantillaSubirImagen1 = false;
      this.plantillaSubirImagen2 = false;
      this.plantillaSubirImagen3 = true;
      this.plantillaSubirImagen4 = false;
      this.plantillaSubirImagen5 = false;
      this.plantillaSubirImagen6 = false;
    }
    else if (plantilla === 4) {
      this.hidePlantillas();
      this.imagenTamanio1 = false;
      this.imagenTamanio2 = false;
      this.imagenTamanio3 = true;
      this.publicarplantilla4 = true;
      this.publicarplantilla2 = false;
      this.publicarplantilla3 = false;
      this.publicarplantilla1 = false;
      this.publicarplantilla5 = false;
      this.publicarplantilla6 = false;
      this.part3AndYoutubeImagenes = true;
      this.publicarplantilla4 = true;
      this.redactarInsertarImagenes = true;
      this.redactarInsertarImagenesPlantilla6 = false;

      this.plantillaSubirImagen1 = false;
      this.plantillaSubirImagen2 = false;
      this.plantillaSubirImagen3 = false;
      this.plantillaSubirImagen4 = true;
      this.plantillaSubirImagen5 = false;
      this.plantillaSubirImagen6 = false;
    }
    else if (plantilla === 5) {
      this.hidePlantillas();
      this.imagenTamanio1 = true;
      this.imagenTamanio2 = false;
      this.imagenTamanio3 = false;
      this.publicarplantilla5 = true;
      this.publicarplantilla6 = false;
      this.publicarplantilla2 = false;
      this.publicarplantilla3 = false;
      this.publicarplantilla4 = false;
      this.publicarplantilla1 = false;
      this.part3AndYoutubeImagenes = false;
      this.redactarInsertarImagenes = true;
      this.redactarInsertarImagenesPlantilla6 = false;

      this.plantillaSubirImagen1 = false;
      this.plantillaSubirImagen2 = false;
      this.plantillaSubirImagen3 = false;
      this.plantillaSubirImagen4 = false;
      this.plantillaSubirImagen5 = true;
      this.plantillaSubirImagen6 = false;
    }
    else if (plantilla === 6) {
      this.hidePlantillas();
      this.imagenTamanio1 = false;
      this.imagenTamanio2 = false;
      this.imagenTamanio3 = false;
      this.publicarplantilla6 = true;
      this.publicarplantilla5 = false;
      this.publicarplantilla2 = false;
      this.publicarplantilla3 = false;
      this.publicarplantilla4 = false;
      this.publicarplantilla1 = false;
      this.part3AndYoutubeImagenes = false;
      this.redactarInsertarImagenes = false;
      this.redactarInsertarImagenesPlantilla6 = true;

      this.plantillaSubirImagen1 = false;
      this.plantillaSubirImagen2 = false;
      this.plantillaSubirImagen3 = false;
      this.plantillaSubirImagen4 = false;
      this.plantillaSubirImagen5 = false;
      this.plantillaSubirImagen6 = true;

      this.editorContent = this.editorForm.get('editor').value;
      this.editorContent2 = this.editorForm2.get('editor2').value;
      this.editorContent3 = this.editorForm3.get('editor3').value;
      this.editorContent4 = this.editorForm4.get('editor4').value;
      this.editorContent5 = this.editorForm5.get('editor5').value;
      this.editorContent6 = this.editorForm6.get('editor6').value;
      this.editorContent7 = this.editorForm7.get('editor7').value;
      this.editorContent8 = this.editorForm8.get('editor8').value;

    }
    else if (plantilla === 7) {
      this.hidePlantillas();
      this.plantillaSubirImagen1 = false;
      this.plantillaSubirImagen2 = false;
      this.plantillaSubirImagen3 = false;
      this.plantillaSubirImagen4 = false;
      this.plantillaSubirImagen5 = false;
      this.plantillaSubirImagen6 = false;
      this.especialDelMes = false;
      this.especialDelMesSubirImagen = true;
      
    }
    
  }
  cleanSpacesEditor1(editor1: string) {
    var posicion = editor1.search("&nbsp;");
    while (posicion !== -1) {
      var var1 = editor1.substring(0, posicion);
      var var2 = editor1.substring(posicion + 6, editor1.length);
      editor1 = var1 + ' ' + var2;
      var posicion = editor1.search("&nbsp;");
    }
    this.editorContent = editor1;
    var posicion = editor1.search(".&nbsp;");
    while (posicion !== -1) {
      var var1 = editor1.substring(0, posicion);
      var var2 = editor1.substring(posicion + 7, editor1.length);
      editor1 = var1 + ' ' + var2;
      var posicion = editor1.search(".&nbsp;");
    }
    this.editorContent = editor1;
    var posicion = editor1.search("&amp;nbsp;");
    while (posicion !== -1) {
      var var1 = editor1.substring(0, posicion);
      var var2 = editor1.substring(posicion + 10, editor1.length);
      editor1 = var1 + ' ' + var2;
      var posicion = editor1.search("&amp;nbsp;");
    }
    this.editorContent = editor1;
  }
  cleanSpacesEditor2(editor2: string) {
    var posicion = editor2.search("&nbsp;");
    while (posicion !== -1) {
      var var1 = editor2.substring(0, posicion);
      var var2 = editor2.substring(posicion + 6, editor2.length);
      editor2 = var1 + ' ' + var2;
      var posicion = editor2.search("&nbsp;");
    }
    this.editorContent2 = editor2;
    var posicion = editor2.search(".&nbsp;");
    while (posicion !== -1) {
      var var1 = editor2.substring(0, posicion);
      var var2 = editor2.substring(posicion + 7, editor2.length);
      editor2 = var1 + ' ' + var2;
      var posicion = editor2.search(".&nbsp;");
    }
    this.editorContent2 = editor2;
    var posicion = editor2.search("&amp;nbsp;");
    while (posicion !== -1) {
      var var1 = editor2.substring(0, posicion);
      var var2 = editor2.substring(posicion + 10, editor2.length);
      editor2 = var1 + ' ' + var2;
      var posicion = editor2.search("&amp;nbsp;");
    }
    this.editorContent2 = editor2;
  }
  cleanSpacesEditor3(editor3: string) {
    var posicion = editor3.search("&nbsp;");
    while (posicion !== -1) {
      var var1 = editor3.substring(0, posicion);
      var var2 = editor3.substring(posicion + 6, editor3.length);
      editor3 = var1 + ' ' + var2;
      var posicion = editor3.search("&nbsp;");
    }
    this.editorContent3 = editor3;
    var posicion = editor3.search(".&nbsp;");
    while (posicion !== -1) {
      var var1 = editor3.substring(0, posicion);
      var var2 = editor3.substring(posicion + 7, editor3.length);
      editor3 = var1 + ' ' + var2;
      var posicion = editor3.search(".&nbsp;");
    }
    this.editorContent3 = editor3;
    var posicion = editor3.search("&amp;nbsp;");
    while (posicion !== -1) {
      var var1 = editor3.substring(0, posicion);
      var var2 = editor3.substring(posicion + 10, editor3.length);
      editor3 = var1 + ' ' + var2;
      var posicion = editor3.search("&amp;nbsp;");
    }
    this.editorContent3 = editor3;
  }
  cleanSpacesEditor4(editor4: string) {
    var posicion = editor4.search("&nbsp;");
    while (posicion !== -1) {
      var var1 = editor4.substring(0, posicion);
      var var2 = editor4.substring(posicion + 6, editor4.length);
      editor4 = var1 + ' ' + var2;
      var posicion = editor4.search("&nbsp;");
    }
    this.editorContent4 = editor4;
    var posicion = editor4.search(".&nbsp;");
    while (posicion !== -1) {
      var var1 = editor4.substring(0, posicion);
      var var2 = editor4.substring(posicion + 7, editor4.length);
      editor4 = var1 + ' ' + var2;
      var posicion = editor4.search(".&nbsp;");
    }
    this.editorContent4 = editor4;
    var posicion = editor4.search("&amp;nbsp;");
    while (posicion !== -1) {
      var var1 = editor4.substring(0, posicion);
      var var2 = editor4.substring(posicion + 10, editor4.length);
      editor4 = var1 + ' ' + var2;
      var posicion = editor4.search("&amp;nbsp;");
    }
    this.editorContent4 = editor4;
  }
  cleanSpacesEditor5(editor5: string) {
    var posicion = editor5.search("&nbsp;");
    while (posicion !== -1) {
      var var1 = editor5.substring(0, posicion);
      var var2 = editor5.substring(posicion + 6, editor5.length);
      editor5 = var1 + ' ' + var2;
      var posicion = editor5.search("&nbsp;");
    }
    this.editorContent5 = editor5;
    var posicion = editor5.search(".&nbsp;");
    while (posicion !== -1) {
      var var1 = editor5.substring(0, posicion);
      var var2 = editor5.substring(posicion + 7, editor5.length);
      editor5 = var1 + ' ' + var2;
      var posicion = editor5.search(".&nbsp;");
    }
    this.editorContent5 = editor5;
    var posicion = editor5.search("&amp;nbsp;");
    while (posicion !== -1) {
      var var1 = editor5.substring(0, posicion);
      var var2 = editor5.substring(posicion + 10, editor5.length);
      editor5 = var1 + ' ' + var2;
      var posicion = editor5.search("&amp;nbsp;");
    }
    this.editorContent5 = editor5;
  }
  cleanSpacesEditor6(editor6: string) {
    var posicion = editor6.search("&nbsp;");
    while (posicion !== -1) {
      var var1 = editor6.substring(0, posicion);
      var var2 = editor6.substring(posicion + 6, editor6.length);
      editor6 = var1 + ' ' + var2;
      var posicion = editor6.search("&nbsp;");
    }
    this.editorContent6 = editor6;
    var posicion = editor6.search(".&nbsp;");
    while (posicion !== -1) {
      var var1 = editor6.substring(0, posicion);
      var var2 = editor6.substring(posicion + 7, editor6.length);
      editor6 = var1 + ' ' + var2;
      var posicion = editor6.search(".&nbsp;");
    }
    this.editorContent6 = editor6;
    var posicion = editor6.search("&amp;nbsp;");
    while (posicion !== -1) {
      var var1 = editor6.substring(0, posicion);
      var var2 = editor6.substring(posicion + 10, editor6.length);
      editor6 = var1 + ' ' + var2;
      var posicion = editor6.search("&amp;nbsp;");
    }
    console.log(this.editorContent6)
    this.editorContent6 = editor6;
  }
  cleanSpacesEditor7(editor7: string) {
    var posicion = editor7.search("&nbsp;");
    while (posicion !== -1) {
      var var1 = editor7.substring(0, posicion);
      var var2 = editor7.substring(posicion + 6, editor7.length);
      editor7 = var1 + ' ' + var2;
      var posicion = editor7.search("&nbsp;");
    }
    this.editorContent7 = editor7;
    var posicion = editor7.search(".&nbsp;");
    while (posicion !== -1) {
      var var1 = editor7.substring(0, posicion);
      var var2 = editor7.substring(posicion + 7, editor7.length);
      editor7 = var1 + ' ' + var2;
      var posicion = editor7.search(".&nbsp;");
    }
    this.editorContent7 = editor7;
    var posicion = editor7.search("&amp;nbsp;");
    while (posicion !== -1) {
      var var1 = editor7.substring(0, posicion);
      var var2 = editor7.substring(posicion + 10, editor7.length);
      editor7 = var1 + ' ' + var2;
      var posicion = editor7.search("&amp;nbsp;");
    }
    this.editorContent7 = editor7;
  }
  cleanSpacesEditor8(editor8: string) {
    var posicion = editor8.search("&nbsp;");
    while (posicion !== -1) {
      var var1 = editor8.substring(0, posicion);
      var var2 = editor8.substring(posicion + 6, editor8.length);
      editor8 = var1 + ' ' + var2;
      var posicion = editor8.search("&nbsp;");
    }
    this.editorContent8 = editor8;
    var posicion = editor8.search(".&nbsp;");
    while (posicion !== -1) {
      var var1 = editor8.substring(0, posicion);
      var var2 = editor8.substring(posicion + 7, editor8.length);
      editor8 = var1 + ' ' + var2;
      var posicion = editor8.search(".&nbsp;");
    }
    this.editorContent8 = editor8;
    var posicion = editor8.search("&amp;nbsp;");
    while (posicion !== -1) {
      var var1 = editor8.substring(0, posicion);
      var var2 = editor8.substring(posicion + 10, editor8.length);
      editor8 = var1 + ' ' + var2;
      var posicion = editor8.search("&amp;nbsp;");
    }
    this.editorContent8 = editor8;
  }
  cleanTittle() {
    this.titulo = "";
    this.titulo2 = "";
    this.titulo3 = "";
    this.titulo4 = "";
    this.titulo5 = "";
    this.tituloEspecial = "";
  }
  convertMonths(mes: string) {
    if (mes === "Enero") {
      this.selectedItemMes = '01'
    }
    else if (mes === "Febrero") {
      this.selectedItemMes = '02'
    }
    else if (mes === "Marzo") {
      this.selectedItemMes = '03'
    }
    else if (mes === "Abril") {
      this.selectedItemMes = '04'
    }
    else if (mes === "Mayo") {
      this.selectedItemMes = '05'
    }
    else if (mes === "Junio") {
      this.selectedItemMes = '06'
    }
    else if (mes === "Julio") {
      this.selectedItemMes = '07'
    }
    else if (mes === "Agosto") {
      this.selectedItemMes = '08'
    }
    else if (mes === "Septiembre") {
      this.selectedItemMes = '09'
    }
    else if (mes === "Octubre") {
      this.selectedItemMes = '10'
    }
    else if (mes === "Noviembre") {
      this.selectedItemMes = '11'
    }
    else if (mes === "Diciembre") {
      this.selectedItemMes = '12'
    }
  }
  reverttMonths(mes: string) {
    if (mes === "01") {
      this.selectedItemMes = 'Enero'
    }
    else if (mes === "02") {
      this.selectedItemMes = 'Febrero'
    }
    else if (mes === "03") {
      this.selectedItemMes = 'Marzo'
    }
    else if (mes === "04") {
      this.selectedItemMes = 'Abril'
    }
    else if (mes === "05") {
      this.selectedItemMes = 'Mayo'
    }
    else if (mes === "06") {
      this.selectedItemMes = 'Junio'
    }
    else if (mes === "07") {
      this.selectedItemMes = 'Julio'
    }
    else if (mes === "08") {
      this.selectedItemMes = 'Agosto'
    }
    else if (mes === "09") {
      this.selectedItemMes = 'Septiembre'
    }
    else if (mes === "10") {
      this.selectedItemMes = 'Octubre'
    }
    else if (mes === "11") {
      this.selectedItemMes = 'Noviembre'
    }
    else if (mes === "12") {
      this.selectedItemMes = 'Diciembre'
    }
  }
  addImages1(event: any) {
    var selectedFile = event.target.files[0];
    this.fileToUpload1Name1 = selectedFile.name;
    this.fileToUpload1Name1_6 = selectedFile.name;
    this.fileToUpload1 = event.target.files[0];
    this.agregarImagenesRevista = true;
  }
  addImages2(event: any) {
    var selectedFile = event.target.files[0];
    this.fileToUpload1Name2 = selectedFile.name;
    this.fileToUpload1Name2_6 = selectedFile.name;
    this.fileToUpload2 = event.target.files[0];
  }
  addImages3(event: any) {
    var selectedFile = event.target.files[0];
    this.fileToUpload1Name3 = selectedFile.name;
    this.fileToUpload1Name3_6 = selectedFile.name;
    this.fileToUpload3 = event.target.files[0]
  }
  addImages4(event: any) {
    var selectedFile = event.target.files[0];
    this.fileToUpload1Name4_6 = selectedFile.name;
    this.fileToUpload4_6 = event.target.files[0]
  }
  addImages5(event: any) {
    var selectedFile = event.target.files[0];
    this.fileToUpload1Name5_6 = selectedFile.name;
    this.fileToUpload5_6 = event.target.files[0]
  }
  addImages6(event: any) {
    var selectedFile = event.target.files[0];
    this.fileToUpload1Name6_6 = selectedFile.name;
    this.fileToUpload6_6 = event.target.files[0]
  }
  addImagesPrincipal(event: any) {
    var selectedFile = event.target.files[0];
    this.fileToUpload1Name4 = selectedFile.name;
    this.fileToUploadPrincipal = event.target.files[0]
  }
  imagen1Tamanio(value) {
    this.imagenTamanio1CSS = value;
  }
  imagen2Tamanio(value) {
    this.imagenTamanio2CSS = value;
  }
  imagen3Tamanio(value) {
    this.imagenTamanio3CSS = value;
  }
  imagen1Full(event) {
    if (event.target.checked) {
      this.imagenTamanio1Full = true;
    }
    else {
      this.imagenTamanio1Full = false;
    }
  }
  imagen2Full(event) {
    if (event.target.checked) {
      this.imagenTamanio2Full = true;
    }
    else {
      this.imagenTamanio2Full = false;
    }
  }
  imagen3Full(event) {
    if (event.target.checked) {
      this.imagenTamanio3Full = true;
    }
    else {
      this.imagenTamanio3Full = false;
    }
  }
  changeRevistaMocotips(part: number) {
    this.subirDatosRevistaMocotips = false;
    console.log(this.revistaMocotipsElegir)
    this.revistaMocotipsElegir = false;
    console.log(this.revistaMocotipsElegir)
    if (part === 1) {
      this.seccionRevista1 = true;
      this.seccionRevista2 = false;
      this.seccionRevista3 = false;
      this.seccionRevista4 = false;
      this.seccionRevista5 = false;
      this.seccionRevista6 = false;
      this.seccionRevista7 = false;
      this.seccionRevista8 = false;
      this.seccionRevista9 = false;
      this.seccionRevista10 = false;
      this.parteRevistaMocotips = 'Introducción';
      this.cloudfirestore.getSeccionIntroTips(this.nodoGeneralSelected[0]).subscribe(item => {
        var id;
        var contenido;
        var titulo;
        if (item.length !== 0) {
          item.forEach((revista: any) => {
            id = revista.payload.doc.id;
            contenido = revista.payload.doc.data().contenido;
            titulo = revista.payload.doc.data().tittle;
          })
          this.tituloRevistaMocotips = titulo;
          this.idTipsRevistaDig[6] = id;
          this.editorFormRevista = new FormGroup({
            'editorRevista': new FormControl(contenido)
          })
          this.actualizarMocotip = true;
        }
        else {
          this.actualizarMocotip = false;
        }
      })

    }
    else if (part === 2) {
      this.seccionRevista1 = false;
      this.seccionRevista2 = true;
      this.seccionRevista3 = false;
      this.seccionRevista4 = false;
      this.seccionRevista5 = false;
      this.seccionRevista6 = false;
      this.seccionRevista7 = false;
      this.seccionRevista8 = false;
      this.seccionRevista9 = false;
      this.seccionRevista10 = false;

      this.parteRevistaMocotips = 'Especial';

      this.cloudfirestore.getSeccionEspecialTips(this.nodoGeneralSelected[0]).subscribe(item => {
        var id;
        var contenido;
        var titulo;
        if (item.length !== 0) {
          item.forEach((revista: any) => {
            id = revista.payload.doc.id;
            contenido = revista.payload.doc.data().contenido;
            titulo = revista.payload.doc.data().tittle;
          })
          this.tituloRevistaMocotips2 = titulo;
          this.idTipsRevistaDig[8] = id;
          this.editorFormRevista2 = new FormGroup({
            'editorRevista2': new FormControl(contenido)
          })
          this.actualizarMocotip = true;
        }
        else {
          this.actualizarMocotip = false;
        }
      })
    }
    else if (part === 3) {
      this.seccionRevista1 = false;
      this.seccionRevista2 = false;
      this.seccionRevista3 = true;
      this.seccionRevista4 = false;
      this.seccionRevista5 = false;
      this.seccionRevista6 = false;
      this.seccionRevista7 = false;
      this.seccionRevista8 = false;
      this.seccionRevista9 = false;
      this.seccionRevista10 = false;   
      this.parteRevistaMocotips = 'Hurga Datos';
      this.cloudfirestore.getSeccionHurgaDatosTips(this.nodoGeneralSelected[0]).subscribe(item => {
        var id;
        var contenido;
        var titulo;
        if (item.length !== 0) {
          item.forEach((revista: any) => {
            id = revista.payload.doc.id;
            contenido = revista.payload.doc.data().contenido;
            titulo = revista.payload.doc.data().tittle;
          })
          this.tituloRevistaMocotips3 = titulo;
          this.idTipsRevistaDig[3] = id;
          this.editorFormRevista3 = new FormGroup({
            'editorRevista3': new FormControl(contenido)
          })
          this.actualizarMocotip = true;
        }
        else {
          this.actualizarMocotip = false;
        }
      })
    }
    else if (part === 4) {
      this.seccionRevista1 = false;
      this.seccionRevista2 = false;
      this.seccionRevista3 = false;
      this.seccionRevista4 = true;
      this.seccionRevista5 = false;
      this.seccionRevista6 = false;
      this.seccionRevista7 = false;
      this.seccionRevista8 = false;
      this.seccionRevista9 = false;
      this.seccionRevista10 = false;
      this.parteRevistaMocotips = 'Bio Aventura';
      this.cloudfirestore.getSeccionBioAventuraTips(this.nodoGeneralSelected[0]).subscribe(item => {
        var id;
        var contenido;
        var titulo;
        if (item.length !== 0) {
          item.forEach((revista: any) => {
            id = revista.payload.doc.id;
            contenido = revista.payload.doc.data().contenido;
            titulo = revista.payload.doc.data().tittle;
          })
          this.tituloRevistaMocotips4 = titulo;
          this.idTipsRevistaDig[5] = id;
          this.editorFormRevista4 = new FormGroup({
            'editorRevista4': new FormControl(contenido)
          })
          this.actualizarMocotip = true;
        }
        else {
          this.actualizarMocotip = false;
        }
      })
    }
    else if (part === 5) {
      this.seccionRevista1 = false;
      this.seccionRevista2 = false;
      this.seccionRevista3 = false;
      this.seccionRevista4 = false;
      this.seccionRevista5 = true;
      this.seccionRevista6 = false;
      this.seccionRevista7 = false;
      this.seccionRevista8 = false;
      this.seccionRevista9 = false;
      this.seccionRevista10 = false;   
      this.parteRevistaMocotips = 'Eco Moco';
      this.cloudfirestore.getSeccionEcoMocoTips(this.nodoGeneralSelected[0]).subscribe(item => {
        var id;
        var contenido;
        var titulo;
        if (item.length !== 0) {
          item.forEach((revista: any) => {
            id = revista.payload.doc.id;
            contenido = revista.payload.doc.data().contenido;
            titulo = revista.payload.doc.data().tittle;
          })
          this.tituloRevistaMocotips5 = titulo;
          this.idTipsRevistaDig[1] = id;
          this.editorFormRevista5 = new FormGroup({
            'editorRevista5': new FormControl(contenido)
          })
          this.actualizarMocotip = true;
        }
        else {
          this.actualizarMocotip = false;
        }
      })
    }
    else if (part === 6) {
      this.seccionRevista1 = false;
      this.seccionRevista2 = false;
      this.seccionRevista3 = false;
      this.seccionRevista4 = false;
      this.seccionRevista5 = false;
      this.seccionRevista6 = true;
      this.seccionRevista7 = false;
      this.seccionRevista8 = false;
      this.seccionRevista9 = false;
      this.seccionRevista10 = false;
      this.parteRevistaMocotips = 'Arte y Mañas';
      this.cloudfirestore.getSeccionArteTips(this.nodoGeneralSelected[0]).subscribe(item => {
        var id;
        var contenido;
        var titulo;
        if (item.length !== 0) {
          item.forEach((revista: any) => {
            id = revista.payload.doc.id;
            contenido = revista.payload.doc.data().contenido;
            titulo = revista.payload.doc.data().tittle;
          })
          this.tituloRevistaMocotips6 = titulo;
          this.idTipsRevistaDig[7] = id;
          this.editorFormRevista6 = new FormGroup({
            'editorRevista6': new FormControl(contenido)
          })
          this.actualizarMocotip = true;
        }
        else {
          this.actualizarMocotip = false;
        }
      })
    }
    else if (part === 7) {
      this.seccionRevista1 = false;
      this.seccionRevista2 = false;
      this.seccionRevista3 = false;
      this.seccionRevista4 = false;
      this.seccionRevista5 = false;
      this.seccionRevista6 = false;
      this.seccionRevista7 = true;
      this.seccionRevista8 = false;
      this.seccionRevista9 = false;
      this.seccionRevista10 = false;
      this.parteRevistaMocotips = 'Puro Cuento';
      this.cloudfirestore.getSeccionPuroCuentoTips(this.nodoGeneralSelected[0]).subscribe(item => {
        var id;
        var contenido;
        var titulo;
        if (item.length !== 0) {
          item.forEach((revista: any) => {
            id = revista.payload.doc.id;
            contenido = revista.payload.doc.data().contenido;
            titulo = revista.payload.doc.data().tittle;
          })
          this.tituloRevistaMocotips7 = titulo;
          this.idTipsRevistaDig[0] = id;
          this.editorFormRevista7 = new FormGroup({
            'editorRevista7': new FormControl(contenido)
          })
          this.actualizarMocotip = true;
        }
        else {
          this.actualizarMocotip = false;
        }

      })
    }
    else if (part === 8) {
      this.seccionRevista1 = false;
      this.seccionRevista2 = false;
      this.seccionRevista3 = false;
      this.seccionRevista4 = false;
      this.seccionRevista5 = false;
      this.seccionRevista6 = false;
      this.seccionRevista7 = false;
      this.seccionRevista8 = true;
      this.seccionRevista9 = false;
      this.seccionRevista10 = false;
      this.parteRevistaMocotips = 'Lo que se pega';
      this.cloudfirestore.getSeccionSePegaTips(this.nodoGeneralSelected[0]).subscribe(item => {
        var id;
        var contenido;
        var titulo;
        if (item.length !== 0) {
          item.forEach((revista: any) => {
            id = revista.payload.doc.id;
            contenido = revista.payload.doc.data().contenido;
            titulo = revista.payload.doc.data().tittle;
          })
          this.tituloRevistaMocotips8 = titulo;
          this.idTipsRevistaDig[2] = id;
          this.editorFormRevista8 = new FormGroup({
            'editorRevista8': new FormControl(contenido)
          })
          this.actualizarMocotip = true;
        }
        else {
          this.actualizarMocotip = false;
        }
      })
    }
    else if (part === 9) {
      this.seccionRevista1 = false;
      this.seccionRevista2 = false;
      this.seccionRevista3 = false;
      this.seccionRevista4 = false;
      this.seccionRevista5 = false;
      this.seccionRevista6 = false;
      this.seccionRevista7 = false;
      this.seccionRevista8 = false;
      this.seccionRevista9 = true;
      this.seccionRevista10 = false;
      this.parteRevistaMocotips = 'Dr. Bakterium';
      this.cloudfirestore.getSeccionDoctorTips(this.nodoGeneralSelected[0]).subscribe(item => {
        var id;
        var contenido;
        var titulo;
        if (item.length !== 0) {
          item.forEach((revista: any) => {
            id = revista.payload.doc.id;
            contenido = revista.payload.doc.data().contenido;
            titulo = revista.payload.doc.data().tittle;
          })
          this.tituloRevistaMocotips9 = titulo;
          this.idTipsRevistaDig[9] = id;
          this.editorFormRevista9 = new FormGroup({
            'editorRevista9': new FormControl(contenido)
          })
          this.actualizarMocotip = true;
        }
        else {
          this.actualizarMocotip = false;
        }
      })
    }
    else if (part === 10) {
      this.seccionRevista1 = false;
      this.seccionRevista2 = false;
      this.seccionRevista3 = false;
      this.seccionRevista4 = false;
      this.seccionRevista5 = false;
      this.seccionRevista6 = false;
      this.seccionRevista7 = false;
      this.seccionRevista8 = false;
      this.seccionRevista9 = false;
      this.seccionRevista10 = true;
      this.parteRevistaMocotips = 'Conclusión';
      this.cloudfirestore.getSeccionConclusionTips(this.nodoGeneralSelected[0]).subscribe(item => {
        var id;
        var contenido;
        var titulo;
        if (item.length !== 0) {
          item.forEach((revista: any) => {
            id = revista.payload.doc.id;
            contenido = revista.payload.doc.data().contenido;
            titulo = revista.payload.doc.data().tittle;
          })
          this.tituloRevistaMocotips10 = titulo;
          this.idTipsRevistaDig[4] = id;
          this.editorFormRevista10 = new FormGroup({
            'editorRevista10': new FormControl(contenido)
          })
          this.actualizarMocotip = true;
        }
        else {
          this.actualizarMocotip = false;
        }
      })
    }
  }
  hideAllRevistaEditors() {
    this.seccionRevista1 = false;
    this.seccionRevista2 = false;
    this.seccionRevista3 = false;
    this.seccionRevista4 = false;
    this.seccionRevista5 = false;
    this.seccionRevista6 = false;
    this.seccionRevista7 = false;
    this.seccionRevista8 = false;
    this.seccionRevista9 = false;
    this.seccionRevista10 = false;
  }
  /*
     if (part === 1) {
      this.parteRevistaMocotips = 'Introducción';
    }
    else if (part === 2) {
      this.parteRevistaMocotips = 'Especial';
    }
    else if (part === 3) {  
      this.parteRevistaMocotips = 'Hurga Datos';
    }
    else if (part === 4) {
      this.parteRevistaMocotips = 'Bio Aventura';
    }
    else if (part === 5) { 
      this.parteRevistaMocotips = 'Eco Moco';
    }
    else if (part === 6) {
      this.parteRevistaMocotips = 'Arte y Mañas';
    }
    else if (part === 7) {
      this.parteRevistaMocotips = 'Puro Cuento';
    }
    else if (part === 8) {
      this.parteRevistaMocotips = 'Lo que se pega';
    }
    else if (part === 9) {
      this.parteRevistaMocotips = 'Dr. Bakterium';
    }
    else if (part === 10) {
      this.parteRevistaMocotips = 'Conclusión';
    }
  */
  continueDatosMocotips(part : number) {
    if (part === 1) {
      this.mocotipsObject.contenido = this.editorFormRevista.get('editorRevista').value;
      this.mocotipsObject.key = this.nodoGeneralSelected[0];
      this.mocotipsObject.tittle = this.tituloRevistaMocotips;
      this.cloudfirestore.registerRevistaIntro(this.mocotipsObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("P");
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 2) {
      this.mocotipsObject.contenido = this.editorFormRevista2.get('editorRevista2').value;
      this.mocotipsObject.key = this.nodoGeneralSelected[0];
      this.mocotipsObject.tittle = this.tituloRevistaMocotips2;
      this.cloudfirestore.registerRevistaEspecial(this.mocotipsObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("P");
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 3) {
      this.mocotipsObject.contenido = this.editorFormRevista3.get('editorRevista3').value;
      this.mocotipsObject.key = this.nodoGeneralSelected[0];
      this.mocotipsObject.tittle = this.tituloRevistaMocotips3;
      this.cloudfirestore.registerRevistaHurgaDatos(this.mocotipsObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("P");
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 4) {
      this.mocotipsObject.contenido = this.editorFormRevista4.get('editorRevista4').value;
      this.mocotipsObject.key = this.nodoGeneralSelected[0];
      this.mocotipsObject.tittle = this.tituloRevistaMocotips4;
      this.cloudfirestore.registerRevistaBioAventura(this.mocotipsObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("P");
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 5) {
      this.mocotipsObject.contenido = this.editorFormRevista5.get('editorRevista5').value;
      this.mocotipsObject.key = this.nodoGeneralSelected[0];
      this.mocotipsObject.tittle = this.tituloRevistaMocotips5;
      this.cloudfirestore.registerRevistaEcoMoco(this.mocotipsObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("P");
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 6) {
      this.mocotipsObject.contenido = this.editorFormRevista6.get('editorRevista6').value;
      this.mocotipsObject.key = this.nodoGeneralSelected[0];
      this.mocotipsObject.tittle = this.tituloRevistaMocotips6;
       this.cloudfirestore.registerRevistaArte(this.mocotipsObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("P"); 
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("P"); 
      }) 
    }
    else if (part === 7) {
      this.mocotipsObject.contenido = this.editorFormRevista7.get('editorRevista7').value;
      this.mocotipsObject.key = this.nodoGeneralSelected[0];
      this.mocotipsObject.tittle = this.tituloRevistaMocotips7;
      this.cloudfirestore.registerRevistaPuroCuento(this.mocotipsObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("P");
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 8) {
      this.mocotipsObject.contenido = this.editorFormRevista8.get('editorRevista8').value;
      this.mocotipsObject.key = this.nodoGeneralSelected[0];
      this.mocotipsObject.tittle = this.tituloRevistaMocotips8;
      this.cloudfirestore.registerRevistaSePega(this.mocotipsObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("P");
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 9) {
      this.mocotipsObject.contenido = this.editorFormRevista9.get('editorRevista9').value;
      this.mocotipsObject.key = this.nodoGeneralSelected[0];
      this.mocotipsObject.tittle = this.tituloRevistaMocotips9;
      this.cloudfirestore.registerRevistaDoctor(this.mocotipsObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("P");
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 10) {
      this.mocotipsObject.contenido = this.editorFormRevista10.get('editorRevista10').value;
      this.mocotipsObject.key = this.nodoGeneralSelected[0];
      this.mocotipsObject.tittle = this.tituloRevistaMocotips10;
      this.cloudfirestore.registerRevistaConclusion(this.mocotipsObject).then(response => {
        console.log(response);
        this.restartAll();
        this.changeSection("P");
      }, error => {
        console.log(error)
        this.restartAll();
        this.changeSection("P");
      })
    }
  }
  actualizarDatosMocotips(part : number) {
    if (part === 1) {
      this.mocotipsObject.contenido = this.editorFormRevista.get('editorRevista').value;
      this.mocotipsObject.tittle = this.tituloRevistaMocotips;
      this.cloudfirestore.updateRevistaIntro(this.mocotipsObject.contenido, this.mocotipsObject.tittle, this.idTipsRevistaDig[6]).then(response => {
        window.alert('Mocotip actualizado con éxito');
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 2) {
      this.mocotipsObject.contenido = this.editorFormRevista2.get('editorRevista2').value;
      this.mocotipsObject.tittle = this.tituloRevistaMocotips2;
      this.cloudfirestore.updateRevistaEspecial(this.mocotipsObject.contenido, this.mocotipsObject.tittle, this.idTipsRevistaDig[8]).then(response => {
        window.alert('Mocotip actualizado con éxito');
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 3) {
      this.mocotipsObject.contenido = this.editorFormRevista3.get('editorRevista3').value;
      this.mocotipsObject.tittle = this.tituloRevistaMocotips3;
      this.cloudfirestore.updateRevistaHurgaDatos(this.mocotipsObject.contenido, this.mocotipsObject.tittle, this.idTipsRevistaDig[3]).then(response => {
        window.alert('Mocotip actualizado con éxito');
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 4) {
      this.mocotipsObject.contenido = this.editorFormRevista4.get('editorRevista4').value;
      this.mocotipsObject.tittle = this.tituloRevistaMocotips4;
      this.cloudfirestore.updateRevistaBioAventura(this.mocotipsObject.contenido, this.mocotipsObject.tittle, this.idTipsRevistaDig[5]).then(response => {
        window.alert('Mocotip actualizado con éxito');
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 5) {
      this.mocotipsObject.contenido = this.editorFormRevista5.get('editorRevista5').value;
      this.mocotipsObject.tittle = this.tituloRevistaMocotips5;
      this.cloudfirestore.updateRevistaEcoMoco(this.mocotipsObject.contenido, this.mocotipsObject.tittle, this.idTipsRevistaDig[1]).then(response => {
        window.alert('Mocotip actualizado con éxito');
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 6) {
      this.mocotipsObject.contenido = this.editorFormRevista6.get('editorRevista6').value;
      this.mocotipsObject.tittle = this.tituloRevistaMocotips6;
      this.cloudfirestore.updateRevistaArte(this.mocotipsObject.contenido, this.mocotipsObject.tittle, this.idTipsRevistaDig[7]).then(response => {
        window.alert('Mocotip actualizado con éxito');
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 7) {
      this.mocotipsObject.contenido = this.editorFormRevista7.get('editorRevista7').value;
      this.mocotipsObject.tittle = this.tituloRevistaMocotips7;
      this.cloudfirestore.updateRevistaPuroCuento(this.mocotipsObject.contenido, this.mocotipsObject.tittle, this.idTipsRevistaDig[0]).then(response => {
        window.alert('Mocotip actualizado con éxito');
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 8) {
      this.mocotipsObject.contenido = this.editorFormRevista8.get('editorRevista8').value;
      this.mocotipsObject.tittle = this.tituloRevistaMocotips8;
      this.cloudfirestore.updateRevistaSePega(this.mocotipsObject.contenido, this.mocotipsObject.tittle, this.idTipsRevistaDig[2]).then(response => {
        window.alert('Mocotip actualizado con éxito');
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 9) {
      this.mocotipsObject.contenido = this.editorFormRevista9.get('editorRevista9').value;
      this.mocotipsObject.tittle = this.tituloRevistaMocotips9;
      this.cloudfirestore.updateRevistaDoctor(this.mocotipsObject.contenido, this.mocotipsObject.tittle, this.idTipsRevistaDig[9]).then(response => {
        window.alert('Mocotip actualizado con éxito');
        this.restartAll();
        this.changeSection("P");
      })
    }
    else if (part === 10) {
      this.mocotipsObject.contenido = this.editorFormRevista10.get('editorRevista10').value;
      this.mocotipsObject.tittle = this.tituloRevistaMocotips10;
      this.cloudfirestore.updateRevistaConclusion(this.mocotipsObject.contenido, this.mocotipsObject.tittle, this.idTipsRevistaDig[4]).then(response => {
        window.alert('Mocotip actualizado con éxito');
        this.restartAll();
        this.changeSection("P");
      })
    }
  }
  restartAll() {
    this.buttondisabled = "";
    this.buttonActualizaDisabled = "none"
    this.autor = "";
    this.autor2 = "";
    this.autor3 = "";
    this.autor4 = "";
    this.autor5 = "";
    this.autorEspecial = "";
    this.titulo = "";
    this.titulo2 = "";
    this.titulo3 = "";
    this.titulo4 = "";
    this.titulo5 = "";
    this.tituloEspecial = "";
    this.selectedItem = "";
    this.selectedItemDia = "";
    this.selectedItemMes = "";
    this.selectedItemAnio = "";
    this.titulo_youtube = "";
    this.fileToUpload1Name1 = "Selecciona una imagen";
    this.fileToUpload1 = null;
    this.fileToUpload1Name2 = "Selecciona una imagen";
    this.fileToUpload2 = null;
    this.fileToUpload1Name3 = "Selecciona una imagen";
    this.fileToUpload3 = null;
    this.fileToUpload1Name4 = "Selecciona una imagen";
    this.fileToUploadPrincipal = null;

    this.fileToUpload1Name1_6 = "Imagen 1";
    this.fileToUpload1Name2_6 = "Imagen 2";
    this.fileToUpload1Name3_6 = "Imagen 3";
    this.fileToUpload1Name4_6 = "Imagen 4";
    this.fileToUpload1Name5_6 = "Imagen 5";
    this.fileToUpload1Name6_6 = "Imagen 6";
    this.fileToUpload4_6 = null;
    this.fileToUpload5_6 = null;
    this.fileToUpload6_6 = null;

    this.statusUploadImage1 = "";
    this.imagenTamanio1CSS = "";
    this.imagenTamanio2CSS = "";
    this.imagenTamanio3CSS = "";
    this.imagenTamanio1 = false;
    this.imagenTamanio2 = false;
    this.imagenTamanio3 = false;

    this.tituloRevistaMocotipsPrincipal = "";
    this.descripcionRevistaMocotipsPrincipal = "";
    this.anioRevistaMocotipsPrincipal = "";
    this.numeroRevistaMocotipsPrincipal = "";
    this.costoRevistaMocotipsPrincipal = "";
    this.noticiasObject.part1 = "";
    this.noticiasObject.part2 = "";
    this.noticiasObject.part3 = "";
    this.noticiasObject.part4 = "";
    this.noticiasObject.part5 = "";
    this.agregarImagenesRevista = false;


    this.urlPatrocinador1Delete = false;
    this.urlPatrocinador2Delete = false;
    this.urlPatrocinador3Delete = false;
    this.urlPatrocinador4Delete = false;

    this.actualRevistaDigital = "";

    this.cargandoRevistas = "Cargando...";

    this.imagenesRevistaObject = {
      key: ""
    };
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedNotas() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  isAllSelectedRevista() {
    const numSelected = this.selectionRevista.selected.length;
    const numRows = this.dataSourceRevista.data.length;
    return numSelected === numRows;
  }
  isAllSelectedEspecial() {
    const numSelected = this.selectionEspecial.selected.length;
    const numRows = this.dataSourceEspecial.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleNotas() {
    this.isAllSelectedNotas() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  masterToggleRevista() {
    this.isAllSelectedRevista() ?
      this.selectionRevista.clear() :
      this.dataSourceRevista.data.forEach(row => this.selectionRevista.select(row));
  }
  masterToggleEspecial() {
    this.isAllSelectedEspecial() ?
      this.selection.clear() :
      this.dataSourceEspecial.data.forEach(row => this.selectionEspecial.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelNotas(row?: NoticiasNodoGeneralInterface): string {
    if (!row) {
      return `${this.isAllSelectedNotas() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.date + 1}`;
  }
  checkboxLabelRevista(row?: revistaDigitalInterface): string {
    if (!row) {
      return `${this.isAllSelectedRevista() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionRevista.isSelected(row) ? 'deselect' : 'select'} row ${row.anio + 1}`;
  }
  checkboxLabelEspecial(row?: EspecialDelMesInterface): string {
    if (!row) {
      return `${this.isAllSelectedEspecial() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionEspecial.isSelected(row) ? 'deselect' : 'select'} row ${row.$key + 1}`;
  }

  selectRowNotas($event, dataSource) {
    if ($event.checked) {
      this.keyToEdit = dataSource.id_noticia;
      this.keyToEditSeccion = dataSource.seccion;
      this.keyNodoGeneral = dataSource.$key;
      this.keysSelected.push(this.keyToEdit);
      this.seccionSelected.push(this.keyToEditSeccion);
      this.nodoGeneralSelected.push(this.keyNodoGeneral);
      if (this.keysSelected.length > 1 || this.keysSelected.length === 0) {
        this.editarVisibilidad = "hidden";
        this.eliminarVisibilidad = "hidden";
      }
      else if (this.keysSelected.length === 1) {
        this.editarVisibilidad = "visible";
        this.eliminarVisibilidad = "visible";
      }
    }
    else {
      var index = this.keysSelected.indexOf(dataSource.id_noticia);
      var index2 = this.seccionSelected.indexOf(dataSource.seccion);
      var index3 = this.nodoGeneralSelected.indexOf(dataSource.$key);
      if (index !== -1) {
        this.keysSelected.splice(index, 1);
        this.seccionSelected.splice(index2, 1);
        this.nodoGeneralSelected.splice(index3, 1);
      }
      if (this.keysSelected.length > 1 || this.keysSelected.length === 0) {
        this.editarVisibilidad = "hidden";
        this.eliminarVisibilidad = "hidden";
      }
      else if (this.keysSelected.length === 1) {
        this.editarVisibilidad = "visible";
        this.eliminarVisibilidad = "visible";
      }
      this.keyToEdit = "";
      this.keyToEditSeccion = "";
    }


  }
  selectRowNRevista($event, dataSourceRevista) {

    if ($event.checked) {
      this.revistastKeySelected = dataSourceRevista.id;
      this.keyNodoGeneral = dataSourceRevista.key;
      this.nodoGeneralSelected.push(this.keyNodoGeneral);
      this.revistastKey.push(this.revistastKeySelected)
      if (this.nodoGeneralSelected.length > 1 || this.nodoGeneralSelected.length === 0) {
        this.editarVisibilidad = "hidden";
        this.eliminarVisibilidad = "hidden";
      }
      else if (this.nodoGeneralSelected.length === 1) {
        this.editarVisibilidad = "visible";
        this.eliminarVisibilidad = "visible";
      }
    }
    else {
      var index = this.nodoGeneralSelected.indexOf(dataSourceRevista.key);
      var index2 = this.revistastKey.indexOf(dataSourceRevista.id);
      if (index !== -1) {
        this.nodoGeneralSelected.splice(index, 1);
      }
      if (index2 !== -1) {
        this.revistastKey.splice(index, 1);
      }
      if (this.nodoGeneralSelected.length > 1 || this.nodoGeneralSelected.length === 0) {
        this.editarVisibilidad = "hidden";
        this.eliminarVisibilidad = "hidden";
      }
      else if (this.nodoGeneralSelected.length === 1) {
        this.editarVisibilidad = "visible";
        this.eliminarVisibilidad = "visible";
      }

    }
    console.log("key: "+this.revistastKey);
    console.log("key nodo: "+this.nodoGeneralSelected);
  }
  selectRowEspecial($event, datatSourceEspecial) {

    if ($event.checked) {

      this.keyNodoGeneral = datatSourceEspecial.$key;
      this.nodoGeneralSelected.push(this.keyNodoGeneral);
      if (this.nodoGeneralSelected.length > 1 || this.nodoGeneralSelected.length === 0) {
        this.editarVisibilidad = "hidden";
        this.eliminarVisibilidad = "hidden";
      }
      else if (this.nodoGeneralSelected.length === 1) {
        this.editarVisibilidad = "visible";
        this.eliminarVisibilidad = "visible";
      }
    }
    else {
      var index = this.nodoGeneralSelected.indexOf(datatSourceEspecial.$key);

      if (index !== -1) {
        this.nodoGeneralSelected.splice(index, 1);

      }
      if (this.nodoGeneralSelected.length > 1 || this.nodoGeneralSelected.length === 0) {
        this.editarVisibilidad = "hidden";
        this.eliminarVisibilidad = "hidden";
      }
      else if (this.nodoGeneralSelected.length === 1) {
        this.editarVisibilidad = "visible";
        this.eliminarVisibilidad = "visible";
      }

    }

  }
  editRowEspecial() {

    this.redactEspecialMes();
    this.buttondisabled = "none";
    this.buttonActualizaDisabled = "block";
    this.noticiasService.getEspecialSelected(this.nodoGeneralSelected[0]).snapshotChanges().subscribe(item => {
      this.especialParaEditar = [];
      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        this.especialParaEditar.push(json as especialDelMes);
      });
      this.tituloEspecial = this.especialParaEditar[0].tittle;
      this.editorFormEspecial = new FormGroup({
        'editorEspecial': new FormControl(this.especialParaEditar[0].description)
      })
      var posicion = this.especialParaEditar[0].date.search("-");
      var var1 = this.especialParaEditar[0].date.substring(0, posicion);
      this.selectedItemDia = var1;
      var var2 = this.especialParaEditar[0].date.substring(posicion + 1, this.especialParaEditar[0].date.length);
      var var3 = var2.substring(0, 2);
      var var4 = var2.substring(3, 7)
      this.reverttMonths(var3);
      this.selectedItemAnio = var4;
      this.autorEspecial = this.especialParaEditar[0].autor;
      this.fileToUpload1Name1 = "Imagen ya cargada";
      this.fileToUpload1Name2 = "Imagen ya cargada";
      this.fileToUpload1Name3 = "Imagen ya cargada";
    })
  }
  updateEspecial() {

    console.log("se va a actualizar")
    this.editorContent = this.editorFormEspecial.get('editorEspecial').value;
    this.especialDelMesObject.description = this.editorContent;
    this.especialDelMesObject.tittle = this.tituloEspecial;
    this.especialDelMesObject.autor = this.autorEspecial;

    this.especialDelMesObject.$key = this.especialParaEditar[0].$key;
    this.convertMonths(this.selectedItemMes + '');
    this.currentDate = this.selectedItemDia + '-' + this.selectedItemMes + '-' + this.selectedItemAnio;
    this.especialDelMesObject.date = this.currentDate;
    this.cleanSpacesEditor1(this.editorContent);

    this.subirimagenEspecial_1().then(res => this.subirimagenEspecial_2().then(res => this.subirimagenEspecial_3()));

  }
  subirimagenEspecial_1() {
    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name1 === "Imagen ya cargada") {
        this.especialDelMesObject.principalImage = this.especialParaEditar[0].principalImage;
        console.log("no se subio la primera imagen")
        resolve();
      }
      else {
        this.storage.storage.refFromURL(this.especialParaEditar[0].principalImage).delete();
        const id = Math.random().toString(36).substring(2);
        const filePath = `infografias/${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.fileToUpload1);
        this.image1UploadPercent = task.percentageChanges();
        this.statusUploadImage1 = "Actualizando infografía"
        task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(url => {
              this.urlImage1 = url;
              this.especialDelMesObject.principalImage = this.urlImage1;
              resolve();
            });
          })
        ).subscribe();
      }
    });
  }
  subirimagenEspecial_2() {
    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name2 === "Imagen ya cargada") {
        this.especialDelMesObject.portada1 = this.especialParaEditar[0].portada1;
        console.log("no se subio la segunda imagen")
        resolve();
      }
      else {
        console.log(this.especialParaEditar[0].portada1)
        this.storage.storage.refFromURL(this.especialParaEditar[0].portada1).delete();
        const id2 = Math.random().toString(36).substring(2);
        const filePath2 = `portadas1/${id2}`;
        const ref2 = this.storage.ref(filePath2);
        const task2 = this.storage.upload(filePath2, this.fileToUpload2);
        this.image1UploadPercent = task2.percentageChanges();
        this.statusUploadImage1 = "Actualizando portada 1"
        task2.snapshotChanges().pipe(
          finalize(() => {
            ref2.getDownloadURL().subscribe(url => {
              this.urlImage2 = url;
              console.log(this.urlImage2)
              this.especialDelMesObject.portada1 = this.urlImage2;
              resolve();
            });
          })
        ).subscribe();
      }
    });

  }
  subirimagenEspecial_3() {
    if (this.fileToUpload1Name1 === "Imagen ya cargada") {
      this.especialDelMesObject.portada2 = this.especialParaEditar[0].portada2;
      this.noticiasService.updatetEspecialDelMes(this.especialDelMesObject).then(res => {
        window.alert('Especial actualizado con éxito');
        this.changeSection("M")
        this.restartAll();

      });
    }
    else {
      this.storage.storage.refFromURL(this.especialParaEditar[0].portada2).delete();
      const id = Math.random().toString(36).substring(2);
      const filePath = `portadas2/${id}`;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.fileToUpload3);
      this.image1UploadPercent = task.percentageChanges();
      this.statusUploadImage1 = "Actualizando portada 2"
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(url => {
            this.urlImage3 = url;
            this.especialDelMesObject.portada2 = this.urlImage3;
            console.log(this.especialDelMesObject)
            this.noticiasService.updatetEspecialDelMes(this.especialDelMesObject).then(res => {
              window.alert('Especial actualizado con éxito');
              this.changeSection("M")
              this.restartAll();

            });
          });
        })
      ).subscribe();
    }
  }
  editRowRevistaDigital() {
    this.seleccionarSeccionRevista();
    this.buttondisabled = "none";
    this.buttonActualizaDisabled = "block";
    console.log(this.buttondisabled)
    this.cloudfirestore.getRevista(this.nodoGeneralSelected[0]).subscribe(item => {
      this.revistaDigitalParaEditar = [];

      item.forEach((revista: any) => {

        this.revistaDigitalParaEditar.push({
          key: revista.payload.doc.data().key,
          anio: revista.payload.doc.data().anio,
          costo: revista.payload.doc.data().costo,
          description: revista.payload.doc.data().description,
          imagenPrincipal: revista.payload.doc.data().imagenPrincipal,
          numero: revista.payload.doc.data().numero,
          tittle: revista.payload.doc.data().tittle,
          idioma: revista.payload.doc.data().idioma,
          id: revista.payload.doc.id,
        });

      })
      this.tituloRevistaMocotipsPrincipal = this.revistaDigitalParaEditar[0].tittle;
      this.descripcionRevistaMocotipsPrincipal = this.revistaDigitalParaEditar[0].description;
      this.anioRevistaMocotipsPrincipal = this.revistaDigitalParaEditar[0].anio;
      this.numeroRevistaMocotipsPrincipal = this.revistaDigitalParaEditar[0].numero;
      this.costoRevistaMocotipsPrincipal = this.revistaDigitalParaEditar[0].costo;
      this.selectedItem = this.revistaDigitalParaEditar[0].idioma;
      this.fileToUpload1Name1 = "Imagen ya cargada";
    })
  }
  editRowRevistaDigitalMocotips() {
    this.seleccionarSeccionRevistaMocotips();
    this.buttondisabled = "none";
    this.buttonActualizaDisabled = "block";
    console.log(this.buttondisabled)
    this.cloudfirestore.getRevistaMocotips(this.nodoGeneralSelected[0]).subscribe(item => {
      this.revistaDigitalParaEditar = [];

      item.forEach((revista: any) => {

        this.revistaDigitalParaEditar.push({
          key: revista.payload.doc.data().key,
          anio: revista.payload.doc.data().anio,
          costo: revista.payload.doc.data().costo,
          description: revista.payload.doc.data().description,
          imagenPrincipal: revista.payload.doc.data().imagenPrincipal,
          numero: revista.payload.doc.data().numero,
          tittle: revista.payload.doc.data().tittle,
          idioma: revista.payload.doc.data().idioma,
          id: revista.payload.doc.id,
        });

      })
      this.tituloRevistaMocotipsPrincipal = this.revistaDigitalParaEditar[0].tittle;
      this.descripcionRevistaMocotipsPrincipal = this.revistaDigitalParaEditar[0].description;
      this.anioRevistaMocotipsPrincipal = this.revistaDigitalParaEditar[0].anio;
      this.numeroRevistaMocotipsPrincipal = this.revistaDigitalParaEditar[0].numero;
      this.costoRevistaMocotipsPrincipal = this.revistaDigitalParaEditar[0].costo;
      this.selectedItem = this.revistaDigitalParaEditar[0].idioma;
      this.fileToUpload1Name1 = "Imagen ya cargada";
    })
  }
  updateRevista(option : number) {
    console.log(option)
    console.log(this.revistastKey[0]);
    this.revistaDigitalObject.tittle = this.tituloRevistaMocotipsPrincipal;
    this.revistaDigitalObject.description = this.descripcionRevistaMocotipsPrincipal;
    this.revistaDigitalObject.anio = this.anioRevistaMocotipsPrincipal;
    this.revistaDigitalObject.numero = this.numeroRevistaMocotipsPrincipal;
    this.revistaDigitalObject.costo = this.costoRevistaMocotipsPrincipal;
    this.revistaDigitalObject.key = this.revistaDigitalParaEditar[0].key;
    this.revistaDigitalObject.idioma = this.selectedItem;

    if (this.fileToUpload1Name1 === "Imagen ya cargada") {
      this.revistaDigitalObject.imagenPrincipal = this.revistaDigitalParaEditar[0].imagenPrincipal;
      console.log("ola 1")
      if(option === 1){
        this.cloudfirestore.updateRevistaDigital(this.revistaDigitalObject, this.revistastKey[0]).then(response => {
          window.alert('Revista actualizada con éxito');
          this.restartAll();
          this.changeSection("R");
        })
      }
      else if (option === 2){
        this.cloudfirestore.updateRevistaDigitalMocotips(this.revistaDigitalObject, this.revistastKey[0]).then(response => {
          window.alert('Revista mocotips actualizada con éxito');
          this.restartAll();
          this.changeSection("P");
        })
      }

    }
    else {
      this.storage.storage.refFromURL(this.revistaDigitalParaEditar[0].imagenPrincipal).delete();
      const id = Math.random().toString(36).substring(2);
      const filePath = `revistaDigital/${id}`;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.fileToUpload1);
      this.image1UploadPercent = task.percentageChanges();
      this.statusUploadImage1 = "Actualizando portada"
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(url => {
            this.urlImage1 = url;
            this.revistaDigitalObject.imagenPrincipal = this.urlImage1;

            if(option === 1){
              this.cloudfirestore.updateRevistaDigital(this.revistaDigitalObject, this.revistastKey[0]).then(response => {
                window.alert('Revista actualizada con éxito');
                this.restartAll();
                this.changeSection("R");
              })
            }
            else if(option === 2){
              this.cloudfirestore.updateRevistaDigitalMocotips(this.revistaDigitalObject, this.revistastKey[0]).then(response => {
                window.alert('Revista mocotips actualizada con éxito');
                this.restartAll();
                this.changeSection("P");
              })
            }

          });
        })
      ).subscribe();
    }
  }
  editRow() {
    if (this.keysSelected[0] !== "") {
      this.noticiasService.getNoteToEdit(this.seccionSelected[0], this.keysSelected[0]).snapshotChanges().subscribe(item => {
        this.notaParaEditar = [];
        item.forEach(element => {
          let json = element.payload.toJSON();
          json["$key"] = element.key;
          this.notaParaEditar.push(json as Noticias);
        });
        if (this.notaParaEditar[0].plantilla === "1") {
          console.log("OLLAAA")
          this.changeSection('RE1');
          this.buttondisabled = "none";
          this.buttonActualizaDisabled = "block";
          console.log(this.buttonActualizaDisabled)
          this.titulo = this.notaParaEditar[0].tittle;
          this.selectSeccionNotaDisabled = true;

          var part2limpieza = this.notaParaEditar[0].part1.search("<div class=");
          var part2cleaned = this.notaParaEditar[0].part1.substring(0, part2limpieza);

          var part2limpieza2 = this.notaParaEditar[0].part1.search("</div>");
          var part2cleaned2 = this.notaParaEditar[0].part1.substring(part2limpieza2 + 6, this.notaParaEditar[0].part1.length);

          var part2CleanFull = part2cleaned + "-image-" + part2cleaned2;

          var part4limpieza = this.notaParaEditar[0].part2.search("></div>");
          var part4cleaned = this.notaParaEditar[0].part2.substring(part4limpieza + 8, this.notaParaEditar[0].part2.length);

          this.editorForm = new FormGroup({
            'editor': new FormControl(this.notaParaEditar[0].phrase)
          })
          this.editorForm2 = new FormGroup({
            'editor2': new FormControl(part2CleanFull)
          })
          this.editorForm3 = new FormGroup({
            'editor3': new FormControl(part4cleaned)
          })
          this.editorForm4 = new FormGroup({
            'editor4': new FormControl(this.notaParaEditar[0].part3)
          })
          this.selectedItem = this.seccionSelected[0];
          this.autor = this.notaParaEditar[0].autor;
          this.notaParaEditar[0].date;
          var posicion = this.notaParaEditar[0].date.search("-");

          var var1 = this.notaParaEditar[0].date.substring(0, posicion);
          this.selectedItemDia = var1;
          var var2 = this.notaParaEditar[0].date.substring(posicion + 1, this.notaParaEditar[0].date.length);
          var var3 = var2.substring(0, 2);
          var var4 = var2.substring(3, 7)
          this.reverttMonths(var3);
          this.selectedItemAnio = var4;
          this.fileToUpload1Name1 = "Imagen ya cargada";
          this.fileToUpload1Name2 = "Imagen ya cargada";
          this.fileToUpload1Name3 = "Imagen ya cargada";
          this.fileToUpload1Name4 = "Imagen ya cargada";
          this.editarNota = true;
          console.log("nota" + this.editarNota)
        }
        else if (this.notaParaEditar[0].plantilla === "2") {
          this.changeSection('RE2');
          this.buttondisabled = "none";
          this.buttonActualizaDisabled = "block";
          this.titulo2 = this.notaParaEditar[0].tittle;
          this.selectSeccionNotaDisabled = true;

          console.log(this.notaParaEditar[0].part2);
          var part2limpieza = this.notaParaEditar[0].part1.search("<div class=");
          var part2cleaned = this.notaParaEditar[0].part1.substring(0, part2limpieza);

          var part4limpieza = this.notaParaEditar[0].part2.search("<div class=");
          var part4cleaned = this.notaParaEditar[0].part2.substring(0, part4limpieza);

          this.editorForm = new FormGroup({
            'editor': new FormControl(this.notaParaEditar[0].phrase)
          })
          this.editorForm2 = new FormGroup({
            'editor2': new FormControl(part2cleaned)
          })
          this.editorForm3 = new FormGroup({
            'editor3': new FormControl(part4cleaned)
          })

          this.selectedItem = this.seccionSelected[0];
          this.autor2 = this.notaParaEditar[0].autor;
          this.notaParaEditar[0].date;
          var posicion = this.notaParaEditar[0].date.search("-");

          var var1 = this.notaParaEditar[0].date.substring(0, posicion);
          this.selectedItemDia = var1;
          var var2 = this.notaParaEditar[0].date.substring(posicion + 1, this.notaParaEditar[0].date.length);
          var var3 = var2.substring(0, 2);
          var var4 = var2.substring(3, 7)
          this.reverttMonths(var3);
          this.selectedItemAnio = var4;
          this.fileToUpload1Name1 = "Imagen ya cargada";
          this.fileToUpload1Name2 = "Imagen ya cargada";
          this.fileToUpload1Name3 = "Imagen ya cargada";
          this.fileToUpload1Name4 = "Imagen ya cargada";
          this.editarNota = true;
        }
        else if (this.notaParaEditar[0].plantilla === "3") {
          this.changeSection('RE3');
          this.buttondisabled = "none";
          this.buttonActualizaDisabled = "block";
          this.titulo3 = this.notaParaEditar[0].tittle;
          this.selectSeccionNotaDisabled = true;
          console.log(this.notaParaEditar[0]);

          var part2limpieza = this.notaParaEditar[0].part1.search("<div class=");
          var part2cleaned = this.notaParaEditar[0].part1.substring(0, part2limpieza);

          var part4limpieza = this.notaParaEditar[0].part3.search("></div>");
          var part4cleaned = this.notaParaEditar[0].part3.substring(part4limpieza + 8, this.notaParaEditar[0].part3.length);

          this.editorForm = new FormGroup({
            'editor': new FormControl(this.notaParaEditar[0].phrase)
          })
          this.editorForm2 = new FormGroup({
            'editor2': new FormControl(part2cleaned)
          })
          this.editorForm3 = new FormGroup({
            'editor3': new FormControl(this.notaParaEditar[0].part2)
          })
          this.editorForm4 = new FormGroup({
            'editor4': new FormControl(part4cleaned)
          })
          this.editorForm5 = new FormGroup({
            'editor5': new FormControl(this.notaParaEditar[0].part4)
          })
          this.selectedItem = this.seccionSelected[0];
          this.autor3 = this.notaParaEditar[0].autor;
          this.notaParaEditar[0].date;
          var posicion = this.notaParaEditar[0].date.search("-");

          var var1 = this.notaParaEditar[0].date.substring(0, posicion);
          this.selectedItemDia = var1;
          var var2 = this.notaParaEditar[0].date.substring(posicion + 1, this.notaParaEditar[0].date.length);
          var var3 = var2.substring(0, 2);
          var var4 = var2.substring(3, 7)
          this.reverttMonths(var3);
          this.selectedItemAnio = var4;
          this.fileToUpload1Name1 = "Imagen ya cargada";
          this.fileToUpload1Name2 = "Imagen ya cargada";
          this.fileToUpload1Name3 = "Imagen ya cargada";
          this.fileToUpload1Name4 = "Imagen ya cargada";
          this.editarNota = true;
        }
        else if (this.notaParaEditar[0].plantilla === "4") {
          this.changeSection('RE4');
          this.buttondisabled = "none";
          this.buttonActualizaDisabled = "block";
          this.titulo4 = this.notaParaEditar[0].tittle;
          var youtubelimpieza = this.notaParaEditar[0].youtube.search("embed/");
          var youtubecleaned = this.notaParaEditar[0].youtube.substring(youtubelimpieza + 6, this.notaParaEditar[0].youtube.length);

          this.titulo_youtube = youtubecleaned;
          this.selectSeccionNotaDisabled = true;


          var part2limpieza = this.notaParaEditar[0].part2.search("<div class=");
          var part2cleaned = this.notaParaEditar[0].part2.substring(0, part2limpieza);

          var part4limpieza = this.notaParaEditar[0].part4.search("<div class=");
          var part4cleaned = this.notaParaEditar[0].part4.substring(0, part4limpieza);

          var part3limpieza = this.notaParaEditar[0].part3.search("<div class=");
          var part3limpieza2 = this.notaParaEditar[0].part3.search("</div>");
          var part3cleaned1 = this.notaParaEditar[0].part3.substring(0, part3limpieza);
          var part3cleaned2 = this.notaParaEditar[0].part3.substring(part3limpieza2 + 6, this.notaParaEditar[0].part3.length);

          var part3cleanFull = part3cleaned1 + "-image-" + part3cleaned2;

          this.editorForm = new FormGroup({
            'editor': new FormControl(this.notaParaEditar[0].phrase)
          })
          this.editorForm2 = new FormGroup({
            'editor2': new FormControl(this.notaParaEditar[0].part1)
          })
          this.editorForm3 = new FormGroup({
            'editor3': new FormControl(part2cleaned)
          })
          this.editorForm4 = new FormGroup({
            'editor4': new FormControl(part3cleanFull)
          })
          this.editorForm5 = new FormGroup({
            'editor5': new FormControl(part4cleaned)
          })
          this.editorForm6 = new FormGroup({
            'editor6': new FormControl(this.notaParaEditar[0].part5)
          })
          this.selectedItem = this.seccionSelected[0];
          this.autor4 = this.notaParaEditar[0].autor;
          this.notaParaEditar[0].date;
          var posicion = this.notaParaEditar[0].date.search("-");

          var var1 = this.notaParaEditar[0].date.substring(0, posicion);
          this.selectedItemDia = var1;
          var var2 = this.notaParaEditar[0].date.substring(posicion + 1, this.notaParaEditar[0].date.length);
          var var3 = var2.substring(0, 2);
          var var4 = var2.substring(3, 7)
          this.reverttMonths(var3);
          this.selectedItemAnio = var4;
          this.fileToUpload1Name1 = "Imagen ya cargada";
          this.fileToUpload1Name2 = "Imagen ya cargada";
          this.fileToUpload1Name3 = "Imagen ya cargada";
          this.fileToUpload1Name4 = "Imagen ya cargada";
          this.editarNota = true;
        }
        else if (this.notaParaEditar[0].plantilla === "5") {
          this.changeSection('RE5');
          this.buttondisabled = "none";
          this.buttonActualizaDisabled = "block";
          this.titulo5 = this.notaParaEditar[0].tittle;
          this.selectSeccionNotaDisabled = true;

          var part2limpieza = this.notaParaEditar[0].part2.search("<div class=");
          var part2cleaned = this.notaParaEditar[0].part2.substring(0, part2limpieza);

          var part4limpieza = this.notaParaEditar[0].part4.search("></div>");
          var part4cleaned = this.notaParaEditar[0].part4.substring(part4limpieza + 8, this.notaParaEditar[0].part4.length);

          this.editorForm = new FormGroup({
            'editor': new FormControl(this.notaParaEditar[0].phrase)
          })
          this.editorForm2 = new FormGroup({
            'editor2': new FormControl(this.notaParaEditar[0].part1)
          })
          this.editorForm3 = new FormGroup({
            'editor3': new FormControl(part2cleaned)
          })
          this.editorForm4 = new FormGroup({
            'editor4': new FormControl(this.notaParaEditar[0].part3)
          })
          this.editorForm5 = new FormGroup({
            'editor5': new FormControl(part4cleaned)
          })
          this.selectedItem = this.seccionSelected[0];
          this.autor5 = this.notaParaEditar[0].autor;
          this.notaParaEditar[0].date;
          var posicion = this.notaParaEditar[0].date.search("-");

          var var1 = this.notaParaEditar[0].date.substring(0, posicion);
          this.selectedItemDia = var1;
          var var2 = this.notaParaEditar[0].date.substring(posicion + 1, this.notaParaEditar[0].date.length);
          var var3 = var2.substring(0, 2);
          var var4 = var2.substring(3, 7)
          this.reverttMonths(var3);
          this.selectedItemAnio = var4;
          this.fileToUpload1Name1 = "Imagen ya cargada";
          this.fileToUpload1Name2 = "Imagen ya cargada";
          this.fileToUpload1Name3 = "Imagen ya cargada";
          this.fileToUpload1Name4 = "Imagen ya cargada";
          this.editarNota = true;
        }
        if (this.notaParaEditar[0].plantilla === "6") {
         /* console.log("OLLAAA 6");
          console.log(this.notaParaEditar[0]);
          this.changeSection('RE6');
          this.buttondisabled = "none";
          this.buttonActualizaDisabled = "block";
          console.log(this.buttonActualizaDisabled)
          this.titulo6 = this.notaParaEditar[0].tittle;
          this.selectSeccionNotaDisabled = true;

          var part2limpieza = this.notaParaEditar[0].part2.search("<div class=");
          var part2cleaned = this.notaParaEditar[0].part2.substring(0, part2limpieza);

          var part2limpieza2 = this.notaParaEditar[0].part2.search("</div>");
          var part2cleaned2 = this.notaParaEditar[0].part2.substring(part2limpieza2 + 6, this.notaParaEditar[0].part1.length);

          var part2CleanFull = part2cleaned + "-image-" + part2cleaned2;

          var part4limpieza = this.notaParaEditar[0].part2.search("></div>");
          var part4cleaned = this.notaParaEditar[0].part2.substring(part4limpieza + 8, this.notaParaEditar[0].part2.length);

          this.editorForm = new FormGroup({
            'editor': new FormControl(this.notaParaEditar[0].phrase)
          })
          this.editorForm2 = new FormGroup({
            'editor2': new FormControl(this.notaParaEditar[0].part1)
          })
          this.editorForm3 = new FormGroup({
            'editor3': new FormControl(part2CleanFull)
          }) */
          /*
          this.editorForm4 = new FormGroup({
            'editor4': new FormControl(this.notaParaEditar[0].part3)
          })
          this.selectedItem = this.seccionSelected[0];
          this.autor = this.notaParaEditar[0].autor;
          this.notaParaEditar[0].date;
          var posicion = this.notaParaEditar[0].date.search("-");

          var var1 = this.notaParaEditar[0].date.substring(0, posicion);
          this.selectedItemDia = var1;
          var var2 = this.notaParaEditar[0].date.substring(posicion + 1, this.notaParaEditar[0].date.length);
          var var3 = var2.substring(0, 2);
          var var4 = var2.substring(3, 7)
          this.reverttMonths(var3);
          this.selectedItemAnio = var4;
          this.fileToUpload1Name1 = "Imagen ya cargada";
          this.fileToUpload1Name2 = "Imagen ya cargada";
          this.fileToUpload1Name3 = "Imagen ya cargada";
          this.fileToUpload1Name4 = "Imagen ya cargada";
          this.editarNota = true;
          console.log("nota" + this.editarNota)
          */
        }
      });
    }
    else if (this.keyToEdit === "") {
      console.log("no esta seleccionado")
    }
  }

  updateNote() {

    if (this.notaParaEditar[0].plantilla === '1') {
      this.editorContent = this.editorForm.get('editor').value;
      this.editorContent2 = this.editorForm2.get('editor2').value;
      this.editorContent3 = this.editorForm3.get('editor3').value;
      this.editorContent4 = this.editorForm4.get('editor4').value;
      this.noticiasObject.tittle = this.titulo;
      this.noticiasObject.autor = this.autor;
      this.noticiasObject.part3 = this.editorContent4;
      this.noticiasObject.plantilla = '1';


      this.convertMonths(this.selectedItemMes + '');
      this.currentDate = this.selectedItemDia + '-' + this.selectedItemMes + '-' + this.selectedItemAnio;
      this.noticiasObject.date = this.currentDate;

      this.cleanSpacesEditor1(this.editorContent);
      this.noticiasObject.phrase = this.editorContent;
      this.cleanSpacesEditor2(this.editorContent2);
      this.cleanSpacesEditor3(this.editorContent3);
      this.cleanSpacesEditor4(this.editorContent4);

      this.subirimagen1_1().then(res => this.subirimagen2_1().then(res => this.subirImagenPrincipal()));

    }
    if (this.notaParaEditar[0].plantilla === '2') {
      this.editorContent = this.editorForm.get('editor').value;
      this.editorContent2 = this.editorForm2.get('editor2').value;
      this.editorContent3 = this.editorForm3.get('editor3').value;

      this.noticiasObject.tittle = this.titulo2;
      this.noticiasObject.autor = this.autor2;
      this.noticiasObject.plantilla = '2';


      this.convertMonths(this.selectedItemMes + '');
      this.currentDate = this.selectedItemDia + '-' + this.selectedItemMes + '-' + this.selectedItemAnio;
      this.noticiasObject.date = this.currentDate;

      this.cleanSpacesEditor1(this.editorContent);
      this.noticiasObject.phrase = this.editorContent;
      this.cleanSpacesEditor2(this.editorContent2);
      this.cleanSpacesEditor3(this.editorContent3);

      this.subirimagen1_2().then(res => this.subirimagen2_2().then(res => this.subirImagenPrincipal()));

    }
    if (this.notaParaEditar[0].plantilla === '3') {
      this.editorContent = this.editorForm.get('editor').value;
      this.editorContent2 = this.editorForm2.get('editor2').value;
      this.editorContent3 = this.editorForm3.get('editor3').value;
      this.editorContent4 = this.editorForm4.get('editor4').value;
      this.editorContent5 = this.editorForm5.get('editor5').value;

      this.noticiasObject.tittle = this.titulo3;
      this.noticiasObject.part2 = this.editorContent3;
      this.noticiasObject.part4 = this.editorContent5;
      this.noticiasObject.plantilla = '3';
      this.noticiasObject.autor = this.autor3;

      this.convertMonths(this.selectedItemMes + '');
      this.currentDate = this.selectedItemDia + '-' + this.selectedItemMes + '-' + this.selectedItemAnio;
      this.noticiasObject.date = this.currentDate;

      this.cleanSpacesEditor1(this.editorContent);
      this.noticiasObject.phrase = this.editorContent;
      this.cleanSpacesEditor2(this.editorContent2);
      this.cleanSpacesEditor3(this.editorContent3);
      this.cleanSpacesEditor4(this.editorContent4);
      this.cleanSpacesEditor5(this.editorContent5);

      this.subirimagen1_3().then(res => this.subirimagen2_3().then(res => this.subirImagenPrincipal()));
    }
    if (this.notaParaEditar[0].plantilla === '4') {
      this.editorContent = this.editorForm.get('editor').value;
      this.editorContent2 = this.editorForm2.get('editor2').value;
      this.editorContent3 = this.editorForm3.get('editor3').value;
      this.editorContent4 = this.editorForm4.get('editor4').value;
      this.editorContent5 = this.editorForm5.get('editor5').value;
      this.editorContent6 = this.editorForm6.get('editor6').value;
      this.noticiasObject.tittle = this.titulo4;
      this.noticiasObject.youtube = "https://www.youtube.com/embed/" + this.titulo_youtube;
      this.noticiasObject.phrase = this.editorContent;
      this.noticiasObject.part1 = this.editorContent2;
      this.noticiasObject.part5 = this.editorContent6;
      this.noticiasObject.plantilla = '4';
      this.noticiasObject.autor = this.autor4;

      this.convertMonths(this.selectedItemMes + '');
      this.currentDate = this.selectedItemDia + '-' + this.selectedItemMes + '-' + this.selectedItemAnio;
      this.noticiasObject.date = this.currentDate;

      this.cleanSpacesEditor1(this.editorContent);
      this.noticiasObject.phrase = this.editorContent;
      this.cleanSpacesEditor2(this.editorContent2);
      this.cleanSpacesEditor3(this.editorContent3);
      this.cleanSpacesEditor4(this.editorContent4);
      this.cleanSpacesEditor5(this.editorContent5);
      this.cleanSpacesEditor6(this.editorContent6);

      this.subirimagen1_4().then(res => this.subirimagen2_4().then(res => this.subirimagen3_4().then(res => this.subirImagenPrincipal())));
    }
    else if (this.notaParaEditar[0].plantilla === '5') {
      this.editorContent = this.editorForm.get('editor').value;
      this.editorContent2 = this.editorForm2.get('editor2').value;
      this.editorContent3 = this.editorForm3.get('editor3').value;
      this.editorContent4 = this.editorForm4.get('editor4').value;
      this.editorContent5 = this.editorForm5.get('editor5').value;

      this.noticiasObject.tittle = this.titulo5;
      this.editorContent2 = this.editorContent2;
      this.noticiasObject.part1 = this.editorContent2;
      this.noticiasObject.part3 = this.editorContent4;


      this.noticiasObject.plantilla = '5';
      this.noticiasObject.autor = this.autor5;

      this.convertMonths(this.selectedItemMes + '');
      this.currentDate = this.selectedItemDia + '-' + this.selectedItemMes + '-' + this.selectedItemAnio;
      this.noticiasObject.date = this.currentDate;

      this.cleanSpacesEditor1(this.editorContent);
      this.noticiasObject.phrase = this.editorContent;
      this.cleanSpacesEditor2(this.editorContent2);
      this.cleanSpacesEditor3(this.editorContent3);
      this.cleanSpacesEditor4(this.editorContent4);
      this.cleanSpacesEditor5(this.editorContent5);


      this.subirimagen1_5().then(res => this.subirimagen2_5().then(res => this.subirImagenPrincipal()));




    }
  }
  subirimagen1_1() {
    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name1 === "Imagen ya cargada") {
        var posicion = this.editorContent2.search("-image-");
        if (posicion !== -1) {
          var b = '<div class="plantilla1-1" style="background-image: url(' + this.notaParaEditar[0].image1 + ');"> </div>'
          this.editorContent2 = [this.editorContent2.slice(0, posicion), b, this.editorContent2.slice(posicion)].join('');
          posicion = this.editorContent2.search("-image-");
          var var1 = this.editorContent2.substring(0, posicion);
          var var2 = this.editorContent2.substring(posicion + 7, this.editorContent2.length);
          this.editorContent2 = var1 + var2;
          this.noticiasObject.part1 = this.editorContent2;
        }
        else {
          this.noticiasObject.part1 = this.editorContent2;
        }
        this.noticiasObject.image1 = this.notaParaEditar[0].image1;

        resolve();
      }
      else {
        this.storage.storage.refFromURL(this.notaParaEditar[0].image1).delete();
        const id = Math.random().toString(36).substring(2);
        const filePath = `plantilla1Imagenes/${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.fileToUpload1);
        this.image1UploadPercent = task.percentageChanges();
        this.statusUploadImage1 = "Actualizando imagen 1"
        task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(url => {
              this.urlImage1 = url;
              var posicion = this.editorContent2.search("-image-");
              if (posicion !== -1) {
                var b = '<div class="plantilla1-1" style="background-image: url(' + this.urlImage1 + ');"> </div>'
                this.editorContent2 = [this.editorContent2.slice(0, posicion), b, this.editorContent2.slice(posicion)].join('');
                posicion = this.editorContent2.search("-image-");
                var var1 = this.editorContent2.substring(0, posicion);
                var var2 = this.editorContent2.substring(posicion + 7, this.editorContent2.length);
                this.editorContent2 = var1 + var2;
                this.noticiasObject.part1 = this.editorContent2;
              }
              else {
                this.noticiasObject.part1 = this.editorContent2;
              }
              this.noticiasObject.image1 = this.urlImage1;

              resolve();
            });
          })
        ).subscribe();
      }
    });
  }
  subirimagen2_1() {
    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name2 === "Imagen ya cargada") {
        this.editorContent3 = '<div class="plantilla1-2" style="background-image: url(' + this.notaParaEditar[0].image2 + ');"></div> ' + this.editorContent3;
        this.noticiasObject.part2 = this.editorContent3;
        this.noticiasObject.image2 = this.notaParaEditar[0].image2;
        console.log(this.noticiasObject.part4);
        resolve();
      }
      else {
        this.storage.storage.refFromURL(this.notaParaEditar[0].image2).delete();
        const id2 = Math.random().toString(36).substring(2);
        const filePath2 = `plantilla1Imagenes/${id2}`;
        const ref2 = this.storage.ref(filePath2);
        const task2 = this.storage.upload(filePath2, this.fileToUpload2);
        this.image1UploadPercent = task2.percentageChanges();
        this.statusUploadImage1 = "Actualizando imagen 2"
        task2.snapshotChanges().pipe(
          finalize(() => {
            ref2.getDownloadURL().subscribe(url => {
              this.urlImage2 = url;
              this.editorContent3 = '<div class="plantilla1-2" style="background-image: url(' + this.urlImage2 + ');"></div> ' + this.editorContent3;
              this.noticiasObject.part2 = this.editorContent3;
              this.noticiasObject.image2 = this.urlImage2;
              console.log(this.noticiasObject.part4);
              //this.restartAll();
              resolve();
            });
          })
        ).subscribe();
      }
    });

  }

  subirimagen1_2() {
    return new Promise((resolve, reject) => {

      if (this.fileToUpload1Name1 === "Imagen ya cargada") {
        this.noticiasObject.image1 = this.notaParaEditar[0].image1;
        console.log("SÍ se va a subir imagen")
        if (this.imagenTamanio1CSS === "chico") {
          if (this.imagenTamanio1Full === true) {
            this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: cover;"></div> ';
          }
          else {
            this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: contain;"></div> ';
          }
        }
        else if (this.imagenTamanio1CSS === "mediano") {
          if (this.imagenTamanio1Full === true) {
            this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: cover;"></div> ';
          }
          else {
            this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: contain;"></div> ';
          }
        }
        else if (this.imagenTamanio1CSS === "grande") {
          if (this.imagenTamanio1Full === true) {
            this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: cover;"></div> ';
          }
          else {
            this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: contain;"></div> ';
          }
        }
        else {
          this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image1 + ');"></div>';
        }
        this.noticiasObject.part1 = this.editorContent2;
        resolve();
      }
      else {
        console.log("SI se va a subir imagen")
        this.storage.storage.refFromURL(this.notaParaEditar[0].image1).delete();
        const id = Math.random().toString(36).substring(2);
        const filePath = `plantilla2Imagenes/${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.fileToUpload1);
        this.image1UploadPercent = task.percentageChanges();
        this.statusUploadImage1 = "Actualizando imagen 1"
        task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(url => {
              this.urlImage1 = url;
              if (this.imagenTamanio1CSS === "chico") {
                if (this.imagenTamanio1Full === true) {
                  this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
                }
                else {
                  this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
                }
              }
              else if (this.imagenTamanio1CSS === "mediano") {
                if (this.imagenTamanio1Full === true) {
                  this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
                }
                else {
                  this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
                }
              }
              else if (this.imagenTamanio1CSS === "grande") {
                if (this.imagenTamanio1Full === true) {
                  this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
                }
                else {
                  this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
                }
              }
              else {
                this.editorContent2 = this.editorContent2 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage1 + ');"></div>';
              }
              this.noticiasObject.image1 = this.urlImage1;
              this.noticiasObject.part1 = this.editorContent2;
              resolve();
            });
          })
        ).subscribe();
      }
    });
  }
  subirimagen2_2() {
    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name1 === "Imagen ya cargada") {
        this.noticiasObject.image2 = this.notaParaEditar[0].image2;
        console.log("No se va a subir imagen")
        if (this.imagenTamanio2CSS === "chico") {
          if (this.imagenTamanio2Full === true) {
            this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.notaParaEditar[0].image2 + '); background-size: cover;"></div> ';
          }
          else {
            this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.notaParaEditar[0].image2 + '); background-size: contain;"></div> ';
          }
        }
        else if (this.imagenTamanio2CSS === "mediano") {
          if (this.imagenTamanio2Full === true) {
            this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image2 + '); background-size: cover;"></div> ';
          }
          else {
            this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image2 + '); background-size: contain;"></div> ';
          }
        }
        else if (this.imagenTamanio2CSS === "grande") {
          if (this.imagenTamanio2Full === true) {
            this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.notaParaEditar[0].image2 + '); background-size: cover;"></div> ';
          }
          else {
            this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.notaParaEditar[0].image2 + '); background-size: contain;"></div> ';
          }
        }
        else {
          this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image2 + ');"></div>';
        }
        this.noticiasObject.part2 = this.editorContent3;
        resolve();
      }
      else {
        console.log("SI se va a subir imagen")
        this.storage.storage.refFromURL(this.notaParaEditar[0].image2).delete();
        const id = Math.random().toString(36).substring(2);
        const filePath = `plantilla2Imagenes/${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.fileToUpload2);
        this.image1UploadPercent = task.percentageChanges();
        this.statusUploadImage1 = "Actualizando imagen 2"
        task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(url => {
              this.urlImage2 = url;
              if (this.imagenTamanio2CSS === "chico") {
                if (this.imagenTamanio2Full === true) {
                  this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.urlImage2 + '); background-size: cover;"></div> ';
                }
                else {
                  this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.urlImage2 + '); background-size: contain;"></div> ';
                }
              }
              else if (this.imagenTamanio2CSS === "mediano") {
                if (this.imagenTamanio2Full === true) {
                  this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage2 + '); background-size: cover;"></div> ';
                }
                else {
                  this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage2 + '); background-size: contain;"></div> ';
                }
              }
              else if (this.imagenTamanio2CSS === "grande") {
                if (this.imagenTamanio2Full === true) {
                  this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.urlImage2 + '); background-size: cover;"></div> ';
                }
                else {
                  this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.urlImage2 + '); background-size: contain;"></div> ';
                }
              }
              else {
                this.editorContent3 = this.editorContent3 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage2 + ');"></div>';
              }
              this.noticiasObject.part2 = this.editorContent3;
              this.noticiasObject.image2 = this.urlImage2;
              resolve();
            });
          })
        ).subscribe();
      }
    });
  }
  subirimagen1_3() {
    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name1 === "Imagen ya cargada") {
        this.noticiasObject.image1 = this.notaParaEditar[0].image1;
        if (this.imagenTamanio1CSS === "chico") {
          if (this.imagenTamanio1Full === true) {
            this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-chica"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: cover;"></div> ';
          }
          else {
            this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-chica"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: contain;"></div> ';
          }
        }
        else if (this.imagenTamanio1CSS === "mediano") {
          if (this.imagenTamanio1Full === true) {
            this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: cover;"></div> ';
          }
          else {
            this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: contain;"></div> ';
          }
        }
        else if (this.imagenTamanio1CSS === "grande") {
          if (this.imagenTamanio1Full === true) {
            this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-grande"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: cover;"></div> ';
          }
          else {
            this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-grande"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: contain;"></div> ';
          }
        }
        else {
          this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image1 + ');"></div>';
        }
        this.noticiasObject.part1 = this.editorContent2;
        resolve();
      }
      else {
        this.storage.storage.refFromURL(this.notaParaEditar[0].image1).delete();
        const id = Math.random().toString(36).substring(2);
        const filePath = `plantilla3Imagenes/${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.fileToUpload1);
        this.image1UploadPercent = task.percentageChanges();
        this.statusUploadImage1 = "Actualizando imagen 1"
        task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(url => {
              this.urlImage1 = url;
              if (this.imagenTamanio1CSS === "chico") {
                if (this.imagenTamanio1Full === true) {
                  this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-chica"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
                }
                else {
                  this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-chica"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
                }
              }
              else if (this.imagenTamanio1CSS === "mediano") {
                if (this.imagenTamanio1Full === true) {
                  this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-mediana"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
                }
                else {
                  this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-mediana"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
                }
              }
              else if (this.imagenTamanio1CSS === "grande") {
                if (this.imagenTamanio1Full === true) {
                  this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-grande"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
                }
                else {
                  this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-grande"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
                }
              }
              else {
                this.editorContent2 = this.editorContent2 + '<div class="plantilla3-1-mediana"  style="background-image: url(' + this.urlImage1 + ');"></div>';
              }
              this.noticiasObject.part1 = this.editorContent2;
              this.noticiasObject.image1 = this.urlImage1;
              resolve();
            });
          })
        ).subscribe();
      }
    });
  }

  subirimagen2_3() {
    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name2 === "Imagen ya cargada") {

        this.editorContent4 = '<div class="plantilla1-2" style="background-image: url(' + this.notaParaEditar[0].image2 + ');"></div> ' + this.editorContent4;
        this.noticiasObject.part3 = this.editorContent4;
        this.noticiasObject.image2 = this.notaParaEditar[0].image2;

        resolve();
      }
      else {
        this.storage.storage.refFromURL(this.notaParaEditar[0].image2).delete();
        const id2 = Math.random().toString(36).substring(2);
        const filePath2 = `plantilla3Imagenes/${id2}`;
        const ref2 = this.storage.ref(filePath2);
        const task2 = this.storage.upload(filePath2, this.fileToUpload2);
        this.image1UploadPercent = task2.percentageChanges();
        this.statusUploadImage1 = "Actualizando imagen 2"
        task2.snapshotChanges().pipe(
          finalize(() => {
            ref2.getDownloadURL().subscribe(url => {
              this.urlImage2 = url;
              this.editorContent4 = '<div class="plantilla1-2" style="background-image: url(' + this.urlImage2 + ');"></div> ' + this.editorContent4;
              this.noticiasObject.part3 = this.editorContent4;
              this.noticiasObject.image2 = this.urlImage2;

              //this.restartAll();
              resolve();
            });
          })
        ).subscribe();
      }
    });

  }
  subirimagen1_4() {
    console.log(this.notaParaEditar[0].image1)
    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name1 === "Imagen ya cargada") {

        this.editorContent3 = this.editorContent3 + '<div class="plantilla4-1"  style="background-image: url(' + this.notaParaEditar[0].image1 + ');"></div>';
        this.noticiasObject.part2 = this.editorContent3;

        this.noticiasObject.image1 = this.notaParaEditar[0].image1;
        console.log("Imágen 1 ya cargada, no se subirá");
        resolve();
      }
      else {
        this.storage.storage.refFromURL(this.notaParaEditar[0].image1).delete();
        const id = Math.random().toString(36).substring(2);
        const filePath = `plantilla4Imagenes/${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.fileToUpload1);
        this.image1UploadPercent = task.percentageChanges();
        this.statusUploadImage1 = "Actualizando imagen 1"
        task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(url => {

              this.urlImage1 = url;
              this.editorContent3 = this.editorContent3 + '<div class="plantilla4-1"  style="background-image: url(' + this.urlImage1 + ');"></div>';
              this.noticiasObject.part2 = this.editorContent3;

              this.noticiasObject.image1 = this.urlImage1;
              console.log("Imágen 1 se subirá");
              resolve();
            });
          })
        ).subscribe();
      }
    });
  }
  subirimagen2_4() {

    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name2 === "Imagen ya cargada") {
        console.log("Imágen 2 ya cargada, no se subirá");
        var posicion = this.editorContent4.search("-image-");
        if (posicion !== -1) {
          var b = '<div class="plantilla4-2" style="background-image: url(' + this.notaParaEditar[0].image2 + ');"> </div>'
          this.editorContent4 = [this.editorContent4.slice(0, posicion), b, this.editorContent4.slice(posicion)].join('');
          posicion = this.editorContent4.search("-image-");
          var var1 = this.editorContent4.substring(0, posicion);
          var var2 = this.editorContent4.substring(posicion + 7, this.editorContent4.length);
          this.editorContent4 = var1 + var2;
          this.noticiasObject.part3 = this.editorContent4;
        }
        else {
          this.noticiasObject.part3 = this.editorContent4;
        }
        this.noticiasObject.image2 = this.notaParaEditar[0].image2;
        console.log("entro 2");
        resolve();
      }
      else {
        this.storage.storage.refFromURL(this.notaParaEditar[0].image2).delete();
        const id = Math.random().toString(36).substring(2);
        const filePath = `plantilla4Imagenes/${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.fileToUpload2);
        this.image1UploadPercent = task.percentageChanges();
        this.statusUploadImage1 = "Actualizando imagen 2";
        console.log("entro 2.2");
        task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(url => {
              this.urlImage2 = url;
              var posicion = this.editorContent4.search("-image-");
              if (posicion !== -1) {
                var b = '<div class="plantilla4-2" style="background-image: url(' + this.urlImage2 + ');"> </div>'
                this.editorContent4 = [this.editorContent4.slice(0, posicion), b, this.editorContent4.slice(posicion)].join('');
                posicion = this.editorContent4.search("-image-");
                var var1 = this.editorContent4.substring(0, posicion);
                var var2 = this.editorContent4.substring(posicion + 7, this.editorContent4.length);
                this.editorContent4 = var1 + var2;
                this.noticiasObject.part3 = this.editorContent4;
              }
              else {
                this.noticiasObject.part3 = this.editorContent4;
              }
              this.noticiasObject.image2 = this.urlImage2;
              console.log("Imágen 2 se subirá");
              resolve();
            });
          })
        ).subscribe();
      }
    });
  }
  subirimagen3_4() {
    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name3 === "Imagen ya cargada") {
        this.noticiasObject.image3 = this.notaParaEditar[0].image3;
        console.log("Imágen 3 ya cargada, no se subirá");

        if (this.imagenTamanio3CSS === "chico") {
          if (this.imagenTamanio3Full === true) {
            this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.notaParaEditar[0].image3 + '); background-size: cover;"></div> ';
          }
          else {
            this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.notaParaEditar[0].image3 + '); background-size: contain;"></div> ';
          }
        }
        else if (this.imagenTamanio3CSS === "mediano") {
          if (this.imagenTamanio3Full === true) {
            this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image3 + '); background-size: cover;"></div> ';
          }
          else {
            this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image3 + '); background-size: contain;"></div> ';
          }
        }
        else if (this.imagenTamanio3CSS === "grande") {
          if (this.imagenTamanio3Full === true) {
            this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.notaParaEditar[0].image3 + '); background-size: cover;"></div> ';
          }
          else {
            this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.notaParaEditar[0].image3 + '); background-size: contain;"></div> ';
          }
        }
        else {
          this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image3 + ');"></div>';
        }
        this.noticiasObject.part4 = this.editorContent5;
        resolve();
      }
      else {
        console.log("Se eliminara:");
        console.log(this.notaParaEditar[0].image3);
        this.storage.storage.refFromURL(this.notaParaEditar[0].image3).delete();
        console.log("Se eliminó:");
        const id = Math.random().toString(36).substring(2);
        const filePath = `plantilla4Imagenes/${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.fileToUpload3);
        this.image1UploadPercent = task.percentageChanges();
        this.statusUploadImage1 = "Actualizando imagen 3"
        task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(url => {
              this.urlImage3 = url;
              if (this.imagenTamanio3CSS === "chico") {
                if (this.imagenTamanio3Full === true) {
                  this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.urlImage3 + '); background-size: cover;"></div> ';
                }
                else {
                  this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-chica"  style="background-image: url(' + this.urlImage3 + '); background-size: contain;"></div> ';
                }
              }
              else if (this.imagenTamanio3CSS === "mediano") {
                if (this.imagenTamanio3Full === true) {
                  this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage3 + '); background-size: cover;"></div> ';
                }
                else {
                  this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage3 + '); background-size: contain;"></div> ';
                }
              }
              else if (this.imagenTamanio3CSS === "grande") {
                if (this.imagenTamanio3Full === true) {
                  this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.urlImage3 + '); background-size: cover;"></div> ';
                }
                else {
                  this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-grande"  style="background-image: url(' + this.urlImage3 + '); background-size: contain;"></div> ';
                }
              }
              else {
                this.editorContent5 = this.editorContent5 + '<div class="plantilla2-1-mediana"  style="background-image: url(' + this.urlImage3 + ');"></div>';
              }
              this.noticiasObject.part4 = this.editorContent5;
              this.noticiasObject.image3 = this.urlImage3;
              console.log("Imágen 3 se subirá");
              console.log(this.urlImage3);
              resolve();
            });
          })
        ).subscribe();
      }
    });
  }
  subirimagen1_5() {
    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name1 === "Imagen ya cargada") {
        this.noticiasObject.image1 = this.notaParaEditar[0].image1;

        if (this.imagenTamanio1CSS === "chico") {
          if (this.imagenTamanio1Full === true) {
            this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-chica"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: cover;"></div> ';
          }
          else {
            this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-chica"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: contain;"></div> ';
          }
        }
        else if (this.imagenTamanio1CSS === "mediano") {
          if (this.imagenTamanio1Full === true) {
            this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: cover;"></div> ';
          }
          else {
            this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: contain;"></div> ';
          }
        }
        else if (this.imagenTamanio1CSS === "grande") {
          if (this.imagenTamanio1Full === true) {
            this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-grande"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: cover;"></div> ';
          }
          else {
            this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-grande"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: contain;"></div> ';
          }
        }
        else {
          this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-mediana"  style="background-image: url(' + this.notaParaEditar[0].image1 + '); background-size: contain;"></div>';
        }
        resolve();
      }
      else {
        this.storage.storage.refFromURL(this.notaParaEditar[0].image1).delete();
        const id = Math.random().toString(36).substring(2);
        const filePath = `plantilla5Imagenes/${id}`;
        const ref = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.fileToUpload1);
        this.image1UploadPercent = task.percentageChanges();
        this.statusUploadImage1 = "Actualizando imagen 1"
        task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(url => {
              this.urlImage1 = url;
              if (this.imagenTamanio1CSS === "chico") {
                if (this.imagenTamanio1Full === true) {
                  this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-chica"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
                }
                else {
                  this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-chica"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
                }
              }
              else if (this.imagenTamanio1CSS === "mediano") {
                if (this.imagenTamanio1Full === true) {
                  this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-mediana"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
                }
                else {
                  this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-mediana"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
                }
              }
              else if (this.imagenTamanio1CSS === "grande") {
                if (this.imagenTamanio1Full === true) {
                  this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-grande"  style="background-image: url(' + this.urlImage1 + '); background-size: cover;"></div> ';
                }
                else {
                  this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-grande"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div> ';
                }
              }
              else {
                this.noticiasObject.part2 = this.editorContent3 + '<div class="plantilla5-1-mediana"  style="background-image: url(' + this.urlImage1 + '); background-size: contain;"></div>';
              }
              this.noticiasObject.image1 = this.urlImage1;
              console.log(this.noticiasObject.part2);
              resolve();
            });
          })
        ).subscribe();
      }
    });
  }
  subirimagen2_5() {
    return new Promise((resolve, reject) => {
      if (this.fileToUpload1Name2 === "Imagen ya cargada") {
        this.noticiasObject.part4 = '<div class="plantilla5-2" style="background-image: url(' + this.notaParaEditar[0].image2 + ');"></div> ' + this.editorContent5;
        this.noticiasObject.image2 = this.notaParaEditar[0].image2;
        console.log(this.noticiasObject.part4);
        resolve();
      }
      else {
        this.storage.storage.refFromURL(this.notaParaEditar[0].image2).delete();
        const id2 = Math.random().toString(36).substring(2);
        const filePath2 = `plantilla5Imagenes/${id2}`;
        const ref2 = this.storage.ref(filePath2);
        const task2 = this.storage.upload(filePath2, this.fileToUpload2);
        this.image1UploadPercent = task2.percentageChanges();
        this.statusUploadImage1 = "Actualizando imagen 2"
        task2.snapshotChanges().pipe(
          finalize(() => {
            ref2.getDownloadURL().subscribe(url => {
              this.urlImage2 = url;
              this.noticiasObject.part4 = '<div class="plantilla5-2" style="background-image: url(' + this.urlImage2 + ');"></div> ' + this.editorContent5;
              this.noticiasObject.image2 = this.urlImage2;
              console.log(this.noticiasObject.part4);
              //this.restartAll();
              resolve();
            });
          })
        ).subscribe();
      }
    });

  }
  subirImagenPrincipal() {
    if (this.fileToUpload1Name4 === "Imagen ya cargada") {
      console.log("entro al IF")
      this.noticiasObject.principalImage = this.notaParaEditar[0].principalImage;
      this.noticiasObject.$key = this.notaParaEditar[0].$key;
      console.log(this.noticiasObject);
      var seccion = this.seccionSelected[0];
      if (seccion === "Noticias") {
        console.log("esta en noticias");
        this.noticiasService.updateNoticia(this.noticiasObject, "Noticias").then(res => {
          this.noticiasNodoGeneralObject.date = this.noticiasObject.date;
          this.noticiasNodoGeneralObject.seccion = "Noticias";
          this.noticiasNodoGeneralObject.tittle = this.noticiasObject.tittle;
          this.noticiasNodoGeneralObject.id_noticia = this.notaParaEditar[0].$key;
          this.noticiasNodoGeneralObject.$key = this.nodoGeneralSelected[0];

          this.noticiasService.updatetNoticiasEnNodoGeneral(this.noticiasNodoGeneralObject).then(res => {
            window.alert('Nota actualizada con éxito');
            this.changeSection("S")
            this.restartAll();
            console.log("ola")
          });
        });
      }
      else if (seccion === "Ciencia") {
        console.log("esta en ciencia");
        this.noticiasService.updateNoticia(this.noticiasObject, "Ciencia").then(res => {
          this.noticiasNodoGeneralObject.date = this.noticiasObject.date;
          this.noticiasNodoGeneralObject.seccion = "Ciencia";
          this.noticiasNodoGeneralObject.tittle = this.noticiasObject.tittle;
          this.noticiasNodoGeneralObject.id_noticia = this.notaParaEditar[0].$key;
          this.noticiasNodoGeneralObject.$key = this.nodoGeneralSelected[0];
          this.noticiasService.updatetNoticiasEnNodoGeneral(this.noticiasNodoGeneralObject).then(res => {
            window.alert('Nota actualizada con éxito');
            this.changeSection("S")
            this.restartAll();
            console.log("ola")
          });
        });
      }
      else if (seccion === "Arte") {
        console.log("esta en arte");
        this.noticiasService.updateNoticia(this.noticiasObject, "Arte").then(res => {
          this.noticiasNodoGeneralObject.date = this.noticiasObject.date;
          this.noticiasNodoGeneralObject.seccion = "Arte";
          this.noticiasNodoGeneralObject.tittle = this.noticiasObject.tittle;
          this.noticiasNodoGeneralObject.id_noticia = this.notaParaEditar[0].$key;
          this.noticiasNodoGeneralObject.$key = this.nodoGeneralSelected[0];
          this.noticiasService.updatetNoticiasEnNodoGeneral(this.noticiasNodoGeneralObject).then(res => {
            window.alert('Nota actualizada con éxito');
            this.changeSection("S")
            this.restartAll();
            console.log("ola")
          });
        });
      }
      else if (seccion === "Ocio") {
        console.log("esta en ocio");
        this.noticiasService.updateNoticia(this.noticiasObject, "Ocio").then(res => {
          this.noticiasNodoGeneralObject.date = this.noticiasObject.date;
          this.noticiasNodoGeneralObject.seccion = "Ocio";
          this.noticiasNodoGeneralObject.tittle = this.noticiasObject.tittle;
          this.noticiasNodoGeneralObject.id_noticia = this.notaParaEditar[0].$key;
          this.noticiasNodoGeneralObject.$key = this.nodoGeneralSelected[0];

          this.noticiasService.updatetNoticiasEnNodoGeneral(this.noticiasNodoGeneralObject).then(res => {
            window.alert('Nota actualizada con éxito');
            this.changeSection("S")
            this.restartAll();
            console.log("ola")
          });
        });
      }
      else if (seccion === "Descubre") {
        console.log("esta en descubre");
        this.noticiasService.updateNoticia(this.noticiasObject, "Descubre").then(res => {
          this.noticiasNodoGeneralObject.date = this.noticiasObject.date;
          this.noticiasNodoGeneralObject.seccion = "Descubre";
          this.noticiasNodoGeneralObject.tittle = this.noticiasObject.tittle;
          this.noticiasNodoGeneralObject.id_noticia = this.notaParaEditar[0].$key;
          this.noticiasNodoGeneralObject.$key = this.nodoGeneralSelected[0];

          this.noticiasService.updatetNoticiasEnNodoGeneral(this.noticiasNodoGeneralObject).then(res => {
            window.alert('Nota actualizada con éxito');
            this.changeSection("S")
            this.restartAll();
            console.log("ola")
          });
        });
      }
      else if (seccion === "Mocotips") {
        console.log("esta en mocotis");
        this.noticiasService.updateNoticia(this.noticiasObject, "Mocotips").then(res => {
          this.noticiasNodoGeneralObject.date = this.noticiasObject.date;
          this.noticiasNodoGeneralObject.seccion = "Mocotips";
          this.noticiasNodoGeneralObject.tittle = this.noticiasObject.tittle;
          this.noticiasNodoGeneralObject.id_noticia = this.notaParaEditar[0].$key;
          this.noticiasNodoGeneralObject.$key = this.nodoGeneralSelected[0];

          this.noticiasService.updatetNoticiasEnNodoGeneral(this.noticiasNodoGeneralObject).then(res => {
            window.alert('Nota actualizada con éxito');
            this.changeSection("S")
            this.restartAll();
            console.log("ola")
          });
        });
      }
    }
    else {

      this.storage.storage.refFromURL(this.notaParaEditar[0].principalImage).delete();
      const idPrincipal = Math.random().toString(36).substring(2);
      const filePathPrincipal = `portadasNotas/${idPrincipal}`;
      const refPrincipal = this.storage.ref(filePathPrincipal);
      const taskPrincipal = this.storage.upload(filePathPrincipal, this.fileToUploadPrincipal);
      this.image1UploadPercent = taskPrincipal.percentageChanges();
      this.statusUploadImage1 = "Actualizando imagen principal"
      taskPrincipal.snapshotChanges().pipe(
        finalize(() => {
          refPrincipal.getDownloadURL().subscribe(url => {
            this.urlImagePrincipal = url;
            this.noticiasObject.principalImage = this.urlImagePrincipal;
            this.noticiasObject.$key = this.notaParaEditar[0].$key;


            var seccion = this.seccionSelected[0];
            if (seccion === "Noticias") {
              console.log("esta en noticias");
              this.noticiasService.updateNoticia(this.noticiasObject, "Noticias").then(res => {

                this.noticiasNodoGeneralObject.date = this.noticiasObject.date;
                this.noticiasNodoGeneralObject.seccion = "Noticias";
                this.noticiasNodoGeneralObject.tittle = this.noticiasObject.tittle;
                this.noticiasNodoGeneralObject.id_noticia = this.notaParaEditar[0].$key;
                this.noticiasNodoGeneralObject.$key = this.nodoGeneralSelected[0];

                this.noticiasService.updatetNoticiasEnNodoGeneral(this.noticiasNodoGeneralObject).then(res => {
                  window.alert('Nota actualizada con éxito');
                  this.changeSection("S")
                  this.restartAll();
                });
              });
            }
            else if (seccion === "Ciencia") {
              console.log("esta en ciencia")
              this.noticiasService.updateNoticia(this.noticiasObject, "Ciencia").then(res => {

                this.noticiasNodoGeneralObject.date = this.noticiasObject.date;
                this.noticiasNodoGeneralObject.seccion = "Ciencia";
                this.noticiasNodoGeneralObject.tittle = this.noticiasObject.tittle;
                this.noticiasNodoGeneralObject.id_noticia = this.notaParaEditar[0].$key;
                this.noticiasNodoGeneralObject.$key = this.nodoGeneralSelected[0];

                this.noticiasService.updatetNoticiasEnNodoGeneral(this.noticiasNodoGeneralObject).then(res => {
                  window.alert('Nota actualizada con éxito');
                  this.changeSection("S")
                  this.restartAll();
                });
              });
            }
            else if (seccion === "Arte") {
              console.log("esta en arte");
              this.noticiasService.updateNoticia(this.noticiasObject, "Arte").then(res => {

                this.noticiasNodoGeneralObject.date = this.noticiasObject.date;
                this.noticiasNodoGeneralObject.seccion = "Arte";
                this.noticiasNodoGeneralObject.tittle = this.noticiasObject.tittle;
                this.noticiasNodoGeneralObject.id_noticia = this.notaParaEditar[0].$key;
                this.noticiasNodoGeneralObject.$key = this.nodoGeneralSelected[0];

                this.noticiasService.updatetNoticiasEnNodoGeneral(this.noticiasNodoGeneralObject).then(res => {
                  window.alert('Nota actualizada con éxito');
                  this.changeSection("S")
                  this.restartAll();
                });
              });
            }
            else if (seccion === "Ocio") {
              console.log("esta en ocio");
              this.noticiasService.updateNoticia(this.noticiasObject, "Ocio").then(res => {

                this.noticiasNodoGeneralObject.date = this.noticiasObject.date;
                this.noticiasNodoGeneralObject.seccion = "Ocio";
                this.noticiasNodoGeneralObject.tittle = this.noticiasObject.tittle;
                this.noticiasNodoGeneralObject.id_noticia = this.notaParaEditar[0].$key;
                this.noticiasNodoGeneralObject.$key = this.nodoGeneralSelected[0];

                this.noticiasService.updatetNoticiasEnNodoGeneral(this.noticiasNodoGeneralObject).then(res => {
                  window.alert('Nota actualizada con éxito');
                  this.changeSection("S")
                  this.restartAll();
                });
              });
            }
            else if (seccion === "Descubre") {
              console.log("esta en descubre");
              this.noticiasService.updateNoticia(this.noticiasObject, "Descubre").then(res => {

                this.noticiasNodoGeneralObject.date = this.noticiasObject.date;
                this.noticiasNodoGeneralObject.seccion = "Descubre";
                this.noticiasNodoGeneralObject.tittle = this.noticiasObject.tittle;
                this.noticiasNodoGeneralObject.id_noticia = this.notaParaEditar[0].$key;
                this.noticiasNodoGeneralObject.$key = this.nodoGeneralSelected[0];

                this.noticiasService.updatetNoticiasEnNodoGeneral(this.noticiasNodoGeneralObject).then(res => {
                  window.alert('Nota actualizada con éxito');
                  this.changeSection("S")
                  this.restartAll();
                });
              });
            }
            else if (seccion === "Mocotips") {
              console.log("esta en mocotis");
              this.noticiasService.updateNoticia(this.noticiasObject, "Mocotips").then(res => {

                this.noticiasNodoGeneralObject.date = this.noticiasObject.date;
                this.noticiasNodoGeneralObject.seccion = "Mocotips";
                this.noticiasNodoGeneralObject.tittle = this.noticiasObject.tittle;
                this.noticiasNodoGeneralObject.id_noticia = this.notaParaEditar[0].$key;
                this.noticiasNodoGeneralObject.$key = this.nodoGeneralSelected[0];

                this.noticiasService.updatetNoticiasEnNodoGeneral(this.noticiasNodoGeneralObject).then(res => {
                  window.alert('Nota actualizada con éxito');
                  this.changeSection("S")
                  this.restartAll();
                });
              });
            }
          });
        })
      ).subscribe();

    }

  }
  eliminarNoticia() {
    this.noticiasService.getNoteToEdit(this.seccionSelected[0], this.keysSelected[0]).snapshotChanges().subscribe(item => {
      this.notaParaEditar = [];
      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        this.notaParaEditar.push(json as Noticias);
      });
      if (window.confirm("¿Estás seguro de eliminar la nota: " + this.notaParaEditar[0].tittle + " ?")) {
        this.storage.storage.refFromURL(this.notaParaEditar[0].image1).delete();
        this.storage.storage.refFromURL(this.notaParaEditar[0].image2).delete();
        this.storage.storage.refFromURL(this.notaParaEditar[0].principalImage).delete();
        if (this.notaParaEditar[0].image3 !== "") {
          this.storage.storage.refFromURL(this.notaParaEditar[0].image3).delete();
        }
        this.noticiasService.deleteNoticia(this.keysSelected[0], this.seccionSelected[0], this.nodoGeneralSelected[0]);
        window.alert('Nota eliminada con éxito');
        this.changeSection("S");
      }
    })
  }
  eliminarEspecial() {
 this.noticiasService.getEspecialSelected(this.nodoGeneralSelected[0]).snapshotChanges().subscribe(item => {
      this.especialParaEditar = [];
      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        this.especialParaEditar.push(json as especialDelMes);
      });
      if (window.confirm("¿Estás seguro de eliminar el especial: " + this.especialParaEditar[0].tittle + " ?")) {
        this.storage.storage.refFromURL(this.especialParaEditar[0].portada1).delete();
        this.storage.storage.refFromURL(this.especialParaEditar[0].portada2).delete();
        this.storage.storage.refFromURL(this.especialParaEditar[0].principalImage).delete();
        this.noticiasService.deleteEspecial(this.especialParaEditar[0].$key);
        window.alert('Especial eliminada con éxito');
        this.changeSection("M")
      }

    })


  }
}
