import { Request, Response } from 'express';
import ImagensController from '../src/controllers/ImagensController';

describe('ImagensController', () => {
  let controller: ImagensController;
  let request: Request;
  let response: Response;

  beforeEach(() => {
    controller = new ImagensController();
    request = {} as Request;
    response = {} as Response;
  });

  describe('create', () => {
    it('should return 400 if receitaId is missing', async () => {
      request.params = undefined;

      const result = await controller.create(request, response);

      expect(response.status).toBeCalledWith(400);
      expect(response.json).toBeCalledWith({ message: 'É obrigatório indicar a receita' });
    });

    it('should log request files', async () => {
      request.params = 'receitaId';
      request.files = ['file1', 'file2'];

      const consoleSpy = jest.spyOn(console, 'log');

      await controller.create(request, response);

      expect(consoleSpy).toBeCalledWith(['file1', 'file2']);
    });

    it('should return 201 with message "ok"', async () => {
      request.params = 'receitaId';

      const result = await controller.create(request, response);

      expect(response.status).toBeCalledWith(201);
      expect(response.json).toBeCalledWith({ message: 'ok' });
    });

    it('should return 400 with error message if an error occurs', async () => {
      request.params = 'receitaId';

      const error = new Error('Some error');
      response.status = jest.fn().mockReturnThis();
      response.json = jest.fn().mockReturnValue({ Error: error });

      const result = await controller.create(request, response);

      expect(response.status).toBeCalledWith(400);
      expect(response.json).toBeCalledWith({ Error: error });
    });
  });
});