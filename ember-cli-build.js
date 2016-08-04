var preparse = require('broccoli-ember-preparse');
var Funnel = require('broccoli-funnel');
var Filter = require('broccoli-persistent-filter');
var fs = require('fs');
var SemVer = require('semver');

var bowerConfig = JSON.parse(fs.readFileSync('bower_components/ember/bower.json', 'utf8'));


var version = new SemVer(bowerConfig.version);
console.log('building', version);

var options = {
  eagerLoad: [
    'htmlbars-runtime/hooks',
    'ember/index',
    'ember-htmlbars/system/render-view',
    'ember-metal/streams/key-stream',
    'ember-runtime/mixins/-proxy'
  ]
};

if (version.major === 2) {
  if (version.minor > 6) {
    if (version.minor === 7) {
      options.eagerLoad = [
        'htmlbars-runtime/hooks',
        'ember-htmlbars/renderer',
        'ember-htmlbars/component',
        'ember-htmlbars/helper',
        'ember-htmlbars/components/checkbox',
        'ember-htmlbars/components/text_field',
        'ember-htmlbars/components/text_area',
        'ember-htmlbars/components/link-to',
        'ember-htmlbars/setup-registry',
        'ember-htmlbars/streams/key-stream',
        'ember-runtime/mixins/-proxy',
        'ember/index'
      ];
    } else {
      if (version.prerelease[0] === 'alpha') {
        options.eagerLoad = [
          'glimmer-reference/index',
          'ember-glimmer/components/checkbox',
          'ember-glimmer/components/link-to',
          'ember-glimmer/components/text_area',
          'ember-glimmer/components/text_field',
          'ember-glimmer/renderer',
          'ember-glimmer/make-bound-helper',
          'ember-glimmer/setup-registry',
          'ember-glimmer/views/outlet',
          'ember-glimmer/templates/outlet',
          'ember-glimmer/templates/component',
          'ember-glimmer/dom',
          'ember/index'
        ];
      } else {
        options.eagerLoad = [
          'ember-htmlbars/renderer',
          'ember-htmlbars/component',
          'ember-htmlbars/helper',
          'ember-htmlbars/components/checkbox',
          'ember-htmlbars/components/text_field',
          'ember-htmlbars/components/text_area',
          'ember-htmlbars/components/link-to',
          'ember-htmlbars/utils/string',
          'ember-htmlbars/make-bound-helper',
          'ember-htmlbars/setup-registry',
          'ember-htmlbars/index',
          'ember-htmlbars/streams/key-stream',
          'ember-runtime/mixins/-proxy',
          'ember/index'
        ];
      }
    }
  }
}

module.exports = function() {
  var bowerEmber = new Funnel('bower_components/ember', {
    exclude: ['.bower.json']
  });
  return preparse(new StripSourceMap(bowerEmber), options);
}

StripSourceMap.prototype = Object.create(Filter.prototype);

StripSourceMap.prototype.constructor = StripSourceMap;
function StripSourceMap(inputNode, options) {
  options = options || {};
  Filter.call(this, inputNode, {
    annotation: options.annotation
  });
}

StripSourceMap.prototype.extensions = ['js'];
StripSourceMap.prototype.targetExtension = 'js';

StripSourceMap.prototype.processString = function(content, relativePath) {
  var buffer = '';
  var start = 0;
  var end;

  while (start !== -1 && (end = content.indexOf('//# sourceMappingURL=', start)) !== -1) {
    buffer += content.substring(start, end);
    start = content.indexOf('\n', end);
  }

  if (start !== -1) {
    buffer += content.substring(start, content.length);
  }

  return buffer;
};