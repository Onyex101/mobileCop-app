import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';

import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      // {
      //   path: 'settings',
      //   loadChildren: () => import('../settings/settings.module').then( m => m.SettingsPageModule)
      // },
      {
        path: 'incident-report',
        loadChildren: () => import('../incident-report/incident-report.module').then( m => m.IncidentReportPageModule)
      },
      {
        path: 'map',
        loadChildren: () => import('../map/map.module').then( m => m.MapPageModule)
      }
    ]
  },
  {
    path: 'tabs',
    redirectTo: '/tabs/home'
  }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
