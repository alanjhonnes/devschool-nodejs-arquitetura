import { RequestHandler } from 'express';
import { getUsuarios } from '../data/usuarios.repository';
import { User } from '../model/user.model';
import { adicionaUsuario } from '../service/user.service';

export const usuariosController: RequestHandler = async (request, response) => {
    const usuarios = await getUsuarios();
    return response.json(usuarios)
}

export const adicionaUsuarioController: RequestHandler = async (request, response) => {
    console.log(request.body);
    const validacao = validaAdicionaUsuarioInput(request.body);
    if (validacao.success) {
        const adicionaUsuarioResult = await adicionaUsuario(validacao.body);
        return response.json(adicionaUsuarioResult);
    } else {
        return response.status(400).json(validacao);
    }
}

export type ValidaUsuarioResult = 
| ValidaUsuarioSuccess
| ValidaUsuarioError;
export interface ValidaUsuarioSuccess {
    success: true;
    body: User;
};
export interface ValidaUsuarioError {
    success: false;
    validationErrors: string[];
};

export function validaAdicionaUsuarioInput(body: any): ValidaUsuarioResult  {
    if(typeof body === 'object' && typeof body.id === 'string' && typeof body.name === 'string') {
        return {
            success: true,
            body: body,
        }
    }
    return {
        success: false,
        validationErrors: ['Input inválido.'],
    }
}
