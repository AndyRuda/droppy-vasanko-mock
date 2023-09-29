const express = require('express')
const fs = require('fs');

var cors = require('cors')

const app = express()
app.use(cors())
const port = 3000

app.get('/*', (req, res) => {
    try {
        const path = req.path.split('/').filter(e => e !== '')

        const jsonString = fs.readFileSync('./db.json', 'utf-8');
        let response = JSON.parse(jsonString);

        path.shift();
        let numberOfFounds = 0;
        // let response = DB['files'];
        if (path.length < 0) return res.json(response)

        for (let route in path) {
            for (let data in response['content']) {
                if (path[route].toLowerCase() === response['content'][data]['name'].toLowerCase()) {
                    response = response['content'][data]
                    numberOfFounds++
                    break;
                }
            }
        }
        if (numberOfFounds < path.length) {
            return res.status(404).json({
                message: 'File not found'
            })
        }

        response['URL'] = req.path
        res.json(response)
    } catch (error) {
        res.status(500).json({ error: 'Unknown error', descp: error.message })
    }
})

app.listen(port, () => {
    console.log(`Mock app listening on port ${port}`)
})