const AWS = require('aws-sdk');
AWS.config.loadFromPath('../credentials.json');
const sns = new AWS.SNS({apiVersion: '2010-03-31'});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.text());

const TopicArn = 'arn:aws:sns:us-east-1:678806694864:EVENTOS_TEST';
const Protocol = 'http';
const Endpoint = 'http://ec2-54-235-238-92.compute-1.amazonaws.com/receive';


const subscribe = (sns, Protocol, Endpoint, TopicArn) => {
  return sns.subscribe({Protocol, Endpoint, TopicArn}).promise();
}

const confirm = (sns, Token, TopicArn, AuthenticateOnUnsubscribe) => {
  return sns.confirmSubscription({Token, TopicArn, AuthenticateOnUnsubscribe}).promise();
}

app.get('/subscribe', async (req, res) => {
  try{
    const result = await subscribe(sns, Protocol, Endpoint, TopicArn);
    console.log(result);
    res.send(result);
  }
  catch(error){
    console.log(error);
    res.status(401).send(error.message);
  }
});

app.post('/receive', async (req, res) => {
  try{
    const body = JSON.parse(req.body);
    console.log(body);
    if(body.Token){
        const result = await confirm(sns, body.Token, TopicArn, 'false');
        res.status(200).send(JSON.stringify(result));
    }
    res.status(200).send('Notification received');
  }
  catch(error){
    console.log(error);
    res.status(401).send(error.message);
  }
})
 
app.listen(80);


// {
//   Type: 'Notification',
//   MessageId: '806b9aef-f87a-56d5-bdfe-cf2c3aeda8b6',
//   TopicArn: 'arn:aws:sns:us-east-1:678806694864:EVENTOS_TEST',
//   Message: 'ANY_MESSAGE',
//   Timestamp: '2019-08-06T18:00:55.247Z',
//   SignatureVersion: '1',
//   Signature: 'TGAEy7glm0AYLUmuZhYOZ6NMdZGztIDZFuvnv3q9si/c6xgCRks5ZS4INl/DDoy/usuZgfsULdSwdK4pibVroGwnUnixlHrD5ByMNb9pk/uTxuxmljhzfnH2xIornIl54N11aENY3XNFl30SW7LBbpOKUN/lcjjbYYjyr0e/gGX3qj96Sy7mAOme2ojLaNAk7ExxH21q+PNI1CIh5/5WOfwYK0sUUjnwPwx+ASTPHKbO/GnH12C08WOC3IeBuT9Ad9gDSZbwk2aZmFH2Eh++Ar5Yy6d+MRAY4lOuBx3uOd37JVyrWdKj8MPlOWrL3ulaXpLq4xPrOvlnHPp7plRIqQ==',
//   SigningCertURL: 'https://sns.us-east-1.amazonaws.com/SimpleNotificationService-6aad65c2f9911b05cd53efda11f913f9.pem',
//   UnsubscribeURL: 'https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-1:678806694864:EVENTOS_TEST:3b9c0905-c2fd-4809-8a27-fe16edf93379',
//   MessageAttributes: {
//       event_version: {
//           Type: 'String',
//           Value: '1.0.3'
//       },
//       emitter_name: {
//           Type: 'String',
//           Value: 'TF-XXX-API'
//       },
//       date: {
//           Type: 'String',
//           Value: '2019-08-06T18:00:54.274Z'
//       },
//       emitter_version: {
//           Type: 'String',
//           Value: '19.5'
//       },
//       event_id: {
//           Type: 'String',
//           Value: '1.1'
//       },
//       client_id: {
//           Type: 'String',
//           Value: 'XXXXX'
//       }
//   }
// }