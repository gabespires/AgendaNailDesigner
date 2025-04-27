const mongoose = require('mongoose');
const URI = 
  'mongodb+srv://salaoUser:HzebfbAS7zZGvkbE@clusterdev.rhbih.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDev';

mongoose
  .connect(URI)
  .then(() => console.log('DB is Up!'))
  .catch((err) => console.log('Erro ao conectar no banco:', err));
