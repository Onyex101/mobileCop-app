import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ApiService } from './../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from './../../services/storage.service';
import { AngularFireStorage } from "@angular/fire/storage"
import { AlertController } from '@ionic/angular';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
@Component({
  selector: 'app-incident-report',
  templateUrl: './incident-report.page.html',
  styleUrls: ['./incident-report.page.scss'],
})
export class IncidentReportPage implements OnInit {
  incidentForm: FormGroup;
  user: any;
  base64Image: string;
  selectedFile: File = null;
  downloadURL: Observable<string>;
  picUrl = '';
  constructor(
    private camera: Camera,
    private API: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private storage: StorageService,
    private af: AngularFireStorage,
    private alertCtrl: AlertController,
  ) { }

  async ngOnInit() {
    this.incidentForm = this.fb.group({
      incidentLocation: ['', [Validators.required]],
      incidentDetails: ['', [Validators.required]]
    });
    this.user = JSON.parse(await this.storage.get('user'));
  }

  async takePhoto(sourceType: number) {
    const options: CameraOptions = {
      quality: 95,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType
    };
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
      // console.error(err);
    });
  }

  upload(): void {
    var currentDate = Date.now();
    const file: any = this.base64ToImage(this.base64Image);
    const filePath = `Images/${currentDate}`;
    const fileRef = this.af.ref(filePath);

    const task = this.af.upload(`Images/${currentDate}`, file);
    task.snapshotChanges()
      .pipe(finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(downloadURL => {
          if (downloadURL) {
            this.showSuccesfulUploadAlert();
          }
          // console.log('downloadURL', downloadURL);
          this.picUrl = downloadURL;
        });
      })
      )
      .subscribe(url => {
        if (url) {
          // console.log('url', url);
        }
      });
  }

  async showSuccesfulUploadAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'basic-alert',
      header: 'Uploaded',
      subHeader: 'Image uploaded successful to Firebase storage',
      buttons: ['OK']
    });
    await alert.present();
  }

  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }

  async submitIncident() {
    const formDetails = this.incidentForm.value;
    // console.log(formDetails);

    this.API.addIncident(
      {
        ...formDetails,
        photoUrl: this.picUrl,
        email: this.user.email,
        status: 'active'
      }
    ).then(res => {
      // console.log('new document added', res);
      this.incidentForm.reset();
      this.picUrl = '';
      this.base64Image = '';
      this.router.navigateByUrl('tabs/home');
    }).catch(error => {
      // console.log('error', error);
    })
  }
}
