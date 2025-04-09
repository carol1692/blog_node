import express from "express"
import bodyParser from "body-parser"
import path, {dirname} from "path"
import fs, { appendFileSync } from "fs";
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const port = 3000

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded())

let list_data 

fs.readFile(path.join(__dirname,'public/MOCK_DATA.json'), { encoding: 'utf8' }, (err, data) => {
    if (err) throw err;
    list_data = JSON.parse(data); 
});


app.get('/', (req, res) => {
    res.render('index.ejs',{posts_data:list_data})
})

app.get('/posts', (req, res) => {
    res.render('list_posts.ejs',{posts_data:list_data})
})

app.get('/posts/:id', (req,res) => {
    const id = req.params.id;
    res.render('post.ejs', {posts_data:list_data, id_post:id})
});

app.get('/new_post', (req, res) => {
    res.render('new_post.ejs')
})

app.post('/new_post', (req, res) => {
    let new_title = req.body['new_title']
    let new_subtitle = req.body['new_subtitle']
    let new_text = req.body['new_text']
    if(new_title != "" && new_subtitle != "" && new_text != ""){
        list_data.posts[list_data.posts.length] = {title:new_title, subtitle:new_subtitle, text:new_text}
        let jsonString = JSON.stringify(list_data);
        fs.writeFile(path.join(__dirname,'public/MOCK_DATA.json'), jsonString, (err) =>{
            if (err) throw err;
            console.log('Data appended to file successfully.');
        })
    }
    res.redirect('/')
})

app.get('/edit_posts', (req, res) => {
    res.render('list_edit_posts.ejs',{posts_data:list_data} )
})  

app.get('/edit_post/:id', (req,res) => {
    const id = req.params.id;
    res.render('edit_post.ejs', {posts_data:list_data, id_post:id})
});

app.post('/edit_post/:id', (req,res) => {
    const id =  parseInt(req.params.id);
    let update_title = req.body['update_title']
    let update_subtitle = req.body['update_subtitle']
    let update_text = req.body['update_text']
    if(update_title != "" && update_subtitle != "" && update_text != ""){
        list_data.posts[id] = {title:update_title, subtitle:update_subtitle,text:update_text}
        let jsonString = JSON.stringify(list_data);
        fs.writeFile(path.join(__dirname,'public/MOCK_DATA.json'), jsonString, (err) =>{
            if (err) throw err;
            console.log('Data updated successfully.');
        })
        res.redirect('/')
    }else{
        res.render('edit_post.ejs', {posts_data:list_data, id_post:id})
    }
});


app.get('/delete/:id', (req,res) => {
    let id = req.params.id;
    list_data.posts.splice(id, 1)
    let jsonString = JSON.stringify(list_data);
    fs.writeFile(path.join(__dirname,'public/MOCK_DATA.json'), jsonString, (err) =>{
        if (err) throw err;
        console.log(`Post ${id} removed from file successfully.`);
    })
    res.redirect('/edit_posts')
    
});

// Start web Server
app.listen(port, () =>{
    console.log(`Listening on port ${port}`)
})