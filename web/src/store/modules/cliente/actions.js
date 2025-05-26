import types from '../../../store/modules/cliente/types';

export function allClientes(){
    return {type: types.ALL_CLIENTES};
}

export function updateClientes(payload){
    return {type: types.UPDATE_CLIENTES, payload};
}
