const AWS = require('aws-sdk');
AWS.config.loadFromPath('../credentials.json');
const sns = new AWS.SNS({apiVersion: '2010-03-31'});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.text());

const TopicArn = 'arn:aws:sns:us-east-1:678806694864:SIMPLE_MESSAGE';
const Protocol = 'http';
const Endpoint = 'http://ec2-18-205-24-250.compute-1.amazonaws.com/confirm';


const subscribe = (sns, Protocol, Endpoint, TopicArn) => {
  return sns.subscribe({Protocol, Endpoint, TopicArn}).promise();
}

const confirm = (sns, Token, TopicArn, AuthenticateOnUnsubscribe) => {
  return sns.confirmSubscription({Token, TopicArn, AuthenticateOnUnsubscribe}).promise();
}


app.get('/subscribe', async (req, res) => {
  try{
    const result = await subscribe(sns, Protocol, Endpoint, TopicArn);
    res.send(result);
  }
  catch(error){
    console.log(error);
    res.status(401).send(error.message);
  }
});

app.post('/confirm', async (req, res) => {
  try{
    const body = JSON.parse(req.body);
    if(body.Token){
        const result = await confirm(sns, body.Token, TopicArn, 'false');
    }
    res.status(200).send(JSON.stringify(result));
  }
  catch(error){
    console.log(error);
    res.status(401).send(error.message);
  }
})
 
app.listen(80);
