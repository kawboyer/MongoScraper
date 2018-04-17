// Require mongoose
var mongoose = require("mongoose");

// Get a reference to the mongoose Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ExampleSchema object
// This is similar to a Sequelize model
var ExampleSchema = new Schema({
  // `string` must be of type String. We "trim" it to remove any trailing white space
  // `string` is a required field, and a custom error message is thrown if it is not supplied
  foo: {
    type: String,
    trim: true, //K We want it to trim
    required: "Foo is Required" //K Error message if this field is not provided
  },
  // `number` is of type Number
  // `number` must be unique
  // `number` is required. The default mongoose error message is thrown if it is not supplied
  SSN: {
    type: Number,
    unique: true,
    required: true //K This will allow Mongoose to come up with it's own error message
  },
  // `email` is of type String
  // `email` must match the regex pattern below and throws a custom error message if it does not
  // You can read more about RegEx Patterns here https://www.regexbuddy.com/regex.html
  email: {
    type: String,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"] //K Here (.) is a wildcard. And this (\.) would be a period. This is a regular expressions.
  },
  // `boolean` must be of type Boolean
  boolean: Boolean,
  // `array` must be an Array
  array: Array,
  // `date` must be of type Date. The default value is the current date
  date: {
    type: Date,
    default: Date.now
  },
  // `longstring` must be of type String
  // `longstring` uses a custom validation function to only accept values 6 characters or more
  // A custom error message is thrown if the validation fails
  title: { //K a long string
    type: String,
    validate: [
      // Function takes in the new `longstring` value to be saved as an argument
      function(input) {
        // If this returns true, proceed. If not, return the error message below
        return input.length >= 6; //K This sets the validation making sure that the data input can be longer than 6 characters. Really powerful.
      },
      // Error Message
      "Title should be longer."
    ]
  }
});

// This creates our model from the above schema, using mongoose's model method
var Example = mongoose.model("Example", ExampleSchema);

// Export the Example model
module.exports = Example;

var ExampleSchema = new Schema({
  // `string` must be of type String. We "trim" it to remove any trailing white space
  // `string` is a required field, and a custom error message is thrown if it is not supplied
  foo: {
    type: String,
    trim: true,
    required: "foo is Required"
  },
  // `number` is of type Number
  // `number` must be unique
  // `number` is required. The default mongoose error message is thrown if it is not supplied
  ssn: {
    type: Number,
    unique: true,
    required: true
  },
  // `email` is of type String
  // `email` must match the regex pattern below and throws a custom error message if it does not
  // You can read more about RegEx Patterns here https://www.regexbuddy.com/regex.html
  email: {
    type: String,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"]
  },
  // `boolean` must be of type Boolean
  isCool: Boolean,
  // `array` must be an Array
  someThings: Array,
  // `date` must be of type Date. The default value is the current date
  lastLogin: {
    type: Date,
    default: Date.now
  },
  // `longstring` must be of type String
  // `longstring` uses a custom validation function to only accept values 6 characters or more
  // A custom error message is thrown if the validation fails
  title: {
    type: String,
    validate: [
      // Function takes in the new `longstring` value to be saved as an argument
      function(input) {
        // If this returns true, proceed. If not, return the error message below
        return input.length >= 6;
      },
      // Error Message
      "title should be longer."
    ]
  }
});
