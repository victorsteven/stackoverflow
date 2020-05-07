import _ from 'lodash'
import { ObjectID } from 'mongodb';
import Answer from '../models/answer';
import validate from '../utils/validate'


class AnswerController {

  constructor(userService, questionService, answerService){
    this.userService = userService
    this.questionService = questionService
    this.answerService = answerService
  }

  async createAnswer(req, res) {

    //The tokenMetadata has already been set in the request when the middleware attached to this route ran
    let tokenMetadata = req.tokenMetadata
    if(!tokenMetadata) {
      return res.status(401).json({
        status: 401,
        error: "unauthorized",
      });
    }

    //check the request param
    const { quesId } = req.params 
    if(!ObjectID.isValid(quesId)){
      return res.status(400).json({
        status: 400,
        error: "question id is not valid"
      })
    }
    
    const errors = validate.answerValidate(req)
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      })
    }

    //No errors, proceed
    const { body } = req.body

    try {
      
      let userId = tokenMetadata._id

      //verify that the user sending this request exist:
      const user = await this.userService.getUser(userId)
      
      //check if the question exists, if any error, it will handled in the catch block
      const ques  = await this.questionService.getQuestion(quesId)

      const answer = new Answer({
        body: body,
        question: ques._id,
        user: user._id,
      })

      const createAnswer = await this.answerService.createAnswer(answer)
      return res.status(201).json({
        status: 201,
        data: createAnswer
      })
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  async updateAnswer(req, res) {

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
        error: "answer id is not valid"
      })
    }

    const errors = validate.answerValidate(req)
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      })
    }

    //No errors, proceed
    const { body } = req.body

    try {
      
      let userId = tokenMetadata._id

      //check if the answer exist and if the owner is legit, before updating it:

      const answer = await this.answerService.getAnswer(id)

      if (answer.user._id.toHexString() !== userId) {
        return res.status(401).json({
          status: 401,
          error: "unauthorized: you are not the owner"
        })
      }
      //update the answers
      answer.body = body

      const updateAnswer = await this.answerService.updateAnswer(answer)
      return res.status(200).json({
        status: 200,
        data: updateAnswer
      })
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  async getAnswer(req, res) {

    //check the request param
    const { id } = req.params 
    if(!ObjectID.isValid(id)){
      return res.status(400).json({
        status: 400,
        error: "answer id is not valid"
      })
    }

    try {

      const answer = await this.answerService.getAnswer(id)
      
      return res.status(200).json({
        status: 200,
        data: answer
      })
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  async getAnswers(req, res) {

    //check the request param
    const { quesId } = req.params 
    if(!ObjectID.isValid(quesId)){
      return res.status(400).json({
        status: 400,
        error: "question id is not valid"
      })
    }

    try {

      //check if the question exists, if any error, it will handled in the catch block
      const ques  = await this.questionService.getQuestion(quesId)

      if(ques) {
        const answers = await this.answerService.getAnswers(ques._id)

        return res.status(200).json({
          status: 200,
          data: answers
        })
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }
}

export default AnswerController