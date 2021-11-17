import { Request, Response, NextFunction } from  'express';

const   
  express      =  require('express'),
  app          =  express(),
  createError  =  require('http-errors'),
  cookieParser =  require('cookie-parser'),
  bodyParser   =  require('body-parser'),
  morgan       =  require('morgan'),
  fileUpload   =  require("express-fileupload"),
  device       =  require('express-device'),
  cors         =  require('cors'),
  { sync }     =  require('glob'),
  { resolve }  =  require('path');

require('dotenv').config();

app.use(cors());
app.use((req: Request, res: any, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", req.header('Origin'));
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization')");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser());
app.use(morgan('\x1b[34m:method \x1b[0m:url \x1b[33m:status \x1b[0m:res[content-length] - :response-time ms'));
app.use(fileUpload());
app.use(device.capture({ parseUserAgent: true }));

const ending = JSON.parse(process.env.DEV || 'false') ? '.ts' : '.js';

const files = sync(resolve(JSON.parse(process.env.DEV || 'false') ? './src/api/routes/**/*' : './api/routes/**/*' + ending));
console.log('');
files.forEach((file: string) => {
    const _file = require(file);
    if (_file) {
        try {
            app.use(file.replace(__dirname.replaceAll('\\', '/') + '/api/routes', '').replace(ending, ''), _file);
            console.log(`Loaded \x1b[36m${file.replace(__dirname.replaceAll('\\', '/') + '/api/routes', '')} \x1b[0mas \x1b[36m${file.replace(__dirname.replaceAll('\\', '/') + '/api/routes', '').replace(ending, '')}\x1b[0m`);
        } catch { };
    }
});
console.log('');

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError.NotFound());
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Running on 3000');
});