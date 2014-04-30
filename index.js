var objcase = require('obj-case');
var natural = require('natural');

module.exports.name = require('people-names');
module.exports.objcase = objcase;

var FUZZY_MATCH_REGEX = /(\d+)(\+)?([^0-9-]*)?(-)?([^0-9]*)?(\d*)?(\+)?/;
module.exports.fuzzifyNumberRange = function(inputString) {
  var match = inputString.match(FUZZY_MATCH_REGEX);
  if (!match) return null;
  var lowerBound = parseInt(match[1], 10);
  var lowerPlus = !!match[2];
  // match[3] is garbage
  var isRange = !!match[4];
  // match[5] is garbage
  var upperBound = match[6];
  var upperPlus = !!match[7];

  // logic is lower bound plus a random number < (lowerBound - upperBound)
  // if no upper bound create one
  if (!upperBound) {
    if (lowerPlus) {
      upperBound = 1.1 * lowerBound;
    } else {
      upperBound = lowerBound;
    }
  } else {
    upperBound = parseInt(upperBound, 10);
  }

  var estimate = Math.floor(lowerBound + (Math.random() * (upperBound - lowerBound)));
  var error = Math.min(estimate - lowerBound, upperBound - estimate);

  return {
    value: estimate,
    errorRange: error
  };
};


var getCompanyName = module.exports.getCompanyName = function(person) {
  return objcase(person, 'company.name');
};

/**
 * Get an interesting domain.
 *
 * @param {Object} person
 * @return {String}
 */

var getInterestingDomain = module.exports.getInterestingDomain = function(person) {
  if (person.domain && !person.domain.disposable && !person.domain.personal)
    return person.domain.name;
  else
    return null;
};

module.exports.getInterestingDomainStripped = function(person) {
  var interestingDomain = getInterestingDomain(person);
  if (interestingDomain) {
    return strippedDomain(interestingDomain);
  } else {
    return null;
  }
};

var strippedDomain = module.exports.strippedDomain = function(domain) {
  return domain.split('.').slice(0, -1).join('.');
};

var getCompanyDomain = module.exports.getCompanyDomain = function(person) {
  var companyWebsite = objcase(person, 'company.website');
  return getCleanDomain(companyWebsite);
};

var getCleanDomain = module.exports.getCleanDomain = function(url) {
  if (url) {
    var hostname = url;
    var protocolIndex = url.indexOf('://');
    if (protocolIndex != -1) {
      hostname = hostname.substr(protocolIndex + 3);
    }
    // trim to just domain - remove rest of url.
    hostname = hostname.split('/')[0].trim();
    // remove random things like blog. or www.
    // for this case we may be better off just blacklisting a few subdomains
    // like www rather than aggressively triming to just two levels
    if (hostname.split('.').length > 2) {
      var splitHostname = hostname.split('.');
      if (splitHostname.slice(-2)[0].length < 3) {
        // e.g. somedomain.co.uk, asdf.co.jp
        return splitHostname.slice(-3).join('.');
      } else {
        return splitHostname.slice(-2).join('.');
      }
    } else {
      return hostname;
    }
  } else {
    return null;
  }
};

var getCompanySearchTerm = module.exports.getCompanySearchTerm = function(person) {
  var company = getCompanyName(person);
  var domain = getInterestingDomain(person);
  var companyDomain = getCompanyDomain(person);
  return companyDomain || domain || company;
};

var MAX_DIST = 7;
var MIN_JARO = 0.8;
module.exports.accurateTitle = function(title, query, maxDistance, minJaro) {
  maxDistance = maxDistance || MAX_DIST;
  minJaro = minJaro || MIN_JARO;
  title = title.toLowerCase();
  query = query.toLowerCase();
  var jaro = natural.JaroWinklerDistance(title, query);
  //console.log('action=jaro value=%d title=%s query=%s', jaro, title, query);
  //console.log('action=lev value=%d title=%s query=%s', lev, title, query);
  //var lev = natural.LevenshteinDistance(title, query);
  //if (lev < maxDistance || jaro > minJaro) {
  // jaro seems to do a good enough job - ignore lev for now.
  if (jaro > minJaro) {
    return true;
  }
  // attempt to scan full title by token for our query term
  /*
  var splitTitle = title.split(/\s+/);
  var splitQuery = query.split(/\s+/);
  if (splitTitle.length > 1 && splitTitle.length > splitQuery.length) {
    for (var i=0; i < splitTitle.length; i++) {
      var substr = splitTitle.slice(i, i+splitQuery.length).join(' ');
      lev = natural.LevenshteinDistance(substr, query);
      jaro = natural.JaroWinklerDistance(query, substr);
      console.log('action=jaro value=%d title=%s query=%s', jaro, substr, query);
      console.log('action=lev value=%d title=%s query=%s', lev, substr, query);
      if (lev < (maxDistance / 2)  || jaro > minJaro) {
        return true;
      }
    }
  }
  */
  return false;
};