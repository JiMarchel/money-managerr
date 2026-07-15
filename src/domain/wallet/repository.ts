import { UserId } from "../user/value-objects/user-id";
import { Wallet } from "./entity";
import { WalletId } from "./value-objects/wallet-id";
import { WalletName } from "./value-objects/wallet-name";

export interface WalletRepository {
    findById(id: WalletId): Promise<Wallet | null>;
    findByUserId(userId: UserId): Promise<Wallet[]>;
    findByUserIdAndName(userId: UserId, name: WalletName): Promise<Wallet | null>;
    save(wallet: Wallet): Promise<void>;
}
