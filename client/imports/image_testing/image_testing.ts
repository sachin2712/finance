import { Component, OnInit } from '@angular/core';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder ,Validators} from '@angular/forms';
import { ROUTER_DIRECTIVES,Router } from '@angular/router';
import { Productcategory }   from '../../../both/collections/csvdata.collection';
import { FileDropDirective } from 'angular2-file-drop';
import { upload } from '../../../both/methods/images.methods';
import template from './image_testing.html';
import { ReactiveVar } from 'meteor/reactive-var'; 
import { Thumbs } from '../../../both/collections/images.collection';
import { Thumb } from '../../../both/interfaces/image.interface';

@Component({
  selector: 'imagetesting',
  template,
  directives: [REACTIVE_FORM_DIRECTIVES,ROUTER_DIRECTIVES, FileDropDirective]
})

export class imagetestingComponent extends MeteorComponent implements OnInit {
    fileIsOver: boolean = false;
     uploading: boolean = false;
     files: ReactiveVar<string[]> = new ReactiveVar<string[]>([]);
     thumbs: Mongo.Cursor<Thumb>;
  productlist: Mongo.Cursor<any>;
  addForm: FormGroup;
  selectedCategory: any;
  constructor(private formBuilder: FormBuilder,private _router:Router) {
      super();
  }
     fileOver(fileIsOver: boolean): void {

    this.fileIsOver = fileIsOver;

  }
    onFileDrop(file: File): void {
    this.uploading = true;
    upload(file)
      .then((result) => {
        this.uploading = false;
        this.addFile(result);
      })
      .catch((error) => {
        this.uploading = false;
        console.log(`Something went wrong!`, error);
      });
  }
  
      ngOnInit() {
    this.autorun(() => {
      this.subscribe('thumbs', this.files.get(), () => {
        this.thumbs = Thumbs.find({
          originalStore: 'images',
          originalId: {
            $in: this.files.get()
          }
        });
      }, true);
    });
  }
   

  addFile(file) {
    // update array with files
    this.files.get().push(file._id);
    this.files.set(this.files.get());

  }



 
  
}