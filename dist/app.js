"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
const db_1 = require("./config/db");
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const userModel_1 = __importDefault(require("./models/userModel"));
const app = (0, express_1.default)();
db_1.sequelize.authenticate()
    .then(() => {
    console.log('Database connection has been established successfully.');
    // return sequelize.sync();
})
    .catch((error) => {
    console.error('Unable to connect to the database:', error);
});
const schema = (0, graphql_1.buildSchema)(`
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
const root = {
    getUser: async ({ id }) => {
        return await userModel_1.default.findByPk(id);
    },
    createUser: async ({ name, email }) => {
        return await userModel_1.default.create({ name, email });
    },
};
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable the GraphiQL UI for testing
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/", index_1.default);
app.use("/users", users_1.default);
exports.default = app;
