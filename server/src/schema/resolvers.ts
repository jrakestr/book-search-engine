import type { Response } from 'express';
import { AuthenticationError } from 'apollo-server-express';
import {
  getSingleUser,
  createUser,
  login as loginController,
  saveBook as saveBookController,
  deleteBook as removeBookController
} from '../controllers/user-controller.js';

// Helper function to simulate Express response object
const callController = async (controller: Function, req: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const res = {
      json: (result: any): any => resolve(result),
      status: (code: number): any => ({
        json: (result: any) => reject(new Error(`Error ${code}: ${result.message || JSON.stringify(result)}`))
      })
    };
    Promise.resolve(controller(req, res as Response)).catch(reject);
  });
};

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any): Promise<any> => {
      if (context && context.user) {
        // Build a fake req with user info
        const req = { user: context.user, params: { id: context.user._id } };
        return await callController(getSingleUser, req);
      }
      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    addUser: async (_: any, { username, email, password }: any): Promise<any> => {
      try {
        const req = { body: { username, email, password } };
        const result = await callController(createUser, req);
        console.log('User creation result:', result);
        
        // The token is already created in the controller
        return result;
      } catch (err) {
        console.error('Error in addUser resolver:', err);
        throw err;
      }
    },
    login: async (_: any, { email, password }: any): Promise<any> => {
      try {
        const req = { body: { email, password } };
        const result = await callController(loginController, req);
        console.log('Login result:', result);
        
        // The token is already created in the controller
        return result;
      } catch (err) {
        console.error('Error in login resolver:', err);
        throw err;
      }
    },
    saveBook: async (_: any, { bookData }: any, context: any): Promise<any> => {
      if (context && context.user) {
        const req = { user: { _id: context.user._id }, body: bookData };
        return await callController(saveBookController, req);
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (_: any, { bookId }: any, context: any): Promise<any> => {
      if (context && context.user) {
        const req = { user: { _id: context.user._id }, params: { bookId } };
        return await callController(removeBookController, req);
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

export default resolvers;
