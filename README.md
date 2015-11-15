# Deployer

Allows user to view files in an SVN repo by commit number and deploy them to a server.

![screenshot][screenshot]


##### Purpose
Aided in the deployment of large number of file to servers in absence of a correct deployment solution.
Files were displayed in a web interface (primarily so I could practice Angular and Sass) and were then manipulated via powershell - allowing commands to be executed with the current users permission set. 

##### Features
- Search SVN repo by commit number.
- Group files by folder path.
- Open file and destination in diff tool.
- Copy files to server.
- Recycle sites hosted in IIS.
- Allowed transforming folder path where it varied between repo and server.



[screenshot]: /screenshot.png