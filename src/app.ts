import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import {sequelize} from './config/db';


import indexRouter from './routes/index';
import usersRouter from './routes/users';
import User from './models/userModel';

const app = express();

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    // return sequelize.sync();
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

const schema = buildSchema(`
  type User {
    id: Int
    name: String
    email: String
    
  }

  type Query {
    getUser(id: Int!): User
  }

  type Mutation {
    createUser(name: String, email: String): User
  }
`);

// Define your GraphQL resolvers
interface GetUserArgs {
  id: number;
}

const root = {
  getUser: async ({ id }: GetUserArgs) => {
    return await User.findByPk(id);
  },

  createUser: async ({ name, email }: { name: string, email: string }) => {
    return await User.create({ name, email });
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable the GraphiQL UI for testing
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

export default app;
