import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import {
    Mongo
} from 'meteor/mongo';
import {
    Meteor
} from 'meteor/meteor';
import template from './suggestoption.html';


@Component({
    selector: 'suggest-option',
    template
})

export class suggestionComponent implements OnInit{
    suggestarray: any = [];
    allcategoryArray: any;
    category: any;
    n: any;
    description: string;
    @Input() input: string; // this variable will have input from parent  component
    @Input() id: string;
    @Input() child_category_list: any;
    ngOnInit() { 
        this.description = this.input;
        this.allcategoryArray= this.child_category_list;
            for (let i = 0; i < this.allcategoryArray.length; i++) {
                this.n = this.description.indexOf(this.allcategoryArray[i].category);
                if (this.n != -1) {
                    this.category = this.allcategoryArray[i];
                    this.suggestarray.push(this.allcategoryArray[i]);
                }
        }
}
    assigncategory(category_id: string) {
        Meteor.call('addCategory', this.id, category_id, (error, response) => {
            if (error) {
                console.log(error.reason);
            } else {
                console.log(response);
            }
        });
    }
}