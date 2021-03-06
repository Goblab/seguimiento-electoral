/**
 * Board-offline.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Q = require('q');
var json2csv = require('json2csv');

var util = require( 'util' ),
  actionUtil = require( '../blueprints/_util/actionUtil' );

module.exports = {

  attributes: {
  	number: 'string',
  	totalVotes: 'string',
  	blankVotes: 'string',
  	recurredVotes: 'string',
  	inpugnedVotes: 'string',
    nullVotes: 'string',
  	columnVotes: 'string',
    remitedVotes: 'string',
    electorVotes: 'string',
    packetUsed: 'string',

    isCertificate: 'boolean',
    isProvisorio: 'boolean',

  	town: {
  		model: 'town'
  	},

    instance: {
      model: 'instance'
    },
    
  	config: {
  		model: 'config'
  	},

  	votes: 'json'
  },

  afterCreate: function (args, next) {
    var self = this;
    Board.findOne({name: args.number, town: args.town}).populate('school').exec(function (err, board) {
        if (board === undefined) next();

        if (board) {
          var votes = JSON.parse(args.votes);

          if (!votes[0].candidateId) {
            votes = JSON.parse(votes);         
          }

          var candivotes = [];

          _.each(votes, function (candidate) {
            var p = {
              school: board.school.id,
              borough: board.school.borough,
              candidate: candidate.candidateId,
              instance: args.instance,
              board: board.id,
              config: args.config
            };
            candivotes.push(p);
          });

          Candivote.findOrCreate(candivotes).exec(function (err, records) {

            _.each(records, function (candivote) {
              var index = _.findIndex(votes, { 'candidateId': candivote.candidate});
              //console.log(candivote, index);
              if (index >= 0) {
                candivote.votes = votes[index].votes;
                candivote.boardOffline = args.id,
                candivote.save();
              }
            });


            board.totalVotes = args.totalVotes;
            board.blankVotes = args.blankVotes;
            board.recurredVotes = args.recurredVotes;
            board.inpugnedVotes = args.inpugnedVotes;
            board.nullVotes = args.nullVotes;
            board.isCertificate = args.isCertificate;
            board.isProvisorio = args.isProvisorio;

            board.save();

            Config.publishUpdate(args.config, {id: args.config}, null, { previous: { } });

            next();
          });
        }
    });    
  },  
};

