var preparse = require('broccoli-ember-preparse');
var Funnel = require('broccoli-funnel');

module.exports = function() {
  return preparse(
    new Funnel('bower_components/ember', {
      exclude: ['.bower.json']
    }),
    new Funnel('loader'),
    {
      glimmer: true
    }
  );
}
