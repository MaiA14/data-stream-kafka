
const request = require('supertest');
const expect = require('chai').expect;

const API_URL = 'http://localhost:4000/api'

describe('Check GET  - main server is online', () => {
  it('should successfully pass the test for get server online', (done) => {
    request(API_URL)
      .get('/server-online')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
  });
});


const streamData = {
  filePath: 'gs://public-assignments',
  fileName: 'generated.json',
  brokerTopic: 'assignments'
}

describe('Check POST - read notification', () => {
  it('should successfully pass the test for post api', (done) => {
    request(`${API_URL}/server-online`)
      .post('/readNotifications')
      .send(streamData)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
  }).timeout(5000);
});
