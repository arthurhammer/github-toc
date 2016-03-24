var self = require('sdk/self');
var pageMod = require('sdk/page-mod');

pageMod.PageMod({
  include: [/https:\/\/github.com\/.*\/.*/, /https:\/\/gist.github.com\/.*\/.*/],
  contentScriptFile: './github-toc.js',
  contentStyleFile: './style.css',
  attachTo: [/*'existing',*/ 'top'],
  onAttach: function(worker) { }
});
