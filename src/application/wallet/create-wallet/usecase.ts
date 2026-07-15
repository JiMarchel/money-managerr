import { Wallet } from "../../../domain/wallet/entity";
import { DuplicateWalletError } from "../../../domain/wallet/error";
import { WalletRepository } from "../../../domain/wallet/repository";
import { AccountType } from "../../../domain/wallet/value-objects/account-type";
import { Currency } from "../../../domain/wallet/value-objects/currency";
import { WalletName } from "../../../domain/wallet/value-objects/wallet-name";
import { CreateWalletCommand } from "./command";

export class CreateWalletUseCase {
    constructor(private readonly walletRepository: WalletRepository) {}

    async execute(command: CreateWalletCommand) {
        const walletName = WalletName.create(command.name);
        
        // Check for duplicates
        const existingWallet = await this.walletRepository.findByUserIdAndName(command.userId, walletName);
        if (existingWallet) {
            throw new DuplicateWalletError(`Wallet with name '${command.name}' already exists for this user.`);
        }

        const accountType = AccountType.create(command.accountType);
        const currency = Currency.create(command.currency);

        const wallet = Wallet.create(command.userId, walletName, accountType, currency);

        await this.walletRepository.save(wallet);

        return {
            id: wallet.id.toString(),
            name: wallet.name.toString(),
            accountType: wallet.accountType.toString(),
            currency: wallet.currency.toString(),
            balance: wallet.balance.toString(),
            createdAt: wallet.createdAt,
            updatedAt: wallet.updatedAt
        };
    }
}
