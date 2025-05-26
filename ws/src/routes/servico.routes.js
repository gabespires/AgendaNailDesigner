const express = require('express');
const router = express.Router();
const Busboy = require('busboy'); 
const aws = require('../services/aws');
const Servico = require('../models/servico');
const Arquivos = require('../models/arquivo');

router.post('/', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });

  const arquivos = [];
  const campos = {};
  const arquivosBuffers = [];

  // Captura campos do formulário (texto)
  busboy.on('field', (fieldname, val) => {
    campos[fieldname] = val;
  });

  // Captura arquivos (em buffer para upload)
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    let buffer = Buffer.alloc(0);

    file.on('data', (data) => {
      buffer = Buffer.concat([buffer, data]);
    });

    file.on('end', () => {
      arquivosBuffers.push({ fieldname, filename, encoding, mimetype, buffer });
    });
  });

  busboy.on('finish', async () => {
    try {
      let errors = [];
      let paths = [];

      // Faz upload dos arquivos para o AWS S3
      if (arquivosBuffers.length > 0) {
        for (const file of arquivosBuffers) {
          const nameParts = file.filename.split('.');
          const fileName = `${Date.now()}.${nameParts[nameParts.length - 1]}`;
          const path = `servicos/${campos.salaoId}/${fileName}`;

          const response = await aws.uploadToS3(file.buffer, path);
          if (response.error) {
            errors.push({ error: true, message: response.message });
          } else {
            paths.push(path);
          }
        }
      }

      if (errors.length > 0) {
        return res.json(errors[0]);
      }

      // CRIAR SERVIÇO
      let jsonServico = JSON.parse(campos.servico);
      jsonServico.salaoId = campos.salaoId;
      const servico = await new Servico(jsonServico).save();

      // CRIAR ARQUIVO
      const arquivosParaSalvar = paths.map((arquivo) => ({
        referenciaId: servico._id,
        model: 'Servico',
        arquivo,
      }));
      await Arquivos.insertMany(arquivosParaSalvar);

      return res.json({ error: false, arquivos: paths });
    } catch (err) {
      return res.json({ error: true, message: err.message });
    }
  });

  req.pipe(busboy);
});

module.exports = router;
