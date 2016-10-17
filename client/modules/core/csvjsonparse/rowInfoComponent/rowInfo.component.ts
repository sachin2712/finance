import {
    Component,
    Input
} from '@angular/core';
import {
    AssignCategoryComponent
} from './assignCategoryComponent/assignCategory.component';
import template from './rowInfo.html';

@Component({
    selector: '[other]',
    template,
    directives: [AssignCategoryComponent]
})

export class RowInfoComponent {
    @Input() data: string[];
    constructor() {}
}