import { WalletRepository } from "../../../domain/wallet/repository";
import { GetWalletsQuery } from "./query";

export class GetWalletsUseCase {
    constructor(private readonly walletRepository: WalletRepository) {}

    async execute(query: GetWalletsQuery) {
        const wallets = await this.walletRepository.findByUserId(query.userId);

        return wallets.map(wallet => ({
            id: wallet.id.toString(),
            name: wallet.name.toString(),
            accountType: wallet.accountType.toString(),
            currency: wallet.currency.toString(),
            balance: wallet.balance.toString(),
            createdAt: wallet.createdAt,
            updatedAt: wallet.updatedAt
        }));
    }
}
