import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES,Router } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder ,Validators} from '@angular/forms';

import { Productcategory }   from '../../../../both/collections/csvdata.collection';

import template from './addproduct.html';
 

@Component({
  selector: 'csvaddproduct',
  template,
  directives: [REACTIVE_FORM_DIRECTIVES,ROUTER_DIRECTIVES]
})

export class CsvAddProductComponent extends MeteorComponent implements OnInit {
  productlist: Mongo.Cursor<any>;
  subcategory:Mongo.Cursor<any>;
  
  addForm: FormGroup;
  addFormsubcategory: FormGroup;
  
  selectedCategory: any;
  activateChild:boolean;
  constructor(private formBuilder: FormBuilder,private _router:Router) {
      super();
  }
  
  onSelect(category: any): void {
  this.selectedCategory = category;
  this.activateChild=true;
  this.subcategory=category;
//  Productcategory.find({_id:category._id},{"subarray":1,_id:0,"category":0});
  console.log(this.subcategory);
}
  
  ngOnInit() {
      this.subscribe('Productcategory', () => {
      this.productlist = Productcategory.find();
    }, true);
//    **** for checking user is login or not ****  
    if (!Meteor.userId()) {
        this._router.navigate(['/login']);
    }
    this.productlist = Productcategory.find();
    
  
    
    console.log(this.productlist);
    this.addForm = this.formBuilder.group({
      category: ['', Validators.required],
    });
    
    this.addFormsubcategory = this.formBuilder.group({
      subcategory: ['', Validators.required],
    });
  }
  resetForm() {
    this.addForm.controls['category']['updateValue']('');
  }
  
  ressetChildForm(){
      this.addFormsubcategory.controls['subcategory']['updateValue'](''); 
  }
  
 addcategory(){
     if(this.addForm.valid){
         Productcategory.insert(this.addForm.value);
         
         // to empty the input box
         this.resetForm();
     }
 }
 
 addSubcategory(parentCategory_id){
     if(this.addFormsubcategory.valid){
         console.log(parentCategory_id);
         console.log(this.addFormsubcategory.controls['subcategory'].value);
         Productcategory.update(
             {_id:parentCategory_id},{ 
           $push:{ "subarray":
               {
               "subcategory":this.addFormsubcategory.controls['subcategory'].value
               }
           }
             });
//             Teams.update(teamId, {$set: {name: "Something else"}}); 
//         Productcategory.insert(this.addFormsubcategory.value);// prototype
//         { $push: { scores: 89 } }
         
         this.ressetChildForm();
     }
 }
 
 updatecategory(){
     if(this.addForm.valid){
//         Productcategory.insert(this.addForm.value);
           Productcategory.update({_id:this.selectedCategory._id},{$set:{"category":this.selectedCategory.category}});
         
         // to empty the input box
         this.resetForm();
         this.selectedCategory="";
         this.activateChild="";
     }
 }
 
 removeCategory(category){
     Productcategory.remove(category._id);
 }
 removeSubCategory(id,subarraycategoryname){
     console.log(id);
     console.log(subarraycategoryname);
     Productcategory.update({ _id : id },{ $pull : {'subarray' : { 'subcategory' : subarraycategoryname } } });
//     this.activateChild=false;
 }
 
  
}