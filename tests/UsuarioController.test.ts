import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import usuarioRepository from '../src/repositories/usuariosRepository';
import UsuarioController from '../src/controllers/UsuariosController';

describe('UsuarioController', () => {
  let usuarioController: UsuarioController;

  beforeEach(() => {
    usuarioController = new UsuarioController();
  });

  describe('create', () => {
    it('should return 400 if username is not provided', async () => {
      const request = {
        body: {
          usuario: '',
          nome: 'John Doe',
          email: 'john@example.com',
          senha: 'password',
          confirmacaoSenha: 'password',
        },
      } as Request;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await usuarioController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'O username é obrigatório',
      });
    });

    it('should return 400 if password and confirmation do not match', async () => {
      const request = {
        body: {
          usuario: 'johndoe',
          nome: 'John Doe',
          email: 'john@example.com',
          senha: 'password',
          confirmacaoSenha: 'differentpassword',
        },
      } as Request;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await usuarioController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'A senha e a confirmação não coincidem',
      });
    });

    it('should create a new user and return 201', async () => {
      const request = {
        body: {
          usuario: 'johndoe',
          nome: 'John Doe',
          email: 'john@example.com',
          senha: 'password',
          confirmacaoSenha: 'password',
        },
      } as Request;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const createSpy = jest.spyOn(usuarioRepository, 'create').mockReturnValueOnce({
        id: 1,
        usuario: 'johndoe',
        nome: 'John Doe',
        email: 'john@example.com',
        senha: 'hashedpassword',
      });

      const saveSpy = jest.spyOn(usuarioRepository, 'save');

      await usuarioController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Usuario criado com sucesso!',
      });
      expect(createSpy).toHaveBeenCalledWith({
        usuario: 'johndoe',
        nome: 'John Doe',
        email: 'john@example.com',
        senha: 'hashedpassword',
      });
      expect(saveSpy).toHaveBeenCalledWith({
        id: 1,
        usuario: 'johndoe',
        nome: 'John Doe',
        email: 'john@example.com',
        senha: 'hashedpassword',
      });
    });

    it('should return 400 if an error occurs', async () => {
      const request = {
        body: {
          usuario: 'johndoe',
          nome: 'John Doe',
          email: 'john@example.com',
          senha: 'password',
          confirmacaoSenha: 'password',
        },
      } as Request;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(usuarioRepository, 'create').mockImplementationOnce(() => {
        throw new Error('Some error');
      });

      await usuarioController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ error: new Error('Some error') });
    });
  });

  describe('updateSenha', () => {
    it('should return 400 if user is not provided', async () => {
      const request = {
        body: {
          usuario: '',
          senhaAtual: 'oldpassword',
          novaSenha: 'newpassword',
          confirmacaoSenha: 'newpassword',
        },
      } as Request;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await usuarioController.updateSenha(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Usuário inválido!',
      });
    });

    it('should return 400 if password and confirmation do not match', async () => {
      const request = {
        body: {
          usuario: 'johndoe',
          senhaAtual: 'oldpassword',
          novaSenha: 'newpassword',
          confirmacaoSenha: 'differentpassword',
        },
      } as Request;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await usuarioController.updateSenha(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'A senha e a confirmação não coincidem',
      });
    });

    it('should return 400 if user is not found', async () => {
      const request = {
        body: {
          usuario: 'johndoe',
          senhaAtual: 'oldpassword',
          novaSenha: 'newpassword',
          confirmacaoSenha: 'newpassword',
        },
      } as Request;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(usuarioRepository, 'findOne').mockResolvedValueOnce(null);

      await usuarioController.updateSenha(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Usuario não encontrado',
      });
    });

    it('should update the password and return 201', async () => {
      const request = {
        body: {
          usuario: 'johndoe',
          senhaAtual: 'oldpassword',
          novaSenha: 'newpassword',
          confirmacaoSenha: 'newpassword',
        },
      } as Request;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const findOneSpy = jest.spyOn(usuarioRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        usuario: 'johndoe',
        senha: 'oldhashedpassword',
      });

      const compareSpy = jest.spyOn(compare, 'compare').mockResolvedValueOnce(true);

      const hashSpy = jest.spyOn(hash, 'hash').mockResolvedValueOnce('newhashedpassword');

      const updateSpy = jest.spyOn(usuarioRepository, 'update');

      await usuarioController.updateSenha(request, response);

      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Senha alterada com sucesso!',
      });
      expect(findOneSpy).toHaveBeenCalledWith({
        where: {
          usuario: 'johndoe',
        },
      });
      expect(compareSpy).toHaveBeenCalledWith('oldpassword', 'oldhashedpassword');
      expect(hashSpy).toHaveBeenCalledWith('newpassword', 8);
      expect(updateSpy).toHaveBeenCalledWith(
        {
          usuario: 'johndoe',
        },
        {
          senha: 'newhashedpassword',
        }
      );
    });

    it('should return 400 if an error occurs', async () => {
      const request = {
        body: {
          usuario: 'johndoe',
          senhaAtual: 'oldpassword',
          novaSenha: 'newpassword',
          confirmacaoSenha: 'newpassword',
        },
      } as Request;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(usuarioRepository, 'findOne').mockImplementationOnce(() => {
        throw new Error('Some error');
      });

      await usuarioController.updateSenha(request, response);

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({ error: new Error('Some error') });
    });
  });

  describe('delete', () => {
    it('should delete the user and return 200', async () => {
      const request = {
        params: {
          id: '1',
        },
      } as Request;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const findOneSpy = jest.spyOn(usuarioRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        usuario: 'johndoe',
        nome: 'John Doe',
        email: 'john@example.com',
        senha: 'hashedpassword',
      });

      const removeSpy = jest.spyOn(usuarioRepository, 'remove');

      await usuarioController.delete(request, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        Message: 'Usuario apagado com sucesso!',
      });
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(removeSpy).toHaveBeenCalledWith({
        id: 1,
        usuario: 'johndoe',
        nome: 'John Doe',
        email: 'john@example.com',
        senha: 'hashedpassword',
      });
    });

    it('should return 404 if user is not found', async () => {
      const request = {
        params: {
          id: '1',
        },
      } as Request;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(usuarioRepository, 'findOne').mockResolvedValueOnce(null);