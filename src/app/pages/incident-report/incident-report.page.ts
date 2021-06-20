import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ApiService } from './../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from './../../services/storage.service';

@Component({
  selector: 'app-incident-report',
  templateUrl: './incident-report.page.html',
  styleUrls: ['./incident-report.page.scss'],
})
export class IncidentReportPage implements OnInit {
  incidentForm: FormGroup;
  user: any;
  constructor(
    private camera: Camera,
    private file: File,
    private API: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private storage: StorageService
  ) { }

  async ngOnInit() {
    this.incidentForm = this.fb.group({
      incidentLocation: ['', [Validators.required]],
      incidentDetails: ['', [Validators.required]]
    });
    this.user = JSON.parse(await this.storage.get('user'));
  }

  async pickImage() {
    try {
      const options: CameraOptions = {
        quality: 80,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.ALLMEDIA,
        sourceType : this.camera.PictureSourceType.PHOTOLIBRARY
      };

      let cameraInfo = await this.camera.getPicture(options);
      let blobInfo = await this.makeFileIntoBlob(cameraInfo);
      let uploadInfo: any = await this.API.uploadToFirebase(blobInfo);
      console.log('File Upload Success', uploadInfo.fileName);
      alert("File Upload Success " + uploadInfo.fileName);
    } catch (e) {
      console.log(e.message);
      alert("File Upload Error " + e.message);
    }
  }

  // FILE STUFF
  makeFileIntoBlob(imagePath) {
    return new Promise((resolve, reject) => {
      let fileName = '';
      this.file
        .resolveLocalFilesystemUrl(imagePath)
        .then(fileEntry => {
          let { name, nativeURL } = fileEntry;

          // get the path..
          let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
          console.log("path", path);
          console.log("fileName", name);

          fileName = name;

          // we are provided the name, so now read the file into
          // a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          let imgBlob = new Blob([buffer], {
            type: "image/jpeg"
          });
          console.log(imgBlob.type, imgBlob.size);
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

  async submitIncident() {
    const formDetails = this.incidentForm.value;
    console.log(formDetails);
    
    this.API.addIncident(
      {
        ...formDetails,
        photoUrl: '',
        email: this.user.email,
        status: 'active'
      }
    ).then(res => {
      console.log('new document added', res);
      this.incidentForm.reset();
      this.router.navigateByUrl('tabs/home');
    }).catch(error => {
      console.log('error', error);
    })
  }
}
