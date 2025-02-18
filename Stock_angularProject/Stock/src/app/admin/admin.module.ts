import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CurrentstockpositionComponent } from './reports/currentstockposition/currentstockposition.component';
import { StatestockpositionComponent } from './reports/statestockposition/statestockposition.component';
import { VarietywiseliftComponent } from './reports/varietywiselift/varietywiselift.component';
import { VarietysearchComponent } from './reports/varietysearch/varietysearch.component';
import { FarmersaleComponent } from './reports/farmersale/farmersale.component';
import { DealerpacssaleComponent } from './reports/dealerpacssale/dealerpacssale.component';
import { ComponentwisesubsidySalecomponentComponent } from './reports/componentwisesubsidy-salecomponent/componentwisesubsidy-salecomponent.component';
import { PaymentdetailsComponent } from './reports/paymentdetails/paymentdetails.component';
import { CumulativetransactiondatewiseComponent } from './reports/cumulativetransactiondatewise/cumulativetransactiondatewise.component';
import { DistwisePACSDetailsComponent } from './reports/distwise-pacsdetails/distwise-pacsdetails.component';
import { DealerPACSReceiveComponent } from './reports/dealer-pacsreceive/dealer-pacsreceive.component';
import { SchemeWiseConsolidatedComponent } from './reports/scheme-wise-consolidated/scheme-wise-consolidated.component';
import { InputSubsidyComponent } from './reports/input-subsidy/input-subsidy.component';
import { SchemewiseSubsidyUtilisedComponent } from './reports/schemewise-subsidy-utilised/schemewise-subsidy-utilised.component';
import { DealerpacspaymentComponent } from './reports/dealerpacspayment/dealerpacspayment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FarmerdetailscheckComponent } from './reports/farmerdetailscheck/farmerdetailscheck.component';
import { DailyProgressReportComponent } from './reports/daily-progress-report/daily-progress-report.component';
import { PfmsstatusComponent } from './reports/pfmsstatus/pfmsstatus.component';
import { DistwisestockdetailsComponent } from './reports/distwisestockdetails/distwisestockdetails.component';
import { BlockwisestockdetailsComponent } from './reports/distwisestockdetails/blockwisestockdetails/blockwisestockdetails.component';
import { SchemewisedetailsComponent } from './reports/schemewisedetails/schemewisedetails.component';
import { DealerwisesaledetailsComponent } from './reports/dealerwisesaledetails/dealerwisesaledetails.component';
import { PfmstransactiondetailsComponent } from './reports/pfmstransactiondetails/pfmstransactiondetails.component';
import { SubsidyinvolovementComponent } from './reports/subsidyinvolovement/subsidyinvolovement.component';
import { ResetpasswordComponent } from './reports/resetpassword/resetpassword.component';
import { PrebookingdashboardComponent } from './reports/prebookingdashboard/prebookingdashboard.component';
import { ErupidashboardComponent } from './erupidashboard/erupidashboard.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CurrentstockpositionComponent,
    StatestockpositionComponent,
    VarietywiseliftComponent,
    VarietysearchComponent,
    FarmersaleComponent,
    DealerpacssaleComponent,
    ComponentwisesubsidySalecomponentComponent,
    PaymentdetailsComponent,
    CumulativetransactiondatewiseComponent,
    DistwisePACSDetailsComponent,
    DealerPACSReceiveComponent,
    SchemeWiseConsolidatedComponent,
    InputSubsidyComponent,
    SchemewiseSubsidyUtilisedComponent,
    DealerpacspaymentComponent,
    FarmerdetailscheckComponent,
    DailyProgressReportComponent,
    PfmsstatusComponent,
    DistwisestockdetailsComponent,
    BlockwisestockdetailsComponent,
    SchemewisedetailsComponent,
    DealerwisesaledetailsComponent,
    PfmstransactiondetailsComponent,
    SubsidyinvolovementComponent,
    ResetpasswordComponent,
    PrebookingdashboardComponent,
    ErupidashboardComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    NgxPrintModule,
    NgxSpinnerModule,
  ]
})
export class AdminModule { }
