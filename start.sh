sudo apt update
sudo apt -y upgrade

sudo apt update
sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

sudo apt -y install nodejs
sudo apt -y  install gcc g++ make

wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org


cd /vagrant/

npm install
sudo npm install -g forever
sudo mkdir -p /data/db

sudo service mongod start

git submodule init
git submodule update
cd jiff && npm install

cd ../
node server/index.js


