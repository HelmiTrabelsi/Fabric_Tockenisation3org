//SPDX-License-Identifier: Apache-2.0

var tuna = require('./controller.js');


module.exports = function(app){

  app.get('/EditBalance/:value', function(req, res){
    tuna.EditBalance(req, res);
  });
  app.get('/transfer/:transfer', function(req, res){
    tuna.Transfer(req, res);
  });
  app.get('/get_history/:id', function(req, res){
    tuna.get_history(req, res);
  });
  app.get('/add_tuna/:tuna', function(req, res){
    tuna.add_tuna(req, res);
  });
  app.get('/balance/:user', function(req, res){
    console.log('I am here')
    tuna.balance(req, res);
  });
  app.get('/change_holder/:holder', function(req, res){
    tuna.change_holder(req, res);
  });

// receiver route

  app.get('/get_all_receiver', function(req, res){
    receiver.get_all_receiver(req, res);
  });
  app.get('/get_receiver/:id', function(req, res){
    receiver.get_receiver(req, res);
});
  app.get('/add_receiver/:receiver', function(req, res){
    receiver.add_receiver(req, res);
 
  });
 app.get('/change_receiver_state/:receiver', function(req, res){
    receiver.change_receiver_state(req, res);
 
  });


//login route
 app.get('/add_hospital/:hospital', function(req, res){
    login.add_Hospital(req, res);
 
  });
 app.get('/get_hospital/:id', function(req, res){
    login.get_Hospital(req, res);
 
  });
 app.get('/add_AB/:AB', function(req, res){
    login.add_AB(req, res);
 
  });
 app.get('/get_AB/:id', function(req, res){
    login.get_AB(req, res);
 
  });


}
