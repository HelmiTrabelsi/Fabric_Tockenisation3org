//SPDX-License-Identifier: Apache-2.0

var Token = require('./controller.js');


module.exports = function(app){

  app.get('/CreateToken/:token', function(req, res){
    Token.CreateToken(req, res);
  });
  app.get('/CreateTokenFromOther/:token', function(req, res){
    Token.CreateTokenFromOther(req, res);
  });
  app.get('/GiveConsent/:data', function(req, res){
    Token.GiveConsent(req, res);
  });
  app.get('/GiveConsentToOrg/:data', function(req, res){
    Token.GiveConsentToOrg(req, res);
  });
  app.get('/deleteToken/:id', function(req, res){
    Token.deleteToken(req, res);
  });
  app.get('/GetToken/:id', function(req, res){
    Token.GetToken(req, res);
  });
  app.get('/AddInput/:token', function(req, res){
    Token.AddInput(req, res);
  });
  app.get('/RemoveInput/:token', function(req, res){
    Token.RemoveInput(req, res);
  });
  app.get('/FinalizeToken/:id', function(req, res){
    Token.FinalizeToken(req, res);
  });
  app.get('/RegisterUser/:user', function(req, res){
    Token.RegisterUser(req, res);
  });
  app.get('/SignInUser/:user', function(req, res){
    Token.SignInUser(req, res);
  });
  app.get('/RegisterUser/:user', function(req, res){
    Token.RegisterUser(req, res);
  });
  app.get('/SetAuthCall/:token', function(req, res){
    Token.SetAuthCall(req, res);
  });
}

