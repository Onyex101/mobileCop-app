import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { StorageService } from './../../services/storage.service';
import { INTRO_KEY } from 'src/app/guards/intro.guard';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  @ViewChild(IonSlides)slides: IonSlides;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    spaceBetween: 25
  };

  constructor(private router: Router, private storage: StorageService) { }

  ngOnInit() {
  }

  next() {
    this.slides.slideNext();
  }

  async start() {
    const val = await this.storage.set(INTRO_KEY, true);
    console.log('val', val);
    this.router.navigateByUrl('/login', {replaceUrl: true});
  }

}
