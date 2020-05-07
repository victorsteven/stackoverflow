import Answer from '../models/answer'
import { ObjectID } from 'mongodb';


class AnswerService {

  constructor() {
    this.answer = Answer;
  }

   async createAnswer(answer) {

    try {

      const createdAnswer = await this.answer.create(answer);

      return createdAnswer

    } catch(error) {
      throw error;
    }
  }

  //This answer can both be seen by the user and the admin
   async getAnswer(answerId) {

    try {

      let answerIdObj = new ObjectID(answerId)

      const gottenAnswer = await this.answer.findOne({ _id: answerIdObj })
                                          .select('-__v')
                                          .populate('question', '_id body')
                                          .exec()
      if (!gottenAnswer) {
        throw new Error('no record found');
      }

      return gottenAnswer

    } catch(error) {
      throw error;
    }
  }

   async updateAnswer(answer) {

    try {

      const record = await this.answer.findOne({ _id: answer._id })

      //If the same record is passed to be updated for a particular given answer id, allow it, else throw already exist error
      if (record && (record._id.toHexString() !== answer._id.toHexString())) {
        throw new Error('record already exists');
      } 
      
      const updatedAnswer = await this.answer.findOneAndUpdate(
        { _id: answer._id}, 
        { $set: answer },
        { "new": true},
      );

      return updatedAnswer

    } catch(error) {
      throw error;
    }
  }

   async getAnswers(questionId) {

    try {

      let questionIdObj = new ObjectID(questionId)

      const gottenAnswers = await this.answer.find({ question: questionIdObj })
                                                .select('-user')
                                                .select('-__v')
                                                .populate('question', '_id body')
                                                .exec()

      return gottenAnswers

    } catch(error) {
      throw error;
    }
  }
}

export default AnswerService