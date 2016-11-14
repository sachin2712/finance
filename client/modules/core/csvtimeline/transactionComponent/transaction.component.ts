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

    @Input() transaction_data: Row;
    @Input() parent_category_array: any;
    @Input() sub_category_array: any;
    constructor() {}
    ngOnInit() { }

}