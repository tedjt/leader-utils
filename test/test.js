
describe('people-names', function () {

  var assert = require('assert')
    , should = require('should')
    , utils = require('..');

  describe('fuzzifyNumberRange.()', function () {
    it('should loose compare', function () {
      var testString = '500-900 employees';
      var value = utils.fuzzifyNumberRange(testString);
      console.log(value);
      value.value.should.be.within(500, 900);
      value.errorRange.should.be.below(200);

      testString = '1-10 employees';
      value = utils.fuzzifyNumberRange(testString);
      console.log(value);
      value.value.should.be.within(1, 10);
      value.errorRange.should.be.below(4.5);

      testString = '500+ employees';
      value = utils.fuzzifyNumberRange(testString);
      console.log(value);
      value.value.should.be.within(500, 550);
      value.errorRange.should.be.below(25);
    });
  });

  describe('getCompanyName.()', function () {
    it('should work', function () {
      var person = {company: {name:'testCompany'}};
      var value = utils.getCompanyName(person);
      console.log(value);
      value.should.be.equal(person.company.name);

      person = {name: 'no company' };
      value = utils.getCompanyName(person);
      console.log(value);
      should(value).not.be.ok;

      person = {company: { website: 'noname.com' }};
      value = utils.getCompanyName(person);
      console.log(value);
      should(value).not.be.ok;
    });
  });

  describe('getInterstingDomain.()', function () {
    it('should work', function () {
      var person = { domain: { name: 'segment.io', disposable: false, personal: false }};
      var value = utils.getInterestingDomain(person);
      console.log(value);
      value.should.be.equal(person.domain.name);

      person = {};
      value = utils.getInterestingDomain(person);
      console.log(value);
      should(value).be.equal(null);

      person = { domain: { name: 'segment.io', disposable: false, personal: true }};
      value = utils.getInterestingDomain(person);
      console.log(value);
      should(value).be.equal(null);
    });
  });

  describe('getInterstingDomainStripped.()', function () {
    it('should work', function () {
      var person = { domain: { name: 'segment.io', disposable: false, personal: false }};
      var value = utils.getInterestingDomainStripped(person);
      console.log(value);
      value.should.be.equal('segment');

      person = { domain: { name: 'segment.co.jp', disposable: false, personal: false }};
      value = utils.getInterestingDomainStripped(person);
      console.log(value);
      value.should.be.equal('segment.co');

      person = {};
      value = utils.getInterestingDomainStripped(person);
      console.log(value);
      should(value).be.equal(null);

      person = { domain: { name: 'segment.io', disposable: false, personal: true }};
      value = utils.getInterestingDomainStripped(person);
      console.log(value);
      should(value).be.equal(null);
    });
  });

  describe('getCompanyDomain.()', function () {
    it('should work', function () {
      var person = { company: { website: 'segment.io' }};
      var value = utils.getCompanyDomain(person);
      console.log(value);
      value.should.be.equal('segment.io');

      person = { company: { website: 'segment.co.jp' }};
      value = utils.getCompanyDomain(person);
      console.log(value);
      value.should.be.equal('segment.co.jp');


      person = { company: { website: 'www.segment.co.jp' }};
      value = utils.getCompanyDomain(person);
      console.log(value);
      value.should.be.equal('segment.co.jp');

      person = { company: { website: 'www.segment.io' }};
      value = utils.getCompanyDomain(person);
      console.log(value);
      value.should.be.equal('segment.io');

      person = { company: { website: 'http://www.segment.io' }};
      value = utils.getCompanyDomain(person);
      console.log(value);
      value.should.be.equal('segment.io');


      person = { company: { website: ' \n http://www.segment.io \n ' }};
      value = utils.getCompanyDomain(person);
      console.log(value);
      value.should.be.equal('segment.io');


      person = { company: { website: ' \n https://www.segment.io \n ' }};
      value = utils.getCompanyDomain(person);
      console.log(value);
      value.should.be.equal('segment.io');


      person = { company: { website: ' \n https://www.segment.io/asdf.json \n ' }};
      value = utils.getCompanyDomain(person);
      console.log(value);
      value.should.be.equal('segment.io');

      person = {};
      value = utils.getCompanyDomain(person);
      console.log(value);
      should(value).be.equal(null);

      person = { domain: { name: 'segment.io', disposable: false, personal: true }};
      value = utils.getCompanyDomain(person);
      console.log(value);
      should(value).be.equal(null);
    });
  });

  describe('accurateTitle.()', function () {
    it('should accurately choose based on title', function() {
      assert(!utils.accurateTitle('TheLEADSTACK', 'stacklead.com'));
      assert(utils.accurateTitle('Haymarket Media Group', 'haymarket.com'));
      // this doesn't work as expected :()
      assert(!utils.accurateTitle('SeaChange Pharmaceuticals, Inc', 'seachangepharma.com'));
      // this doesn't work as expected :()
      assert(utils.accurateTitle('Zinc Digital Business Solutions Ltd', 'zinc.io'));
      assert(!utils.accurateTitle('www.qatar-index.com', 'index.com'));
      assert(utils.accurateTitle('Haymarket Media Group', 'haymarket media'));
    });
  });


});
