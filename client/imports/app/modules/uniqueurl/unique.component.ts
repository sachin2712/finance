import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import {
    Router
} from '@angular/router';
// *** new pattern***
import {
    Observable
} from 'rxjs/Observable';
import { 
    InjectUser 
} from 'angular2-meteor-accounts-ui';
import {
    Subscription
} from 'rxjs/Subscription';
import {
    MeteorObservable
} from 'meteor-rxjs';
import { 
  Roles 
} from 'meteor/alanning:roles';
import {
    ActivatedRoute
} from '@angular/router';
import {
    Csvdata,
    Productcategory,
    Subcategory,
    Head,
    Comments
} from '../../../../../both/collections/csvdata.collection';
import { 
    NgForm 
} from '@angular/forms';
import * as _ from 'lodash';
import template from './uniqueurlhtml.html';

@Component({
    selector: 'uniqueurls',
    template
})
@InjectUser('user')
export class SharedUrlComponent implements OnInit, OnDestroy {
    commentlist: Observable <any[]> ;
    commentSub: Subscription;

    user: Meteor.User;

    csvdata1: Observable < any[] > ;
    csvdata: any;
    csvSub: Subscription;

    parentcategoryarray: any;
    categoryname: any;
    productcategory: Observable < any[] > ;
    productSub: Subscription;

    subcategoryarray: any;
    subcategoryname: any;
    subcategory: Observable < any[] > ;
    subcategorySub: Subscription;

    headarraylist: any;
    headname: any;
    headarrayobservable: Observable < any[] > ;
    headarraySub: Subscription;

    id: string;
    private sub: any;
    uniqueSub: Subscription;
    // changevalue: string;
    constructor(private route: ActivatedRoute) {}
    ngOnInit() {
        // this.commentlist = Comments.find({"transactionid":this.transaction_data['_id']}).zone();
        // this.commentSub = MeteorObservable.subscribe('Commentslist', this.transaction_data['_id']).subscribe();
        console.log(this.user);

        this.headarrayobservable = Head.find({}).zone();
        this.headarraySub = MeteorObservable.subscribe('headlist').subscribe();
        this.headarrayobservable.subscribe((data) => {
            this.headarraylist = data;
        });

        this.productcategory = Productcategory.find({}).zone();
        this.productSub = MeteorObservable.subscribe('Productcategory').subscribe();
        this.productcategory.subscribe((data) => {
            this.parentcategoryarray = data;
        });

        this.subcategory = Subcategory.find({}).zone();
        this.subcategorySub = MeteorObservable.subscribe('Subcategory').subscribe();
        this.subcategory.subscribe((data) => {
            this.subcategoryarray = data;
        });

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.csvSub = MeteorObservable.subscribe('uniquetransaction', this.id).subscribe();
            this.commentSub = MeteorObservable.subscribe('Commentslist', this.id).subscribe();
            // console.log(this.id);
        });
        this.csvdata1 = Csvdata.find().zone();

        this.csvdata1.subscribe(data => {
           this.csvdata=data[0];
           // console.log(this.csvdata);
        });
    }
    
    categoryfind(id){
       this.categoryname =_.filter(this.parentcategoryarray,{"_id": id});
        if(this.categoryname[0]){
           return this.categoryname[0].category;
          }
    }
    
    subcategoryfind(id){
       this.subcategoryname =_.filter(this.subcategoryarray,{"_id": id});
         if(this.subcategoryname[0]){
             return this.subcategoryname[0].category;
         } 
    }
    
    headfind(id){
         this.headname =_.filter(this.headarraylist,{"_id": id});
         return this.headname[0].head;
    }
    
   addcomment(form: NgForm){
      console.log(form.value);
    if(form.value.comment!='' && Roles.userIsInRole(Meteor.userId(), 'admin')){
      Comments.insert({
       "transactionid": this.csvdata["_id"],
       "ownerid": Meteor.userId(),
       "ownername": this.user.username,
       "messagecontent": form.value.comment,
       "createdat": new Date()
     });
     form.reset();
   }
 } 
    
    ngOnDestroy() {
        this.csvSub.unsubscribe();
        this.commentSub.unsubscribe();
    }
}