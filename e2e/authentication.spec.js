const chakram = require('chakram'),
endpoint = require('./helpers/endpointFactory'),
expect = chakram.expect;
chakram.setRequestDefaults({jar: true})

describe('Authentication test', function() {

  const testingUserData = {
    email: 'apitest@user.com',
    password: 'test123'
  }
  let header;
  beforeEach(function(){
    header = {'Content-Type': 'application/x-www-form-urlencoded'};
  })

  // TODO: fix all case
  it('should POST /auth/login avaliable', function(){
    return chakram.post(endpoint('/auth/login'))
      .then(function(response) {
        expect(response).to.have.status(400);
      });
  });

  it('should POST /auth/register create new user and send user info back', function(){
    return chakram.post(endpoint('/auth/register'), testingUserData, header)
      .then(function(response){
        expect(response.body.id).to.be.exist;
        expect(response).to.have.status(200);
      });
  });

  it('should POST /auth/login can login with username and password', function(){
    return chakram.post(endpoint('/auth/login'), testingUserData, header)
    .then(function(response){
      expect(response).to.have.status(200);
    });
  });

  it('should GET /auth/info can receive infomation', function(){
    return chakram.get(endpoint('/auth/info'), header)
    .then(function(response){
      expect(response.body._id).to.be.exist;
      expect(response.body.email).to.be.eql(testingUserData.email);
      expect(response).to.have.status(200);
    })
  })

  it('should DELETE /auth remove user from DB', function() {
    return chakram.delete(endpoint('/auth'), header)
    .then(function(response){
      expect(response.body).to.be.eql('Removed');
      expect(response).to.have.status(200);
    });
  });

  it('should POST /auth/login can not login after delete user', function() {
    return chakram.post(endpoint('/auth/login'), testingUserData, header)
    .then(function(response){
      expect(response).to.have.status(401);
    });
  })


  // TODO: implement more test case
  // it('should POST /user return 403 unauthorize if no token in request header')
  // it('should POST /user send user information back')
  // it('should POST /verifyToken will verify token if expired or not');
  // it('should POST and GET /logout with token will remove token from session');
  // it('should POST /user with token will return 403 authorize after remove token from session db');

})
