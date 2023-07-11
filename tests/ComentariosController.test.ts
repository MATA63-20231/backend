import { Request, Response } from 'express';
import usuariosRepository from '../src/repositories/usuariosRepository';
import receitasRepository from '../src/repositories/receitasRepository';
import comentariosRepository from '../src/repositories/comentariosRepository';

describe('CurtidasController', () => {
  let curtidasController: CurtidasController;

  beforeEach(() => {
    curtidasController = new CurtidasController();
  });

  describe('create', () => {
    it('should return 400 if receitaId is not provided', async () => {
      const request: Request = {
        params: {},
        body: {
          comentario: 'Test comment',
        },
      } as Request;

      const response: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Response;

      await curtidasController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'É obrigatório indicar a receita',
      });
    });

    it('should return 400 if comentario is not provided', async () => {
      const request: Request = {
        params: {
          receitaId: '1',
        },
        body: {},
      } as Request;

      const response: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Response;

      await curtidasController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'É obrigatório incluir um comentário',
      });
    });

    it('should return 400 if receita is not found', async () => {
      const request: Request = {
        params: {
          receitaId: '1',
        },
        body: {
          comentario: 'Test comment',
        },
      } as Request;

      const response: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Response;

      jest.spyOn(receitasRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(undefined),
      } as any);

      await curtidasController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Receita informada é inválida',
      });
    });

    it('should return 400 if usuario is not found', async () => {
      const request: Request = {
        params: {
          receitaId: '1',
        },
        body: {
          comentario: 'Test comment',
        },
      } as Request;

      const response: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Response;

      jest.spyOn(receitasRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce({}),
      } as any);

      jest.spyOn(usuariosRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(undefined),
      } as any);

      await curtidasController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Usuário informado é inválido',
      });
    });

    it('should create a new comment and return 200', async () => {
      const request: Request = {
        params: {
          receitaId: '1',
        },
        body: {
          comentario: 'Test comment',
        },
      } as Request;

      const response: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Response;

      jest.spyOn(receitasRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce({}),
      } as any);

      jest.spyOn(usuariosRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce({}),
      } as any);

      jest.spyOn(comentariosRepository, 'create').mockReturnValueOnce({
        save: jest.fn().mockResolvedValueOnce(undefined),
      } as any);

      await curtidasController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Comentário incluido',
      });
    });
  });

  // Add more unit tests for other methods in the CurtidasController class

});