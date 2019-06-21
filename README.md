```
rm build.tar.gz
tar -czvf build.tar.gz aws-sns-pubsub
scp -i instance-key-par.pem build.tar.gz ec2-user@ec2-18-205-24-250.compute-1.amazonaws.com:~/
scp -i instance-key-par.pem ./credentials.json ec2-user@ec2-18-205-24-250.compute-1.amazonaws.com:~/
ssh -i instance-key-par.pem ec2-user@ec2-18-205-24-250.compute-1.amazonaws.com
tar -xzvf build.tar.gz
rm build.tar.gz
cd aws-sns-pubsub/
sudo su
/home/ec2-user/.nvm/versions/node/v10.16.0/bin/node subscriber.js
```

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 10.16.0
```