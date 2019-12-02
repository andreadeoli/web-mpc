# mpc-voting

Implementation of a simple online election using secure multi-party computation. This application was adapted from web-mpc (https://multiparty.org/), accessible at the following repository: https://github.com/multiparty/web-mpc.


## Local machine installation

This project uses `vagrant`, which can be installed with `sudo apt install vagrant` along with a VMM such as VirtualBox. To load the vagrant and ssh into the vagrant vm:
```
vagrant up && vagrant ssh
```
Inside the virual machine, run the one-time installation script:
```
./start.sh
```
To start the application each time, run:
```
cd /vagrant/
sudo service mongod start
MODERATOR_EMAIL_USER="example@yale.edu" MODERATOR_EMAIL_PASS="password" URL_BASE="https://yourdomain.com" node server/index.js
```
MODERATOR_EMAIL_USER and MODERATOR_EMAIL_PASS specify login credentials for the email account which will send voting invitations to specified participants. If using gmail, enable logins from less secure apps.  

URL_BASE is the domain on which the project will run. 

## Application usage

Instructions on how to operate the application. All steps below are performed in the browser.

#### Generate session key

* Navigate to `yourdomain.com/create`.
* Click on **Generate Session** and save the two given files, one contains the session key and password which are needed for managing the session. The other contains a secret key needed to unmask the aggregate.

#### Manage session

* Navigate to `yourdomain.com/manage`.
* Input your session key and password.
* Specify participant names and emails.

#### Fill out data

* All participants will open a unique participation link, and proceed to fill out the information. Once completed, click **Submit**.

#### Retrieve the result

* Stop the session in `yourdomain.com/manage`.
* Click the **unmask** link.
* Paste the session key and password in its designated fields.
* Click **Browse** and upload the private key file that was downloaded when generating the session key.
* Click **Unmask Data** and view the result.

## License
Web-mpc is freely distributable under the terms of the [MIT license](https://github.com/multiparty/web-mpc/blob/master/LICENSE). This release supports Handsontable's "[Nested headers](https://docs.handsontable.com/pro/1.17.0/demo-nested-headers.html)", a Pro feature. A [valid license](https://handsontable.com/pricing) must be obtained when using this feature.
