import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/Services/admin.service';
import { groupBy, map, mergeMap, toArray } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-varietywiselift',
  templateUrl: './varietywiselift.component.html',
  styleUrls: ['./varietywiselift.component.css']
})
export class VarietywiseliftComponent implements OnInit {
  SelectedFinancialYear: any = [];
  SelectedSeason: any = '';
  SelectedUserType: any = 'OSSC';
  SelectedDistrict: any = ''
  SelectedCrop: any = [];
  selectedToDate: any = '';
  selectedFromDate: any = '';
  SelectedMonth: any = '0';
  maxdate: any;
  mindate: any;

  getAllCrop: any = [];
  getAllCatagory: any = [];
  getAllFinYr: any = [];
  getAllDistrict: any = [];
  stateStockPositionData: any = [];
  showpage: boolean = false;

  invoiceItems: any = [];
  invoiceItems1: any = []
  invoiceItems2: any = [];
  sumByVarietyCode: any = {};
  sumByVarietyCode1: any = {};
  resultArray: any = [];
  dataByCropVerid: any = {};
  latestarray: any = [];
  cropVeridMap: any = {};
  distinctVarieties: any = {};
  distinctVarietyArray: any = [];
  distinctDistrict: any = {};
  distinctDistrictArray: any = [];
  alldata: any = [];
  colorClasses: string[] = ['color1', 'color2', 'color3'];
  sumArray: number[] = [];
  invoiceItems3: any = [];
  sumTotalDealerSale: any = 0.00;
  sumTotalPACSSale: any = 0.00;
  sumTotalTotalSale: any = 0.00;
  fileName: any = '';
  constructor(
    private fb: FormBuilder,
    private service: AdminService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.FillFinYr();
    this.maxdate = this.getDate();
    this.FillDistrict();
    this.FillCategoryId();

  }
  private getDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  mindatecal() {
    this.selectedToDate = '';
    const today = new Date(this.selectedFromDate);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.mindate = year + '-' + month + '-' + day;

  }
  FillFinYr() {
    this.getAllFinYr = []
    this.service.allFillFinYr().subscribe(data => {
      this.getAllFinYr = data;
    })
  }
  FillCategoryId() {
    this.getAllCrop = []
    this.service.FillCategoryId().subscribe(data => {
      this.getAllCrop = data;
    })
  }
  FillDistrict() {
    this.getAllDistrict = []
    this.service.FillDistrict().subscribe(data => {
      this.getAllDistrict = data;
      this.getAllDistrict.unshift({
        Dist_Code: 0, Dist_Name: 'All'
      });
      this.SelectedDistrict = this.getAllDistrict[0].Dist_Code
    })
  }
  transformData(dealerwisedata: any): Observable<any[]> {
    return from(dealerwisedata).pipe(
      groupBy((item: any) => item.Dist_Code),
      mergeMap((group) => group.pipe(
        map((item) => item),
        toArray()
      )),
      toArray()
    );
  }
  getVarietywiseLift() {
    this.stateStockPositionData = [];
    this.invoiceItems = [];
    this.invoiceItems1 = [];
    this.alldata = [];
    this.distinctVarieties = [];
    this.sumArray = [];
    this.sumTotalDealerSale = 0.00;
    this.sumTotalPACSSale = 0.00;
    this.sumTotalTotalSale = 0.00;
    this.distinctVarietyArray=[];
    this.distinctDistrictArray=[];
    this.stateStockPositionData=[];
    this.invoiceItems=[];
    this.sumArray=[];
    this.invoiceItems3=[];
    this.distinctDistrict=[];
    
    if (this.SelectedFinancialYear !== null && this.SelectedFinancialYear !== '' && this.SelectedFinancialYear !== undefined
      && this.SelectedSeason !== null && this.SelectedSeason !== '' && this.SelectedSeason !== undefined
      && this.SelectedCrop !== null && this.SelectedCrop !== '' && this.SelectedCrop !== undefined && this.SelectedCrop.length > 0 
      && this.SelectedUserType !== null && this.SelectedUserType !== '' && this.SelectedUserType !== undefined
      && this.SelectedDistrict !== null && this.SelectedDistrict !== '' && this.SelectedDistrict !== undefined
      && this.SelectedMonth !== null && this.SelectedMonth !== '' && this.SelectedMonth !== undefined) {
      // this.spinner.show();

      let data = {
        SelectedFinancialYear: this.SelectedFinancialYear,
        SelectedSeason: this.SelectedSeason,
        SelectedUserType: this.SelectedUserType,
        SelectedCrop: this.SelectedCrop,
        selectedFromDate: this.selectedFromDate,
        selectedToDate: this.selectedToDate,
        SelectedDistrict: this.SelectedDistrict,
        SelectedMonth: this.SelectedMonth
      }
      this.service.getVarietywiseLift(data).subscribe(data => {
        this.stateStockPositionData = data;
        if (this.stateStockPositionData.length > 0) {


          this.transformData(this.stateStockPositionData).subscribe((margeList) => {
            // margeList will contain the grouped and transformed data
            this.invoiceItems = margeList;


            const addMissingVarieties = (sourceArray: any, targetArrays: any) => {
              sourceArray.forEach((item: any) => {
                const varietyCode = item.CROP_VERID;
                const Type = item.Type;

                let foundInAnyArray = false;

                targetArrays.forEach((targetArray: any, index: number) => {
                  const existsInTarget = targetArray.some((targetItem: any) => targetItem.CROP_VERID === varietyCode && targetItem.Type === Type);
                  if (!existsInTarget) {
                    const newVariety = {
                      ...item,
                      sale: 0,
                      Dist_Name: targetArray[0].Dist_Name,
                      Dist_Code: targetArray[0].Dist_Code,
                    };
                    targetArray.push(newVariety);
                    foundInAnyArray = true;
                  }
                });

                if (!foundInAnyArray) {
                  const newArray = [
                    {
                      ...item,
                      sale: 0,
                      Dist_Name: '',
                      Dist_Code: '',
                    },
                  ];

                  targetArrays.push(newArray);
                }
              });
            };

            for (let i = 0; i < margeList.length; i++) {
              const currentArray = margeList[i];
              const otherArrays = [...margeList.slice(0, i), ...margeList.slice(i + 1)];
              addMissingVarieties(currentArray, otherArrays);
            }
            this.invoiceItems1 = margeList;

            const groupedData = new Map<string, any[]>();

            this.invoiceItems1.forEach((item: any) => {
              const cropVerid = item.CROP_VERID;

              if (!groupedData.has(cropVerid)) {
                groupedData.set(cropVerid, []);
              }
              const group = groupedData.get(cropVerid);
              if (group) {
                group.push(item);
              }
            });

            this.invoiceItems1.forEach((array: any[]) => {
              array = array.filter((item: any) => item.Variety_Name != null);
              this.invoiceItems3.push(array);

            });

            this.alldata = this.invoiceItems3;
            this.invoiceItems3.forEach((array: any) => {
              array.sort((a: any, b: any) => a.Type.localeCompare(b.Type));
            });
            this.invoiceItems3.forEach((array: any) => {
              array.sort((a: any, b: any) => a.Variety_Name.localeCompare(b.Variety_Name));
            });



            for (let i = 0; i < this.alldata.length; i++) {
              var length = (this.alldata[i].length) / 2
              let k = 0
              for (let j = 0; j < this.alldata[i].length; j++) { // Start from the third object in each array

                if (length > k) {
                  const arrayofobh = {
                    "Dist_Code": this.alldata[i][j].Dist_Code,
                    "Dist_Name": this.alldata[i][j].Dist_Name,
                    "CROP_VERID": this.alldata[i][j].CROP_VERID,
                    "Type": "Total",
                    "USER_TYPE": this.alldata[i][j].USER_TYPE,
                    "Variety_Name": this.alldata[i][j].Variety_Name,
                    "sale": +this.alldata[i][j].sale + +this.alldata[i][j + 1].sale

                  }
                  this.alldata[i].push(arrayofobh);
                  k = ++k;
                  j = j + 1;
                }
              }

            }
            this.alldata.forEach((array: any) => {
              array.sort((a: any, b: any) => a.Type.localeCompare(b.Type));
            });
            this.alldata.forEach((array: any) => {
              array.sort((a: any, b: any) => a.Variety_Name.localeCompare(b.Variety_Name));
            });

            for (let i = 0; i < this.alldata[0].length; i++) {
              let varietyName = this.alldata[0][i]["Variety_Name"];
              this.distinctVarieties[varietyName] = true;

            }
            if(this.alldata[0].length > 0){
              for (let i = 0; i < this.alldata.length; i++) {
                let DistrictName = this.alldata[i][0]["Dist_Name"];
                this.distinctDistrict[DistrictName] = true;
              }
            }
            
            this.distinctVarietyArray = Object.keys(this.distinctVarieties).map((varietyName) => ({
              "Variety_Name": varietyName,
            }));
            this.distinctDistrictArray = Object.keys(this.distinctDistrict).map((DistrictName) => ({
              "Dist_Name": DistrictName,
            }));

          })
          for (let i = 0; i < this.alldata[0].length; i++) {
            let sum = 0;
            for (let j = 0; j < this.alldata.length; j++) {
              sum += parseFloat(this.alldata[j][i].sale);
              if(this.alldata[j][i].Type == 'Dealer'){
                this.sumTotalDealerSale += parseFloat(this.alldata[j][i].sale);
              }
              if(this.alldata[j][i].Type == 'PACS'){
                this.sumTotalPACSSale += parseFloat(this.alldata[j][i].sale);
              }
              if(this.alldata[j][i].Type == 'Total'){
                this.sumTotalTotalSale += parseFloat(this.alldata[j][i].sale);
              }
            }
            this.sumArray.push(sum);
          }
          
        }


        this.showpage = true;
        this.spinner.hide();
      })
    }
    else {
      this.toastr.warning('Please select all field.');
    }
  }
  calculateTotalSale(x: any, i: any) {
    this.alldata[i].totalDealerSale = 0;
    this.alldata[i].totalPACSSale = 0;
    this.alldata[i].totalTotalSale = 0;
    for (let index = 0; index < x.length; index++) {
      if (index == 0) {
        this.alldata[i].totalDealerSale = 0;
        this.alldata[i].totalPACSSale = 0;
        this.alldata[i].totalTotalSale = 0;
      }
      if (x[index].Type == 'Dealer') {
        this.alldata[i].totalDealerSale = this.alldata[i].totalDealerSale + parseFloat(x[index].sale);
      }
      if (x[index].Type == 'PACS') {
        this.alldata[i].totalPACSSale = this.alldata[i].totalPACSSale + parseFloat(x[index].sale)
      }
      if (x[index].Type == 'Total') {
        this.alldata[i].totalTotalSale = this.alldata[i].totalTotalSale + parseFloat(x[index].sale)
      }

    }

  }
  exportexcel(): void {
    let latest_date = new Date().getDate();
    let getmonth = new Date().getMonth() + 1;
    let getFullYear = new Date().getFullYear();
    let getDate = new Date().getDate();

    this.fileName = 'VarietyWiseliftReport_' + ' ' + getDate + '-' + getmonth + '-' + getFullYear + '.xlsx';
    /* table id is passed over here */
    let element = document.getElementById('tables');    
    if (element !== null && element !== undefined) {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'VarietyWiseliftReport');
  
      /* save to file */
      XLSX.writeFile(wb, this.fileName);
    }
   

  }
}