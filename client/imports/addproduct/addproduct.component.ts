import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder ,Validators} from '@angular/forms';

import { Productcategory }   from '../../../both/collections/csvdata.collection';

import template from './addproduct.html';
 

@Component({
  selector: 'csvaddproduct',
  template,
  directives: [REACTIVE_FORM_DIRECTIVES,ROUTER_DIRECTIVES]
})

export class CsvAddProductComponent implements OnInit {
  productlist: Mongo.Cursor<any>;
  addForm: FormGroup;
  selectedCategory: any;
  constructor(private formBuilder: FormBuilder) {}
  
  onSelect(category: any): void {
  this.selectedCategory = category;
}
  
  ngOnInit() {
//    **** for checking user is login or not ****  
    if (!Meteor.userId()) {
        this._router.navigate(['/login']);
    }
    this.productlist = Productcategory.find();
    this.addForm = this.formBuilder.group({
      category: ['', Validators.required],
    });
  }
  resetForm() {
    this.addForm.controls['category']['updateValue']('');
  }
 addcategory(){
     if(this.addForm.valid){
         Productcategory.insert(this.addForm.value);
         
         // to empty the input box
         this.resetForm();
     }
 }
 updatecategory(){
     if(this.addForm.valid){
//         Productcategory.insert(this.addForm.value);
           Productcategory.update({_id:this.selectedCategory._id},{$set:{"category":this.selectedCategory.category}});
         
         // to empty the input box
         this.resetForm();
         this.selectedCategory="";
     }
 }
 removeCategory(category){
     Productcategory.remove(category._id);
 }
  
}