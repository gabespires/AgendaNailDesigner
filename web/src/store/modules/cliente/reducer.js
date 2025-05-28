import produce from 'immer';
import types from '../../../store/modules/cliente/types';

const INITIAL_STATE = {
  clientes: [],
  cliente: {
    email: '',
    nome: '',
    telefone: '',
    dataNascimento: '',
    sexo: 'M',
    documento: {
      tipo: 'cpf',
      numero: '',
    },
    endereco: {
      cidade: '',
      uf: '',
      cep: '',
      logradouro: '',
      numero: '',
      pais: 'BR',
    },
  },
  behavior: 'create', // ou 'update'
  components: {
    drawer: false,
    confirmDelete: false,
  },
  form: {
    filtering: false,
    disabled: false,
    saving: false,
  },
};

function cliente(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case types.UPDATE_CLIENTE: {
        const { payload } = action;

        if (payload.components) {
          draft.components = {
            ...draft.components,
            ...payload.components,
          };
        }

        if (payload.form) {
          draft.form = {
            ...draft.form,
            ...payload.form,
          };
        }

        if (payload.behavior) {
          draft.behavior = payload.behavior;
        }

        if (payload.clientes) {
          draft.clientes = payload.clientes;
        }

        if (payload.cliente) {
          draft.cliente = {
            ...INITIAL_STATE.cliente,
            ...payload.cliente,
            documento: {
              ...INITIAL_STATE.cliente.documento,
              ...(payload.cliente.documento || {}),
            },
            endereco: {
              ...INITIAL_STATE.cliente.endereco,
              ...(payload.cliente.endereco || {}),
            },
          };
        }

        break;
      }

      default:
        break;
    }
  });
}

export default cliente;
