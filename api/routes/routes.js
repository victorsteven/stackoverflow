import { Router } from 'express'

import UserService from '../services/user.service'
import LoginService from '../services/login.service'
import QuestionService from '../services/question.service'
import AnswerService from '../services/answer.service'
import VoteService from '../services/vote.service'
import SearchService from '../services/search.service'
import UserController from '../controllers/user.controller'
import LoginController from '../controllers/login.controller'
import QuestionController from '../controllers/question.controller';
import AnswerController from '../controllers/answer.controller';
import SearchController from '../controllers/search.controller';
import VoteController from '../controllers/vote.controller';
import { auth } from '../middlewares/middlewares'

const userService = new UserService()
const loginService = new LoginService()
const questionService = new QuestionService()
const answerService = new AnswerService()
const searchService = new SearchService()
const voteService = new VoteService()
const searchController = new SearchController(searchService)
const userController = new UserController(userService)
const loginController = new LoginController(loginService)
const questionController = new QuestionController(userService, questionService)
const answerController = new AnswerController(userService, questionService, answerService)
const voteController = new VoteController(userService, questionService, voteService)


const router = Router();


//User routes
router.post('/users', (req, res) => userController.createUser(req, res))

//auth
router.post('/login', (req, res) => loginController.login(req, res))

//questions
router.post('/questions', auth, (req, res) => questionController.createQuestion(req, res))
router.put('/questions/:id', auth, (req, res) => questionController.updateQuestion(req, res))
router.get('/questions/:id', (req, res) => questionController.getQuestion(req, res))
router.get('/questions', (req, res) => questionController.getQuestions(req, res))

//answers
router.post('/answers/:quesId', auth, (req, res) => answerController.createAnswer(req, res))
router.put('/answers/:id', auth, (req, res) => answerController.updateAnswer(req, res))
router.get('/answers/:id', (req, res) => answerController.getAnswer(req, res))
router.get('/all/answers/:quesId', (req, res) => answerController.getAnswers(req, res))

//votes
router.post('/votes/upvote/:quesId', auth, (req, res) => voteController.upvote(req, res))
router.post('/votes/downvote/:quesId', auth, (req, res) => voteController.downvote(req, res))

//Search
router.get('/search/user', (req, res) => searchController.searchUser(req, res))
router.get('/search/question', (req, res) => searchController.searchQuestion(req, res))
router.get('/search/answer', (req, res) => searchController.searchAnswer(req, res))


export default router