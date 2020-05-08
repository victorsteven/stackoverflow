import Question from '../models/question'
import Answer from '../models/answer'
import User from '../models/user'



class SearchService {
  constructor() {
    this.user = User
    this.question = Question
    this.answer = Answer
  }


  async searchUser(term){

    try {
      //a wildcard might get more than one question
      const users = await this.user.find({'username': { $regex: '.*' + term, $options:'i'  + '.*' }}, 'username')
                                    .exec()

      return users

    } catch(error) {
      throw error;
    }
  }

  async searchQuestion(term){

    try {
      //a wildcard might get more than one question
      const questions = await this.question.find({ $or: [{'title': { $regex: '.*' + term, $options:'i'  + '.*' }}, {'body': { $regex: '.*' + term, $options:'i'  + '.*' }}] })
                                            .select('-__v')
                                            .exec()
      return questions

    } catch(error) {
      throw error;
    }
  }

  async searchAnswer(term){

    try {
      //a wildcard might get more than one question
      const answers = await this.answer.find({'body': { $regex: '.*' + term, $options:'i'  + '.*' }})
                                    .select('-__v')
                                    .exec()
      return answers

    } catch(error) {
      throw error;
    }
  }
}

export default SearchService