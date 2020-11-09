import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NoticiasService } from '../services/noticias.service';
import { noticiasNodoGeneral } from '../models/noticiasNodoGeneral';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})

export class BuscadorComponent implements OnInit {

  userPicture : string = "";
  userName : string = "";
  Moconauta : string = "MOCONAUTA ";
  Ingreso : string = "INGRESO"
  busqueda : string = "";
  noticiasNodoGeneralList: noticiasNodoGeneral[];
  displayedColumns: string[] = [ 'tittle'];
  dataSource = new MatTableDataSource(this.noticiasNodoGeneralList);
  constructor(private cookie: CookieService, public noticiasService: NoticiasService, public router: Router) { }

  ngOnInit(): void {
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
    this.noticiasService.getAllNewsNodoGeneral(100000).snapshotChanges().subscribe(item => {
      this.noticiasNodoGeneralList = [];
      item.slice().reverse().forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        this.noticiasNodoGeneralList.push(json as noticiasNodoGeneral);
      });

      this.dataSource = new MatTableDataSource(this.noticiasNodoGeneralList);
      console.log(this.noticiasNodoGeneralList)
    });
  }
  redirectTo(){
    this.router.navigate(['/home'])
    .then(() => {
      window.location.reload();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
