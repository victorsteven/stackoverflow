import VoteController from './vote.controller'
import QuestionService from '../services/question.service'
import UserService from '../services/user.service'
import VoteService from '../services/vote.service'
import faker from 'faker'
import { ObjectID } from 'mongodb';

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};


describe('VoteController', () => {

  let res, voteController, userService, questionService, voteService

  beforeEach(() => {

    res = mockResponse()
    questionService = new QuestionService();
    userService = new UserService();
    voteService = new VoteService();
  });

  afterEach(() => {    
    jest.clearAllMocks();
  });


  describe('upvote', () => {

    it('should return unauthorized if no token is provided', async () => {
      const req = {

        params: { quesId: '5e6403c9e4ca0f9fce20b1b3'}, //this is a valid question id

      };

      voteController = new VoteController(userService, questionService, voteService);

      await voteController.upvote(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized'});

    });

    it('should return error if the question id is invalid', async () => {

      const req = {

        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { quesId: 'dkshfsdhfoisdhfoisdf'} //invalid id
      };

      voteController = new VoteController(userService, questionService, voteService);

      await voteController.upvote(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'error': 'question id is not valid' });

    });


    it('should create a new upvote successfully', async () => {

      const req = {
        
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { quesId: '5e6403c9e4ca0f9fce20b1b3'}, //this is a valid question id

      };

      const stubUser = {
        _id: new ObjectID(),
        username: faker.name.findName(),
      }

      const gottenQuestion = {
        _id: new ObjectID(),
        title: 'THis is the title',
        body: 'This is the body'
      }
    
      const stubValue = {
        _id: new ObjectID(),
        question: new ObjectID(),
        user: new ObjectID(),
        kind: 'upvote'
      }

      const gottenVote = {} //the vote has not been created before

      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(stubUser);
      const getQuestion = jest.spyOn(questionService, 'getQuestion').mockReturnValue(gottenQuestion);
      const gottenStub = jest.spyOn(voteService, 'getVote').mockReturnValue(gottenVote); 
      const stub = jest.spyOn(voteService, 'createVote').mockReturnValue(stubValue);

      voteController = new VoteController(userService, questionService, voteService);

      await voteController.upvote(req, res);


      expect(getQuestion).toHaveBeenCalledTimes(1)
      expect(userStub).toHaveBeenCalledTimes(1)
      expect(gottenStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({'status': 201, 'data': stubValue });
    });


    it('should not create multiple upvotes for the same question', async () => {

      const req = {
        
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { quesId: '5e6403c9e4ca0f9fce20b1b3'}, //this is a valid question id

      };

      const stubUser = {
        _id: new ObjectID(),
        username: faker.name.findName(),
      }

      const gottenQuestion = {
        _id: new ObjectID(),
        title: 'THis is the title',
        body: 'This is the body'
      }

      const gottenVote = {
        _id: new ObjectID(),
        question: new ObjectID('5e6403c9e4ca0f9fce20b1b3'),
        user: new ObjectID('5eb1d0954ba8fe5844a6f2ff'),
        kind: 'upvote'
      }
    
      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(stubUser);
      const getQuestion = jest.spyOn(questionService, 'getQuestion').mockReturnValue(gottenQuestion);
      const gottenStub = jest.spyOn(voteService, 'getVote').mockReturnValue(gottenVote); 

      voteController = new VoteController(userService, questionService, voteService);

      await voteController.upvote(req, res);

      expect(getQuestion).toHaveBeenCalledTimes(1)
      expect(userStub).toHaveBeenCalledTimes(1)
      expect(gottenStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'cannot upvote multiple times' });
    });


    it('should first remove a downvote before upvoting a question', async () => {

      const req = {
        
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { quesId: '5e6403c9e4ca0f9fce20b1b3'}, //this is a valid question id

      };

      const stubUser = {
        _id: new ObjectID(),
        username: faker.name.findName(),
      }

      const gottenQuestion = {
        _id: new ObjectID(),
        title: 'THis is the title',
        body: 'This is the body'
      }

      const gottenVote = {
        _id: new ObjectID(),
        question: new ObjectID('5e6403c9e4ca0f9fce20b1b3'),
        user: new ObjectID('5eb1d0954ba8fe5844a6f2ff'),
        kind: 'downvote'
      }

      //this response can be anything. It does not matter because it is a stub
      const delStub = {
        data: 'downvote deleted'
      }

      const newStubValue = {
        _id: new ObjectID(),
        question: new ObjectID(),
        user: new ObjectID(),
        kind: 'upvote'
      }
    
      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(stubUser);
      const getQuestion = jest.spyOn(questionService, 'getQuestion').mockReturnValue(gottenQuestion);
      const gottenStub = jest.spyOn(voteService, 'getVote').mockReturnValue(gottenVote); 
      const deletedStub = jest.spyOn(voteService, 'deleteVote').mockReturnValue(delStub); 
      const stub = jest.spyOn(voteService, 'createVote').mockReturnValue(newStubValue);

      voteController = new VoteController(userService, questionService, voteService);

      await voteController.upvote(req, res);

      expect(getQuestion).toHaveBeenCalledTimes(1)
      expect(userStub).toHaveBeenCalledTimes(1)
      expect(gottenStub).toHaveBeenCalledTimes(1)
      expect(deletedStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({'status': 201, 'data': newStubValue });

    });

    it('should not upvote a question if db error occurs', async () => {

      const req = {
        
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { quesId: '5e6403c9e4ca0f9fce20b1b3'}, //this is a valid question id

      };

      const stubUser = {
        _id: new ObjectID(),
        username: faker.name.findName(),
      }

      const gottenQuestion = {
        _id: new ObjectID(),
        title: 'THis is the title',
        body: 'This is the body'
      }

      const gottenVote = {} //the vote has not been created before
    
      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(stubUser);
      const getQuestion = jest.spyOn(questionService, 'getQuestion').mockReturnValue(gottenQuestion);
      const gottenStub = jest.spyOn(voteService, 'getVote').mockReturnValue(gottenVote); 
      const stub = jest.spyOn(voteService, 'createVote').mockImplementation(() => {
        throw new Error('database error') //this can be anything
      });

      voteController = new VoteController(userService, questionService, voteService);

      await voteController.upvote(req, res);

      expect(getQuestion).toHaveBeenCalledTimes(1)
      expect(userStub).toHaveBeenCalledTimes(1)
      expect(gottenStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'database error' });
    });
  });



  describe('downvote', () => {

    it('should return unauthorized if no token is provided', async () => {
      const req = {

        params: { quesId: '5e6403c9e4ca0f9fce20b1b3'}, //this is a valid question id

      };

      voteController = new VoteController(userService, questionService, voteService);

      await voteController.downvote(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized'});

    });

    it('should return error if the question id is invalid', async () => {

      const req = {

        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { quesId: 'dkshfsdhfoisdhfoisdf'} //invalid id
      };

      voteController = new VoteController(userService, questionService, voteService);

      await voteController.downvote(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'error': 'question id is not valid' });

    });


    it('should create a new downvote successfully', async () => {

      const req = {
        
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { quesId: '5e6403c9e4ca0f9fce20b1b3'}, //this is a valid question id

      };

      const stubUser = {
        _id: new ObjectID(),
        username: faker.name.findName(),
      }

      const gottenQuestion = {
        _id: new ObjectID(),
        title: 'THis is the title',
        body: 'This is the body'
      }
    
      const stubValue = {
        _id: new ObjectID(),
        question: new ObjectID(),
        user: new ObjectID(),
        kind: 'downvote'
      }

      const gottenVote = {} //the vote has not been created before

      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(stubUser);
      const getQuestion = jest.spyOn(questionService, 'getQuestion').mockReturnValue(gottenQuestion);
      const gottenStub = jest.spyOn(voteService, 'getVote').mockReturnValue(gottenVote); 
      const stub = jest.spyOn(voteService, 'createVote').mockReturnValue(stubValue);

      voteController = new VoteController(userService, questionService, voteService);

      await voteController.downvote(req, res);


      expect(getQuestion).toHaveBeenCalledTimes(1)
      expect(userStub).toHaveBeenCalledTimes(1)
      expect(gottenStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({'status': 201, 'data': stubValue });
    });


    it('should not create multiple downvotes for the same question', async () => {

      const req = {
        
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { quesId: '5e6403c9e4ca0f9fce20b1b3'}, //this is a valid question id

      };

      const stubUser = {
        _id: new ObjectID(),
        username: faker.name.findName(),
      }

      const gottenQuestion = {
        _id: new ObjectID(),
        title: 'THis is the title',
        body: 'This is the body'
      }

      const gottenVote = {
        _id: new ObjectID(),
        question: new ObjectID('5e6403c9e4ca0f9fce20b1b3'),
        user: new ObjectID('5eb1d0954ba8fe5844a6f2ff'),
        kind: 'downvote'
      }
    
      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(stubUser);
      const getQuestion = jest.spyOn(questionService, 'getQuestion').mockReturnValue(gottenQuestion);
      const gottenStub = jest.spyOn(voteService, 'getVote').mockReturnValue(gottenVote); 

      voteController = new VoteController(userService, questionService, voteService);

      await voteController.downvote(req, res);

      expect(getQuestion).toHaveBeenCalledTimes(1)
      expect(userStub).toHaveBeenCalledTimes(1)
      expect(gottenStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'cannot downvote multiple times' });
    });


    it('should first remove an upvote before downvoting a question', async () => {

      const req = {
        
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { quesId: '5e6403c9e4ca0f9fce20b1b3'}, //this is a valid question id

      };

      const stubUser = {
        _id: new ObjectID(),
        username: faker.name.findName(),
      }

      const gottenQuestion = {
        _id: new ObjectID(),
        title: 'THis is the title',
        body: 'This is the body'
      }

      const gottenVote = {
        _id: new ObjectID(),
        question: new ObjectID('5e6403c9e4ca0f9fce20b1b3'),
        user: new ObjectID('5eb1d0954ba8fe5844a6f2ff'),
        kind: 'upvote'
      }

      //this response can be anything. It does not matter because it is a stub
      const delStub = {
        data: 'upvote deleted'
      }

      const newStubValue = {
        _id: new ObjectID(),
        question: new ObjectID(),
        user: new ObjectID(),
        kind: 'downvote'
      }
    
      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(stubUser);
      const getQuestion = jest.spyOn(questionService, 'getQuestion').mockReturnValue(gottenQuestion);
      const gottenStub = jest.spyOn(voteService, 'getVote').mockReturnValue(gottenVote); 
      const deletedStub = jest.spyOn(voteService, 'deleteVote').mockReturnValue(delStub); 
      const stub = jest.spyOn(voteService, 'createVote').mockReturnValue(newStubValue);

      voteController = new VoteController(userService, questionService, voteService);

      await voteController.downvote(req, res);

      expect(getQuestion).toHaveBeenCalledTimes(1)
      expect(userStub).toHaveBeenCalledTimes(1)
      expect(gottenStub).toHaveBeenCalledTimes(1)
      expect(deletedStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({'status': 201, 'data': newStubValue });

    });

    it('should not downvote a question if db error occurs', async () => {

      const req = {
        
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { quesId: '5e6403c9e4ca0f9fce20b1b3'}, //this is a valid question id

      };

      const stubUser = {
        _id: new ObjectID(),
        username: faker.name.findName(),
      }

      const gottenQuestion = {
        _id: new ObjectID(),
        title: 'THis is the title',
        body: 'This is the body'
      }

      const gottenVote = {} //the vote has not been created before
    
      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(stubUser);
      const getQuestion = jest.spyOn(questionService, 'getQuestion').mockReturnValue(gottenQuestion);
      const gottenStub = jest.spyOn(voteService, 'getVote').mockReturnValue(gottenVote); 
      const stub = jest.spyOn(voteService, 'createVote').mockImplementation(() => {
        throw new Error('database error') //this can be anything
      });

      voteController = new VoteController(userService, questionService, voteService);

      await voteController.downvote(req, res);

      expect(getQuestion).toHaveBeenCalledTimes(1)
      expect(userStub).toHaveBeenCalledTimes(1)
      expect(gottenStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'database error' });
    });
  });
});