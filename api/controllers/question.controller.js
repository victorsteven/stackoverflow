import { ObjectID } from 'mongodb';
import Question from '../models/question'
import validate from '../utils/validate'


class QuestionController {
  constructor(userService, questionService){
    this.userService = userService
    this.questionService = questionService
  }

  async createQuestion(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata
    if(!tokenMetadata) {
      return res.status(401).json({
        status: 401,
        error: "unauthorized",
      });
    }

    const errors = validate.questionValidate(req)
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      })
    }

    const { title, body } = req.body

    try {

      let userId = tokenMetadata._id

      const user = await this.userService.getUser(userId)

      if(user) {

        const question = new Question({
          title: title.trim(),
          body: body.trim(),
          user:  user._id
        })
  
        const createQuestion = await this.questionService.createQuestion(question)
        return res.status(201).json({
          status: 201,
          data: createQuestion
        })
      } 
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  async updateQuestion(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata
    if(!tokenMetadata) {
      return res.status(401).json({
        status: 401,
        error: "unauthorized",
      });
    }

    //check the request param
    const { id } = req.params 
    if(!ObjectID.isValid(id)){
      return res.status(400).json({
        status: 400,
        error: "question id is not valid"
      })
    }
    const errors = validate.questionValidate(req)
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      })
    }

    const { title, body } = req.body

    try {

      let userId = tokenMetadata._id

      const question = await this.questionService.getQuestion(id)

      if (question.user._id.toHexString() !== userId) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized: you are not the owner"
        })
      }

      question.title = title
      question.body = body
      
      const updateQuestion = await this.questionService.updateQuestion(question)
      return res.status(200).json({
        status: 200,
        data: updateQuestion
      })
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  async getQuestion(req, res) {

    //check the request param
    const { id } = req.params 
    if(!ObjectID.isValid(id)){
      return res.status(400).json({
        status: 400,
        error: "question id is not valid"
      })
    }

    try {

      try {
        const gottenQuestion = await this.questionService.getQuestion(id)
        return res.status(200).json({
          status: 200,
          data: gottenQuestion
        })
      } catch(error) {
        throw error;
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }


  async getQuestions(req, res) {

    try {

      const questions = await this.questionService.getQuestions()

      return res.status(200).json({
        status: 200,
        data: questions
      })
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  async upvoteQuestion(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata
    if(!tokenMetadata) {
      return res.status(401).json({
        status: 401,
        error: "unauthorized",
      });
    }

    //check the request param
    const { id } = req.params 
    if(!ObjectID.isValid(id)){
      return res.status(400).json({
        status: 400,
        error: "question id is not valid"
      })
    }

    try {

      let userId = tokenMetadata._id

      //check if the user exist(any error will be handled in the catch block)
      await this.userService.getUser(userId)

      const question = await this.questionService.getQuestion(id)

      const upvotedQuestion = await this.questionService.upvoteQuestion(question._id)
      return res.status(200).json({
        status: 200,
        data: upvotedQuestion
      })
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }
  

  async upvoteQuestion(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata
    if(!tokenMetadata) {
      return res.status(401).json({
        status: 401,
        error: "unauthorized",
      });
    }

    //check the request param
    const { id } = req.params 
    if(!ObjectID.isValid(id)){
      return res.status(400).json({
        status: 400,
        error: "question id is not valid"
      })
    }

    try {

      let userId = tokenMetadata._id

      //check if the user exist(any error will be handled in the catch block)
      await this.userService.getUser(userId)

      const question = await this.questionService.getQuestion(id)

      const upvotedQuestion = await this.questionService.upvoteQuestion(question._id)
      return res.status(200).json({
        status: 200,
        data: upvotedQuestion
      })
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }



  async downvoteQuestion(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata
    if(!tokenMetadata) {
      return res.status(401).json({
        status: 401,
        error: "unauthorized",
      });
    }

    //check the request param
    const { id } = req.params 
    if(!ObjectID.isValid(id)){
      return res.status(400).json({
        status: 400,
        error: "question id is not valid"
      })
    }
    const errors = validate.questionValidate(req)
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      })
    }

    const { title, body } = req.body

    try {

      let userId = tokenMetadata._id

      const question = await this.questionService.getQuestion(id)

      if (question.user._id.toHexString() !== userId) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized: you are not the owner"
        })
      }

      question.title = title
      question.body = body
      
      const updateQuestion = await this.questionService.updateQuestion(question)
      return res.status(200).json({
        status: 200,
        data: updateQuestion
      })
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }
}

export default QuestionController