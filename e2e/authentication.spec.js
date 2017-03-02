const chakram = require('chakram'),
endpoint = require('./helpers/endpointFactory'),
expect = chakram.expect;


describe('Authentication test', function() {

  const testingUserData = {
    email: 'apitest@user.com',
    password: 'test123',
    confirmPassword: 'test123'
  }
  const header = {'Content-Type': 'application/x-www-form-urlencoded'};
  // TODO: fix all case
  it('should POST /login avaliable', function(){
    return chakram.post(endpoint('login'))
      .then(function(response) {
        expect(response).to.have.status(302);
      });
  });

  it('should POST /signup create new user and send token back', function(){
    return chakram.post(endpoint('signup'), testingUserData,header)
      .then(function(response){
        expect(response).to.have.status(302);
        expect(response.user).to.be.exist();
      });
  });

  it('should POST /login can login with username and password', function(){
    return chakram.post(endpoint('login'), {
      username: testingUserData.email,
      password: testingUserData.password,
      confirmPassword: testingUserData.password
    },header)
    .then(function(response){
      
      expect(response).to.have.status(200);
    });
  });

  // TODO: implement more test case
  // it('should POST /user return 403 unauthorize if no token in request header')
  // it('should POST /user send user information back')
  // it('should POST /verifyToken will verify token if expired or not');
  // it('should POST and GET /logout with token will remove token from session');
  // it('should POST /user with token will return 403 authorize after remove token from session db');

})
