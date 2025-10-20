import {AppDataSource} from "../src/database/AppDataSource";
import {app} from "../src/app";
import request from "supertest";
import {Usuario} from "../src/entities/Usuario";
import {Chave} from "../src/entities/Chave";
import {Transacao} from "../src/entities/Transacao";
import {TipoChave} from "../src/entities/enums/TipoChave";

let token: string;

beforeAll(async () => {
    AppDataSource.initialize();

    await request(app)
        .post('/v1/usuarios')
        .send({
            id: 1000,
            cpf_cnpj: "127.027.040-00",
            senha: 'Bob123',
            nome_completo: "Bob Green",
            telefone: "997268541",
            rua: "rua_teste b",
            bairro: "bairro_teste c",
            cidade: "cidade_teste d"
        });

    await request(app)
        .post('/v1/usuarios')
        .send({
            id: 1001,
            cpf_cnpj: "047.930.260-01",
            senha: 'johndoe',
            nome_completo: "John Doe",
            telefone: "996322831",
            rua: "rua_teste e",
            bairro: "bairro_teste f",
            cidade: "cidade_teste g"
        });

    await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Chave)
        .values({
            id: 6000,
            tipo: 'telefone' as TipoChave.TELEFONE,
            chave: '999726854',
            usuario: { id: 1000 }
        })
        .execute();

    await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(Chave)
        .values({
            id: 5000,
            tipo: 'email' as TipoChave.EMAIL,
            chave: 'email@email.com',
            usuario: { id: 1001 }
        })
        .execute();

    const res = await request(app)
        .post('/v1/auth')
        .expect('Content-Type', /json/)
        .send({
            cpf_cnpj: '127.027.040-00',
            senha: 'Bob123'
        });

    token = res.body.token;
})

afterAll(async () => {
    await AppDataSource.getRepository(Usuario).deleteAll();
    await AppDataSource.getRepository(Chave).deleteAll();
    await AppDataSource.getRepository(Transacao).deleteAll();
});

describe('POST /v1/transacoes', function () {
   it ('Criar nova transação', async function() {

       const res = await request(app)
           .post('/v1/transacoes')
           .set('Authorization', 'Bearer ' + token)
           .expect(201)
           .expect('Content-Type', /json/)
           .send({
                valor: 55.00,
                chaveOrigem: '999726854',
                chaveDestino: 'email@email.com',
                mensagem: 'testando transacao'
           });

       expect(res.body.Transacao.valor).toBe(55.00);
       expect(res.body.Transacao.chaveOrigem.chave).toBe('999726854');
       expect(res.body.Transacao.chaveDestino.chave).toBe('email@email.com');
       expect(res.body.Transacao.mensagem).toBe('testando transacao');
   });

    it ('Criar nova transação com chaves iguais', async function() {

        const res = await request(app)
            .post('/v1/transacoes')
            .set('Authorization', 'Bearer ' + token)
            .expect(400)
            .expect('Content-Type', /json/)
            .send({
                valor: 55.00,
                chaveOrigem: '999726854',
                chaveDestino: '999726854',
                mensagem: 'testando transacao'
            });

        expect(res.body.errors).not.toBeNull();
        expect(res.body.errors[0].msg).toBe('A chave de destino não pode ser igual a chave de origem.')
    });

    it ('Criar nova transação com valor negativo', async function() {

        const res = await request(app)
            .post('/v1/transacoes')
            .set('Authorization', 'Bearer ' + token)
            .expect(400)
            .expect('Content-Type', /json/)
            .send({
                valor: -1.00,
                chaveOrigem: '999726854',
                chaveDestino: 'email@email.com',
                mensagem: 'testando transacao'
            });

        expect(res.body.errors).not.toBeNull();
        expect(res.body.errors[0].msg).toBe('O valor da transação deve ser maior que zero.')
    });

    it ('Criar nova transação com valor zero', async function() {

        const res = await request(app)
            .post('/v1/transacoes')
            .set('Authorization', 'Bearer ' + token)
            .expect(400)
            .expect('Content-Type', /json/)
            .send({
                valor: -0,
                chaveOrigem: '999726854',
                chaveDestino: 'email@email.com',
                mensagem: 'testando transacao'
            });

        expect(res.body.errors).not.toBeNull();
        expect(res.body.errors[0].msg).toBe('O valor da transação deve ser maior que zero.')
    });

    it ('Criar nova transação com dados inválidos', async function() {

        const res = await request(app)
            .post('/v1/transacoes')
            .set('Authorization', 'Bearer ' + token)
            .expect(400)
            .expect('Content-Type', /json/)
            .send({
                valor: -1.00,
                chaveOrigem: ' ',
                chaveDestino: '   ',
                mensagem: 'testando transacao'
            });

        expect(res.body.errors).not.toBeNull();
    });

    it ('Criar nova transação sem autenticação', async function() {

        const res = await request(app)
            .post('/v1/transacoes')
            //.set('Authorization', 'Bearer ' + token)
            .expect(401)
            .expect('Content-Type', /json/)
            .send({
                valor: -1.00,
                chaveOrigem: '999726854',
                chaveDestino: 'email@email.com',
                mensagem: 'testando transacao'
            });

        expect(res.body.statusCode).toBe(401);
        expect(res.body.statusMessage).toBe('Unauthorized');
        expect(res.body.errorMessage).toBe('Insira um Token JWT.');
    });
});

describe('GET /v1/transacoes/id', function () {
    it('Buscar transação por id', async function () {
        await AppDataSource
            .createQueryBuilder()
            .insert()
            .into(Transacao)
            .values({
                id: 9000,
                chaveOrigem: {id: 5000},
                chaveDestino: {id: 6000},
                valor: 70.00,
                data: new Date(),
                mensagem: 'Nova transação'
            })
            .execute();

        const res = await request(app)
            .get('/v1/transacoes/9000')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body.Transacao.valor).toBe('70');
        expect(res.body.Transacao.chaveOrigem.chave).toBe('email@email.com');
        expect(res.body.Transacao.chaveDestino.chave).toBe('999726854');
        expect(res.body.Transacao.id).toBe(9000);
        expect(res.body.Transacao.mensagem).toBe('Nova transação');
    });

    it('Buscar transação por id inexistente', async function() {
        const res = await request(app)
            .get('/v1/transacoes/0')
            .set('Authorization', 'Bearer ' + token)
            .expect(404)
            .expect('Content-Type', /json/);

        expect(res.body.statusMessage).toBe('Not Found');
        expect(res.body.statusCode).toBe(404);
        expect(res.body.errorMessage).toBe('Transação não encontrada.');
    })
});

describe('GET /v1/transacoes', function () {
   it('Buscar todas transações', async function() {
       const res = await request(app)
           .get('/v1/transacoes')
           .set('Authorization', 'Bearer ' + token)
           .expect(200)
           .expect('Content-Type', /json/)

       expect(res.body).not.toBeNull();
   })
});