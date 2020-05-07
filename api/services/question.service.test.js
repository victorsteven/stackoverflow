import { ObjectID } from 'mongodb'
import QuestionService from './question.service'
import { seedQuestions } from '../test-setup/seed'
import  { connect, clearDatabase, closeDatabase  }  from '../test-setup/db-config'



//Define the variable to hold our seeded data
let seededQuestions
/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await connect();
});

beforeEach(async () => {
  seededQuestions = await seedQuestions()
});

/**
* Clear all test data after every test.
*/
afterEach(async () => {
  await clearDatabase();
  jest.clearAllMocks();
});

/**
* Remove and close the db and server.
*/
afterAll(async () => {
  await closeDatabase();
});


describe('QuestionService', () => {

  describe('createQuestion', () => {

    it('should not create a new question if title already exists', async () => {

      try {

        const firstQuestion = seededQuestions[0]
  
        const record = {
          title: firstQuestion.title, 
          body: 'this is a new body',
          user: new ObjectID('5e6b13809f86ce60e92ff11c')
        };
    
        const questionService = new QuestionService();

        await questionService.createQuestion(record)

      } catch (e) {
        expect(e.message).toMatch('record already exists');
      }
    });

    it('should create a new question successfully', async () => {

      const newQuestion = {
        title: 'How to create a migration in nodejs',
        body: 'I have been trying to create a migration in Nodejs since i was born and have not had a breakthrough',
        user: new ObjectID('5e6b13809f86ce60e92ff11c'), //our seeded user
      };

      const questionService = new QuestionService();

      const question = await questionService.createQuestion(newQuestion);

      expect(question._id).toBeDefined();
      expect(question.title).toBe(newQuestion.title);
      expect(question.body).toBe(newQuestion.body);
      expect(question.user).toEqual(newQuestion.user);

    });
  });

  describe('getQuestion', () => {

    it('should not get a question if record does not exists', async () => {

      try {

        let questionObjID = new ObjectID('5e682d0d580b5a6fb795b842') //the id does not match any of the seeded question

        const questionService = new QuestionService();

        await questionService.getQuestion(questionObjID)
      } catch (e) {
        expect(e.message).toMatch('no record found');
      }
    });

    it('should get a question', async () => {

      const firstQuestion = seededQuestions[0]

      const questionService = new QuestionService();
      const question = await questionService.getQuestion(firstQuestion._id);

      expect(question._id).toBeDefined()
      expect(question._id).toEqual(firstQuestion._id);
      expect(question.title).toBe(firstQuestion.title);
      expect(question.body).toBe(firstQuestion.body);
      expect(question.user).toEqual(firstQuestion.user);
    });
  });

  describe('getQuestions', () => {

    it('should get questions', async () => {

      const questionService = new QuestionService();

      const questions = await questionService.getQuestions()

      expect(questions.length).toEqual(2); //we have two questions in our seeded db
    });
  });

  describe('updateQuestion', () => {

    it('should not update a new question if record already exists, to avoid duplicate', async () => {

      try {

        const firstQuestion = seededQuestions[0]
        const secondQuestion = seededQuestions[1]

        const update = {
          _id: firstQuestion._id,
          title: secondQuestion.title,
          body: secondQuestion.body
        };

        const questionService = new QuestionService();

        await questionService.updateQuestion(update)
      } catch (e) {
        expect(e.message).toMatch('record already exists');
      }
    });

    it('should update a question successfully', async () => {

      const firstQuestion = seededQuestions[0]

      const update = {
        _id: firstQuestion._id,
        title: 'How to use dependency injection in COBOL',
        body: 'I am really excited learning COBOL. How do i achieve dependency injection?'
      };

      const questionService = new QuestionService();

      const updated = await questionService.updateQuestion(update)

      expect(updated._id).toBeDefined()
      expect(updated._id).toEqual(update._id);
      expect(updated.title).toBe(update.title);
      expect(updated.body).toBe(update.body);
    });
  });
});
