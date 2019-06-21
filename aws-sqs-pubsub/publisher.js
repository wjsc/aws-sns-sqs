const AWS = require('aws-sdk');
const crypto = require('crypto');
const queueURL = 'https://sqs.us-east-1.amazonaws.com/678806694864/simple_queue.fifo';
AWS.config.loadFromPath('../credentials.json');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const data = new Date().toString();
const hash = crypto.createHash('md5').update(data).digest("hex");

const params = {
  MessageAttributes: {},
  MessageBody: data,
  QueueUrl: queueURL,
  MessageGroupId: 'CREATE',
  MessageDeduplicationId: hash
};

sqs.sendMessage(params, (err, data) => {
  if (err) {
    console.log('Error', err);
  } else {
    console.log('Success', data.MessageId);
  }
});