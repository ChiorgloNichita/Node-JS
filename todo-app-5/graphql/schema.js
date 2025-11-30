import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import prisma from '../models/db.js';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString },
    todos: {
      type: new GraphQLList(TodoType),
      resolve: (parent) =>
        prisma.todo.findMany({
          where: { user_id: parent.id },
        }),
    },
  }),
});

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    todos: {
      type: new GraphQLList(TodoType),
      resolve: (parent) =>
        prisma.todo.findMany({
          where: { category_id: parent.id },
        }),
    },
  }),
});

const TodoType = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    category: {
      type: CategoryType,
      resolve: (parent) =>
        prisma.category.findUnique({
          where: { id: parent.category_id },
        }),
    },
    user: {
      type: UserType,
      resolve: (parent) =>
        prisma.user.findUnique({
          where: { id: parent.user_id },
        }),
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    todos: {
      type: new GraphQLList(TodoType),
      resolve: (_, __, req) => {
        if (!req.user) throw new Error('Не авторизован');
        return prisma.todo.findMany({
          where: { user_id: req.user.id },
        });
      },
    },

    todo: {
      type: TodoType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: (_, { id }, req) => {
        if (!req.user) throw new Error('Не авторизован');
        return prisma.todo.findUnique({ where: { id } });
      },
    },

    categories: {
      type: new GraphQLList(CategoryType),
      resolve: () => prisma.category.findMany(),
    },

    me: {
      type: UserType,
      resolve: (_, __, req) => {
        if (!req.user) throw new Error('Нет токена');
        return prisma.user.findUnique({
          where: { id: req.user.id },
        });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createTodo: {
      type: TodoType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        categoryId: { type: GraphQLInt },
      },
      resolve: async (_, { title, categoryId }, req) => {
        if (!req.user) throw new Error('Нет токена');

        if (title.trim().length < 2) {
          throw new Error('Название слишком короткое');
        }

        return prisma.todo.create({
          data: {
            title,
            category_id: categoryId,
            user_id: req.user.id,
          },
        });
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
