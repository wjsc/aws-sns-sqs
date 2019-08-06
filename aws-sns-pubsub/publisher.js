const TopicArn = 'arn:aws:sns:us-east-1:678806694864:EVENTOS_TEST';
const AWS = require('aws-sdk');
AWS.config.loadFromPath('../credentials.json');

const constructMessageAttributes = (event_id, event_version, emitter_name, emitter_version, client_id) => ({
  event_id,
  event_version,
  emitter_name,
  emitter_version,
  date: new Date().toISOString(),
  client_id
});

const formatMessageAttributes = obj => Object.keys( obj).reduce( (prev, key) => ({
  ...prev,
  ...formatMessageAttribute(key, obj[key], 'String')
}), {});

const formatMessageAttribute = (key, StringValue, DataType) => ({
  [key]: {
    DataType,
    StringValue
  }
});

const constructSNSParams = (TopicArn, Message, ...attributes) => ({
  Message,
  TopicArn,
  MessageAttributes: formatMessageAttributes(constructMessageAttributes(...attributes)),
});

const params = constructSNSParams(TopicArn, 'ANY_MESSAGE', '1.1', '1.0.3', 'TF-XXX-API', '19.5', 'XXXXX');

const publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

publishTextPromise.then(
  (data) => {
    console.log(`Message ${params.Message} send sent to the topic ${params.TopicArn}`);
  }).catch(
    (err) =>{
    console.error(err, err.stack);
  });


// {
//   Message: 'ANY_MESSAGE',
//   TopicArn: 'arn:aws:sns:us-east-1:123123123123:EVENTOS_TEST',
//   MessageAttributes: {
//       event_id: {
//           DataType: 'S',
//           StringValue: '1.1'
//       },
//       event_version: {
//           DataType: 'S',
//           StringValue: '1.0.3'
//       },
//       emitter_name: {
//           DataType: 'S',
//           StringValue: 'TF-XXX-API'
//       },
//       emitter_version: {
//           DataType: 'S',
//           StringValue: '19.5'
//       },
//       date: {
//           DataType: 'S', 
//           StringValue: '2019-08-06T17:45:45.538Z'
//       },
//       client_id: {
//           DataType: 'S',
//           StringValue: 'XXXXX'
//       }
//   }
// }