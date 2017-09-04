'use strict';

const AWS = require('aws-sdk');

const S3 = new AWS.S3({
  region: 'us-west-2',
  apiVersion: '2006-03-01',
});

const Polly = new AWS.Polly({
  region: 'us-west-2',
  apiVersion: '2016-06-10',
});

const bucket = process.env.BUCKET;

// happy case returns here
const getPresignedUrl = function (callback, params) {
  params.Expires = 60;

  S3.getSignedUrl('getObject', params, (error, url) => {
    if (error) {
      console.log(error);
      callback('InternalError: failed to get presigned URL for S3 params: '
        + JSON.stringify(params));
    } else {
      console.log('Success: ' + JSON.stringify(params));

      // Success!
      callback(null, {
        url: url,
      });
    }
  });
};

exports.handler = function (event, context, callback) {

  console.log(event);

  // parse parameters
  let type = event.type;
  if (!type) {
    callback('ReferenceError: \'type\' not specified');
    return;
  }

  let number = event[type];
  if (!number) {
    callback(`ReferenceError: number not specified for type '${type}'`);
    return;
  }

  let value = null;

  switch (type) {
    case 'number':
      value = parseInt(number);
      if (isNaN(value) || value < 0 || value > 9999) {
        callback('ReferenceError: invalid input for number: ' + number);
        return;
      }

      break;
    case 'clock':
      value = parseFloat(number);
      if (isNaN(value) || value < 0.0 || value > 23.59) {
        callback('ReferenceError: invalid input for clock: ' + number);
        return;
      }

      break;
    default:
      callback('ReferenceError: invalid type: ' + type);
      return;
  }

  let filename = `${type}/${number}.mp3`;

  let s3params = {
    Bucket: bucket,
    Key: filename,
  };

  // check to see if speech already exists in the cache
  S3.headObject(s3params, (error, metadata) => {

    // no, speech does not yet exist in cache ...
    if (error) {
      if (error.statusCode === 404) {

        if (type === 'clock') {
          number = number.replace(/\./g, ':');
        }

        // ... so synthesize the speech, ...
        let pollyParams = {
          Text: number,
          TextType: 'text',
          OutputFormat: 'mp3',
          SampleRate: '8000',
          VoiceId: 'Joanna',
        };

        console.log('Synthesize Speech: ' + JSON.stringify(pollyParams));

        Polly.synthesizeSpeech(pollyParams, (error, data) => {
          if (error) {
            console.log(error);
            callback('InternalError: failed to synthesize speech for Polly params: '
              + JSON.stringify(pollyParams));
          } else {
            console.log('Cache Speech: ' + JSON.stringify(s3params));

            s3params.Body = data.AudioStream;
            s3params.ContentType = data.ContentType;

            // ... cache it, ...
            S3.putObject(s3params, (error, data) => {
              if (error) {
                console.log(error);
                callback('InternalError: failed to write object for S3 params: '
                  + JSON.stringify(s3params));
              } else {

                // leaving these in causes an error
                delete s3params.Body;
                delete s3params.ContentType;

                // ... and return it
                getPresignedUrl(callback, s3params);
              }
            });
          }
        });
      } else {
        callback(`InternalError: status code '${error.statusCode}' returned for S3 params: `
          + JSON.stringify(s3params));
      }

    // speech already exists in cache ...
    } else {

      // ... so return it
      getPresignedUrl(callback, s3params);
    }
  });
};
