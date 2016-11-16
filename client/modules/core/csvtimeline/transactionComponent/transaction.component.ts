import {
    Component,
    OnInit,
    Input
} from '@angular/core';
import {
    UserComponent
} from './userComponent/user.component';
import {
    CategoryComponent
} from './categoryComponent/category.component';
import {
    Row
} from '../../../../../both/interfaces/row.model';
import {
    InvoiceComponent
} from './invoiceComponent/invoice.component';
import {
    suggestionComponent
} from './suggestoptionComponent/suggestoption.component';
import { 
    Observable 
} from 'rxjs/Observable';
import { 
    Subscription 
} from 'rxjs/Subscription';
import { 
    MeteorObservable 
} from 'meteor-rxjs';
import * as _ from 'lodash';
import {
    Productcategory,
    Subcategory
} from '../../../../../both/collections/csvdata.collection';
import template from './transaction.html';

@Component({
    selector: '[transaction]',
    template
})

export class TransactionComponent implements OnInit{
     Income_id: string;
     Expense_id: string;
     show_head: any;
     change_color: boolean;
    @Input() transaction_data: Row;
    @Input() parent_category_array: any;
    @Input() sub_category_array: any;
    @Input() head_array_transaction_list: any;

    constructor() {}
    ngOnInit() {
        // if(this.head_array_transaction_list){
           console.log(this.transaction_data);
       console.log(this.head_array_transaction_list);  
          this.show_head=_.filter(this.head_array_transaction_list,{"head": "Income"});
          this.Income_id=this.show_head[0]._id;

          this.show_head=_.filter(this.head_array_transaction_list,{"head": "Expense"});
          this.Expense_id=this.show_head[0]._id;
          console.log("2");
          if(this.transaction_data['Assigned_head_id']!=this.Income_id && this.transaction_data['Assigned_head_id']!=this.Expense_id)
          {
             this.change_color=true;
          }
       // }

     }

}