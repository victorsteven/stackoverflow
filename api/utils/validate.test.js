import validate from './validate'

describe('Validation', () => {

  describe('registerValidate', () => {

    it('invalid register inputs', () => {

      const req = {
         //the name,email and password are invalid
        body: { username: 123, email: "mail.com", password: "sdf" }
      };

      const errorsResponse =  [ 
        { username: 'a valid username is required' },
        {email: 'a valid email is required'},
        { password: 'a valid password with atleast 6 characters is required' } 
      ]

      let errors = validate.registerValidate(req)

      expect(errors.length).toBeGreaterThan(0)
      expect(JSON.stringify(errors)).toEqual(JSON.stringify(errorsResponse)) 
    });

    it('valid register inputs', () => {

      const req = {
        body: { username: "steven", email: "steven@example.com", password: "password" }
      };

      let errors = validate.registerValidate(req)

      expect(errors.length).toBe(0)
      
    });
  });


  describe('loginValidate', () => {

    it('invalid login inputs', () => {

      const req = {
         //The email and password are invalid
        body: { email: "mail.com", password: "sdf" }
      };

      const errorsResponse =  [ 
        {email: 'a valid email is required'},
        { password: 'a valid password with atleast 6 characters is required' } 
      ]

      let errors = validate.loginValidate(req)

      expect(errors.length).toBeGreaterThan(0)
      expect(JSON.stringify(errors)).toEqual(JSON.stringify(errorsResponse))
    });

    it('valid login inputs', () => {

      const req = {
        body: { email: "steven@example.com", password: "password" }
      };

      let errors = validate.loginValidate(req)

      expect(errors.length).toBe(0)
      
    });
  });


  describe('questionValidate', () => {
    it('should not create a question with invalid title', () => {

      const req = {
         //The question body is invalid
        body: { title: 123, body: 'This is the question body' }
      };

      const errorsResponse =  [ 
        { title: 'a valid question title is required' }
      ]

      let errors = validate.questionValidate(req)

      expect(errors.length).toBeGreaterThan(0)
      expect(JSON.stringify(errors)).toEqual(JSON.stringify(errorsResponse)) 
    });

    it('should not create a question with invalid body', () => {

      const req = {
         //The question body is invalid
        body: { title: "this is a valid title", body: 1234 }
      };

      const errorsResponse =  [ 
        { body: 'a valid question body is required' }
      ]

      let errors = validate.questionValidate(req)

      expect(errors.length).toBeGreaterThan(0)
      expect(JSON.stringify(errors)).toEqual(JSON.stringify(errorsResponse)) 
    });

    it('should create valid question', () => {

      const req = {
        body: { title: 'The question title', body: 'The question body' }
      };

      let errors = validate.questionValidate(req)

      expect(errors.length).toBe(0)
      
    });
  });


  describe('answerValidate', () => {

    it('should not create an answer with invalid input', () => {

      const req = {
       body: { body: 32423 }
     };

      const errorsResponse =  [ 
        {"body": "a valid answer body is required"},
      ]

     let errors = validate.answerValidate(req)

     expect(errors.length).toBeGreaterThan(0)
     expect(JSON.stringify(errors)).toEqual(JSON.stringify(errorsResponse))
    });

    it('should create valid answer', () => {

      const req = {
        body: { body: 'This is a valid answer' }
      };
      let errors = validate.answerValidate(req)

      expect(errors.length).toBe(0)
    });
  });


  describe('userSearchValidate', () => {

    it('should not search a user with invalid entry', () => {

      const req = {
        query: { term: '' }
      };
      const errorsResponse =  [ 
        { term: 'a valid search term is required' }
      ]
      let errors = validate.userSearchValidate(req)

      expect(errors.length).toBeGreaterThan(0)
      expect(JSON.stringify(errors)).toEqual(JSON.stringify(errorsResponse)) 
    });

    it('should search for a user with valid input', () => {
      const req = {
        query: { username: 'victorsteven' }
      };

      let errors = validate.userSearchValidate(req)

      expect(errors.length).toBe(0)
      
    });
  });


  describe('questionSearchValidate', () => {

    it('should not search a question with invalid entry', () => {

      const req = {
        query: { term: "" }
      };
      const errorsResponse =  [ 
        { term: 'a valid search term is required' }
      ]
      let errors = validate.questionSearchValidate(req)

      expect(errors.length).toBeGreaterThan(0)
      expect(JSON.stringify(errors)).toEqual(JSON.stringify(errorsResponse)) 
    });

    it('should search for a question with valid input', () => {
      const req = {
        query: { term: 'How to deploy my nodejs app on kubernetes' }
      };

      let errors = validate.questionSearchValidate(req)

      expect(errors.length).toBe(0)
      
    });
  });

  describe('answerSearchValidate', () => {

    it('should not search an answer with invalid entry', () => {

      const req = {
        query: { term: "" }
      };
      const errorsResponse =  [ 
        { term: 'a valid search term is required' }
      ]
      let errors = validate.answerSearchValidate(req)

      expect(errors.length).toBeGreaterThan(0)
      expect(JSON.stringify(errors)).toEqual(JSON.stringify(errorsResponse)) 
    });

    it('should search for an answer with valid input', () => {
      const req = {
        query: { term: 'How to deploy my nodejs app on kubernetes' }
      };

      let errors = validate.answerSearchValidate(req)

      expect(errors.length).toBe(0)
      
    });
  });
});
