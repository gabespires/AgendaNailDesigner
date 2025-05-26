const axios = require('axios');

// services/pagarme.js (mock)

module.exports = async function pagarme(path, data) {
  // Simula uma resposta válida da API de pagamentos
  if (path === '/transactions') {
    return {
      error: false,
      data: {
        id: 'transaction_mock_id_123',
      },
    };
  }

  if (path === '/customers') {
    return {
      error: false,
      data: {
        id: 'customer_mock_id_456',
      },
    };
  }

  return { error: true, message: 'Endpoint não mockado' };
};


/*const api = axios.create({
  baseURL: 'https://api.pagar.me/1',
});

const api_key = require('../data/keys.json').api_key;

module.exports = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, {
      api_key,
      ...data,
    });

    return { error: false, data: response.data };
  } catch (err) {
    let message = 'Erro desconhecido';

    if (err.response?.data?.errors?.length > 0) {
      message = JSON.stringify(err.response.data.errors[0]);
    } else if (err.response?.data?.error) {
      message = err.response.data.error;
    } else if (err.message) {
      message = err.message;
    }

    return {
      error: true,
      message,
    };
  }
};
*/