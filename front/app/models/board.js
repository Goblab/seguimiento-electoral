import DS from 'ember-data';

export default DS.Model.extend({
  	school: DS.belongsTo('school', {async: true}),
  	town: DS.belongsTo('town', {async: true}),
  	name: DS.attr('string'),
  	totalVotes: DS.attr('string'),
  	isCertificate: DS.attr('boolean', {defaultValue: true}),
  	isProvisorio: DS.attr('boolean', {defaultValue: true}),
  	blankVotes: DS.attr('string'),
  	inpugnedVotes: DS.attr('string'),
  	recurredVotes: DS.attr('string'),
  	nullVotes: DS.attr('string'),
});
