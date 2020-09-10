var express = require('express');
const consign = require('consign');

var app = express();
consign()
  .include('libs/config-app.js')
  .then('routes')
  .then('libs/boot.js')
  .into(app);
