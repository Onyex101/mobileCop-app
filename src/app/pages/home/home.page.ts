import { AuthenticationService } from './../../services/authentication.service';
import { Router } from '@angular/router';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { StorageService } from './../../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user: any;
  activateButton = true;
  constructor(
    private api: ApiService,
    private router: Router,
    private auth: AuthenticationService,
    private storage: StorageService
  ) { }

  incidents$ = this.api.getIncidents$;

  async ngOnInit() {
    try {
      this.user = JSON.parse(await this.storage.get('user'));
      console.log('user', this.user.email);
    } catch (error) {
      console.log('error', error);
    }
  }

  openProfile() {
    this.router.navigateByUrl('/profile');
  }

  openMap(pos) {
    this.api.updateLocation(pos);
    this.router.navigateByUrl('/tabs/map');
  }

  async sendAlert() {
    if (this.activateButton) {
      try {
        const res = await this.api.addIncident({
          photoUrl: '',
          incidentDetails: 'Emergency response needed',
          incidentLocation: '',
          email: this.user.email,
          status: 'pending'
        });
        console.log('new incident added', res);
        this.activateButton = false;
        setTimeout(() => {
          this.activateButton = true;
        }, 300000) // 300000 milliseconds === 5 minutes
      } catch (error) {
        console.log('error', error);
      }
    }
  }

  logOut() {
    this.auth.SignOut();
 }

//  loadBatch() {
//    this.api.saveBatch();
//  }

}
