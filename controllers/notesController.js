const { title, nextTick } = require('process');
const Note = require('../models/note');
const User = require('../models/user');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

const getAllNotes = async(req,res)=>{
 await Note.find({isDeleted : false,userId:req.userId})
           .select({title:1,body:1,updatedAt:1})
           .sort({ updatedAt: 'desc' })
           .exec()
           .then(items =>{
               res.status(200).json({
                   count : items.length,
                   notes : items});
           })
           .catch(err =>{
               res.status(500).json({
                   message:"Something went wrong",
                   error : err
               });
            })
}

const getNotesById = async (req, res) => {
    try {
      const { id } = req.params;

      const item = await Note.findById(id)
        .select({ title: 1, body: 1, updatedAt: 1, isDeleted: 1 })
        .exec();
  
      // Check if the note is found and not already deleted
      if (!item || item.isDeleted === true) {
        return res.status(404).json({
          message: "Note not found",
        });
      }
  
      return res.status(200).json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Something went wrong",
        error: err,
      });
    }
  };

const saveNewNote = async (req, res) => {
    try {
      const newNote = new Note({
        title: req.body.title,
        body: req.body.body,
        userId: req.userId,
        });
  
      const savedNote = await newNote.save();
  
      return res.status(201).json({
        message: "Note saved successfully",
        note: savedNote,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Something went wrong",
        error: err,
      });
    }
};
              


const updateNote = async (req, res) => {
    try {
      const { id } = req.params;
  
      const item = await Note.findById(id).exec();
  
      // Check if the note is found and not already deleted
      if (!item || item.isDeleted === true) {
        return res.status(404).json({
          message: "Note not found",
        });
      }
  
      item.title = req.body.title;
      item.body = req.body.body;
  
      await Note.findByIdAndUpdate(id, item, { runValidators: true }).exec();
  
      return res.status(200).json({
        message: "Updated the note successfully",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Something went wrong",
        error: err,
      });
    }
  };

const deleteNote = async (req, res) => {
    try {
      const { id } = req.params;
      
      const item = await Note.findById(id).exec();
  
      // Check if the note is found and not already deleted
      if (!item || item.isDeleted === true) {
        return res.status(404).json({
          message: "Note not found",
        });
      }
 
      item.isDeleted = true;

      await Note.findByIdAndUpdate(id, item).exec();
  
      return res.status(200).json({
        message: "Deleted the note successfully",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Something went wrong",
        error: err,
      });
    }
  };

const searchNote = async (req, res) => {
    try {
      const searchText = req.query.q;
  
      const items = await Note.find({
        $text: { $search: searchText },
        userId: req.userId,
        isDeleted: false,
      })
        .select({ title: 1, body: 1, updatedAt: 1 })
        .exec();
  
      if (items.length === 0) {
        return res.status(200).json({ message: "No results" });
      }
  
      return res.status(200).json({
        count: items.length,
        notes: items,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Something went wrong",
        error: err,
      });
    }
  };

const shareNote = async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Note.findById(id).exec();
  
      //check if note with the id exists
      if (!item || item.isDeleted === true) {
        return res.status(404).json({
          message: "Note not found",
        });
      }
  
      const shareUserName = req.body.shareUserName;
  
      //check if user to be shared with is not the same user
      if (shareUserName === req.userName) {
        return res.status(400).json({
          message: "Can not share with yourself",
        });
      }
  
      const shareUser = await User.findOne({ username: shareUserName }).exec();
  
      //check if the user to be shared with exists
      if (!shareUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      console.log(shareUser);
  
      const newNote = new Note({
        title: item.title,
        body: item.body,
        userId: shareUser.id,
      });
  
      await newNote.save();
  
      return res.status(201).json({
        message: "Note shared successfully",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Something went wrong",
        error: err,
      });
    }
  };
   
  const getEmbedding = async(query)=> {
    const url = 'https://api.openai.com/v1/embeddings';
    const openai_key = process.env.openai_key;

    let response = await axios.post(url, {
      input: query,
      model: "text-embedding-ada-002"
    }, {
      headers: {
          'Authorization': `Bearer ${openai_key}`,
          'Content-Type': 'application/json'
      }
    });
    if(response.status === 200) {
      return response.data.data[0].embedding;
    } else {
    throw new Error(`Failed to get embedding. Status code: ${response.status}`);
    }
  } 
  const contextSearchText = async(req,res) =>{
    const searchText = req.query.q;

    const url = process.env.MONGODB_CONNECTION;
    const client = new MongoClient(url);


    try{
      await client.connect();
        
      const db = client.db('test'); 
      const collection = db.collection('notes');
      const embedding = await getEmbedding(searchText);
      const items = await collection.aggregate([
        {"$vectorSearch": {
          "queryVector": embedding,
          "path": "body_embedding",
          "numCandidates": 100,
          "limit": 5,
          "index": "notesBodyIndex",
            }},
            {
              $match:
                {
                  isDeleted: false,
                },
            },
        {"$project":{
          title:1,
          body:1
        }}
      ]).toArray();
  
      if (items.length === 0) {
        return res.status(200).json({ message: "No results" });
      }
  
      return res.status(200).json({
        count: items.length,
        notes: items,
      });
    }catch(err){
      console.error(err);
      return res.status(500).json({
        message: "Something went wrong",
        error: err,
    })
  }
}




module.exports = {getAllNotes,getNotesById,saveNewNote,updateNote,deleteNote,shareNote,searchNote,contextSearchText};