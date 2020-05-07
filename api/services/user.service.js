import User from '../models/user'
import password from '../utils/password';
import { ObjectID } from 'mongodb';


class UserService {

  constructor() {
    this.user = User
  }

  async createUser(user) {

    try {

      //check if the user already exists
      const record = await this.user.findOne({ email: user.email })
      if (record) {
        throw new Error('record already exists');
      }
      user.password = password.hashPassword(user.password)

      //create the user
      const createdUser = await this.user.create(user);

      const { _id, username } = createdUser;

      //return user details except email and password:
      const publicUser = { 
        _id,
        username
      }

      return publicUser

    } catch(error) {
      throw error;
    }
  }

  async getUser(userId) {

    let userObjID = new ObjectID(userId)

    try {

      const gottenUser = await this.user.findOne({ _id: userObjID })
      if (!gottenUser) {
        throw new Error('no record found');
      }

      const { _id, username } = gottenUser;

      //return user details except email and password:
      const publicUser = { 
        _id,
        username
      }

      return publicUser

    } catch(error) {
      throw error;
    }
  }
}

export default UserService