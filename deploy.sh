echo -------------------------stop server-----------------
cd /usr/local/java/apache-tomcat-8.5.8/bin
sh shutdown.sh
cd /home/lyc/java/workspace/v4.0/yuqing/trunk/yuqing
echo -------------------------update code-----------------
svn update
rm -r yuqing
echo -------------------------package start-----------------
npm run build
echo -------------------------package success-----------------
cd /usr/local/java/apache-tomcat-8.5.8/webapps/
rm -r yuqing
cp -rf /home/lyc/java/workspace/v4.0/yuqing/trunk/yuqing/yuqing /usr/local/java/apache-tomcat-8.5.8/webapps/
echo -------------------------start server-----------------
cd /usr/local/java/apache-tomcat-8.5.8/bin
sh startup.sh

