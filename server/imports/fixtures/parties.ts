import { Csvdata,Productcategory } from '../../../both/collections/csvdata.collection';

export function loadParties() {
  if (Productcategory.find().count() === 0) {
    const cateogry = [
      {
        category: 'Dubstep-Free Zone'
      },
      {
        category: 'All dubstep all the time'
      },
      {
        category: 'Savage lounging'
      }
    ];
 
    cateogry.forEach((party) => Productcategory.insert(party));
  }
}


