import produce from 'immer';
import types from '../../../store/modules/cliente/types';

const INITIAL_STATE = {
    clientes: []
}

function cliente(state = INITIAL_STATE, action) {
    switch(action.type){
        case types.UPDATE_CLIENTES: {
            console.log(action);
            return produce(state, draft => {
                // {clientes: [.....] }
                draft = { ...draft, ...action.payload };
                return draft;
            });
        }
        default: return state;
    }
}

export default cliente;