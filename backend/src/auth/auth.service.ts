import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(senha: string): { ok: boolean; token: string } {
    const senhaCorreta = process.env.SENHA_PAINEL || '1234';
    if (senha !== senhaCorreta) throw new UnauthorizedException('Senha incorreta.');
    const token = Buffer.from(`lp-painel:${Date.now()}`).toString('base64');
    return { ok: true, token };
  }
}
