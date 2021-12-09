const orango = require('orango');
const {EVENTS} = orango.consts;
const db = orango.get('_system');

db.events.once(EVENTS.CONNECTED, conn => {
  console.log('Connected to arango db', conn.url + '/' + conn.name);
})

db.events.once(EVENTS.READY, ()=> {
  console.log('Orango is ready');
})

function registerModels(orango) {
  let PostSchema = new orango.Schema({
    author: {type: String, required: 'insert'}, 
    title: {type: String, required: 'insert'}, 
    body: {type: String, required: 'insert'}
  })

  orango.model('Post', PostSchema, 'Posts');
}

function createModel(orango) {
    let UserSchema = new orango.Schema({
        username: {type: String, required: 'insert'}
    })

    orango.model('BlogUser', UserSchema, "BlogUsers");
}

function createEdge(orango) {

    let likeEdge = new orango.Schema({
        
    })

    likeEdge.type('edge', {
        from: 'BlogUser', 
        to: 'Post'
    })

    orango.model('Like', likeEdge);
}

async function main() {
  try {
    registerModels(db)
    createModel(db);
    createEdge(db);

    await db.connect({username: 'root', password: 'rootpassword'})

    console.log('Are we connected?', db.connection.connected);
  } catch(e) {
    console.log('Error:', e.message);
  }

  const Post = orango.model('Post');

  let results = await Post.insert({author: "Amanda", title: "Hejsan", body: "jvirdsljfir"}).return()
  console.log(results);
  console.log('--------------');

  results = await Post.insert({author: "Dessi", title: "Post 2", body: "giksnrlfjls"}).return()
  console.log(results);
  console.log('--------------');

  await Post.insert({author: "Dessi", title: "Hallå", body: "fieosjfi"})
  await Post.insert({author: "Amanda", title: "Hej", body: "ofepjfiefe"})
  await Post.insert({author: "Teo", title: "Tjo", body: "odpwajoid"})


  results = await Post.find();
  console.log(results);

  console.log('--------------');

  results = await Post.find().where({author:"Amanda"});
  console.log(results);

  console.log('--------------');

  results = await Post.find().where({author:"Amanda"}).limit(1);
  console.log(results);

  console.log('--------------');

  results = await Post.find().where({$or: [{author: 'Dessi'}, {author: "Teo"}]})
  console.log(results);

  console.log('--------------');

  results = await Post.update({title: "Hej hopp"}).where({author: "Teo"}).return()
  console.log(results);

  const User = orango.model('BlogUser');
  await User.insert({username: "Tintin"});
  
  let Like = orango.model('Like')


  const userRes = await User.find().where({username: "Tintin"});
  const tintin = userRes[0];
  console.log('--------------');
  console.log(tintin);

  const postRes = await Post.find().where({author: "Teo"});
  const post = postRes[0];

//   await Like.link({_to: `Posts/${post._key}`, _from: `BlogUsers/${tintin._key}`});
  await Like.link({BlogUser: `${tintin._key}`, Post: `${post._key}`})
//   await res.exec()

}

main();