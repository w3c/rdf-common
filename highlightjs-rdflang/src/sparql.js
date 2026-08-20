/*
Language: SPARQL
Requires: trig.js
Category: common
Description: SPARQL Protocol and RDF Query Language for the semantic web
Website: https://www.w3.org/TR/sparql11-query/, http://www.w3.org/TR/sparql11-update/, https://www.w3.org/TR/sparql11-federated-query/
Based on:
  - <https://github.com/highlightjs/highlightjs-rdflang/>
    Copyright (c) 2019 Vladimir Alexiev, Mark Ellis, Marcos Cáceres.
    Available under the MIT license.
*/

var module = module ? module : {};     // shim for browser use

function hljsDefineSparql(hljs) {
  var ttl = hljs.getLanguage('trig').exports;
  var KEYWORDS = {
    keyword: 'base|10 prefix|10 version|10 @base|10 @prefix|10 @version|10 add all as|0 ask bind by|0 clear construct|10 copy move create data default define delete describe distinct drop exists filter from|0 graph|10 group having in|0 insert limit load minus named|10 not offset optional order reduced select|0 service silent to union using values where with|0',
    name: 'abs asc avg bound ceil coalesce concat contains strbefore count day hours desc encode_for_uri floor group_concat if|0 iri isblank isiri isliteral isnumeric isuri lang langdir haslang haslangdir datatype langmatches lcase max md5 min|0 minutes month now rand regex replace round sameterm sample seconds separator sha1 sha256 sha384 sha512 str strafter strdt strends strlang strlangdir strlen strstarts struuid substr sum then timezone tz ucase uri bnode uuid year triple subject predicate object istriple',
    literal: 'true|0 false|0',
    built_in: 'a|0'
  };

  var VARIABLE = {
    className: 'variable',
    begin: '[?$]' + hljs.IDENT_RE,
    relevance: 0,
  };

  return {
    case_insensitive: true,
    keywords: KEYWORDS,
    aliases: ['sparql', 'rql', 'rq', 'ru'],
    contains: [
      ttl.REIFIED_TRIPLE,
      ttl.LANGTAG,
      ttl.DATATYPE,
      ttl.IRI_TERM,
      ttl.BLANK_NODE,
      ttl.PNAME,
      VARIABLE,
      ttl.TRIPLE_QUOTE_STRING,
      ttl.TRIPLE_APOS_STRING,
      ttl.QUOTE_STRING_LITERAL,
      ttl.APOS_STRING_LITERAL,
      ttl.NUMBER,
      hljs.HASH_COMMENT_MODE,
      ttl.ANNOTATION,
      ttl.NAMED_ANNOT,
    ]
  };
}


module.exports = function(hljs) {
    hljs.registerLanguage('sparql', hljsDefineSparql);
};

module.exports.definer = hljsDefineSparql;
