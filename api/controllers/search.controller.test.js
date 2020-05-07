import SearchController from './search.controller'
import SearchService from '../services/search.service'

import validate from '../utils/validate'


const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

//WE WILL MOCK ALL REQUEST BODY VALIDATION  IN THIS TEST. WE HAVE ALREADY TESTED ALL REQUEST BODY VALIDATIONS IN THE validate.test.js FILE, SO WE WILL ONLY FOCUS ON UNIT TESTING THE CONTROLLER

describe('SearchController', () => {

  let res, searchService, searchController

  beforeEach(() => {

    res = mockResponse()

    searchService = new SearchService();

  });

  afterEach(() => {    
    jest.clearAllMocks();
  });


  describe('SearchQuestion', () => {

    //Since we have already unit tested all input validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it('should return error(s) when validation fails', async () => {

      //If at all the client should search questions, his query must be validated
      const req = {
        query: { 
          term: '', //this is invalid, cannot send empty tean'
        },
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { 'term': 'a valid search term is required' },
      ]

      const stub = jest.spyOn(validate, 'questionSearchValidate').mockReturnValue(errors);

      searchController = new SearchController(searchService);

      await searchController.searchQuestion(req, res);

      expect(stub).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 'status': 400, 'errors': errors});

    });

    //A db error can occur in the services, lets test for that
    it('should not search for question(s) when db error occurs', async () => {

      const req = {
        query: { 
          term: 'This is the title'
        },
      };

      const stubErr = jest.spyOn(validate, 'questionSearchValidate').mockReturnValue([]); //no validation error
      const stub = jest.spyOn(searchService, 'searchQuestion').mockImplementation(() => {
        throw new Error('database error')
      });

      searchController = new SearchController(searchService);

      await searchController.searchQuestion(req, res);

      expect(stubErr).toHaveBeenCalledTimes(1);
      expect(stub).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 'status': 500, 'error': 'database error' });

    });

    it('should search and get question(s)', async () => {

      const req = {
        query: { 
          term: 'I couldnt run docker locally'
        },
      };

      const questionValue = {
          '_id': '5e69748a6e72a1a0793956eb',
          'title': 'I couldnt run docker locally',
          'body': 'This is the body'
        }

      const stubErr = jest.spyOn(validate, 'questionSearchValidate').mockReturnValue([]);
      const stub = jest.spyOn(searchService, 'searchQuestion').mockReturnValue(questionValue);

      searchController = new SearchController(searchService);

      await searchController.searchQuestion(req, res);

      expect(stubErr).toHaveBeenCalledTimes(1);
      expect(stub).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 'status': 200, 'data': questionValue });

    });
  });

  describe('SearchUser', () => {

    //Since we have already unit tested all input validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it('should return error(s) when validation fails', async () => {

      //If at all the client should search users, his query must be validated
      const req = {
        query: { 
          username: '', //this is invalid, cannot send empty tean'
        },
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { 'username': 'victorsteven' },
      ]

      const stub = jest.spyOn(validate, 'userSearchValidate').mockReturnValue(errors);

      searchController = new SearchController(searchService);

      await searchController.searchUser(req, res);

      expect(stub).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 'status': 400, 'errors': errors});

    });

    //A db error can occur in the services, lets test for that
    it('should not search for user(s) when db error occurs', async () => {

      const req = {
        query: { 
          term: 'victorsteven'
        },
      };

      const stubErr = jest.spyOn(validate, 'userSearchValidate').mockReturnValue([]); //no validation error
      const stub = jest.spyOn(searchService, 'searchUser').mockImplementation(() => {
        throw new Error('database error')
      });

      searchController = new SearchController(searchService);

      await searchController.searchUser(req, res);

      expect(stubErr).toHaveBeenCalledTimes(1);
      expect(stub).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 'status': 500, 'error': 'database error' });

    });

    it('should search and get user', async () => {

      const req = {
        query: { 
          username: 'victorsteven'
        },
      };
      const userValue = {
          '_id': '5e69748a6e72a1a0793956eb',
          'username': 'victorsteven'
        }

      const stubErr = jest.spyOn(validate, 'userSearchValidate').mockReturnValue([]);
      const stub = jest.spyOn(searchService, 'searchUser').mockReturnValue(userValue);

      searchController = new SearchController(searchService);

      await searchController.searchUser(req, res);

      expect(stubErr).toHaveBeenCalledTimes(1);
      expect(stub).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 'status': 200, 'data': userValue });

    });
  });


  describe('SearchAnswer', () => {

    //Since we have already unit tested all input validations in the validate.test.js file, we can just consider any scenerio here where validation fails so as to improve coverage
    it('should return error(s) when validation fails', async () => {

      //If at all the client should search answers, his query must be validated
      const req = {
        query: { 
          term: '', //this is invalid, cannot send empty tean'
        },
      };

      //this is a mock response, it can be anything you want
      const errors = [
        { 'term': 'a valid search term is required' },
      ]

      const stub = jest.spyOn(validate, 'answerSearchValidate').mockReturnValue(errors);

      searchController = new SearchController(searchService);

      await searchController.searchAnswer(req, res);

      expect(stub).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 'status': 400, 'errors': errors});

    });

    //A db error can occur in the services, lets test for that
    it('should not search for answer(s) when db error occurs', async () => {

      const req = {
        query: { 
          term: 'How i achieved linting in my code'
        },
      };

      const stubErr = jest.spyOn(validate, 'answerSearchValidate').mockReturnValue([]); //no validation error
      const stub = jest.spyOn(searchService, 'searchAnswer').mockImplementation(() => {
        throw new Error('database error')
      });

      searchController = new SearchController(searchService);

      await searchController.searchAnswer(req, res);

      expect(stubErr).toHaveBeenCalledTimes(1);
      expect(stub).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 'status': 500, 'error': 'database error' });

    });

    it('should search and get answer(s)', async () => {

      const req = {
        query: { 
          term: 'How i achieved linting in my code'
        },
      };

      const answerValue = {
          '_id': '5e69748a6e72a1a0793956eb',
          'body': 'How i achieved linting in my code. VSCode have a package that enabled me do this'
        }

      const stubErr = jest.spyOn(validate, 'answerSearchValidate').mockReturnValue([]);
      const stub = jest.spyOn(searchService, 'searchAnswer').mockReturnValue(answerValue);

      searchController = new SearchController(searchService);

      await searchController.searchAnswer(req, res);

      expect(stubErr).toHaveBeenCalledTimes(1);
      expect(stub).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 'status': 200, 'data': answerValue });

    });
  });
});