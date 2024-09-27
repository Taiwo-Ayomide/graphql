const graphql = require('graphql');
const Student = require('../models/student');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull } = graphql;
const CryptoJS = require('crypto-js');

// student types
const StudentTypes = new GraphQLObjectType({
    name: 'Student',
    fields: () => ({
        id: { type: GraphQLID },
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        age: { type: GraphQLString },
        sex: { type: GraphQLString },
        religion: { type: GraphQLString },
        phone: { type: GraphQLString },
        email: { type: GraphQLString },
        state: { type: GraphQLString },
        password: { type: GraphQLString },
    })
});

// Root query
const RootQuery =  new  GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        student: {
            type: StudentTypes,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Student.findById(args.id)
            },
        },
        students: {
            type: new GraphQLList(StudentTypes),
            resolve(parent, args) {
                return Student.find({});
            },
        },
    })
});

// Mutation (post, update, delete)
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addStudent: {
            type: StudentTypes,
            args: {
                firstname: { type: new GraphQLNonNull(GraphQLString) },
                lastname: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLString) },
                sex: { type: new GraphQLNonNull(GraphQLString) },
                religion: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                state: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                const encrpytPassword = CryptoJS.AES.encrypt(args.password, process.env.PASSWORD_KEY).toString();
                let student = new Student({
                    firstname: args.firstname,
                    lastname: args.lastname,
                    age: args.age,
                    sex: args.sex,
                    religion: args.religion,
                    phone: args.phone,
                    email: args.email,
                    state: args.state,
                    password: encrpytPassword,
                });
                return student.save();
            },
        },
        updateStudent: {
            type: StudentTypes,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                firstname: { type: GraphQLString },
                lastname: { type: GraphQLString },
                age: { type: GraphQLString },
                sex: { type: GraphQLString },
                religion: { type: GraphQLString },
                phone: { type: GraphQLString },
                email: { type: GraphQLString },
                state: { type: GraphQLString },
                password: { type: GraphQLString, },
            },
            resolve(parent, args) {
                return Student.findByIdAndUpdate(args.id, {
                    firstname: args.firstname,
                    lastname: args.lastname,
                    age: args.age,
                    sex: args.sex,
                    religion: args.religion,
                    phone: args.phone,
                    email: args.email,
                    state: args.state,
                    password: args.password,
                }, { new: true });
            },
        },
        deleteStudent: {
            type: StudentTypes,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return Student.findByIdAndDelete((args.id));
            },
        },
    }),
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});