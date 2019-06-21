const TopicArn = 'arn:aws:sns:us-east-1:678806694864:SIMPLE_MESSAGE';
const AWS = require('aws-sdk');
AWS.config.loadFromPath('../credentials.json');

const params = {
  Message: new Date().toString(),
  TopicArn
};

const publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

publishTextPromise.then(
  (data) => {
    console.log(`Message ${params.Message} send sent to the topic ${params.TopicArn}`);
  }).catch(
    (err) =>{
    console.error(err, err.stack);
  });