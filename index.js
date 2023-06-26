import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import router from './Routes';
import errorHandler from './Middlewares/ErrorHandling';


const dbUrl = 'mongodb://localhost:27017/cursoDB';
mongoose.set('strictQuery', false);

connect()
.then(console.log('DB connected'))
.catch(e => console.log(e));

async function connect(){
    await mongoose.connect(dbUrl);
}

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', router);
app.use((req, res, next)=>{
    res.status(404).send({
        success: false,
        code: 404,
        message:"Invalid endpoint!"
    });
  });
app.use(errorHandler);

app.set('port', process.env.PORT || 3000);
let port = app.get('port');
app.listen(port, () => {
    console.log('Server on port ' + port);
});