import ReceitasController from '../src/controllers/ReceitasController';
import { Request, Response } from 'express';
import receitasRepository from '../src/repositories/receitasRepository';
import ingredientesRepository from '../src/repositories/ingredientesRepository';
import Ingrediente from '../src/models/Ingrediente';
import Receita from '../src/models/Receita';
import Preparo from '../src/models/Preparo';
import preparoRepository from '../src/repositories/preparoRepository';
type createReceitaDTO = Omit<Omit<Receita, 'id'>, 'tempoPreparo'> & {
    tempoPreparo: {
      horas: number
      minutos: number
    }
  }
  
  type createPreparoDTO = Omit<Preparo, 'id'>
  type createIngredienteDTO = Omit<Ingrediente, 'id'>

describe('ReceitasController', () => {
  let controller: ReceitasController;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    controller = new ReceitasController();
    request = {} as Request;
    response = {} as Response;
  });

  describe('create', () => {
    it('should return an error if title is not provided', async () => {
      request.body = {
        descricao: 'description',
        rendimento: 2,
        tempoPreparo: {
          horas: 0,
          minutos: 30,
        },
        listaPreparo: [
          {
            descricao: 'prepare 1',
          },
        ],
        ingredientes: [
          {
            quantidade: '2',
            descricao: 'ingredient 1',
          },
        ],
      } as createReceitaDTO;

      response.status = jest.fn().mockReturnThis();
      response.json = jest.fn();

      await controller.create(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ message: 'O título é obrigatório ' });
    });

    it('should return an error if ingredients are not provided', async () => {
      request.body = {
        titulo: 'title',
        descricao: 'description',
        rendimento: 2,
        tempoPreparo: {
          horas: 0,
          minutos: 30,
        },
        listaPreparo: [
          {
            descricao: 'prepare 1',
          },
        ],
        ingredientes: [],
      } as createReceitaDTO;

      response.status = jest.fn().mockReturnThis();
      response.json = jest.fn();

      await controller.create(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ message: 'Cadastro de ingredientes é obrigatório' });
    });

    it('should return an error if rendimento is not provided or is zero', async () => {
      request.body = {
        titulo: 'title',
        descricao: 'description',
        rendimento: 0,
        tempoPreparo: {
          horas: 0,
          minutos: 30,
        },
        listaPreparo: [
          {
            descricao: 'prepare 1',
          },
        ],
        ingredientes: [
          {
            quantidade: '2',
            descricao: 'ingredient 1',
          },
        ],
      } as createReceitaDTO;

      response.status = jest.fn().mockReturnThis();
      response.json = jest.fn();

      await controller.create(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ message: 'O rendimento deve ser superior à 0' });
    });

    it('should create a new recipe with ingredients and preparation', async () => {
      const createSpy = jest.spyOn(receitasRepository, 'create');
      const saveSpy = jest.spyOn(receitasRepository, 'save');
      const saveIngredientesSpy = jest.spyOn(ingredientesRepository, 'save');
      const savePreparoSpy = jest.spyOn(preparoRepository, 'save');

      request.body = {
        titulo: 'title',
        descricao: 'description',
        rendimento: 2,
        tempoPreparo: {
          horas: 0,
          minutos: 30,
        },
        listaPreparo: [
          {
            descricao: 'prepare 1',
          },
        ],
        ingredientes: [
          {
            quantidade: '2',
            descricao: 'ingredient 1',
          },
        ],
      } as createReceitaDTO;

      response.status = jest.fn().mockReturnThis();
      response.json = jest.fn();

      await controller.create(request, response);

      expect(createSpy).toHaveBeenCalledWith({
        titulo: 'title',
        descricao: 'description',
        rendimento: 2,
        tempoPreparo: 30,
        listaPreparo: [
          {
            ordem: 0,
            descricao: 'prepare 1',
          },
        ],
        imagem: undefined,
        ingredientes: [
          {
            quantidade: '2',
            descricao: 'ingredient 1',
          },
        ],
      } as Receita);

      expect(saveSpy).toHaveBeenCalled();

      expect(saveIngredientesSpy).toHaveBeenCalledWith([
        {
          quantidade: '2',
          descricao: 'ingredient 1',
          receita: expect.any(Receita),
        } as createIngredienteDTO,
      ]);

      expect(savePreparoSpy).toHaveBeenCalledWith([
        {
          ordem: 0,
          descricao: 'prepare 1',
          receita: expect.any(Receita),
        } as createPreparoDTO,
      ]);

      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({ receita: expect.any(Receita) });
    });

    it('should return an error if any parameter is not provided', async () => {
      request.body = {} as createReceitaDTO;

      response.status = jest.fn().mockReturnThis();
      response.json = jest.fn();

      await controller.create(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ Error: 'Parâmetro não informado' });
    });
  });

  describe('findAll', () => {
    it('should return all recipes ordered by title and id', async () => {
      const findSpy = jest.spyOn(receitasRepository, 'find');

      response.status = jest.fn().mockReturnThis();
      response.json = jest.fn();

      await controller.findAll(request, response);

      expect(findSpy).toHaveBeenCalledWith({
        order: {
          titulo: 'ASC',
          id: 'ASC',
        },
      });

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should return an error if there is a problem with the database', async () => {
      jest.spyOn(receitasRepository, 'find').mockRejectedValueOnce(new Error('Database error'));

      response.status = jest.fn().mockReturnThis();
      response.json = jest.fn();

      await controller.findAll(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ Error: 'Falha ao obter receitas' });
    });
  });

  describe('findByTitulo', () => {
    it('should return all recipes with the given title', async () => {
      const findSpy = jest.spyOn(receitasRepository, 'find');

      request.body = {
        titulo: 'title',
      };

      response.status = jest.fn().mockReturnThis();
      response.json = jest.fn();

      await controller.findByTitulo(request, response);

      expect(findSpy).toHaveBeenCalledWith({
        where: {
          titulo: 'title',
        },
      });

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should return an error if there is a problem with the database', async () => {
      jest.spyOn(receitasRepository, 'find').mockRejectedValueOnce(new Error('Database error'));

      request.body = {
        titulo: 'title',
      };

      response.status = jest.fn().mockReturnThis();
      response.json = jest.fn();

      await controller.findByTitulo(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ Error: 'Falha ao obter receitas' });
    });
  });

  describe('getStatusApi', () => {
    it('should return "API Online"', async () => {
      response.send = jest.fn();

      await controller.getStatusApi(request, response);

      expect(response.send).toHaveBeenCalledWith('API Online');
    });
  });
});