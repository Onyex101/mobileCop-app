import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async signUp() {
    console.log('credentials', this.credentials.value);
    if (this.credentials.value.password !== this.credentials.value.confirmPassword) {
      const alert = await this.alertCtrl.create({
        header: 'Invalid parameter',
        message: 'password and confirm password fields do not match',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      try {
        const regUser = await this.authService.RegisterUser(this.credentials.value.email, this.credentials.value.password);
        await this.authService.SendVerificationMail();
        console.log('res', regUser);
        await loading.dismiss();        
        await this.registerAlert();
      } catch (error) {
        await loading.dismiss();
        console.log('error', error);
        const alert = await this.alertCtrl.create({
          header: 'Registration failed',
          message: error.message,
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }
  
  get password() {
    return this.credentials.get('password');
  }

  get confirmPassword() {
    return this.credentials.get('confirmPassword');
  }

  async registerAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      message: 'Please check your inbox to verify your email before login.',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
    this.credentials.reset();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
