'use strict';
var FS = require('fs');
var READLINE = require('readline');
var csvdata = require('csvdata');

var colistenParser = (function () {
  function start () {
    if (!validateCLIInput()) {
      process.exit();
    }
    var inputFiles = [];
    var inputFilesFromPathPromise = new Promise(function(resolve, reject) {
      FS.readdir(process.argv[2], function (err,files) {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
    var counter = 0;
    inputFilesFromPathPromise.then(function (files) {
      return Promise.all(files.map(function (file) {
        var p = new Promise(function(resolve, reject) {
          var output = [];

          var lineReader = READLINE.createInterface({
            input: FS.createReadStream(process.argv[2]+'/'+file)
          });
          var sessionId = file.substr(0, file.indexOf('.'));

          var lineCount = 0;
          lineReader.on('line', function (line) {
            lineCount++;
            if (/^\[[\d:\.]+\]/.exec(line).length === 0) {
              var badStart = 'line doesn"t start as expected';
              console.error(badStart);
              reject(badStart);
            } else {
              var regex = new RegExp(/^\[([^\]]+)\]\s*((?:\[(?:[^\]\s]+)\]\s*)+?)(?:\[([LR])\])??:[^\S\n]*(.+)?/);
              var matches = regex.exec(line);
              if (matches && matches.hasOwnProperty('length') && matches.length > 1) {
                matches.splice(0,1);
                output.push({session: sessionId, time: matches[0], question: matches[1], participant: matches[2], answer: '"'+matches[3]+'"'});
              } else {
                console.error('line doesn"t match?');
                console.log(line);
                console.log(matches);
              }
            }
          });

          lineReader.on('close', function () {
            if (output.length !== lineCount) {
              var msg = 'wrong count! expected ' + lineCount + ', but only got ' + output.length;
              console.error(msg);
              reject(msg);
            }
            resolve(output);
          });
        });

        return p;

      }))
      .then(function (outputArrays) {
        var data = [].concat.apply([], outputArrays);
        csvdata.write(process.argv[3], data, {header: 'session,time,question,participant,answer'});
      });
      
    });
  }

  function validateCLIInput () {
    if (process.argv.length < 4) {
      console.log('please give the input directory and output files');
      return false;
    }
    return true;
  }

  return {
    start: start
  };
})();

colistenParser.start();