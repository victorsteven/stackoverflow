import { ObjectID } from 'mongodb'
import UserService from './user.service'
import  password from '../utils/password';
import { seedUsers } from '../test-setup/seed'
import  { connect, clearDatabase, closeDatabase  }  from '../test-setup/db-config'


let seededUsers

//Connect to in-memory db before test
beforeAll(async () => {
  await connect();
});
beforeEach(async () => {
  seededUsers = await seedUsers()
});
// Clear all test data after every test.
afterEach(async () => {
  await clearDatabase();
});
// Remove and close the db and server.
afterAll(async () => {
  await closeDatabase();
});


describe('UserService', () => {

  describe('createUser', () => {

    it('should not create a new user if record already exists', async () => {

      let user = {
        username: 'frankdonga',
        email: seededUsers[0].email,
        password: 'password',
      }
      const userService = new UserService();

      await expect(userService.createUser(user)).rejects.toThrow('record already exists'); 
    });

    it('should create a new user', async () => {

      let userNew = {
        username: 'kate',
        email: 'kate@example.com',
        password: 'password',
      }

      //'hashPassword' is a  dependency, so we mock it, and return any value we want
      const hashPass = jest.spyOn(password, 'hashPassword').mockReturnValue('ksjndfklsndflksdmlfksdf')

      const userService = new UserService();
      const user = await userService.createUser(userNew);

      expect(hashPass).toHaveBeenCalled();
      expect(user._id).toBeDefined();
      expect(user.username).toBe(userNew.username);
    });
  });


  describe('getUser', () => {

    it('should not get an user if record does not exists', async () => {

      try {

        //This user does not exist
        let userObjID = new ObjectID("5e682d0d580b5a6fb795b842")

        const userService = new UserService();

        await userService.getUser(userObjID)

      } catch (e) {
        expect(e.message).toMatch('no record found');
      }
    });

    it('should get a user', async () => {

      const userService = new UserService();
      const user = await userService.getUser(seededUsers[0]._id);

      expect(user._id).toBeDefined();
      expect(user.username).toBeDefined();
    });
  });
});
