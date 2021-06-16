import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidentReportPageRoutingModule } from './incident-report-routing.module';

import { IncidentReportPage } from './incident-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IncidentReportPageRoutingModule
  ],
  declarations: [IncidentReportPage]
})
export class IncidentReportPageModule {}
