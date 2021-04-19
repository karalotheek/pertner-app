import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  defaultUrl = 'https://theekkaralo.com/';

  constructor(private meta: Meta, private title: Title) { }

  updateMetaTag(data) {
    if (data) {
      this.meta.updateTag({ name: 'title', content: data.sTitle });
      this.meta.updateTag({ name: 'description', content: data.sDesc });
      this.meta.updateTag({ name: 'keywords', content: data.sWords });
      this.meta.updateTag({ name: 'author', content: 'Theek Karalo' });
      this.meta.updateTag({ name: 'og:description', content: data.sDesc });
      this.meta.updateTag({ name: 'og:keywords', content: data.sWords });
      this.meta.updateTag({ name: 'og:author', content: 'Theek Karalo' });
      this.meta.updateTag({ name: 'og:url', content: window.location.href || this.defaultUrl });
      this.title.setTitle(data.sTitle);
    } else {
      this.meta.updateTag({ name: 'description', content: 'Best home services are here. Cleaning, Plumbing, Electrical, Painting & Refurbishment, Pinting, Carpentry, Interior &Exterior Designing, Electrical Home Appliances, Automobile Engineering Works' });
      this.meta.updateTag({ name: 'keywords', content: 'Best home services are here. Cleaning, Plumbing, Electrical, Painting & Refurbishment, Pinting, Carpentry, Interior &Exterior Designing, Electrical Home Appliances, Automobile Engineering Works' });
      this.meta.updateTag({ name: 'author', content: 'Theek Karalo' });
      this.meta.updateTag({ name: 'title', content: 'Theek Karalo | Anything | Anywhere' });
      this.title.setTitle('Theek Karalo | Anything | Anywhere');
      this.meta.updateTag({ name: 'og:description', content: 'Best home services are here. Cleaning, Plumbing, Electrical, Painting & Refurbishment, Pinting, Carpentry, Interior &Exterior Designing, Electrical Home Appliances, Automobile Engineering Works' });
      this.meta.updateTag({ name: 'og:keywords', content: 'Best home services are here. Cleaning, Plumbing, Electrical, Painting & Refurbishment, Pinting, Carpentry, Interior &Exterior Designing, Electrical Home Appliances, Automobile Engineering Works' });
      this.meta.updateTag({ name: 'og:url', content: this.defaultUrl });
      this.meta.updateTag({ name: 'og:author', content: 'Theek Karalo' });
    }
  }
}