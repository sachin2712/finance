 import { Component, Input, OnInit, AfterContentInit } from '@angular/core';
 import { Mongo } from 'meteor/mongo';
 import { Meteor } from 'meteor/meteor';
 import { MeteorComponent } from 'angular2-meteor';
 import { Csvdata,Productcategory }   from '../../../../../both/collections/csvdata.collection';
 import template from './suggestoption.html';
 

 @Component({
   selector: 'suggest-option',
   template
 })

 export class suggestionComponent extends MeteorComponent implements OnInit, AfterContentInit {
     productcategory: Mongo.Cursor<any>;// this is for our productcategory collection
     suggestarray:any;
     allcategoryArray: any;
     category:any;
     n:any;
     description:string;
     @Input() input: string;// this variable will have input from parent  component
      constructor(){
          super();   
   
        }    
      
 ngOnInit() {
     Tracker.autorun(function () {
      Meteor.subscribe("Productcategory");
      description=this.input;
    });
     allcategoryArray = Productcategory.find({},{"subarray":1,_id:0,"category":0}).fetch(); 
     console.log(allcategoryArray); 
     this.suggestarray=[];  
   }
   ngAfterContentInit() {
        description=this.input;
        for(let i=0;i<allcategoryArray.length;i++){      
           n = description.indexOf(allcategoryArray[i].category);
         
         if(n!=-1){
           this.category=allcategoryArray[i].category;       
           this.suggestarray.push(this.category);  
            }
         }
   }
  
 }


