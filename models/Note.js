//Create schema to store notes user leave per article

// require mongoose
var mongoose = require('mongoose');

// create a schema class
var Schema = mongoose.Schema;

// create the Note schema
var NoteSchema = new Schema({
  // just a string
  title: {
    type:String
  },
  // just a string
  body: {
    type:String
  }
});

// create the Note model with the NoteSchema
var Note = mongoose.model('Notes', NoteSchema);

// export the Note model
module.exports = Note;
