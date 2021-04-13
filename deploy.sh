#bin/bash
rm out.log
rm err.log
rm -rf git
mkdir git
cd git
git clone https://github.com/upexcel/meteor_angular2_bank
#git fetch --all
#git reset --hard origin/development
#git checkout 882c41
#git pull origin development
#git checkout development
cd meteor_angular2_bank
npm install detect-libc
meteor npm install
meteor build ./../

cd ..
gzip -df meteor_angular2_bank.tar.gz
tar -xf meteor_angular2_bank.tar
cd bundle
mv * ..
cd ..
cd programs/server
npm install
yarn add fibers
cd ../../
export MAIL_URL=smtp://apikey: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@smtp.sendgrid.net:587
#export MONGO_URL=mongodb://etech:java1234@ds023105.mlab.com:23105/etech
export MONGO_URL=mongodb://finance:remote123@127.0.0.1:27017/finance
export ROOT_URL=http://176.9.11.14:3013/
export PORT=3013
export STORE_MAIL='http://excellencetechnologies.co.in/imap/?email=acc.excellence2017@gmail.com&pass=java@123&date=2016-01-01&host=imap.gmail.com&port=993&encryp=ssl'

pm2 stop bank_live
pm2 start main.js -e ../err.log -o ../out.log --name bank_live


