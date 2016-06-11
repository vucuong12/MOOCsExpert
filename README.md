# MOOCsExpert

1. Install node
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs


2. Install mongodb
https://docs.mongodb.com/v3.0/tutorial/install-mongodb-on-ubuntu/


3. install git
sudo apt-add-repository ppa:git-core/ppa
sudo apt-get update
sudo apt-get install git


4. Need to update npm 
npm install -g npm


5. if there is problem with unicode:
sudo npm install slug


6. problem with mongo?
export LC_ALL=C


7. Want to connect mongodb from remote machine?
Need to comment out line: ip_bound in /etc/mongod.conf (in server)
http://stackoverflow.com/questions/14653938/remotely-connecting-to-mongodb-http-interface-on-ec2-server.

Also, add MONGODB_ADD in .env file (environment variable)

8. copy mongodb from 110.76.94.231:27017w
db.copyDatabase("moocsexpert","firstcopy","110.76.94.231:27017")