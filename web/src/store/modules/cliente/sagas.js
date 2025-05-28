import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import { updateCliente } from '../../../store/modules/cliente/actions';
import types from '../../../store/modules/cliente/types';
import api from '../../../services/api';
import consts from '../../../consts';

export function* allClientes (){

    const { form } = yield select(state => state.cliente);
    try{
    yield put(updateCliente({ form: {...form, filtering: true} }));
    const { data: res } = yield call(api.get, `/cliente/salao/${consts.salaoId}`);

    console.log("salaoId usado:", consts.salaoId);

     yield put(updateCliente({ form: {...form, filtering: false} }));

    if(res.error){
        alert(res.message);
        return false;
    }
    const state = yield select(state => state.cliente);

    yield put(updateCliente({
    clientes: res.clientes,
    components: state.components, // preserva o estado do drawer!
    }));
    
    } catch(err){
        yield put(updateCliente({ form: {...form, filtering: false} }));
        alert(err.message);
    }
}

export function* filterCliente() {
  const { form, cliente } = yield select(state => state.cliente);
  
  try {
    yield put(updateCliente({ form: { ...form, filtering: true } }));
    
    const { data: res } = yield call(api.post, `/cliente/filter`, {
      filters: {
        email: cliente.email,
        status: 'A',
      },
    });

    yield put(updateCliente({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    // Verificação segura dos dados da resposta
    const clientesFiltrados = Array.isArray(res.clientes) ? res.clientes : [];
    const clienteEncontrado = res.cliente || null;

    if (clienteEncontrado) {
      yield put(updateCliente({
        cliente: clienteEncontrado,
        form: { ...form, filtering: false, disabled: true },
        clientes: clientesFiltrados
      }));
    } else {
      yield put(updateCliente({
        form: { ...form, disabled: false },
        clientes: clientesFiltrados
      }));
    }

  } catch(err) {
    yield put(updateCliente({ 
      form: { ...form, filtering: false },
      clientes: [] // Garante que clientes seja um array mesmo em caso de erro
    }));
    alert(err.message);
  }
}

export default all([takeLatest(types.ALL_CLIENTES, allClientes),
    takeLatest(types.FILTER_CLIENTE, filterCliente),
]);