import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidentReportPage } from './incident-report.page';

const routes: Routes = [
  {
    path: '',
    component: IncidentReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentReportPageRoutingModule {}
