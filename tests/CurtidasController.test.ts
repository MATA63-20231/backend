import { Request, Response } from 'express';
import CurtidasController from '../src/controllers/CurtidasController';
import curtidasRepository from '../src/repositories/curtidasRepository';
import usuariosRepository from '../src/repositories/usuariosRepository';
import receitasRepository from '../src/repositories/receitasRepository';

describe('CurtidasController', () => {
  let curtidasController: CurtidasController;

  beforeEach(() => {
    curtidasController = new CurtidasController();
  });

  describe('curtida', () => {
    it('should return 400 if receitaId is not provided', async () => {
      const request = {
        params: {},
        body: { curtida: true },
      } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await curtidasController.curtida(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'É obrigatório indicar a receita',
      });
    });

    it('should return 400 if curtida is not provided', async () => {
      const request = {
        params: { receitaId: '123' },
        body: {},
      } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await curtidasController.curtida(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'A curtida deve ser informada',
      });
    });

    it('should return 400 if receita is invalid', async () => {
      const request = {
        params: { receitaId: '123' },
        body: { curtida: true },
      } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(receitasRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(undefined),
      } as unknown as any);

      await curtidasController.curtida(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Receita informada é inválida',
      });
    });

    it('should return 400 if usuario is invalid', async () => {
      const request = {
        params: { receitaId: '123' },
        body: { curtida: true },
      } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(receitasRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce({}),
      } as unknown as any);

      jest.spyOn(usuariosRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(undefined),
      } as unknown as any);

      await curtidasController.curtida(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Usuário informado é inválido',
      });
    });

    it('should create a new curtida if it does not exist', async () => {
      const request = {
        params: { receitaId: '123' },
        body: { curtida: true },
      } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(receitasRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce({}),
      } as unknown as any);

      jest.spyOn(usuariosRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce({}),
      } as unknown as any);

      jest.spyOn(curtidasRepository, 'create').mockReturnValueOnce({
        usuario: {},
        receita: {},
        curtida: true,
      } as unknown as any);

      jest.spyOn(curtidasRepository, 'save').mockResolvedValueOnce(undefined);

      await curtidasController.curtida(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({ message: 'Curtida incluida' });
    });

    it('should update the existing curtida if it exists', async () => {
      const request = {
        params: { receitaId: '123' },
        body: { curtida: true },
      } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(curtidasRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce({ id: '456' }),
      } as unknown as any);

      jest.spyOn(curtidasRepository, 'update').mockResolvedValueOnce(undefined);

      await curtidasController.curtida(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({ message: 'Curtida incluida' });
    });
  });

  describe('delete', () => {
    it('should return 400 if receitaId is not provided', async () => {
      const request = {
        params: {},
      } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await curtidasController.delete(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'É obrigatório indicar a receita',
      });
    });

    it('should return 400 if curtida does not exist', async () => {
      const request = {
        params: { receitaId: '123' },
      } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(curtidasRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(undefined),
      } as unknown as any);

      await curtidasController.delete(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ message: 'Curtida não encontrada' });
    });

    it('should remove the curtida if it exists', async () => {
      const request = {
        params: { receitaId: '123' },
      } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(curtidasRepository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce({ id: '456' }),
      } as unknown as any);

      jest.spyOn(curtidasRepository, 'remove').mockResolvedValueOnce(undefined);

      await curtidasController.delete(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({ message: 'Curtida removida' });
    });
  });
});