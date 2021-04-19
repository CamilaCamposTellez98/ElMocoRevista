import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ResizedEvent } from 'angular-resize-event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-suscripciones',
  templateUrl: './suscripciones.component.html',
  styleUrls: ['./suscripciones.component.css']
})
export class SuscripcionesComponent implements OnInit {

  userPicture: string = "";
  userName: string = "";
  Moconauta: string = "MOCONAUTA ";
  Ingreso: string = "INGRESO";
  fileToUpload1: File = null;
  registroForm: FormGroup;
  incioSesion: FormGroup;
  editForm: FormGroup;
  submitted = false;
  private mail: string;
  private pass: string;

  logged: boolean = false;;

  porcentajeTop: number;
  width: number;
  heigth: number;
  left: number;
  padding: number;
  padding_photo: number;

  imagePath: any;
  profilePic: any = "./../../assets/images/aniadir_foto.jpg";
  constructor(public router: Router, private cookie: CookieService, private _snackBar: MatSnackBar, private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    let cookie = this.cookie.check("username");
    if (cookie === true) {
      this.userPicture = this.cookie.get("image");
      this.userName = this.cookie.get("username");
      this.Ingreso = "CERRAR SESIÓN"
      this.Moconauta = this.cookie.get("username").toUpperCase() + " ";
    }
    else {
      this.userPicture = "./../../assets/images/Boton_Moconauta.png";
    }
    this.createFormGroup();
  }
  createFormGroup(): void {
    this.registroForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      user_name: ['', [Validators.maxLength(8), Validators.required]],
      mail: ['', [Validators.email, Validators.required]],
      gender: ['', [Validators.required]],
      age: ['', [Validators.required]],
      country: ['', [Validators.required]],
      pass1: ['', [Validators.minLength(6), Validators.required]],
      pass2: ['', [Validators.minLength(6), Validators.required]],
      tycs: ['', [Validators.requiredTrue]],
    });
    this.incioSesion = this.formBuilder.group({
      mail: ['', [Validators.email, Validators.required]],
      pass: ['', [Validators.required]],
    });
    this.editForm = this.formBuilder.group({
      mail: ['', [Validators.email, Validators.required]],
    });
  }
  redirectTo(): void {
    this.router.navigate(['/home'])
      .then(() => {
        window.location.reload();
      });
  }
  register(): void {
    if (this.registroForm.valid === false) {
      this.showSnackbar('Favor de completar todos los campos', '', 3000);
    }
    else if (this.registroForm.value.pass1 !== this.registroForm.value.pass2) {
      this.showSnackbar('Las contraseñas no coinciden', '', 3000);
    }
    else {
      let user = {
        age: this.registroForm.value.age,
        country: this.registroForm.value.country,
        gender: this.registroForm.value.gender,
        name: this.registroForm.value.name,
        user: this.registroForm.value.user_name,
      }
      this.submitted = true;
      this.authService.createUser(this.registroForm.value.mail, this.registroForm.value.pass1, user, this.fileToUpload1);
    }
  }
  iniciarSesion(): void {
    if (this.incioSesion.valid === false) {
      this.showSnackbar('Favor de ingresar sus datos completos', '', 3000);
    }
    else {
      this.authService.loggeo(this.incioSesion.value.mail, this.incioSesion.value.pass).then(r => {
        if (r.code === "auth/wrong-password") {
          this.showSnackbar('La contraseña es incorrecta', '', 4000);
        }
        else if (r.user) {
          this.showSnackbar('Ingreso exitoso', '', 2000);
          this.logged = true;
          this.mail = this.incioSesion.value.mail;
          this.pass = this.incioSesion.value.pass;
        }
        else {
          this.showSnackbar('Ocurrió un error, por favor intenta más tarde', '', 3000);
        }
      });
    }
  }
  reestablecerMail(): void {

  }
  onResizedPhoto(event: ResizedEvent): void {
    this.width = event.newHeight;
    let square = this.width / 2;
    let form = this.heigth / 2;
    this.left = form - square;
    this.padding = square + 10;
    this.padding_photo = this.width - (this.width / 4)
  }
  onResizedForm(event: ResizedEvent): void {
    this.heigth = event.newWidth;
    let square = this.width / 2;
    let form = this.heigth / 2;
    this.left = form - square;
  }
  addProfilePic(files: any) {
    if (files.length === 0)
      return;
    let mimeType = files.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.showSnackbar('Favor de ingresar una imagen', '', 3000);
      return;
    }
    if (files.target.files[0].size > 1000000) {
      this.showSnackbar('El tamaño de la imagen es demasiado grande.', '', 3000);
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(files.target.files[0]);
    reader.onload = (_event) => {
      this.profilePic = reader.result;
      this.fileToUpload1 = files.target.files[0];
    }
  }
  deletePic(): void {
    this.profilePic = "./../../assets/images/aniadir_foto.jpg";
  }
  showSnackbar(message: string, action: string, ms: number): void {
    this._snackBar.open(message, action, {
      duration: ms
    });
  }
}
