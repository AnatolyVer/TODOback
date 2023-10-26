import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index.js';
import User from '../models/User.js';

chai.use(chaiHttp);

const expect = chai.expect;
const mongoMemoryServer = new MongoMemoryServer();

describe('User API', () => {
    let uri;

    before(async () => {
        await mongoMemoryServer.start();
        uri = mongoMemoryServer.getUri();
        mongoose.set('strictQuery', true)
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    after(async () => {
        await mongoose.disconnect();
        await mongoMemoryServer.stop();
    });

    it('Reg new user', (done) => {
        const user = {
            login: 'tolik.vereshchak88@gmail.com',
            password: 'password',
        };

        chai.request(server)
            .post('/user/sign_up')
            .send(user)
            .end(async (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);


                const user = await User.findOne({login: 'tolik.vereshchak88@gmail.com'})
                expect(err).to.be.null;
                expect(user).to.not.be.null;
                expect(user.login).to.equal('tolik.vereshchak88@gmail.com');
                done();
            });
    });
});
