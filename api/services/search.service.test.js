import SearchService from './search.service'
import { seedUsers, seedQuestionsndAnswers } from '../test-setup/seed'
import  { connect, clearDatabase, closeDatabase  }  from '../test-setup/db-config'


/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await connect();
});

beforeEach(async () => {
  await seedUsers()
  await seedQuestionsndAnswers()
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


describe('SearchUserService', () => {

  describe('searchUser', () => {

    it('should return empty if search result is not found', async () => {

      let userInput = 'joelmartin'

      const searchService = new SearchService();

      const users = await searchService.searchUser(userInput)

      expect(users.length).toBe(0)
     
    });

    it('should search and get users(s)', async () => {

      let userInput = 'abdul'

      const searchService = new SearchService();

      const users = await searchService.searchUser(userInput);

      //this record can be greater than zero
      expect(users.length).toBeGreaterThan(0)

    });
    
  });
});


describe('SearchQuestionService', () => {

  describe('searchQuestion', () => {

    it('should return empty if search result is not found', async () => {

      let userInput = 'This is the title'

      const searchService = new SearchService();

      const questions = await searchService.searchQuestion(userInput)

      expect(questions.length).toBe(0)
     
    });

    it('should search and get questions(s)', async () => {

      let userInput = 'How to convert float64 to string in Golang' //this title exist in the db

      const searchService = new SearchService();

      const users = await searchService.searchQuestion(userInput);

      //this record can be greater than zero
      expect(users.length).toBeGreaterThan(0)

    });
  });
});


describe('SearchAnswerService', () => {

  describe('searchAnswer', () => {

    it('should return empty if search result is not found', async () => {

      let userInput = 'This is the not found answer'

      const searchService = new SearchService();

      const users = await searchService.searchAnswer(userInput)

      expect(users.length).toBe(0)
     
    });

    it('should search and get answer(s)', async () => {

      let userInput = 'This is the first answer' //this is found in the in-memory db

      const searchService = new SearchService();

      const users = await searchService.searchAnswer(userInput);

      //this record can be greater than zero
      expect(users.length).toBeGreaterThan(0)

    });
  });
});

