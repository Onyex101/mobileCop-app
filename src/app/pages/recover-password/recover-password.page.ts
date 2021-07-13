import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
})
export class RecoverPasswordPage implements OnInit {
  credentials: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  async send() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.authService.PasswordRecover(this.credentials.value.email).then(async (res) => {
      await loading.dismiss();        
      this.router.navigateByUrl('/login', { replaceUrl: true });
    })
    .catch(async (err) => {
      await loading.dismiss();
      console.log('error', err);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: err.message,
        buttons: ['OK'],
      });
      await alert.present();
    })
  }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }
}
