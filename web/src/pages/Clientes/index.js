import { useEffect } from 'react';
import Drawer from 'rsuite/Drawer';
import Button from 'rsuite/Button';
import 'rsuite/dist/rsuite.min.css';
import Table from '../../components/Table';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { allClientes, updateCliente, filterCliente } from '../../store/modules/cliente/actions';


const Clientes = () => {
  const dispatch = useDispatch();
  const { clientes, cliente, behavior, form, components } = useSelector((state) => state.cliente);


  const setComponent = (component, state) => {
    dispatch(updateCliente({
      components: { ...components, [component]: state },
    }));
  };

  const setCliente = (key, value) => {
    dispatch(updateCliente({
    cliente: { ...cliente, [key]: value },
    }));
  }

  useEffect(() => {
    console.log("Estado do drawer:", components.drawer);
  }, [components.drawer]);

  useEffect(() => {
    dispatch(allClientes());
  }, [dispatch]);


  useEffect(() => {
    console.log("Clientes do Redux:", clientes);
  }, [clientes]);


  const handleNewClient = () => {
    console.log("Botão clicado - handleNewClient chamado"); // Logs button click
    dispatch(updateCliente({
        behavior: "create",
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
        components: {
            ...components, // Preserves other components
            drawer: true  // Updates only the drawer
        },
    }));
};

  return (
    <div className="col p-5 overflow-auto h-100">
      {/* Drawer */}
      {console.log('Drawer should render:', components.drawer)}
        <Drawer
            open={components.drawer}
            onClose={() => setComponent('drawer', false)}
            size="sm"
            style={{
                zIndex: 9999,
                position: 'fixed'
            }}
            backdropStyle={{
                zIndex: 9998
            }}
            >
            <Drawer.Body style={{ overflow: 'auto' }}>
                <h3>{behavior === 'create' ? 'Criar novo' : 'Atualizar'} Cliente</h3>
                <div className='row mt-3'>
                    <div style={{ padding: 20 }}>
                <div className="form-group col-12 mb-3">
                    <b>E-mail</b>
                    <input
                        type="email"
                        class="form-control"
                        placeholder="E-mail do cliente"
                        disabled={behavior !== 'create'}
                        onChange={(e) => {
                            setCliente('email', e.target.value);
                            console.log(cliente);
                        }}
                        value={cliente.email}
                    />
                {behavior === 'create' && (
                  <div class="input-group-append">
                    <Button
                      appearance="primary"
                      loading={form.filtering}
                      disabled={form.filtering}
                      onClick={() => {
                        dispatch(
                          filterCliente({
                            filters: { email: cliente.email, status: 'A' },
                          })
                        );
                      }}
                    >
                      Pesquisar
                    </Button>
                  </div>
                )}
            
            </div>
            </div>
             <div className="form-group col-6">
              <b className="">Nome</b>
              <input
                type="text"
                className="form-control"
                placeholder="Nome do Cliente"
                disabled={form.disabled}
                value={cliente.nome}
                onChange={(e) => setCliente('nome', e.target.value)}
              />
            </div>
            <div className="form-group col-6">
              <b className="">Telefone / Whatsapp</b>
              <input
                type="text"
                className="form-control"
                placeholder="Telefone / Whatsapp do Cliente"
                disabled={form.disabled}
                value={cliente.telefone}
                onChange={(e) => setCliente('telefone', e.target.value)}
              />
            </div>

            <div className="form-group col-6">
              <b className="">Data de Nascimento</b>
              <input
                type="date"
                className="form-control"
                disabled={form.disabled}
                value={cliente.dataNascimento}
                onChange={(e) => setCliente('dataNascimento', e.target.value)}
              />
            </div>
            <div className="form-group col-6">
              <b>Sexo</b>
              <select
                disabled={form.disabled}
                className="form-control"
                value={cliente.sexo}
                onChange={(e) => setCliente('sexo', e.target.value)}
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>

            <div className="form-group col-6">
              <b>Tipo de documento</b>
              <select
                disabled={form.disabled}
                className="form-control"
                value={cliente.documento.tipo}
                onChange={(e) =>
                  setCliente('documento', {
                    ...cliente.documento,
                    tipo: e.target.value,
                  })
                }
              >
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
              </select>
            </div>
            <div className="form-group col-6">
              <b className="">Número do documento</b>
              <input
                type="text"
                className="form-control"
                disabled={form.disabled}
                value={cliente.documento.numero}
                onChange={(e) =>
                  setCliente('documento', {
                    ...cliente.documento,
                    numero: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group col-3">
              <b className="">CEP</b>
              <input
                type="text"
                className="form-control"
                placeholder="Digite o CEP"
                disabled={form.disabled}
                value={cliente.endereco.cep}
                onChange={(e) =>
                  setCliente('endereco', {
                    ...cliente.endereco,
                    cep: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group col-6">
              <b className="">Rua / Logradouro</b>
              <input
                type="text"
                className="form-control"
                placeholder="Rua / Logradouro"
                disabled={form.disabled}
                value={cliente.endereco.logradouro}
                onChange={(e) =>
                  setCliente('endereco', {
                    ...cliente.endereco,
                    logradouro: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group col-3">
              <b className="">Número</b>
              <input
                type="text"
                className="form-control"
                placeholder="Número"
                disabled={form.disabled}
                value={cliente.endereco.numero}
                onChange={(e) =>
                  setCliente('endereco', {
                    ...cliente.endereco,
                    numero: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group col-3">
              <b className="">UF</b>
              <input
                type="text"
                className="form-control"
                placeholder="UF"
                disabled={form.disabled}
                value={cliente.endereco.uf}
                onChange={(e) =>
                  setCliente('endereco', {
                    ...cliente.endereco,
                    uf: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group col-9">
              <b className="">Cidade</b>
              <input
                type="text"
                className="form-control"
                placeholder="Cidade"
                disabled={form.disabled}
                value={cliente.endereco.cidade}
                onChange={(e) =>
                  setCliente('endereco', {
                    ...cliente.endereco,
                    cidade: e.target.value,
                  })
                }
              />
            </div>
        </div>
                
            </Drawer.Body>
        </Drawer>

      {/* Tabela de Clientes */}
      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between">
            <h2 className="mb-4 mt-0">Clientes</h2>
            <div>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleNewClient}
              >
                <span className="mdi mdi-plus"> Novo Cliente</span>
              </button>
            </div>
          </div>

          <Table
            data={clientes}
            loading={form.filtering}
            config={[
              { label: 'Nome', key: 'nome', width: 200, fixed: true },
              { label: 'E-mail', key: 'email', width: 200 },
              { label: 'Telefone', key: 'telefone', width: 200 },
              {
                label: 'Sexo',
                content: (cliente) => cliente.sexo === "M" ? "Masculino" : "Feminino",
                width: 200
              },
              {
                label: 'Data Cadastro',
                content: (cliente) => moment(cliente.dataCadastro).isValid()
                  ? moment(cliente.dataCadastro).format('DD/MM/YYYY')
                  : 'Data inválida',
                width: 200
              },
            ]}
            actions={(cliente) => (
              <Button color="blue" size="xs">Ver informações</Button>
            )}
            onRowClick={(cliente) => { alert(cliente.nome) }}
          />
        </div>
      </div>
    </div>
  );
};

export default Clientes;