export const blacklist: any = {}

export class LogoutService {
    static logout(token: string) {
        blacklist[token] = true;
        setTimeout(() => delete blacklist[token], parseInt(process.env.JWT_EXPIRES!) * 1000)
    }
}