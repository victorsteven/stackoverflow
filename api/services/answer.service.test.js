import { ObjectID } from 'mongodb'
import AnswerService from './answer.service'
import Answer from '../models/answer'
import { seedAnswers } from '../test-setup/seed'
import  { connect, clearDatabase, closeDatabase  }  from '../test-setup/db-config'



//Define the variable to hold our seeded data
let seededAnswers
/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await connect();
});

beforeEach(async () => {
  seededAnswers = await seedAnswers()
});

/**
* Clear all test data after every test.
*/
afterEach(async () => {
  await clearDatabase();
});

/**
* Remove and close the db and server.
*/
afterAll(async () => {
  await closeDatabase();
});


describe('AnswerService', () => {

  describe('createAnswer', () => {

    it('should create a new answer successfully', async () => {

      const stubValue = {
        body: 'This is a new answer to the question',
        question: new ObjectID('5e6d169de43d8272913a7d99'),
        user: new ObjectID('5e6d1745e43d8272913a7d9d'),
      };

      const answerService = new AnswerService();

      const answer = await answerService.createAnswer(stubValue);

      expect(answer.body).toEqual(stubValue.body);
      expect(answer.user).toEqual(stubValue.user);
    });


    it('should not create answer if error occurs', async () => {

      try {

        const stubValue = {
          body: '', //we omitted the body
          question: new ObjectID('5e6d169de43d8272913a7d99'),
          user: new ObjectID('5e6d1745e43d8272913a7d9d'),
        };

        const answerService = new AnswerService();

        await answerService.createAnswer(stubValue);

      } catch (e) {
        expect(e.message).toBeDefined();
      }
    });
    
    it('should not create an if the user have answer same thing before', async () => {

      let seeded = await seededAnswers[0]

      const ans = {
        body: seeded.body, 
        question: new ObjectID('5e6d169de43d8272913a7d99'),
        user: new ObjectID('5e6d1745e43d8272913a7d9d'),
      };

      const answerService = new AnswerService();

      await expect(answerService.createAnswer(ans)).rejects.toThrow('record already exists'); 
    });
  });


  describe('getAnswer', () => {

    it('should not get a answer if record does not exists', async () => {

      try {

        let answerObjID = new ObjectID('5e682d0d580b5a6fb795b842') //random id

        const answerService = new AnswerService();

        await answerService.getAnswer(answerObjID)

      } catch (e) {
        expect(e.message).toMatch('no record found');
      }
    });

    it('should get an answer', async () => {

      const firstAnswer = await seededAnswers[0]

      const answerService = new AnswerService();

      const answer = await answerService.getAnswer(firstAnswer._id);

      expect(answer._id).toEqual(firstAnswer._id);
      expect(answer.body).toBe(firstAnswer.body);
    });
  });


  describe('updateAnswer', () => {

    it('should update a answer successfully', async () => {

      try {

        const firstAnswer = await seededAnswers[0]

        const stubValue = {
          _id:  firstAnswer._id,
          body: "this is an update"
        };

        const answerService = new AnswerService();

        const answer = await answerService.updateAnswer(stubValue);

        expect(answer.body).toEqual(stubValue.body)

      } catch (e) {
        expect(e).toMatch(null);
      }
    });
  });


  describe('getAnswers', () => {

    it('should get answers', async () => {

      const quesId = await seededAnswers[0].question

      const answerService = new AnswerService();
      const answers = await answerService.getAnswers(quesId); //answers coming from our in-memory db

      expect(answers.length).toEqual(2);

    });
  });
});
