import { ObjectID } from 'mongodb'
import VoteService from './vote.service'
import Vote from '../models/vote'
import { seedQuestionsAndVotes } from '../test-setup/seed'
import  { connect, clearDatabase, closeDatabase  }  from '../test-setup/db-config'



//Define the variable to hold our seeded data
let seededVotes
/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
  await connect();
});

beforeEach(async () => {
  seededVotes = await seedQuestionsAndVotes()
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


describe('VoteService', () => {

  describe('createVote', () => {

    it('should create a new upvote successfully', async () => {

      const stubValue = {
        kind: 'upvote',
        question: new ObjectID('5e6d169de43d8272913a7d99'),
        user: new ObjectID('5e6d1745e43d8272913a7d9d'),
      };

      const voteService = new VoteService();

      const vote = await voteService.createVote(stubValue);

      expect(vote.body).toEqual(stubValue.body);
      expect(vote.user).toEqual(stubValue.user);
    });

    it('should create a new downvote successfully', async () => {

      const stubValue = {
        kind: 'downvote',
        question: new ObjectID('5e6d169de43d8272913a7d99'),
        user: new ObjectID('5e6d1745e43d8272913a7d9d'),
      };

      const voteService = new VoteService();

      const vote = await voteService.createVote(stubValue);

      expect(vote.body).toEqual(stubValue.body);
      expect(vote.user).toEqual(stubValue.user);
    });
  });


  describe('getVote', () => {

    it('should get a vote', async () => {

      const firstVote = await seededVotes[0]

      const voteService = new VoteService();

      const vote = await voteService.getVote(firstVote.user, firstVote.question);

      expect(vote._id).toEqual(firstVote._id);
      expect(vote.kind).toBe(firstVote.kind);
    });
  });


  describe('deleteVote', () => {

    it('should delete a vote successfully', async () => {

      try {

        const firstvote = await seededVotes[0]


        const voteService = new VoteService();

        await voteService.deleteVote(firstvote._id);

      } catch (e) {
        expect(e).toMatch(null);
      }
    });

    it('should not delete a vote if not found', async () => {

      try {

        const randomId = new ObjectID()

        const voteService = new VoteService();

        await voteService.deleteVote(randomId); 

      } catch (e) {
        expect(e.message).toMatch('something went wrong');
      }
    });
  });
});
