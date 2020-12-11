import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RootComponent } from './root/root.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule} from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { NavbarComponent } from './navbar/navbar.component';
import { NewsComponent } from './news/news.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { HistoriaComponent } from './historia/historia.component';
import { MocoShopComponent } from './moco-shop/moco-shop.component';
import { MocoAppComponent } from './moco-app/moco-app.component';
import { RevistaTrimestralComponent } from './revista-trimestral/revista-trimestral.component';
import { MocotipsPadresComponent } from './mocotips-padres/mocotips-padres.component';
import { ContactanosComponent } from './contactanos/contactanos.component';
import { PanelAdminComponent } from './panel-admin/panel-admin.component';


import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table'; 
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {QuillModule} from 'ngx-quill';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NuestroEquipoComponent } from './nuestro-equipo/nuestro-equipo.component';
import { TerminosComponent } from './terminos/terminos.component';
import { AvisosComponent } from './avisos/avisos.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EspecialMesComponent } from './especial-mes/especial-mes.component';
import { IngresoComponent } from './ingreso/ingreso.component';
//firebase
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

//Services
import { NoticiasService } from './services/noticias.service';
import { AuthService } from './services/auth.service';
import { from } from 'rxjs';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { AngularResizedEventModule } from 'angular-resize-event';
import { CookieService } from 'ngx-cookie-service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { BuscadorComponent } from './buscador/buscador.component';
import { SuscribeteComponent } from './suscribete/suscribete.component';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { SuscripcionesComponent } from './suscripciones/suscripciones.component';



const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home' , component: NavbarComponent},
  { path: 'news' , component: NewsComponent},
  { path: 'quienes-somos' , component: QuienesSomosComponent},
  { path: 'historia' , component: HistoriaComponent},
  { path: 'moco-shop' , component: MocoShopComponent},
  { path: 'moco-app' , component: MocoAppComponent},
  { path: 'revista-trimestral' , component: RevistaTrimestralComponent},
  { path: 'mocotips-padres' , component: MocotipsPadresComponent},
  { path: 'contactanos' , component: ContactanosComponent},
  { path: 'panel-admin' , component: PanelAdminComponent},
  { path: 'nuestro-equipo' , component: NuestroEquipoComponent},
  { path: 'terminos' , component: TerminosComponent},
  { path: 'avisos' , component: AvisosComponent},
  { path: 'especial-mes' , component: EspecialMesComponent},
  { path: 'ingreso' , component: IngresoComponent},
  { path: 'suscribete' , component: SuscribeteComponent},
  { path: 'buscador' , component: BuscadorComponent},
  { path: 'editar-perfil' , component: EditarPerfilComponent},
  { path: 'suscripciones' , component: SuscripcionesComponent},
];
  
@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    NavbarComponent,
    NewsComponent,
    QuienesSomosComponent,
    HistoriaComponent,
    MocoShopComponent,
    MocoAppComponent,
    RevistaTrimestralComponent,
    MocotipsPadresComponent,
    ContactanosComponent,
    PanelAdminComponent,
    NuestroEquipoComponent,
    TerminosComponent,
    AvisosComponent,
    EspecialMesComponent,
    SafeHtmlPipe,
    SafeUrlPipe,
    IngresoComponent,
    BuscadorComponent,
    SuscribeteComponent,
    EditarPerfilComponent,
    SuscripcionesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatIconModule,
    MatRadioModule,
    MatListModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatCheckboxModule,
    QuillModule.forRoot(),
    ReactiveFormsModule,
    CKEditorModule,
    NgbModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularResizedEventModule,
    AngularFireAuthModule,
    NgxCaptchaModule,
    RouterModule.forRoot(routes, {useHash: true, scrollPositionRestoration: 'top'})
  ],
  providers: [
    NoticiasService,
    CookieService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
