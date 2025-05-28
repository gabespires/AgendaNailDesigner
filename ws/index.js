const express = require('express');
const app = express();
const morgan = require('morgan');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
const cors = require('cors');
require('./database');

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use(busboy());
app.use(busboyBodyParser());
app.use(cors());

// VARIABLES
app.set('port', 3001);

// ROTAS
app.use('/salao', require('./src/routes/salao.routes'));
app.use('/cliente', require('./src/routes/cliente.routes'));
app.use('/servico', require('./src/routes/servico.routes'));
app.use('/horario', require('./src/routes/horario.routes'));
app.use('/agendamento', require('./src/routes/agendamento.routes'));

app.listen(app.get('port'), () => {
    console.log(`WS Escutando na porta ${app.get('port')}`);
});
