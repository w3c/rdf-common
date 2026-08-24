/*
Language: TriG 1.2
Website: https://www.w3.org/TR/rdf12-trig/
Description: Syntax higlighting for the Turtle and TriG encodings of RDF
Category: common
Based on:
  - <https://github.com/highlightjs/highlightjs-rdflang/>
    Copyright (c) 2019 Vladimir Alexiev, Mark Ellis, Marcos Cáceres.
    Available under the MIT license.
*/

var module = module ? module : {};     // shim for browser use

function hljsDefineTrig(hljs) {
  const KEYWORDS = {
    $pattern: /@?\w+/,
    keyword: '@base|10 @prefix|10 @version|10 base|10 prefix|10 version|10 graph',
    literal: 'true|0 false|0',
    built_in: 'a|0'
  };

  const IRI_TERM = {
    className: 'literal',
    relevance: 1, // XML tags look also like relative IRIs
    begin: /<(?!\s|<)/,  // avoid shadowing operator in extensions (e.g. SPARQL)
    end: />/,
    illegal: /[\x00-\x20<>"{}|^`]/,
  };

  // https://www.w3.org/TR/turtle/#terminals
  const PN_CHARS_BASE    = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u10000-\uEFFFF';
  const PN_CHARS_U       = PN_CHARS_BASE+'_';
  const PN_CHARS         = '-'+PN_CHARS_U+'0-9\u00B7\u0300-\u036F\u203F-\u2040';
  const BLANK_NODE_LABEL = '_:['+PN_CHARS_U+'0-9](['+PN_CHARS+'.]*['+PN_CHARS+'])?';
  const PN_PREFIX        = '['+PN_CHARS_BASE+'](['+PN_CHARS+'.]*['+PN_CHARS+'])?';
  const PERCENT          = '%[0-9A-Fa-f][0-9A-Fa-f]';
  const PN_LOCAL_ESC     = '\\\\[_~.!$&\'()*+,;=/?#@%-]';
  const PLX              = PERCENT+'|'+PN_LOCAL_ESC;
  const PNAME_NS         = '('+PN_PREFIX+')?:';
  const PN_LOCAL         = '(['+PN_CHARS_U+':0-9]|'+PLX+')(['+PN_CHARS+'.:]|'+PLX+')*(['+PN_CHARS+':]|'+PLX+')?';
  const PNAME_LN         = PNAME_NS+PN_LOCAL;
  const PNAME_NS_or_LN   = PNAME_NS+'('+PN_LOCAL+')?';

  const PNAME = {
    begin: PNAME_NS_or_LN,
    relevance: 1,
    className: 'symbol',
  };

  const BLANK_NODE_TERM = {
    begin: BLANK_NODE_LABEL,
    relevance: 10,
    className: 'template-variable',
  };

  const LANGTAG = {
    begin: /(?<=["'])@[a-zA-Z]+([a-zA-Z0-9-]+)*/,
    className: 'type',
    relevance: 5, // also catches objectivec keywords like: @protocol, @optional
  };

  const DATATYPE =  {
    begin: '\\^\\^',
    className: 'type',
    relevance: 10,
  };

  const TRIPLE_APOS_STRING = {
    begin: /'''/,
    end: /'''/,
    className: 'string',
    relevance: 0,
  };

  const TRIPLE_QUOTE_STRING = {
    begin: /"""/,
    end: /"""/,
    className: 'string',
    relevance: 0,
  };

  const APOS_STRING_LITERAL = Object.assign({}, hljs.APOS_STRING_MODE, {relevance: 0});

  const QUOTE_STRING_LITERAL = Object.assign({}, hljs.QUOTE_STRING_MODE, {relevance: 0});

  const NUMBER = Object.assign({}, hljs.C_NUMBER_MODE);
  NUMBER.relevance = 0;

  const BLANK_NODE = {
    begin: /[\[\]]/,
    className: 'template-variable',
    relevance: 0,
  };

  const LIST = {
    begin: /[()]/,
    className: 'subst',
    relevance: 0,
  };

  const BLOCK = {
    begin: /{|}/,
    className: 'meta',
    relevance: 0,
  };

  const PUNCTUATION = {
    begin: /[.;,]/,
    className: 'subst',
    relevance: 0,
  };

  const REIFICATION = {
    begin: /~|<<\(|\)>>|<<|>>|{\||\|}/,
    className: 'subst',
    relevance: 0,
  };

  const CONTAINS = [
    LANGTAG,
    DATATYPE,
    IRI_TERM,
    BLANK_NODE_TERM,
    PNAME,
    TRIPLE_APOS_STRING,
    TRIPLE_QUOTE_STRING,
    APOS_STRING_LITERAL,
    QUOTE_STRING_LITERAL,
    NUMBER,
    hljs.HASH_COMMENT_MODE,
    PUNCTUATION,
    REIFICATION,
    BLANK_NODE,
    LIST,
    BLOCK,
  ];

  return {
    case_insensitive: true,
    keywords: KEYWORDS,
    aliases: ['trig', 'turtle', 'ttl', 'ntriples', 'nt', 'nquads', 'nq'],
    contains: CONTAINS,
    exports: {
      LANGTAG,
      DATATYPE,
      IRI_TERM,
      BLANK_NODE_TERM,
      PNAME,
      TRIPLE_QUOTE_STRING,
      TRIPLE_APOS_STRING,
      QUOTE_STRING_LITERAL,
      APOS_STRING_LITERAL,
      NUMBER,
      PUNCTUATION,
      REIFICATION,
      BLANK_NODE,
      LIST,
      BLOCK,
    }
  };
}

module.exports = function(hljs) {
  hljs.registerLanguage('trig', hljsDefineTrig);
};

module.exports.definer = hljsDefineTrig;
