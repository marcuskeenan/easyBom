import { Meteor } from 'meteor/meteor';
import mqtt from 'mqtt';

const client = mqtt.connect({ port: 1883, host: '52.161.32.26', keepalive: 10000});

console.log("meteor startup")
client.on('connect', function () {
  console.log("connected")
  client.subscribe('spBv1.0/Hydrocide/+/+/+')
  client.publish('presence', 'Hello mqtt')
});

client.on('message', Meteor.bindEnvironment(function (topic, message) {
    console.log("Message in");
    console.log(message.toString());
    //let processing = true;
    //let data = message.toString();

    //first, parse the data. Check to see if it is of a known data type. If not, return.
    //If so, check to see fi the device exists in the database.
}));
