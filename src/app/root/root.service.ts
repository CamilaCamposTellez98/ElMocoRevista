import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RootService {

  public url: any = null;
  public baseUrl = '';
  constructor(private http: HttpClient) {

    const host = window.location.hostname;
    if (host.indexOf('angularelmocodeploy.firebaseapp.com') > -1) {
      this.baseUrl = 'https://expresselmocodeploy.firebaseapp.com/hello-cached';
    }
    else {
      this.baseUrl = 'https://expresselmocodeploy.firebaseapp.com';
    }
  }

  testRequest() {
    return this.http.get('https://jsonplaceholder.typicode.com/users')
  }
  connectionBack(testScript) {
    return this.http.get(this.baseUrl + '/hello-cached');
  }
}
