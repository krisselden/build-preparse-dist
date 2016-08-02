var preparse = require('broccoli-ember-preparse');
var Funnel = require('broccoli-funnel');
var Filter = require('broccoli-persistent-filter');



module.exports = function() {
  return preparse(
    new StripSourceMap(new Funnel('bower_components/ember', {
      exclude: ['.bower.json']
    })),
    {
      glimmer: true
    }
  );
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