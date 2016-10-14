import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router,ROUTER_DIRECTIVES,provideRouter } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import * as moment from 'moment';
import { MeteorComponent } from 'angular2-meteor';
import { Csvdata,Productcategory }   from '../../../../both/collections/csvdata.collection';
import { REACTIVE_FORM_DIRECTIVES, FormGroup,FormArray, FormBuilder ,Validators} from '@angular/forms';
import { suggestionComponent } from './suggestoptionComponent/suggestoption.component';
import template from './csvtimeline.html';
 

@Component({
  selector: 'csvtimeline',
  template,
  directives: [REACTIVE_FORM_DIRECTIVES,ROUTER_DIRECTIVES,suggestionComponent]
})

export class CsvTimelineComponent extends MeteorComponent implements OnInit, OnChanges {
    userlist: Mongo.Cursor<any>;
    csvdata: Mongo.Cursor<any>;
    productcategory: Mongo.Cursor<any>;// this is for our productcategory collection
    loginuser:any;
    loginrole:boolean;// *** will use for hide assigning label****
    
    addForm: FormGroup;// form group instance
    
    invoice_no: string;//**** invoice_no and description are 
    description: string;//   used in adding new invoice details ****
    linkaddressarray:any;
    
    data_month: any;
    sort_order: any;
    month_in_headbar: any;
    yearly:any;
    monthly:any;
    dateB:any;
    dbdate:any;
    initialupperlimit:any;
   
     constructor(private formBuilder: FormBuilder,private _router:Router){
//      this.csvdata = Csvdata.find({ });
//      console.log(this.csvdata);
//      ngOnInit();
         super();
//        Meteor.setTimeout(function(){
            console.log('dfg');
       this.loginuser=Meteor.user();
        
//        }, 1000);
       
       }
    
    ngOnChanges() {
         this.loginuser=Meteor.user();
         this.data_month = moment(); 
     }
     
      
ngOnInit() {
//    this.loginuser=Meteor.user();
    Tracker.autorun(function () {
    Meteor.subscribe("userData");
     Meteor.subscribe('csvdata');
     Meteor.subscribe("Productcategory");
   });
   
//    *** getting all the users list from Meteor users ***
//   *** for only Accounts db.users.find({"roles":"Accounts"}).pretty(); ***
    
//    console.log(Meteor.user.profile.role=='guest');
    this.userlist=Meteor.users.find();
//    **** for checking user is login or not ****  
//    var usernewlist=Meteor.users.find({"roles" : Accounts});
//    console.log(usernewlist);
//    console.log(this.userlist);
    if (!Meteor.userId()) {
        this._router.navigate(['/login']);
    }

    
    var sort_order={};
    var product_order={};
    product_order["category"]=1;
    sort_order["Txn_Posted_Date"]=-1;
//  *** all date related code ****
    this.data_month = moment();
    this.month_in_headbar = this.data_month.format('MMMM YYYY');
    this.yearly=this.data_month.format('YYYY');
    this.monthly=this.data_month.format('MM');
    this.dateB = moment().year(this.yearly).month(this.monthly-1).date(1);
    this.dbdate=this.dateB.format('MM-DD-YYYY');
    this.initialupperlimit=this.data_month.format('MM-DD-YYYY');
//  *** getting data from db related to this month***
    this.csvdata = Csvdata.find({"Txn_Posted_Date":
        { 
            $gt : new Date(this.dbdate), 
            $lte: new Date(this.initialupperlimit) 
        }},
        {
        sort:sort_order
        }
      );
      console.log(this.csvdata);
    this.productcategory=Productcategory.find({},{sort:product_order});
    this.data_month=this.dateB;
    
    //    *** this is code for adding invoice details ***
    this.addForm = this.formBuilder.group({
      invoice_no: ['', Validators.required],
      description: ['', Validators.required],
      linktodrive: this.formBuilder.array([
          this.initLink(),
      ])
    }); 
  }
  
  initLink(){
      return this.formBuilder.group({
          linkAddress:['',Validators.required]
      });
  }
  addLink(){
      const control= <FormArray>this.addForm.controls['linktodrive'];
      control.push(this.initLink());
  }
  removeLink(i: number){
      const control= <FormArray>this.addForm.controls['linktodrive'];
      control.removeAt(i);
  }
  
  
//  **** assign transaction document to a user ****
  assignTransDocToUser(id,userid,username){
      Meteor.call('assigntransdoctouser',id,userid,username,(error,response)=>{
          if(error){
              console.log(error.reason);
          }
          else {
              console.log(response);
          }
      })
  }
  
changecategory(id,category){
        Meteor.call('changecategory',id,category,(error,response)=>{
            if(error){
                console.log(error.reason);
            }
            else{
                console.log(response);
            }
        });
    }
    
//  ******** incremented monthly data *****
csvdatamonthlyplus(){
    var sort_order={};
    var product_order={};
    product_order["category"]=1;
//  *** all date related code ****      
    sort_order["Txn_Posted_Date"]=-1;
//  *** momentjs use ** 
    var incrementDateMoment = moment(this.data_month);
    incrementDateMoment.add(1, 'months');
    this.data_month=moment(incrementDateMoment);
    var data_month_temp=incrementDateMoment;
    this.month_in_headbar = this.data_month.format('MMMM YYYY');
//  ***** here we need two months next and next to next ****
    var yearly=this.data_month.format('YYYY');
    var monthly=this.data_month.format('MM');
    var dateB = moment().year(yearly).month(monthly).date(1);
    var dbdatelower=this.data_month.format('MM-DD-YYYY');
    var dbdateupperlimit=dateB.format('MM-DD-YYYY');
//  *** getting data from db related to this month***
    this.csvdata = Csvdata.find(
        { "Txn_Posted_Date":{ 
            $gte : new Date(dbdatelower), 
            $lt : new Date(dbdateupperlimit)
             }},{
             sort:sort_order
             });     
  }
  
csvdatamonthlyminus(){
    var sort_order={};
    var product_order={};
    product_order["category"]=1;
//  *** all date related code ****   
    sort_order["Txn_Posted_Date"]=-1;
    var dbdateprevious=this.data_month.format('MM-DD-YYYY');
      
    console.log(dbdateprevious);
    var decrementDateMoment = moment(this.data_month); 
    decrementDateMoment.subtract(1, 'months');
     
    this.data_month=decrementDateMoment;
    this.month_in_headbar = this.data_month.format('MMMM YYYY');
//  ***** code to data retrive *****
    var yearly=this.data_month.format('YYYY');
    var monthly=this.data_month.format('MM');
    var dateB = moment().year(yearly).month(monthly-1).date(1);
    var dbdate=dateB.format('MM-DD-YYYY');
//  *** getting data from db related to this month***
    this.csvdata = Csvdata.find(
        {"Txn_Posted_Date":
            { 
                $gte : new Date(dbdate),
                $lt : new Date(dbdateprevious)
             }},
             {
             sort:sort_order
             });
  }
//  **** function use for adding invoice details ****
updateInvoice(id,invoice_no,descriptions,drivelink){
        this.invoice_no=this.addForm.controls['invoice_no'].value;
        this.description=this.addForm.controls['description'].value;
        this.linkaddressarray=this.addForm.controls['linktodrive'].value;
        if(this.invoice_no==''){
            this.invoice_no=invoice_no;
        }
        if(this.description==''){
            this.description=descriptions;
        }
        if(this.linkaddressarray=='')
        {
            this.linkaddressarray = drivelink;
        }
        
         Meteor.call('addInvoice',id,this.invoice_no,this.description,this.linkaddressarray,(error,response)=>{
            if(error){
                console.log(error.reason);
            }
            else{
                console.log(response);
            }
        });
 }
 addInvoice(id){
        this.invoice_no=this.addForm.controls['invoice_no'].value;
        this.description=this.addForm.controls['description'].value;
        this.linkaddressarray=this.addForm.controls['linktodrive'].value;
        console.log(this.linkaddressarray);
        Meteor.call('addInvoice',id,this.invoice_no,this.description,this.linkaddressarray,(error,response)=>{
            if(error){
                console.log(error.reason);
            }
            else{
                console.log(response);
            }
        });
        console.log(this.addForm);
 }
 deleteinvoice(id){
     Meteor.call('deleteinvoice',id,(error,response)=>{
         if(error){
             console.log(error.reason);
         }
         else{
             console.log(response);
         }
     });
//      this.resetForm();
 }
    
   resetForm() {
    this.addForm.controls['invoice_no']['updateValue']('');
    this.addForm.controls['description']['updateValue']('');
    this.addForm.controls['linkAddress']['updateValue']('');
  }
  
  
  suggestCategory(){
      
      
//         for(let i=0;i<categoryarray.length;i++){
////       var str = "BIL/001021344935/joshita/90072010200372";
//         console.log('---------------------------');
//          n = str.indexOf(categoryarray[i].category);
//          console.log(categoryarray[i].category);
//          console.log(str);
//          console.log(n);
//        if(n!=-1){
//          category=categoryarray[i].category;
//          is_processed=1;
//            console.log(category);
//            console.log(is_processed);
//            break;
//           }else{
//          category="not assigned";
//          is_processed=0;
//           }    
//           console.log(i);
//        }
//       console.log(category);
    
  }
  
  
}


