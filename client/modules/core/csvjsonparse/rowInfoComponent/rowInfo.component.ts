import {
    Component,
    Input
} from '@angular/core';
import {
    AssignCategoryComponent
} from './assignCategoryComponent/assignCategory.component';
import template from './rowInfo.html';
import {
    Row
} from '../../../../../both/interfaces/row.model';

@Component({
    selector: '[other]',
    template,
    directives: [AssignCategoryComponent]
})

export class RowInfoComponent {
    @Input() row: Row;
    constructor() {}
}