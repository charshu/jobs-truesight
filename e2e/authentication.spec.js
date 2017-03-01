const chakram = require('chakram'),
endpoint = require('./helpers/endpointFactory'),
expect = chakram.expect;


describe('Authentication test', function() {

  const testingUserData = {
    username: 'apitestuser',
    password: 'test',
    email: 'apitest@user.com'
  }
  // TODO: fix all case
  it('should POST /login avaliable', function(){
    return chakram.post(endpoint('/login'))
      .then(function(response) {
        expect(response).to.have.status(200);
      });
  });

  it('should POST /register create new user and send token back', function(){
    return chakram.post(endpoint('/register'), testingUserData)
      .then(function(response){
        expect(response).to.have.status(200);
        expect(response.body.token).to.be.exist();
      });
  });

  it('should POST /login can login with username and password', function(){
    return chakram.post(endpoint('/login'), {
      username: testingUserData.username,
      password: testingUserData.password
    })
    .then(function(response){
      expect(response).to.have.status(200);
    });
  });

  // TODO: implement more test case
  it('should POST /user return 403 unauthorize if no token in request header')
  it('should POST /user send user information back')
  it('should POST /verifyToken will verify token if expired or not');
  it('should POST and GET /logout with token will remove token from session');
  it('should POST /user with token will return 403 authorize after remove token from session db');

})
