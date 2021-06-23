import { Component, OnDestroy, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy{
  private connectSubscription: any;
  constructor(private network: Network) {}

  ngOnInit() {
    console.log('network connected!');
    // watch network for a connection
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        console.log('we got a connection, woohoo!', this.network.type);
      }, 3000);
    });
  }

  ngOnDestroy(): void {
    // stop connect watch
    this.connectSubscription.unsubscribe();
  }
}
