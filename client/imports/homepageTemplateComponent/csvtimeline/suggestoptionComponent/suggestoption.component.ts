import { Component, OnInit } from '@angular/core';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { Csvdata,Productcategory }   from '../../../../../both/collections/csvdata.collection';
import template from './suggestoption.html';
 

@Component({
  selector: 'suggest-option',
  template
})

export class suggestionComponent extends MeteorComponent implements OnInit {
    productcategory: Mongo.Cursor<any>;// this is for our productcategory collection
    loginuser:any;
    loginrole:boolean;// *** will use for hide assigning label****
    
    linkaddressarray:any;
    
     constructor(){
         super();   
   
       }

     
      
ngOnInit() {
    Tracker.autorun(function () {
     Meteor.subscribe("Productcategory");
   });
    console.log("checking category array values");
    var allcategoryArray = Productcategory.find({}).fetch(); 
    console.log(allcategoryArray); 
    
//    var product_order={};
//    product_order["category"]=1;
//    this.productcategory=Productcategory.find({},{sort:product_order});
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


