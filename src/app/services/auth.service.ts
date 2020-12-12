import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { revistaDigitalWithoutID } from '../models/revistaDigital';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData = [];
  constructor(private cookie: CookieService, private httpClient: HttpClient, public router: Router, private db: AngularFirestore, private afAuth: AngularFireAuth, private _snackBar: MatSnackBar, private storage: AngularFireStorage) { }
  showSnackbar(message: string, action: string, ms: number): void {
    this._snackBar.open(message, action, {
      duration: ms
    });
  }
  login(user, password) {
    return this.db.collection('users', ref => ref.where('username', '==', user).where('password', '==', password)).snapshotChanges();
    //return this.db.collection('users', ref => ref.where('email', '==', email).where('password', '==', password)).snapshotChanges();
  }
<<<<<<< HEAD
  loginAdmin(user, password) {
=======
  loginAdmin(user, password){
    console.log("ola")
>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA
    return this.db.collection('admin-users', ref => ref.where('username', '==', user).where('password', '==', password)).snapshotChanges();
    //return this.db.collection('users', ref => ref.where('email', '==', email).where('password', '==', password)).snapshotChanges();
  }
  //camila.campos.tellez@gmail.com
  loggeo(user, password) {
<<<<<<< HEAD
    return this.afAuth.auth.signInWithEmailAndPassword(user, password).then(data => {
      return data;
    }).catch((error) => {
      return error;
    });

  }
  getUid() {
    if (this.afAuth.auth.currentUser === null) {
      return "no";
=======
    return new Promise((resolve) => {
    this.afAuth.auth.signInWithEmailAndPassword(user, password).then(data=>
      {
        console.log('user dign in success ',data)

        console.log(this.afAuth.auth.currentUser.uid)
        resolve();
    })
  });
  }
  getUid() {
    if(this.afAuth.auth.currentUser === null){
      console.log("no se encontró");
      return "no";   
>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA
    }
    else {
      return this.afAuth.auth.currentUser.uid;
    }
  }
  checkAuthStatus() {
    var status = "Ds";
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
       console.log("CHI")
        return status;
      }
      else {
        console.log("ño")
        return status;
      }
    });
  }
  emailVerification() {
    console.log(this.afAuth.auth.currentUser.emailVerified);
  }
  emailUpdate(mail: string, pass: string, mailUpdate: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(mail, pass).then(data => {
      data.user.updateEmail(mailUpdate).then(res => {
        this.showSnackbar('Correo cambiado con éxito... vuelve a iniciar sesión.', '', 3000);
        this.cookie.deleteAll();
        this.SignOut();
        this.router.navigate(['/ingreso']);
        return res; 
      }).catch((error) => {
        this.showSnackbar('El correo ingresado ya ha sido registrado previamente', '', 3000);
        return error;
      });
    }).catch((error) => {
      return error;
    });
  }
  createUser(email: string, pass: string, data: any, file: File) {

    this.showSnackbar('Registrando usuario... Espere unos segundos.', '', 3000);
    return this.afAuth.auth.createUserWithEmailAndPassword(email, pass).then((user) => {
      //this.afAuth.auth.currentUser.sendEmailVerification();
      this.db.collection('users').doc(user.user.uid).set({
        age: data.age,
        country: data.country,
        gender: data.gender,
        name: data.name,
        user: data.user
      })
      const filePath = `private/users/${user.user.uid}/profile`;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(url => {
            this.showSnackbar('¡Registro completado!', '', 3000);
            this.router.navigate(['/ingreso']);
          });
        })
      ).subscribe();
    })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          this.showSnackbar('El correo ingresado ya ha sido registrado previamente', '', 3000);
        }
        else {
          this.showSnackbar('Ocurrió un error, por favor intenta más tarde', '', 3000);
        }
        return error;
      });
  }
  updateUser(uid : string, data : any){
    return this.db.collection('users').doc(uid).update({
      age: data.age,
      country: data.country,
      gender: data.gender,
      name: data.name,
      user: data.user
    });
  }
<<<<<<< HEAD
  updateImage(uid: string, file : File){
    this.storage.storage.ref("private/users/"+uid+"/profile").getDownloadURL().then((url) => {
    this.storage.storage.refFromURL(url).delete();
    const filePath = `private/users/${uid}/profile`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.cookie.set("image", url);
        });
      })
    ).subscribe();
    });
  }
  getImage(): Observable<Blob> {
    return this.httpClient.get("https://firebasestorage.googleapis.com/v0/b/elmoco-frontend.appspot.com/o/private%2Fusers%2FJgO48yLy0LOxXmaKiQTf2xKQ5AC2%2Fprofile.jpg?alt=media&token=337fcd72-1165-4ad1-ac87-120e924e2998", { responseType: 'blob' });
  }
  resetPassword(mail: string) {
    this.afAuth.auth.sendPasswordResetEmail(mail).then(data => {
      this.showSnackbar('Se ha enviado un correo para recuperar tu contraseña', '', 5000);
      this.router.navigate(['/ingreso']);
    }).catch(function (error) {
      this.showSnackbar('Ocurrió un error, por favor intenta más tarde', '', 3000);
=======
  resetPassword(mail : string){
    this.afAuth.auth.sendPasswordResetEmail(mail).then(function() {
     console.log("SI funciono") // Email sent.
    }).catch(function(error) {
      console.log("no funciono") // Email s// An error happened.
      console.log(error)
>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA
    });
  }
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
    })
  }
  getUserData(uid) {
    return this.db.collection('users').doc(uid).snapshotChanges();
  }
<<<<<<< HEAD
  registerRevista(data) {
=======

  registerRevista(data){
>>>>>>> parent of 60b46f7... Moco Primera entrega COMPLETADA
    return this.db.collection('revista-digital').add(data)
  }
  registerRevistaMocotips(data) {
    return this.db.collection('revista-digital-mocotips').add(data)
  }
  getRevista(key) {
    return this.db.collection('revista-digital', ref => ref.where('key', '==', key)).snapshotChanges()
  }
  getRevistaMocotips(key) {
    return this.db.collection('revista-digital-mocotips', ref => ref.where('key', '==', key)).snapshotChanges()
  }
  updateRevistaDigital(data: revistaDigitalWithoutID, id: string) {
    return this.db.collection('revista-digital').doc(id).update({
      anio: data.anio,
      key: data.key,
      tittle: data.tittle,
      description: data.description,
      numero: data.numero,
      costo: data.costo,
      imagenPrincipal: data.imagenPrincipal,
      idioma: data.idioma
    });
  }
  updateRevistaDigitalMocotips(data: revistaDigitalWithoutID, id: string) {
    return this.db.collection('revista-digital-mocotips').doc(id).update({
      anio: data.anio,
      key: data.key,
      tittle: data.tittle,
      description: data.description,
      numero: data.numero,
      costo: data.costo,
      imagenPrincipal: data.imagenPrincipal,
      idioma: data.idioma
    });
  }

  deleteRevistaDigital(key) {
    this.db.collection('revista-digital').doc(key).delete();
  }
  deleteRevistaDigitalMocotips(key) {
    this.db.collection('revista-digital-mocotips').doc(key).delete();
  }


  registerImagenesPuroCuento(data) {
    return this.db.collection('revista-img-puro-cuento').add(data)
  }
  registerImagenesEcoMoco(data) {
    return this.db.collection('revista-img-eco-moco').add(data)
  }
  registerImagenesSePega(data) {
    return this.db.collection('revista-img-se-pega').add(data)
  }
  registerImagenesHurgaDatos(data) {
    return this.db.collection('revista-img-hurga-datos').add(data)
  }
  registerImagenesEspacio(data) {
    return this.db.collection('revista-img-tu-espacio').add(data)
  }
  registerImagenesBioAventura(data) {
    return this.db.collection('revista-img-bio-aventura').add(data)
  }
  registerImagenesPromos(data) {
    return this.db.collection('revista-img-promos-anuncios').add(data)
  }
  registerImagenesArte(data) {
    return this.db.collection('revista-img-arte-manias').add(data)
  }
  registerImagenesEspecial(data) {
    return this.db.collection('revista-img-especial').add(data)
  }
  registerImagenesDoctor(data) {
    return this.db.collection('revista-img-doctor').add(data)
  }
  registerRevistaPuroCuento(data) {
    return this.db.collection('revista-tips-puro-cuento').add(data)
  }
  registerRevistaEcoMoco(data) {
    return this.db.collection('revista-tips-eco-moco').add(data)
  }
  registerRevistaSePega(data) {
    return this.db.collection('revista-tips-se-pega').add(data)
  }
  registerRevistaHurgaDatos(data) {
    return this.db.collection('revista-tips-hurga-datos').add(data)
  }
  registerRevistaConclusion(data) {
    return this.db.collection('revista-tips-conclusion').add(data)
  }
  registerRevistaIntro(data) {
    return this.db.collection('revista-tips-introduccion').add(data)
  }
  registerRevistaBioAventura(data) {
    return this.db.collection('revista-tips-bio-aventura').add(data)
  }
  registerRevistaArte(data) {
    return this.db.collection('revista-tips-arte-manias').add(data)
  }
  registerRevistaEspecial(data) {
    return this.db.collection('revista-tips-especial').add(data)
  }
  registerRevistaDoctor(data) {
    return this.db.collection('revista-tips-doctor').add(data)
  }
  updateRevistaPuroCuento(contenido: string, tittle: string, id: string) {
    return this.db.collection('revista-tips-puro-cuento').doc(id).update({
      tittle: tittle,
      contenido: contenido
    });
  }
  updateRevistaEcoMoco(contenido: string, tittle: string, id: string) {
    return this.db.collection('revista-tips-eco-moco').doc(id).update({
      tittle: tittle,
      contenido: contenido
    });
  }
  updateRevistaSePega(contenido: string, tittle: string, id: string) {
    return this.db.collection('revista-tips-se-pega').doc(id).update({
      tittle: tittle,
      contenido: contenido
    });
  }
  updateRevistaHurgaDatos(contenido: string, tittle: string, id: string) {
    return this.db.collection('revista-tips-hurga-datos').doc(id).update({
      tittle: tittle,
      contenido: contenido
    });
  }
  updateRevistaConclusion(contenido: string, tittle: string, id: string) {
    return this.db.collection('revista-tips-conclusion').doc(id).update({
      tittle: tittle,
      contenido: contenido
    });
  }
  updateRevistaIntro(contenido: string, tittle: string, id: string) {
    return this.db.collection('revista-tips-introduccion').doc(id).update({
      tittle: tittle,
      contenido: contenido
    });
  }
  updateRevistaBioAventura(contenido: string, tittle: string, id: string) {
    return this.db.collection('revista-tips-bio-aventura').doc(id).update({
      tittle: tittle,
      contenido: contenido
    });
  }
  updateRevistaArte(contenido: string, tittle: string, id: string) {
    return this.db.collection('revista-tips-arte-manias').doc(id).update({
      tittle: tittle,
      contenido: contenido
    });
  }
  updateRevistaEspecial(contenido: string, tittle: string, id: string) {
    return this.db.collection('revista-tips-especial').doc(id).update({
      tittle: tittle,
      contenido: contenido
    });
  }
  updateRevistaDoctor(contenido: string, tittle: string, id: string) {
    return this.db.collection('revista-tips-doctor').doc(id).update({
      tittle: tittle,
      contenido: contenido
    });
  }

  deleteRevistaPuroCuento(key) {
    this.db.collection('revista-tips-puro-cuento').doc(key).delete();
  }
  deleteRevistaEcoMoco(key) {
    this.db.collection('revista-tips-eco-moco').doc(key).delete();
  }
  deleteRevistaSePega(key) {
    this.db.collection('revista-tips-se-pega').doc(key).delete();
  }
  deleteRevistaHurgaDatos(key) {
    this.db.collection('revista-tips-hurga-datos').doc(key).delete();
  }
  deleteRevistaConclusion(key) {
    this.db.collection('revista-tips-conclusion').doc(key).delete();
  }
  deleteRevistaIntro(key) {
    this.db.collection('revista-tips-introduccion').doc(key).delete();
  }
  deleteRevistaBioAventura(key) {
    this.db.collection('revista-tips-bio-aventura').doc(key).delete();
  }
  deleteRevistaArte(key) {
    this.db.collection('revista-tips-arte-manias').doc(key).delete();
  }
  deleteRevistaEspecial(key) {
    this.db.collection('revista-tips-especial').doc(key).delete();
  }
  deleteRevistaDoctor(key) {
    this.db.collection('revista-tips-doctor').doc(key).delete();
  }



  getRevistas() {
    return this.db.collection('revista-digital', ref => ref.orderBy("tittle")).snapshotChanges();
  }
  getRevistasMocotips() {
    return this.db.collection('revista-digital-mocotips', ref => ref.orderBy("tittle")).snapshotChanges();
  }

  validate_email(email) {
    return this.db.collection('users', ref => ref.where('email', '==', email)).snapshotChanges();

  }


  getSeccionPuroCuento(key) {
    return this.db.collection('revista-img-puro-cuento', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionEcoMoco(key) {
    return this.db.collection('revista-img-eco-moco', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionSePega(key) {
    return this.db.collection('revista-img-se-pega', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionHurgaDatos(key) {
    return this.db.collection('revista-img-hurga-datos', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionEspacio(key) {
    return this.db.collection('revista-img-tu-espacio', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionBioAventura(key) {
    return this.db.collection('revista-img-bio-aventura', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionPromos(key) {
    return this.db.collection('revista-img-promos-anuncios', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionArte(key) {
    return this.db.collection('revista-img-arte-manias', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionEspecial(key) {
    return this.db.collection('revista-img-especial', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionDoctor(key) {
    return this.db.collection('revista-img-doctor', ref => ref.where('key', '==', key)).snapshotChanges();
  }


  getSeccionPuroCuentoTips(key) {
    return this.db.collection('revista-tips-puro-cuento', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionEcoMocoTips(key) {
    return this.db.collection('revista-tips-eco-moco', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionSePegaTips(key) {
    return this.db.collection('revista-tips-se-pega', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionHurgaDatosTips(key) {
    return this.db.collection('revista-tips-hurga-datos', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionConclusionTips(key) {
    return this.db.collection('revista-tips-conclusion', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionBioAventuraTips(key) {
    return this.db.collection('revista-tips-bio-aventura', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionIntroTips(key) {
    return this.db.collection('revista-tips-introduccion', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionArteTips(key) {
    return this.db.collection('revista-tips-arte-manias', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionEspecialTips(key) {
    return this.db.collection('revista-tips-especial', ref => ref.where('key', '==', key)).snapshotChanges();
  }
  getSeccionDoctorTips(key) {
    return this.db.collection('revista-tips-doctor', ref => ref.where('key', '==', key)).snapshotChanges();
  }



  getSeccionPuroCuentoImages(key) {
    return this.db.collection('revista-img-puro-cuento').doc(key).snapshotChanges();
  }
  getSeccionEcoMocoImages(key) {
    return this.db.collection('revista-img-eco-moco').doc(key).snapshotChanges();
  }
  getSeccionSePegaImages(key) {
    return this.db.collection('revista-img-se-pega').doc(key).snapshotChanges();
  }
  getSeccionHurgaDatosImages(key) {
    return this.db.collection('revista-img-hurga-datos').doc(key).snapshotChanges();
  }
  getSeccionEspacioImages(key) {
    return this.db.collection('revista-img-tu-espacio').doc(key).snapshotChanges();
  }
  getSeccionBioAventuraImages(key) {
    return this.db.collection('revista-img-bio-aventura').doc(key).snapshotChanges();
  }
  getSeccionPromosImages(key) {
    console.log(key)
    return this.db.collection('revista-img-promos-anuncios').doc(key).snapshotChanges();
  }
  getSeccionArteImages(key) {
    return this.db.collection('revista-img-arte-manias').doc(key).snapshotChanges();
  }
  getSeccionEspecialImages(key) {
    return this.db.collection('revista-img-especial').doc(key).snapshotChanges();
  }
  getSeccionDoctorImages(key) {
    return this.db.collection('revista-img-doctor').doc(key).snapshotChanges();
  }

  delete(id: string): Promise<void> {
    const tutRef = this.db.doc('tutorial');
    return this.db.doc(id).delete();
  }

  deletePromos(key) {

    const deletlist = this.db.collection('revista-img-promos-anuncios', ref => ref.where('key', '==', key))
    deletlist.get().subscribe(delitems => delitems.forEach(doc => doc.ref.delete().then(() => console.log("ola"))));

  }

  deleteSeccionPuroCuento(key) {
    this.db.collection('revista-img-puro-cuento').doc(key).delete();
  }
  deleteSeccionEcoMoco(key) {
    this.db.collection('revista-img-eco-moco').doc(key).delete();
  }
  deleteSeccionSePega(key) {
    this.db.collection('revista-img-se-pega').doc(key).delete();
  }
  deleteSeccionHurgaDatos(key) {
    this.db.collection('revista-img-hurga-datos').doc(key).delete();
  }
  deleteSeccionEspacio(key) {
    this.db.collection('revista-img-tu-espacio').doc(key).delete();
  }
  deleteSeccionBioAventura(key) {
    this.db.collection('revista-img-bio-aventura').doc(key).delete();
  }
  deleteSeccionPromos(key) {
    this.db.collection('revista-img-promos-anuncios').doc(key).delete();
  }
  deleteSeccionArte(key) {
    this.db.collection('revista-img-arte-manias').doc(key).delete();
  }
  deleteSeccionEspecial(key) {
    this.db.collection('revista-img-especial').doc(key).delete();
  }
  deleteSeccionDoctor(key) {
    this.db.collection('revista-img-doctor').doc(key).delete();
  }

}
