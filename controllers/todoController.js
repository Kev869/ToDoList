var bodyParser=require('body-parser');
const { response } = require('express');

var mongoose=require('mongoose');
mongoose.set('strictQuery', true);
//Connect to the database
mongoose.connect('mongodb+srv://kevjohn02:test@tododb.81e8dzl.mongodb.net/test',{useNewUrlParser:true, useUnifiedTopology: true});

//Create schema
var todoSchema=new mongoose.Schema({
    item: String
});

var Todo=mongoose.model("Todo",todoSchema);
// var itemOne=Todo({item:"Do stuff"}).save(function(err){
//     if(err) throw err;
//     //console.log("Item saved");
// });

//var data=[{item:'get milk'},{item:'walk-dog'}];
var urlencodedParser=bodyParser.urlencoded({extended:false});//middle ware we want to run during post request

module.exports=function(app){
    app.get('/todo', async function(req, res) {
        try {
          // Get data from MongoDB and pass it to the view
          const data = await Todo.find({});
          res.render('todo', { todos: data });
        } catch (err) {
          console.error(err);
          // Handle the error appropriately (e.g., sending an error response)
          res.status(500).send('Internal Server Error');
        }
    });

    app.post('/todo', urlencodedParser, async function(req, res) {
        try {
          // Get data from the view and add it to MongoDB
          const newTodo = new Todo(req.body);
          const savedTodo = await newTodo.save();
          res.redirect('/todo');
        } catch (err) {
          console.error(err);
          // Handle the error appropriately (e.g., sending an error response)
          res.status(500).send('Internal Server Error');
        }
      });

    app.delete('/todo/:item', async function(req, res) {
        try {
          // Delete the requested item from MongoDB
          const deletedItem = await Todo.findOneAndDelete({ item: req.params.item.replace(/-/g, ' ') });
          res.send(deletedItem);
        } catch (err) {
          console.error(err);
          // Handle the error appropriately (e.g., sending an error response)
          res.status(500).send('Internal Server Error');
        }
    });
};

// try{
//     const docs=await Todo.find({});
//     res.render('todo', {todos:data});
// }
// catch(err){
//     console.log(err);
// }
