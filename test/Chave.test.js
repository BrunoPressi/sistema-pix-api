import { AppDataSource } from "../src/database/AppDataSource.ts";
import { app } from "../src/app.ts";
import { Usuario } from "../src/entities/Usuario.ts";
import { Chave } from "../src/entities/Chave.ts";
import request from "supertest";
let token;
beforeAll(async () => {
    await AppDataSource.initialize();
    await request(app)
        .post('/v1/usuarios')
        .send({
        id: 1000,
        cpf_cnpj: "127.027.040-00",
        senha: 'Bob123',
        nome_completo: "Bob Green",
        numero_conta: 4525,
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
        numero_conta: 1234,
        telefone: "996322831",
        rua: "rua_teste e",
        bairro: "bairro_teste f",
        cidade: "cidade_teste g"
    });
    const res = await request(app)
        .post('/v1/auth')
        .expect('Content-Type', /json/)
        .send({
        cpf_cnpj: '127.027.040-00',
        senha: 'Bob123'
    });
    token = res.body.token;
});
afterAll(async () => {
    await AppDataSource.getRepository(Usuario).deleteAll();
    await AppDataSource.getRepository(Chave).deleteAll();
    await AppDataSource.destroy();
});
describe('POST /v1/chaves/usuarioID', function () {
    it('Criar chave tipo email', async function () {
        const res = await request(app)
            .post('/v1/chaves/1000')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(201)
            .send({
            tipo: 'email',
            chave: 'teste@email.com'
        });
        expect(res.body.Chave.chave).toBe('teste@email.com');
        expect(res.body.Chave.tipo).toBe('email');
        expect(res.body.Chave.usuario.cpf_cnpj).toBe('127.027.040-00');
        expect(res.body.Chave.usuario.numero_conta).toBe(4525);
    });
    it('Criar chave tipo telefone', async function () {
        const res = await request(app)
            .post('/v1/chaves/1000')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(201)
            .send({
            tipo: 'telefone',
            chave: '996322831'
        });
        expect(res.body.Chave.chave).toBe('996322831');
        expect(res.body.Chave.tipo).toBe('telefone');
        expect(res.body.Chave.usuario.cpf_cnpj).toBe('127.027.040-00');
        expect(res.body.Chave.usuario.numero_conta).toBe(4525);
    });
    it('Criar chave tipo cpf', async function () {
        const res = await request(app)
            .post('/v1/chaves/1000')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(201)
            .send({
            tipo: 'cpf',
            chave: '127.027.040-00'
        });
        expect(res.body.Chave.chave).toBe('127.027.040-00');
        expect(res.body.Chave.tipo).toBe('cpf');
        expect(res.body.Chave.usuario.cpf_cnpj).toBe('127.027.040-00');
        expect(res.body.Chave.usuario.numero_conta).toBe(4525);
    });
    it('Criar chave que já existe', async function () {
        const res = await request(app)
            .post('/v1/chaves/1000')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(409)
            .send({
            tipo: 'email',
            chave: 'teste@email.com'
        });
        expect(res.body.statusCode).toBe(409);
        expect(res.body.statusMessage).toBe('Conflict');
        expect(res.body.errorMessage).toBe('Chave |teste@email.com| já cadastrada.');
    });
    it('Criar chave com dados invalidos', async function () {
        const res = await request(app)
            .post('/v1/chaves/1000')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(400)
            .send({
            tipo: 'abcde',
            chave: '    '
        });
        expect(res.body.errors).not.toBeNull();
    });
    it('Criar chave com id inexistente', async function () {
        const res = await request(app)
            .post('/v1/chaves/0')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(404)
            .send({
            tipo: 'email',
            chave: 'email@email.com'
        });
        expect(res.body.statusCode).toBe(404);
        expect(res.body.statusMessage).toBe('Not Found');
        expect(res.body.errorMessage).toBe('Usuário |0| não encontrado.');
    });
    it('Tentativa de criar chave para outro usuário', async function () {
        const res = await request(app)
            .post('/v1/chaves/1001')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(401)
            .send({
            tipo: 'email',
            chave: 'email@email.com'
        });
        expect(res.body.statusCode).toBe(401);
        expect(res.body.statusMessage).toBe('Unauthorized');
        expect(res.body.errorMessage).toBe('Voce não tem permissão para criar esse recurso.');
    });
    it('Tentativa de criar chave sem estar autenticado', async function () {
        const res = await request(app)
            .post('/v1/chaves/1001')
            .expect('Content-Type', /json/)
            .expect(401)
            .send({
            tipo: 'email',
            chave: 'email123@email.com'
        });
        expect(res.body.statusCode).toBe(401);
        expect(res.body.statusMessage).toBe('Unauthorized');
        expect(res.body.errorMessage).toBe('Insira um Token JWT.');
    });
});
describe('GET /v1/chaves', function () {
    it('Buscar todas as chaves', async function () {
        const res = await request(app)
            .get('/v1/chaves')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(res.body).not.toBeNull();
    });
    it('Buscar todas as chaves sem autenticação', async function () {
        const res = await request(app)
            .get('/v1/chaves')
            //.set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(401);
        expect(res.body.statusCode).toBe(401);
        expect(res.body.statusMessage).toBe('Unauthorized');
        expect(res.body.errorMessage).toBe('Insira um Token JWT.');
    });
});
describe('GET v1/chaves/id', function () {
    it('Buscar chave pelo id', async function () {
        await AppDataSource
            .createQueryBuilder()
            .insert()
            .into(Chave)
            .values({
            id: 999,
            tipo: 'telefone',
            chave: '999726854',
            usuario: { id: 1000 }
        })
            .execute();
        const res = await request(app)
            .get('/v1/chaves/999')
            .expect('Content-Type', /json/)
            .expect(200);
        expect(res.body.Chave).not.toBeNull();
        expect(res.body.Chave.tipo).toBe('telefone');
        expect(res.body.Chave.chave).toBe('999726854');
    });
    it('Buscar chave com id inexistente', async function () {
        const res = await request(app)
            .get('/v1/chaves/0')
            .expect('Content-Type', /json/)
            .expect(404);
        expect(res.body.statusCode).toBe(404);
        expect(res.body.errorMessage).toBe('Chave não encontrada.');
        expect(res.body.statusMessage).toBe('Not Found');
    });
});
describe('DELETE v1/chaves/id', function () {
    it('Deletar chave pelo id', async function () {
        await AppDataSource
            .createQueryBuilder()
            .insert()
            .into(Chave)
            .values({
            id: 1000,
            tipo: 'email',
            chave: 'email@email.com',
            usuario: { id: 1000 },
        })
            .execute();
        await request(app)
            .delete('/v1/chaves/1000')
            .set('Authorization', 'Bearer ' + token)
            .expect(204);
    });
    it('Deletar chave com id inexistente', async function () {
        const res = await request(app)
            .delete('/v1/chaves/0')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(404);
        expect(res.body.statusMessage).toBe('Not Found');
        expect(res.body.statusCode).toBe(404);
        expect(res.body.errorMessage).toBe('Chave não encontrada.');
    });
    it('Tentativa de deletar chave de outro usuário', async function () {
        await AppDataSource
            .createQueryBuilder()
            .insert()
            .into(Chave)
            .values({
            id: 2001,
            tipo: 'email',
            chave: 'mykey@email.com',
            usuario: { id: 1001 }
        })
            .execute();
        const res = await request(app)
            .delete('/v1/chaves/2001')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(401);
        expect(res.body.statusMessage).toBe('Unauthorized');
        expect(res.body.statusCode).toBe(401);
        expect(res.body.errorMessage).toBe('Voce não tem permissão para deletar esse recurso.');
    });
});
