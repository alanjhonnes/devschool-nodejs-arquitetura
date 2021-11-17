import { User } from "../model/user.model";

const usuarios: User[] = [
    {
        id: '1',
        nome: 'Alan',
    }
]

export async function getUsuarios(): Promise<User[]> {
    return usuarios;
}

export async function adicionaUsuarioNoBanco(user: User): Promise<void> {
    usuarios.push(user);
}
