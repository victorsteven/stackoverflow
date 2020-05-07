import validator from  "email-validator"
import { ObjectID } from 'mongodb';

const validate = {

  registerValidate(req) {
    
    const { username, email, password } =  req.body

    const errors = []
  
    if(!username || typeof username !== 'string'){
      errors.push({'username': 'a valid username is required'})
    }
    if(!email || typeof email !== 'string' || !validator.validate(email)){
      errors.push({'email': 'a valid email is required'})
    }
    if(!password || typeof password !== 'string' || password.length < 5){
      errors.push({'password': 'a valid password with atleast 6 characters is required'})
    }
    return errors
  },

  loginValidate(req) {
    
    const { email, password } =  req.body

    const errors = []
  
    if(!email || typeof email !== 'string' || !validator.validate(email)){
      errors.push({'email': 'a valid email is required'})
    }
    if(!password || typeof password !== 'string' || password.length < 5){
      errors.push({'password': 'a valid password with atleast 6 characters is required'})
    }
    return errors
  },

  questionValidate(req) {
    
    const { title, body } =  req.body

    const errors = []
  
    if(!title || typeof title !== 'string'){
      errors.push({'title': 'a valid question title is required'})
    }
    if(!body || typeof body !== 'string'){
      errors.push({'body': 'a valid question body is required'})
    }
    return errors
  },

  answerValidate(req) {

    const { body } = req.body

    const errors = []

    if(!body || typeof body !== 'string'){
      errors.push({'body': 'a valid answer body is required'})
    }

    return errors
  },


  userSearchValidate(req){

    const { term } = req.query

    const errors = []

    if(term !== undefined && term.length < 3){
      errors.push({'term': 'a valid search term is required'})
    } 
    return errors
  },

  questionSearchValidate(req){

    const { term } = req.query

    const errors = []

    if(term !== undefined && term.length < 3){
      errors.push({'term': 'a valid search term is required'})
    } 
    return errors
  },

  answerSearchValidate(req){

    const { term } = req.query

    const errors = []

    if(term !== undefined && term.length < 3){
      errors.push({'term': 'a valid search term is required'})
    } 
    return errors
  },
}

export default validate