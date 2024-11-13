const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLFloat } = require('graphql');
const Property = require('../models/property');
const { uploadImage } = require('../utils/cloudinary');

// Property Type
const PropertyType = new GraphQLObjectType({
  name: 'Property',
  fields: () => ({
    id: { type: GraphQLID },
    numOfBed: { type: GraphQLInt },
    numOfBath: { type: GraphQLInt },
    size: { type: GraphQLString },
    price: { type: GraphQLFloat },
    address: { type: GraphQLString },
    image: { type: GraphQLString },
    state: { type: GraphQLString },
    rentType: { type: GraphQLString },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    property: {
      type: PropertyType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Property.findById(id);
      },
    },
    properties: {
      type: new GraphQLList(PropertyType),
      args: {
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
      },
      resolve(parent, { page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        return Property.find().skip(skip).limit(limit);
      },
    },
  }),
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add Property
    addProperty: {
      type: PropertyType,
      args: {
        numOfBed: { type: new GraphQLNonNull(GraphQLInt) },
        numOfBath: { type: new GraphQLNonNull(GraphQLInt) },
        size: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: GraphQLString }, // Optional image
        state: { type: new GraphQLNonNull(GraphQLString) },
        rentType: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        try {
          let imageUrl = args.image;

          // If an image is provided, upload it to Cloudinary
          if (args.image) {
            imageUrl = await uploadImage(args.image);
          }

          const property = new Property({
            numOfBed: args.numOfBed,
            numOfBath: args.numOfBath,
            size: args.size,
            price: args.price,
            address: args.address,
            image: imageUrl, // Cloudinary image URL
            state: args.state,
            rentType: args.rentType,
          });

          return await property.save();
        } catch (error) {
          throw new Error(`Failed to add property: ${error.message}`);
        }
      },
    },

    // Update Property
    updateProperty: {
      type: PropertyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        numOfBed: { type: GraphQLInt },
        numOfBath: { type: GraphQLInt },
        size: { type: GraphQLString },
        price: { type: GraphQLFloat },
        address: { type: GraphQLString },
        image: { type: GraphQLString },
        state: { type: GraphQLString },
        rentType: { type: GraphQLString },
      },
      resolve(parent, args) {
        const updateData = {};

        // Only add fields to the update object if they are provided
        Object.keys(args).forEach((key) => {
            if (args[key] !== undefined && key !== 'id') {
                updateData[key] = args[key];
            }
        });

        try {
          return Property.findByIdAndUpdate(args.id, updateData, { new: true });
        } catch (error) {
          throw new Error(`Failed to update property: ${error.message}`);
        }
      },
    },

    // Delete Property
    deleteProperty: {
      type: PropertyType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, { id }) {
        try {
          return Property.findByIdAndDelete(id);
        } catch (error) {
          throw new Error(`Failed to delete property: ${error.message}`);
        }
      },
    },
  }),
});

// Export Schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});