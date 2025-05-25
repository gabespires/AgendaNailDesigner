import { all, takeLatest, call, put } from 'redux-saga/effects';
import types from './types';
import { updateAgendamento } from './actions';
import api from '../../../services/api';
import consts from '../../../consts';

export function* filterAgendamento(start, end){
    try {
        const {data: res} = yield call(api.post, '/agendamento/filter', {
            salaoID: consts.salaoId,
            dia: {
                inicio: start,
                fim: end,
            },
        });

        if (res.error){
            alert(res.message);
            return false;
        }

        yield put(updateAgendamento(res.agendamentos));
        
        console.log(res.data);
    } catch (err) {
        alert(err.message);
    }
}

export default all ([takeLatest(types.FILTER_AGENDAMENTOS, filterAgendamento)]);