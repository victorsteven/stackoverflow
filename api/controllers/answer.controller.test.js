import AnswerController from './answer.controller'
import QuestionService from '../services/question.service'
import UserService from '../services/user.service'
import AnswerService from '../services/answer.service'
import faker from 'faker'
import { ObjectID } from 'mongodb';
import validate from '../utils/validate'


const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

 //WE WILL MOCK ALL REQUEST BODY VALIDATION  IN THIS TEST. WE HAVE ALREADY TESTED ALL REQUEST BODY VALIDATIONS IN THE validate.test.js FILE, SO WE WILL ONLY FOCUS ON UNIT TESTING THE CONTROLLER

describe('AnswerController', () => {

  let res, answerController, userService, questionService, answerService

  beforeEach(() => {

    res = mockResponse()
    questionService = new QuestionService();
    userService = new UserService();
    answerService = new AnswerService();
  });

  afterEach(() => {    
    jest.clearAllMocks();
  });


  describe('createAnswer', () => {

    it('should return unauthorized if no token is provided', async () => {
      const req = {
        body: { 
          body: 'This is the answer',
        },
        params: { quesId: '5e6403c9e4ca0f9fce20b1b3'}, //this is a valid question id
      };

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.createAnswer(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized'});

    });

    //Since we have already unit tested all validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it('should return error(s) when validation fails', async () => {
      const req = {
        body: { 
          body: '', //this is invalid
        },
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { quesId: '5e6403c9e4ca0f9fce20b1b3'}, //this is a valid question id

      };

      //this is a mock response, it can be anything you want
      const errors = [
        { 'body': 'a valid answer body is required' },
      ]

      const stub = jest.spyOn(validate, 'answerValidate').mockReturnValue(errors);

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.createAnswer(req, res);

      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'errors': errors });

    });

    it('should return error if the question id is invalid', async () => {

      const req = {
        body: { 
          body: 'This is the body',
        },

        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { quesId: 'dkshfsdhfoisdhfoisdf'} //invalid id
      };

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.createAnswer(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'error': 'question id is not valid' });

    });


    //DB Error
    it('should not create an answer when db error occurs', async () => {

      const req = {
        body: { 
          body: '',
        },
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

      //the error is empty. We have tested validation in the validate.test.js file, so we will only mock the response to be empty
      const errorStub = jest.spyOn(validate, 'answerValidate').mockReturnValue([]);

      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(stubUser);
      const getQuestion = jest.spyOn(questionService, 'getQuestion').mockReturnValue(gottenQuestion);
      const stub = jest.spyOn(answerService, 'createAnswer').mockImplementation(() => {
        throw new Error('database error') //this error can be anything
      });

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.createAnswer(req, res);

      expect(getQuestion).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(userStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'database error' });
    });


    it('should create an answer successfully', async () => {

      const req = {
        body: { 
          body: 'This is the answer'
        },
        
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { quesId: '5e6403c9e4ca0f9fce20b1b3'}, //this is a valid question id

      };

      const stubUser = {
        _id: new ObjectID(),
        name: faker.name.findName(),
      }

      const gottenQuestion = {
        _id: new ObjectID(),
        title: 'THis is the title',
        body: 'This is the body'
      }
    
      const stubValue = {
        body: 'This is the body',
      }

      //the error is empty. We have tested validation in the validate.test.js file, so we will only mock the response to be empty
      const errorStub = jest.spyOn(validate, 'answerValidate').mockReturnValue([]);

      const userStub = jest.spyOn(userService, 'getUser').mockReturnValue(stubUser);
      const getQuestion = jest.spyOn(questionService, 'getQuestion').mockReturnValue(gottenQuestion);
      const stub = jest.spyOn(answerService, 'createAnswer').mockReturnValue(stubValue);

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.createAnswer(req, res);

      expect(getQuestion).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(userStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({'status': 201, 'data': stubValue });
    });
  });


  describe('updateAnswer', () => {

    it('should return unauthorized if no token is provided', async () => {
      const req = {
        body: { 
          body: 'The answer body',
        },
        params: { id: new ObjectID() } //this id is valid
      };

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.updateAnswer(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized' });

    });


    //Validate the request param. We wont get to the request body validation. so no need to mock it
    it('should return error if the answer id is invalid', async () => {

      const req = {
        body: { 
          body: 'The answer body'
        },
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { id: 'dkshfsdhfoisdhfoisdf'} //invalid id
      };

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.updateAnswer(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'error': 'answer id is not valid' });

    });

    //Since we have already unit tested all input validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it('should return error(s) when validation fails', async () => {

      const req = {
        body: { 
          body: '' //this is invalid
        },
        tokenMetadata: { _id: '5eb1d0954ba8fe5844a6f2ff' },

        params: { id: new ObjectID() } //this id is valid

      };

      //this is a mock response, it can be anything you want
      const errors = [
        { 'body': 'a valid answer body is required' },
      ]

      const stub = jest.spyOn(validate, 'answerValidate').mockReturnValue(errors);

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.updateAnswer(req, res);

      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'errors': errors });

    });


    it('should not update a answer with unauthorized user', async () => {

      const req = {
        body: { 
          body: 'This is the answer'
        },
        //we need to make sure that the id matches with the one from the answer
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' },
        
        params: { id: new ObjectID() } //this id is valid
      };

      const formerAnswer = {
        _id: new ObjectID(),
        body: 'The former answer',
        user: {
          _id: new ObjectID('5e678d2255ae90c6a097b72f'), //not the same as the looged in user
        }
      }

      //the error is empty. We have tested validation in the validate.test.js file, so we will only mock the response to be empty
      const errorStub = jest.spyOn(validate, 'answerValidate').mockReturnValue([]);

      const userStub = jest.spyOn(answerService, 'getAnswer').mockReturnValue(formerAnswer);

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.updateAnswer(req, res);

      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(userStub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({'status': 401, 'error': 'unauthorized: you are not the owner' });
    });

    //The DB Error: should incase anything happens while saving record
    it('should not update a answer when db error occurs', async () => {

      const req = {
        body: { 
          body: 'This is the answer',
        },
        //we need to make sure that the id matches with the one from the answer
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' },
        
        params: { id: new ObjectID() } //this id is valid
      };

      const formerAnswer = {
        _id: new ObjectID(),
        body: 'The former answer',
        user: {
          _id: new ObjectID('5e678b4527b990c36ff39dda'), //this id is same as the one in the tokenMetada
        }
      }
    
      const errorStub = jest.spyOn(validate, 'answerValidate').mockReturnValue([]);
      const formerStub = jest.spyOn(answerService, 'getAnswer').mockReturnValue(formerAnswer);
      const stub = jest.spyOn(answerService, 'updateAnswer').mockImplementation(() => {
        throw new Error('database error') //this can be anything
      });

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.updateAnswer(req, res);

      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'database error' });
    });

    it('should update a answer successfully', async () => {

      const req = {
        body: { 
          body: 'This is the answer updated'
        },
        //we need to make sure that the id matches with the one from the answer
        tokenMetadata: { _id: '5e678b4527b990c36ff39dda' },
        
        params: { id: new ObjectID() } //this id is valid
      };

      const formerAnswer = {
        _id: new ObjectID(),
        body: 'The former answer',
        user: {
          _id: new ObjectID('5e678b4527b990c36ff39dda'), //this id is same as the one in the tokenMetada
        }
      }
    
      const stubValue = {
        body: 'The updated answer'
      }

      const errorStub = jest.spyOn(validate, 'answerValidate').mockReturnValue([]);
      const formerStub = jest.spyOn(answerService, 'getAnswer').mockReturnValue(formerAnswer);
      const stub = jest.spyOn(answerService, 'updateAnswer').mockReturnValue(stubValue);

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.updateAnswer(req, res);

      expect(formerStub).toHaveBeenCalledTimes(1)
      expect(errorStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'data': stubValue });
    });
  });


  describe('getAnswer', () => {

    //Validate the request param. 
    it('should return error if the answer id is invalid', async () => {

      const req = {

        params: { id: 'dkshfsdhfoisdhfoisdf' } //invalid id

      };

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.getAnswer(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'error': 'answer id is not valid' });

    });

    //DB Error
    it('should not get a answer if db error occurs', async () => {

      const req = {

        params: { id: new ObjectID() } //this id is valid

      };

      const stub = jest.spyOn(answerService, 'getAnswer').mockImplementation(() => {
        throw new Error('database error') //this can be anything
      });

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.getAnswer(req, res);

      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'database error' });
    });

    it('should get a answer successfully', async () => {

      const req = {
        params: { id: '5e6403c9e4ca0f9fce20b1b3'} //this id is valid
      };

      const answer = {
        _id: new ObjectID(),
        body: 'The answer body'
      }

      const stub = jest.spyOn(answerService, 'getAnswer').mockReturnValue(answer);

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.getAnswer(req, res);

      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'data': answer });
    });
  });


  describe('getAnswers', () => {

    it('should not get all answers if the question id is invalid', async () => {

      const req = {
        params: { quesId: 'dhbsdfbjhsbdfhjsbdfsdfds'} //invalid question id
      };

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.getAnswers(req, res);

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({'status': 400, 'error': 'question id is not valid' });

    });

    it('should not get all answers if db error occurs', async () => {

      let req = {
        params: { quesId: new ObjectID() }, //this is a valid question id
      }

      const gottenQuestion = {
        _id: new ObjectID(),
        title: 'THis is the title',
        body: 'This is the body'
      }

      const questionStub = jest.spyOn(questionService, 'getQuestion').mockReturnValue(gottenQuestion);

      const stub = jest.spyOn(answerService, 'getAnswers').mockImplementation(() => {
        throw new Error('database error')
      });

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.getAnswers(req, res);

      expect(questionStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({'status': 500, 'error': 'database error' });
    });


    it('should get all answers successfully', async () => {

      let req = {
        params: { quesId: new ObjectID() }, //this is a valid question id
      }

      const gottenQuestion = {
        _id: new ObjectID(),
        title: 'THis is the title',
        body: 'This is the body'
      }

      const answers = [
        {
          _id: new ObjectID(),
          body: 'First answer',
        },
        {
          _id: new ObjectID(),
          body: 'Second answer',
        }
      ]

      const stub = jest.spyOn(answerService, 'getAnswers').mockReturnValue(answers);

      const questionStub = jest.spyOn(questionService, 'getQuestion').mockReturnValue(gottenQuestion);

      answerController = new AnswerController(userService, questionService, answerService);

      await answerController.getAnswers(req, res);

      expect(questionStub).toHaveBeenCalledTimes(1)
      expect(stub).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({'status': 200, 'data': answers });

    });
  });
});