import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class SeoServiceService {

 constructor(private meta: Meta) { }
    generateTags(config) {
      // default values
     
     
      this.meta.updateTag({ property: 'og:description', content: config.description });

  }
}