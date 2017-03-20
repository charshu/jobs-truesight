/* eslint no-unused-expressions: "off" */

const chakram = require('chakram');
const endpoint = require('./helpers/endpointFactory');

const expect = chakram.expect;
chakram.setRequestDefaults({ jar: true });

describe('Authentication test', () => {
  const testingUserData = {
    email: 'apitest@user.com',
    password: 'test123'
  };
  let header;
  beforeEach(() => {
    header = { 'Content-Type': 'application/x-www-form-urlencoded' };
  });

  // TODO: fix all case
  it('should POST /auth/login avaliable', () => chakram.post(endpoint('/auth/login'), header)
      .then((response) => {
        expect(response).to.have.status(400);
      }));

  it('should POST /auth/register create new user and send user info back', () => chakram.post(endpoint('/auth/register'), testingUserData, header)
      .then((response) => {
        expect(response.body.id).to.be.exist;
        expect(response).to.have.status(200);
      }));

  it('should POST /auth/login can login with username and password', () => chakram.post(endpoint('/auth/login'), testingUserData, header)
    .then((response) => {
      expect(response).to.have.status(200);
    }));

  const wrongUserData = {
    email: testingUserData.email,
    password: 'xxxxxxxxx'
  };
  it('should POST /auth/login can not login with username and *wrong password', () => chakram.post(endpoint('/auth/login'), wrongUserData, header)
    .then((response) => {
      expect(response).to.have.status(401);
    }));

  it('should GET /auth/info can receive infomation', () => chakram.get(endpoint('/auth/info'), header)
    .then((response) => {
      expect(response.body._id).to.be.exist;
      expect(response.body.email).to.be.eql(testingUserData.email);
      expect(response).to.have.status(200);
    }));


  it('should GET /logout delete user data from request', () => chakram.get(endpoint('/auth/logout'), header)
    .then((response) => {
      expect(response.body).to.be.eql('Logout');
      expect(response).to.have.status(200);
    }));

  it('should GET /auth/info can not receive infomation after logout', () => chakram.get(endpoint('/auth/info'), header)
    .then((response) => {
      expect(response).to.have.status(401);
    }));

  it('should POST /auth/login can login after logout user', () => chakram.post(endpoint('/auth/login'), testingUserData, header)
    .then((response) => {
      expect(response).to.have.status(200);
    }));

  it('should DELETE /auth remove user from DB', () => chakram.delete(endpoint('/auth'), header)
    .then((response) => {
      expect(response.body).to.be.eql('Removed');
      expect(response).to.have.status(200);
    }));

  it('should POST /auth/login can not login after delete user', () => chakram.post(endpoint('/auth/login'), testingUserData, header)
    .then((response) => {
      expect(response).to.have.status(401);
    }));

  // TODO: implement more test case
  // it('should POST /user return 403 unauthorize if no token in request header',function(){
  //   return chakram.post(endpoint('auth/user'))


  // })

  it('should POST /verifyToken will verify token if expired or not');
  it('should POST and GET /logout with token will remove token from session');
  it('should POST /user with token will return 403 authorize after remove token from session db');
});
