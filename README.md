# meteor_angular2_bank


Deploy meteor angular 2 project to server

step 1: On your computer run below command, this will generate a zip folder in output folder
       
        meteor build ./../output

step 2: On server upload the zip file to  below directory using filezilla

        /public_html/bank


step 3: Use terminal to connect to server using SSH Connect

ssh etech@144.76.34.244 -p 4444 -i  {path to pricegenie-fashioniq-key.ppk }


step 4: Do ssh connect etech user from your terminal and reach to /public_html/bank  directory

       cd /public_html/bank

step 5: Then type 

gzip -df socially.tar.gz ( in place of socially.tar.gz enter your zip file name )

step 6: tar -xf  your_file_name.tar 

step 7: After extracting file using tar we will get a folder bundle. go to bundle folder and move all file outside using these commands

        cd bundle

        mv * ..

        cd ..

step 8: Now go to /programs/server 
       
        
        i) cd /programs/server

       then type command 

        ii) npm install

step 9: Now  export detail of mlab mongodb by typing command 

       export MONGO_URL=mongodb://username:password@ds019796.mlab.com:19796/csv_json_test 

       export ROOT_URL=http://144.76.34.244:3012/

       export PORT=3012 

step 10: Restart app with below command

          pm2 list  ( this will list all app running with pm2 )

          pm2 restart { id }

