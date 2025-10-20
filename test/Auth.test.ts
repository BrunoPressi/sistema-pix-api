import {AppDataSource} from "../src/database/AppDataSource";
import request from "supertest";
import {app} from "../src/app";
import {Usuario} from "../src/entities/Usuario";
import {Chave} from "../src/entities/Chave";
import {Transacao} from "../src/entities/Transacao";

beforeAll(async () => {
   await AppDataSource.initialize();

   await request(app)
       .post('/v1/usuarios')
       .send({
           id: 1000,
           cpf_cnpj: '047.930.260-01',
           senha: 'teste123',
           nome_completo: "nome_teste",
           telefone: "996322831",
           rua: "rua_teste",
           bairro: "bairro_teste",
           cidade: "cidade_teste"
       });
});

afterAll( async () => {
    await AppDataSource.getRepository(Usuario).deleteAll();
    await AppDataSource.getRepository(Chave).deleteAll();
    await AppDataSource.getRepository(Transacao).deleteAll();
    await AppDataSource.destroy();
});

describe('POST /v1/auth', function () {
    it('Autenticação com sucesso', async function () {
        const res= await request(app)
            .post('/v1/auth')
            .send({
                cpf_cnpj: '047.930.260-01',
                senha: 'teste123'
            })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body.token).not.toBeNull();
    });
});

describe('POST /v1/auth', function () {
    it('Autenticação com usuário não existente', async function () {
        const res= await request(app)
            .post('/v1/auth')
            .send({
                cpf_cnpj: '047.930.260-02',
                senha: 'teste123'
            })
            .expect('Content-Type', /json/)
            .expect(404);

        expect(res.body.errorMessage).toBe('Usuário |047.930.260-02| não encontrado.');
        expect(res.body.statusCode).toBe(404);
        expect(res.body.statusMessage).toBe('Not Found');
        expect(res.body.path).toBe('/v1/auth');
    });
});

describe('POST /v1/auth', function () {
    it('Autenticação com senha inválida', async function () {
        const res= await request(app)
            .post('/v1/auth')
            .send({
                cpf_cnpj: '047.930.260-01',
                senha: 'teste321'
            })
            .expect('Content-Type', /json/)
            .expect(401);

        expect(res.body.errorMessage).toBe('Senhas não coincidem, tente novamente.');
        expect(res.body.statusCode).toBe(401);
        expect(res.body.statusMessage).toBe('Unauthorized');
        expect(res.body.path).toBe('/v1/auth');
    });
});