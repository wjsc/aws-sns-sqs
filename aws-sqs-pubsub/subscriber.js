const AWS = require('aws-sdk');
AWS.config.loadFromPath('../credentials.json');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const queueURL = 'https://sqs.us-east-1.amazonaws.com/678806694864/simple_queue.fifo';

const params = {
 AttributeNames: [
    "SentTimestamp"
 ],
 MaxNumberOfMessages: 10,
 MessageAttributeNames: [
    "All"
 ],
 QueueUrl: queueURL,
 VisibilityTimeout: 20,
 WaitTimeSeconds: 0
};

const sleep = ms => new Promise( resolve => setTimeout(resolve, ms))

const deleteMessage = message => {

  const deleteParams = {
    QueueUrl: queueURL,
    ReceiptHandle: message.ReceiptHandle
  };

  sqs.deleteMessage(deleteParams, (err, data) => {
    err && console.error("Delete Error", err);
  });
}

const run = async () =>{
  while(true){
    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        console.log("Receive Error", err);
      } else if (data.Messages) {
        data.Messages.map( message => console.log(message.Body));
        data.Messages.map(deleteMessage);
      }
    });

    await sleep(500);

  }
}

run();