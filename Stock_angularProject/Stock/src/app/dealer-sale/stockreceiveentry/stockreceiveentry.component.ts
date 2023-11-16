import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { DealerService } from 'src/app/Services/dealer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stockreceiveentry',
  templateUrl: './stockreceiveentry.component.html',
  styleUrls: ['./stockreceiveentry.component.css']
})
export class StockreceiveentryComponent implements OnInit {
  paymentStatusByFarmeIdDetails: any = [];
  FarmerIdPre: any = '';
  loder: boolean = false;
  showdetails: boolean = false;

  selectedDistName: any = {};
  selectedGodown: any = '';
  selectedFinancialYear: any = '';
  selectedSeasons: any = '';
  selectedReceivedFrom: any = '';
  selectedOutsideAgencies: any = '';
  selectedWayBillNumber: any = '';
  selecteddate: any = '';
  selectedChallanNumber: any = '';
  selectedAgencyName: any = '';
  selectedScheme: any = '';
  selectedMouAgencyName: any = '';
  selectedCropCatagory: any = '';
  selectedCrop: any = '';
  selectedClass: any = '';
  CropClass: any = '';
  selectedIndex1: number | undefined;

  getGodownLIst: any = [];
  allFillFinYr: any = [];
  allFillSeason: any = [];
  getAgencyList: any = [];
  getOutSideAgencyList: any = [];
  getDepartmentalFarmAgencyList: any = [];
  getMouFarmAgencyList: any = [];
  getAllCropCategory: any = [];
  getAllCrop: any = [];
  getAllVarietyList: any = [];

  outsideagency: boolean = false;
  departmentalFarm: boolean = false;
  coomonDiv: boolean = false;
  mouAgencyName: boolean = false;
  Scheme: boolean = false;
  proceedButtonClick: boolean = false;
  showBuuton: boolean = true;


  constructor(
    private service: DealerService,
    private toastr: ToastrService

  ) {

  }

  ngOnInit(): void {
    this.getSupplyType();
    this.FillGoDownByDistCodeUserType();
    this.FillFinYr();
    this.FillAgencyByOSSC();
  }
  getSupplyType() {
    this.service.GetDistCodeFromDist().subscribe(data => {
      this.selectedDistName = data;
    })
  }
  FillGoDownByDistCodeUserType() {
    this.getGodownLIst = [];
    this.service.FillGoDownByDistCodeUserType().subscribe(data => {
      this.getGodownLIst = data;
      console.log(this.getGodownLIst);

      // this.selectedDistName = data;      
    })
  }
  FillFinYr() {
    this.allFillFinYr = []
    this.service.FillFinYr().subscribe(data => {
      this.allFillFinYr = data;
      this.selectedFinancialYear = this.allFillFinYr[0].FIN_YR;
      this.FillSeason();
    })
  }
  FillSeason() {
    this.allFillSeason = []
    this.service.FillSeason(this.selectedFinancialYear).subscribe(data => {
      this.allFillSeason = data;
      this.selectedSeasons = this.allFillSeason[0];
      console.log(this.selectedSeasons);

    })
  }
  FillAgencyByOSSC() {
    this.getAgencyList = [];
    this.service.FillAgencyByOSSC().subscribe(data => {
      this.getAgencyList = data;
      console.log(this.getAgencyList);

      // this.selectedDistName = data;      
    })
  }
  RecvedFromChanges() {
    this.getOutSideAgencyList = [];
    this.selectedOutsideAgencies = '';
    this.selectedWayBillNumber = '';
    this.selecteddate = '';
    this.selectedChallanNumber = '';
    this.selectedAgencyName = '';
    this.selectedScheme = '';
    this.selectedMouAgencyName = '';
    console.log(this.selectedReceivedFrom);
    if (this.selectedReceivedFrom.AgenciesID == '02') {
      this.outsideagency = true;
      this.departmentalFarm = false;
      this.coomonDiv = true;
      this.mouAgencyName = false;
      this.Scheme = false;
      this.service.FillSourceByAgencyIdUserTypeValues(this.selectedReceivedFrom.AgenciesID).subscribe(data => {
        this.getOutSideAgencyList = data;
      })
    }
    else if (this.selectedReceivedFrom.AgenciesID == '05' || this.selectedReceivedFrom.AgenciesID == '06') {
      this.outsideagency = false;
      this.departmentalFarm = true;
      this.coomonDiv = true;
      this.mouAgencyName = false;
      this.Scheme = false;
      this.getDepartmentalFarmAgencyList = [];
      this.service.FillGovtFarmByDistCode(this.selectedReceivedFrom.AgenciesID).subscribe(data => {
        this.getDepartmentalFarmAgencyList = data;
      })
    }
    else if (this.selectedReceivedFrom.AgenciesID == '04') {
      this.outsideagency = false;
      this.departmentalFarm = false;
      this.coomonDiv = true;
      this.mouAgencyName = false;
      this.Scheme = false;
    }

    else if (this.selectedReceivedFrom.AgenciesID == '09') {
      this.outsideagency = false;
      this.departmentalFarm = false;
      this.coomonDiv = true;
      this.mouAgencyName = true;
      this.Scheme = false;
      this.service.FillGovtFarmByDistCode(this.selectedReceivedFrom.AgenciesID).subscribe(data => {
        this.getMouFarmAgencyList = data;
      })
    }
    else if (this.selectedReceivedFrom.AgenciesID == '10') {
      this.outsideagency = false;
      this.departmentalFarm = true;
      this.coomonDiv = true;
      this.mouAgencyName = false;
      this.Scheme = true;
    }
  }
  agencyNameReload() {
    this.selectedAgencyName = '';
    this.getDepartmentalFarmAgencyList = [];
    this.service.agencyNameReload(this.selectedScheme).subscribe(data => {
      this.getDepartmentalFarmAgencyList = data;
    })
  }
  proceed() {
    this.proceedButtonClick = true;
    this.showBuuton = false;
    this.FillCropCategory();
  }
  cancel() {
    window.location.reload();
  }

  FillCropCategory() {
    this.service.FillCropCategory().subscribe(data => {
      this.getAllCropCategory = data;
    })
  }
  FillCropByCategoryId() {
    console.log(this.selectedCropCatagory);

    this.service.FillCropByCategoryId(this.selectedCropCatagory.Category_Code).subscribe(data => {
      this.getAllCrop = data;
    })
  }
  FillCropVariety() {
    if (this.selectedCropCatagory && this.selectedCrop && this.selectedClass) {
      if (this.selectedClass == "Foundation") {
        this.CropClass = "C01";
      }
      else if (this.selectedClass == "TL") {
        this.CropClass = "C02";
      }
      else if (this.selectedClass == "Certified") {
        this.CropClass = "C03";
      }
      else if (this.selectedClass == "Breeder") {
        this.CropClass = "C04";
      }
      console.log(this.selectedReceivedFrom.AgenciesID, this.selectedMouAgencyName);

      this.getAllVarietyList = [];

      if (this.selectedReceivedFrom.AgenciesID == '02' || this.selectedReceivedFrom.AgenciesID == '04') {
        this.service.FillCropVarietyByOutsideAgencies(this.selectedCrop.Crop_Code).subscribe(data => {
          this.getAllVarietyList = data;

          console.log(this.getAllVarietyList);
        })
      }
      else if (this.selectedReceivedFrom.AgenciesID == '05') {
        this.service.FillCropVarietyByGovtFarm(this.selectedAgencyName.Name_of_agency, this.CropClass, this.selectedCrop.Crop_Code).subscribe(data => {
          this.getAllVarietyList = data;
          console.log(this.getAllVarietyList);

        })
      }
      else if (this.selectedReceivedFrom.AgenciesID == '06') {
        this.service.FillCropVarietyByOUAT(this.selectedAgencyName.Name_of_agency, this.CropClass, this.selectedCrop.Crop_Code).subscribe(data => {
          this.getAllVarietyList = data;
          console.log(this.getAllVarietyList);
        })
      }
      else if (this.selectedReceivedFrom.AgenciesID == '09') {
        this.service.FillCropVarietyByMOUAgency(this.selectedMouAgencyName.Name_of_agency, this.CropClass, this.selectedCrop.Crop_Code).subscribe(data => {
          this.getAllVarietyList = data;
          console.log(this.getAllVarietyList);
        })
      }
      else if (this.selectedReceivedFrom.AgenciesID == '10') {
        this.service.FillCropVarietyByCropIdScheme(this.selectedScheme, this.CropClass, this.selectedCrop.Crop_Code, this.selectedAgencyName.Name_of_agency).subscribe(data => {
          this.getAllVarietyList = data;
          console.log(this.getAllVarietyList);
        })
      }
    }


  }
  changeSelection1(event: any, index: any, value: any) {
    this.selectedIndex1 = event.target.checked ? index : undefined;
    if (this.selectedIndex1 != undefined) {
      this.getAllVarietyList.forEach((x: any) => {
        if (x.Lot_No == this.getAllVarietyList[index].Variety_Code) {
          x.ischeacked = false;
          // x.enteredNoOfBags = this.selectedEnterNoofBags;
          // this.changequnital(value.Bag_Size_In_kg, value.enteredNoOfBags, index, value.All_in_cost_Price);
          // this.inputfiled = false;
        }
        else if (x.Lot_No != this.getAllVarietyList[index].Variety_Code) {
          x.ischeacked = true;
          x.enteredNoOfBags = '';
          x.QunitalinQtl = 0.00;
          x.Amount = 0.00;
          // this.inputfiled = false;
        }

      });

    }
    else {
      this.getAllVarietyList.forEach((x: any) => {
        x.ischeacked = true;
        x.enteredNoOfBags = '';
        // this.changequnital(value.BAG_SIZE_IN_KG, 0, index, value.All_in_cost_Price);
        // this.inputfiled = true;
      });
    }


  }
}