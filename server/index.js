import express from 'express';
import serverless from 'serverless-http';
import cors from "cors";
import { fetchTasks, createTasks, updateTasks, deleteTasks } from './task';


const app = express()
const port = 3001;

app.use(express.json()) // allows grabbing the body from request


if (process.env.DEVELOPMENT) { // prevents cors error when running locally
    app.use(cors())
} 


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/task', async (req, res) => {
    try {
        const tasks = await fetchTasks();
        res.send(tasks.Items)
    } catch (error) {
        res.status(400).send(`Error fetching tasks ${error}`)
    }
})

app.post('/task', async (req, res) => {
    try {
        const task = req.body;
        const response = await createTasks(task)

        res.send(response);
    } catch (error) {
        res.status(400).send(`Error creating tasks ${error}`)
    }
})

app.put('/task', async (req, res) => {
    try {
        const task = req.body;
        const response = await updateTasks(task)

        res.send(response)
    } catch (error) {
        res.status(400).send(`Error updating tasks ${error}`)
    }
})

app.delete('/task/:id', async (req, res) => {
    try {
        const {id} = req.params
        const response = await deleteTasks(id)

        res.send(response)
    } catch (error) {
        res.status(400).send(`Error deleting tasks ${error}`)
    }
})



// allows project to work so if using npm run dev it will use env variable called development ot run locally
// and if we want to deploy it will allow use of npm start
if (process.env.DEVELOPMENT) {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
}


export const handler = serverless(app)