import { UploadFS } from 'meteor/jalik:ufs';
import { SalaryfileStore } from '../collections/csvdata.collection';
 
export function upload(data: any,uploaddate: any): Promise<any> {
  return new Promise((resolve, reject) => {
    // console.log(uploaddate);
    // pick from an object only: name, type and size
    const file = {
      name: data.name,
      type: data.type,
      size: data.size,
      monthdate: new Date(uploaddate),
    };
     console.log(file);
 
    const upload = new UploadFS.Uploader({
      data,
      file,
      store: SalaryfileStore,
      onProgress: function(file, progress) {
          console.log(file.name + ' ' + (progress * 100) + '% uploaded');
        },
      onError: reject,
      onComplete: resolve
    });
 
    upload.start();
  });
}

