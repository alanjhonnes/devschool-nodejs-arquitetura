import { adicionaUsuarioNoBanco } from "../data/usuarios.repository"
import { User } from "../model/user.model";

export type AdicionaUsuarioResult = 
| AdicionaUsuarioSuccessResult
| AdicionaUsuarioErrorResult

export interface AdicionaUsuarioSuccessResult {
    sucesso: true;
}
export interface AdicionaUsuarioErrorResult {
    sucesso: false;
    error: string;
}

export const adicionaUsuario = async (user: User): Promise<AdicionaUsuarioResult> => {
    try {
        await adicionaUsuarioNoBanco(user);
        return {
            sucesso: true,
        }
    } catch (error: any) {
        return {
            sucesso: false,
            error: error.message || 'Erro adicionando usuário.',
        }
    }

}
