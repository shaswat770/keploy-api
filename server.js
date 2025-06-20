const express = require('express');
const oracledb = require('oracledb');

const app = express();
const PORT = 3000;

app.use(express.json());

// Step 1: Connect to Oracle DB
async function connectToDB() {
  return await oracledb.getConnection({
    user: 'shaswat',          // e.g., 'system'
    password: 'shas1234',      // e.g., 'oracle'
    connectString: 'localhost/XEPDB1' // or 'localhost/XE'
  });
}

// Step 2: Simple homepage route
app.get('/', (req, res) => {
  res.send('API is working 🚀');
});

// Step 3: GET all items
app.get('/items', async (req, res) => {
  try {
    const conn = await connectToDB();
    const result = await conn.execute('SELECT * FROM items');
     console.log(result);  // 👈 Add this line
    res.json(result.rows);
    await conn.close();
  } catch (err) {
      console.error(err); 
    res.status(500).send('Error fetching items');
  }
});

// Step 4: POST (add new item)
app.post('/items', async (req, res) => {
  const { name, description } = req.body;
  try {
    const conn = await connectToDB();
    await conn.execute(
      'INSERT INTO items (name, description) VALUES (:name, :desc)',
      { name, desc: description },
      { autoCommit: true }
    );
    res.send('Item added');
    await conn.close();
  } catch (err) {
    res.status(500).send('Error adding item');
  }
});

// Step 5: PUT (update item)
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const conn = await connectToDB();
    await conn.execute(
      'UPDATE items SET name = :name, description = :desc WHERE id = :id',
      { id, name, desc: description },
      { autoCommit: true }
    );
    res.send('Item updated');
    await conn.close();
  } catch (err) {
    res.status(500).send('Error updating item');
  }
});

// Step 6: DELETE item
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await connectToDB();
    await conn.execute('DELETE FROM items WHERE id = :id', { id }, { autoCommit: true });
    res.send('Item deleted');
    await conn.close();
  } catch (err) {
    res.status(500).send('Error deleting item');
  }
});

// Step 7: Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
