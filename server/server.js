const express = require('express');
const { mongoose } = require('./db/mongoose.js');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path')

const { Column } = require('./models/column.js');
const { Row } = require('./models/row.js');
const { TableName } = require('./models/tableName.js');

const upload = multer({ dest: 'uploads/' })
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PATCH');
  next();
});

//Post images in rows
app.post('/rows/images', upload.single('image'),  (req, res) => {
  const _id = req.file.originalname;
  const filePath = path.join(__dirname, '../', req.file.path);
  fs.unlinkSync(filePath);

  Row.findByIdAndUpdate(_id, { $set: {image: 'uploaded'} }, { new: true })
  .then(row => {
      if (!row) {
          return res.status(404).send('row was not found')
      }
      res.send(row)
  })
  .catch(e => res.status(400).send('ups smth went wrong: 400'))
})

//Post images in columns
app.post('/columns/images', upload.single('image'),  (req, res) => {
  const _id = req.file.originalname;
  const filePath = path.join(__dirname, '../', req.file.path);
  fs.unlinkSync(filePath);

  Column.findByIdAndUpdate(_id, { $set: {image: 'uploaded'} }, { new: true })
    .then(column => {
        if (!column) {
            return res.status(404).send('column was not found')
        }
        res.send(column)
    })
    .catch(e => res.status(400).send('ups smth went wrong: 400'))
})

// POST column
app.post('/table1/columns', (req, res) => {
  const column = new Column(req.body);
  column.save()
  .then(savedCol => {
      res.status(200).send(savedCol);
  })
  .catch(e => {
      res.status(404).send('error happened while creating new column');
  })
})

// POST row
app.post('/table1/rows', (req, res) => {
  const row = new Row(req.body);
  row.save()
    .then(savedRow => {
        res.status(200).send(savedRow);
    })
    .catch(e => {
        res.status(404).send('error happened while creating new row');
    })
})

//get ALL how to get all, rows, columns and table name
app.get('/table1/all', async (req, res) => {
  try {
    const columns = await Column.find();
    const rows = await Row.find();
    let tableName = await TableName.find();

    if (tableName.length === 0) {
      defaultTableName = new TableName({TableName})
      const result = await defaultTableName.save();
      tableName = [result];
    }

    const table1 = {
        columns,
        rows,
        tableName
    };
    res.send(table1)
  } catch (e) {
    res.status(404).send('error while sending all table')
  }
})

//PATCH row
app.patch('/table1/rows', (req, res) => {
  const { _id } = req.body;
  Row.findByIdAndUpdate(_id, { $set: req.body }, { new: true })
    .then(row => {
        if (!row) {
            return res.status(404).send('row was not found')
        }
        res.send(row)
    })
    .catch(e => res.status(400).send('ups smth went wrong: 400'))
})

//PATCH columns
app.patch('/table1/columns', (req, res) => {
  const { _id } = req.body;
  Column.findByIdAndUpdate(_id, { $set: req.body }, { new: true })
    .then(column => {
        if (!column) {
            return res.status(404).send('column was not found')
        }
        res.send(column)
    })
    .catch(e => res.status(400).send('ups smth went wrong: 400'))
})

//PATCH tableName
app.patch('/table1/name', (req, res) => {
  const { _id } = req.body;

  TableName.findByIdAndUpdate(_id, { $set: req.body }, { new: true })
    .then(name => {
        if (!name) {
            return res.status(404).send('table name was not found')
        }
        res.send({text: 'this table anme has been edited', name})
    })
    .catch(e => res.status(400).send('ups smth went wrong: 400'))
})

//delete row
app.delete('/table1/rows', (req, res) => {
  const { _id }= req.body;

  Row.findByIdAndRemove(_id)
    .then(column => {
        if (!column) {
            return res.status(404).send('row was not found')
        }
        res.status(200).send({text:'removed row', column})
    })
    .catch(e => res.status(400).send(e))
})

//delete columns
app.delete('/table1/columns', (req, res) => {
  const { _id }= req.body;

  Column.findByIdAndRemove(_id)
      .then(columns => {
          if (!columns) {
              return res.status(404).send('columns was not found')
          }
          res.status(200).send({text:'removed column', columns})
      })
      .catch(e => res.status(400).send(e))
  })

app.listen(port, () => {
    console.log(`app is running on port: ${port}`)
})
