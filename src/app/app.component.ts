import { Component } from '@angular/core';
import { RootService } from 'src/app/root/root.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularMoco';
  response : any = [];
  constructor(public rootService: RootService) {

  }
  backendTest(){
    console.log('Este es el test con el backend');
    this.rootService.connectionBack('este es el script').subscribe((res => {
    this.response = res;
    console.log('** Respuesta **');
    console.log(this.response);
    }));

  }
  
}

