'use strict';

var cheerio = require('cheerio');

exports.strip = function(str, tags) {
  var $ = cheerio.load(str, {decodeEntitie: false});

  if (!tags || tags.length === 0) {
    return str;
  }

  tags = !Array.isArray(tags) ? [tags] : tags;
  var len = tags.length;

  while (len--) {
    $(tags[len]).remove();
  }

  return $.html();
};

exports.fetch = function(str, tag) {
  var $ = cheerio.load(str, {decodeEntitie: false});
  if (!tag) return str;

  return $(tag).html();
};