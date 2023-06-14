import 'jest';
import ReceitasController from '../src/controllers/ReceitasController';

describe('Testes do controller Receitas', () =>{
    let instance: ReceitasController;

    beforeEach(() => {
        instance = new ReceitasController();
    })

    it('Teste de instancia', async () => {
        expect(instance).toBeInstanceOf(ReceitasController)
    })

    it('Testes de erros do create', async () => {})
});