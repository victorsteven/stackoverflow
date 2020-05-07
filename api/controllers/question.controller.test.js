import QuestionController from './question.controller'
import QuestionService from '../services/question.service'
import UserService from '../services/user.service'
import faker from 'faker'
import { ObjectID } from 'mongodb';
import validate from '../utils/validate'



//WE WILL MOCK ALL REQUEST BODY VALIDATION  IN THIS TEST. WE HAVE ALREADY TESTED ALL REQUEST BODY VALIDATIONS IN THE validate.test.js FILE, SO WE WILL ONLY FOCUS ON UNIT TESTING THE CONTROLLER


const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('QuestionController', () => {

  let res, questionController, userService, questionService

  beforeEach(() => {

    res = mockResponse()
    questionService = new QuestionService();
    userService = new UserService();
  });

  afterEach(() => {    
    jest.clearAllMocks();
  });


  describe('createQuestion', () => {

    //we wont get reach the validation, no need to mock it
    it('should return unauthorized if no token is provided', async () => {

      const req = {
        body: { title: 'question title', body: 'question body' },
      };

      questionController = new QuestionController(userService, questionService);

      await questionController.createQuestion(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized'});

    });


    //Since we have already unit tested all validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it('should return error(s) when validation fails', async () => {

      const req = {
        body: { title: '', body: '' },
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' } 
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { 'title': 'a valid question title is required' },
        { 'body': 'a valid question body is required' }
      ]

      const errorStub = jest.spyOn(validate, 'questionValidate').mockReturnValue(errors);

      questionController = new QuestionController(userService, questionService);

      await questionController.createQuestion(req, res);

      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'errors': errors });

    });

    //DB Error, when a duplicate record tried to be created
    it('should return error if question title already exists', async () => {

      const req = {
        body: { title: 'How to deploy Nodejs app on kubernetes', body: 'This is the body' }, //we assume this title already exists
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' } 
      };

      const stubUser = {
        _id: new ObjectID(),
        title: 'How to deploy Nodejs app on kubernetes',
        body: 'This is the body'
      }

      const errorStub = jest.spyOn(validate, 'questionValidate').mockReturnValue([]); //empty error

      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(stubUser);
      const stub = jest.spyOn(questionService, 'createQuestion').mockImplementation(() => {
        throw new Error('record already exists');
      })

      questionController = new QuestionController(userService, questionService);

      await questionController.createQuestion(req, res);

      expect(userStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'record already exists' });

    });


    it('should create a question successfully', async () => {
      const req = {
        body: { title: 'New question title', body: 'New question body' },
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' } //since we have mocked the user, this can be anything
      };

      const stubValue = {
        title: 'New question title',
        body: 'New question body'
      };
      const stubUser = {
        _id: new ObjectID(),
        usertitle: 'This is the title',
        body: 'This is the body'
      }

      const errorStub = jest.spyOn(validate, 'questionValidate').mockReturnValue([]); //empty error

      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(stubUser);
      const stub = jest.spyOn(questionService, 'createQuestion').mockReturnValue(stubValue);

      questionController = new QuestionController(userService, questionService);

      await questionController.createQuestion(req, res);

      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(userStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({'status': 201, 'data': stubValue });
    })
  });

  describe('updateQuestion', () => {

    //we wont get reach the validation, no need to mock it
    it('should return unauthorized if no token is provided', async () => {
      const req = {
        body: { title: 'This is the question', body: 'This is the question body' },
      };

      questionController = new QuestionController(userService, questionService);

      await questionController.updateQuestion(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized'});
    });

   
    //we wont get reach the request body validation, no need to mock it. We are checking the request param
    it('should return error when invalid question id param is used', async () => {
      const req = {
        body: { title: 'This is the question', body: 'This is the question body' },

        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' }, 

        params: { id: 'sjdfisdjflksdfshdiufs'} //invalid question id
      };

      questionController = new QuestionController(userService, questionService);

      await questionController.updateQuestion(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'error': 'question id is not valid'});

    });


    //Since we have already unit tested all validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it('should return error(s) when validation fails', async () => {

      const req = {
        body: { title: '', body: '' },
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        //the id here should be valid, we are interested in validating only the request body, not the request param
        params: { id: '5e6403c9e4ca0f9fce20b1b3'} 
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { 'id': 'question id is not valid' },
        { 'title': 'a valid question title is required' },
      ]

      const errorStub = jest.spyOn(validate, 'questionValidate').mockReturnValue(errors);

      questionController = new QuestionController(userService, questionService);

      await questionController.updateQuestion(req, res);

      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'errors': errors });
    });


    it('should not update a question by unauthorized user', async () => {
      const req = {
        body: { title: 'This is the title', body: 'This is the body'},

        //make sure the id here, matches the user id from the question we wishes to update
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' }, 

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      const formerQuestion = {
        _id: new ObjectID(),
        title: 'former question',
        body: 'former body',
        user: {
          _id: new ObjectID('5e678d2255ae90c6a097b72f'), //not the same as the looged in user
        }
      }

      const errorStub = jest.spyOn(validate, 'questionValidate').mockReturnValue([]); //no input errors

      const formerStub = jest.spyOn(questionService, 'getQuestion').mockReturnValue(formerQuestion);

      questionController = new QuestionController(userService, questionService);

      await questionController.updateQuestion(req, res);

      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized: you are not the owner' });
    });

    //DB Error
    it('should not update a question if another question already exist with that question title', async () => {
      const req = {
        body: { title: 'This is the title', body: 'This is the body' }, //we assume that this question exist

        //make sure the id here, matches the user id from the question we wishes to update
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' }, 

        params: { id: '5e6403c9e4ca0f9fce20b1b3' } //this id is valid
      };

      //our concern is making sure that we supply a valid to the user that created the question:
      const formerQuestion = {
        _id: new ObjectID(),
        title: 'former title',
        body: 'former body',
        user: {
          _id: new ObjectID('5e678b4527b990c36ff39dda'), //this id is same as the one in the tokenMetada
        }
      }
      const errorStub = jest.spyOn(validate, 'questionValidate').mockReturnValue([]); //no input errors
      const formerStub = jest.spyOn(questionService, 'getQuestion').mockReturnValue(formerQuestion);
      const stub = jest.spyOn(questionService, 'updateQuestion').mockImplementation(() => {
        throw new Error('record already exists');
      })

      questionController = new QuestionController(userService, questionService);

      await questionController.updateQuestion(req, res);

      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'record already exists' });
    });


    it('should update a question successfully', async () => {
      const req = {
        body: { title: 'This is the title', body: 'This is the body' },

        //make sure the id here, matches the user id from the question we wishes to update
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' }, 

        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      const stubValue = {
        title: 'This is the title',
        body: 'This is the body'
      };

      //our concern is making sure that we supply a valid to the user that created the question:
      const formerQuestion = {
        _id: '5e6403c9e4ca0f9fce20b1b3',
        title: 'former title',
        body: 'former body',
        user: {
          _id: new ObjectID('5e678b4527b990c36ff39dda'), //this id is same as the one in the tokenMetada
        }
      }
      const errorStub = jest.spyOn(validate, 'questionValidate').mockReturnValue([]); //no input errors
      const formerStub = jest.spyOn(questionService, 'getQuestion').mockReturnValue(formerQuestion);
      const stub = jest.spyOn(questionService, 'updateQuestion').mockReturnValue(stubValue);

      questionController = new QuestionController(userService, questionService);

      await questionController.updateQuestion(req, res);

      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'data': stubValue });
    });
  });


  describe('getQuestion', () => {

    // return error when the question id is not valid
    it('should return error when invalid question id param is used', async () => {
      const req = {

        params: { id: 'sjdfisdjflksdfshdiufs'} //invalid question id
      };

      questionController = new QuestionController(userService, questionService);

      await questionController.getQuestion(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'error': 'question id is not valid' });

    });


    //DB Error, error thrown from the service
    it('should not get a question if when error occurs', async () => {

      const req = {

        params: { id: '5e6403c9e4ca0f9fce20b1b3' } //this id is valid
      };

      const stub = jest.spyOn(questionService, 'getQuestion').mockImplementation(() => {
        throw new Error('record not found')
      });

      questionController = new QuestionController(userService, questionService);

      await questionController.getQuestion(req, res);

      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'record not found' });

    });


    it('should get a question successfully', async () => {

      const req = {
        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      const question = {
        _id: new ObjectID(),
        title: 'the title',
        body: 'the body'
      }

      const stub = jest.spyOn(questionService, 'getQuestion').mockReturnValue(question);

      questionController = new QuestionController(userService, questionService);

      await questionController.getQuestion(req, res);

      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'data': question });

    });
  });


  describe('getQuestions', () => {

    const req = {}
    //DB Error
    it('should not get all questions when db error occurs', async () => {

      const stub = jest.spyOn(questionService, 'getQuestions').mockImplementation(() => {
        throw new Error('database error') //this can be anything
      });

      questionController = new QuestionController(userService, questionService);

      await questionController.getQuestions(req, res);

      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'database error' });
    });


    it('should get all questions successfully', async () => {

      const req = {}

      //fake question with ids
      const questions = [
        {
          _id: new ObjectID(),
          title: 'first question',
          body: 'first body'
        },
        {
          _id: new ObjectID(),
          title: 'second question',
          body: 'second body'
        }
      ]

      const stub = jest.spyOn(questionService, 'getQuestions').mockReturnValue(questions);

      questionController = new QuestionController(userService, questionService);

      await questionController.getQuestions(req, res);

      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'data': questions });
    });
  });
});