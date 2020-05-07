import User from '../models/user'
import validate from '../utils/validate'



class SearchController {
  constructor(searchService) {
    this.searchService = searchService
  }


  async searchUser(req, res) {

    const errors = validate.userSearchValidate(req)
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      })
    }

    //The request query parameters passed are validated above

    const { term } = req.query

    try {

      const searchResult = await this.searchService.searchUser(term)
      return res.status(200).json({
        status: 200,
        data: searchResult
      })

    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  async searchQuestion(req, res) {

    const errors = validate.questionSearchValidate(req)
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      })
    }

    const { term } = req.query

    try {

      const searchResult = await this.searchService.searchQuestion(term)
      return res.status(200).json({
        status: 200,
        data: searchResult
      })
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

  async searchAnswer(req, res) {

    const errors = validate.answerSearchValidate(req)
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      })
    }

    //The request query parameters passed are validated above

    const { term } = req.query

    try {

      const searchResult = await this.searchService.searchAnswer(term)
      return res.status(200).json({
        status: 200,
        data: searchResult
      })

    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }
}

export default SearchController