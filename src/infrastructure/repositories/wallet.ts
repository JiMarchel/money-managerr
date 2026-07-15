import { and, eq } from "drizzle-orm";
import { WalletRepository } from "../../domain/wallet/repository";
import { Wallet } from "../../domain/wallet/entity";
import { WalletId } from "../../domain/wallet/value-objects/wallet-id";
import { UserId } from "../../domain/user/value-objects/user-id";
import { WalletName } from "../../domain/wallet/value-objects/wallet-name";
import { AccountType, AccountTypeEnum } from "../../domain/wallet/value-objects/account-type";
import { Currency } from "../../domain/wallet/value-objects/currency";
import { Balance } from "../../domain/wallet/value-objects/balance";
import { Database } from "../database/db";
import { accounts } from "../database/schema";
import { DatabaseError } from "./error";

export class DrizzleWalletRepository implements WalletRepository {
    constructor(private readonly db: Database) { }

    async findById(id: WalletId): Promise<Wallet | null> {
        try {
            const result = await this.db.select().from(accounts).where(eq(accounts.id, id.toString()));

            if (result.length === 0) {
                return null;
            }

            return this.mapToDomain(result[0]);
        } catch (error) {
            throw new DatabaseError("Failed to query wallet by id", error);
        }
    }

    async findByUserId(userId: UserId): Promise<Wallet[]> {
        try {
            const result = await this.db.select().from(accounts).where(eq(accounts.userId, userId.toString()));

            return result.map(row => this.mapToDomain(row));
        } catch (error) {
            throw new DatabaseError("Failed to query wallets by user id", error);
        }
    }

    async findByUserIdAndName(userId: UserId, name: WalletName): Promise<Wallet | null> {
        try {
            const result = await this.db.select().from(accounts).where(
                and(
                    eq(accounts.userId, userId.toString()),
                    eq(accounts.name, name.toString())
                )
            );

            if (result.length === 0) {
                return null;
            }

            return this.mapToDomain(result[0]);
        } catch (error) {
            throw new DatabaseError("Failed to query wallet by user id and name", error);
        }
    }

    async save(wallet: Wallet): Promise<void> {
        try {
            await this.db.insert(accounts).values(this.mapToPersistence(wallet));
        } catch (error) {
            throw new DatabaseError("Failed to save wallet", error);
        }
    }

    private mapToDomain(row: typeof accounts.$inferSelect): Wallet {
        const wallet = Object.create(Wallet.prototype);

        Object.assign(wallet, {
            id: WalletId.create(row.id),
            userId: UserId.create(row.userId),
            name: WalletName.create(row.name),
            accountType: AccountType.create(row.accountType),
            currency: Currency.create(row.currency),
            balance: Balance.create(row.balanceCache),
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        });

        return wallet;
    }

    private mapToPersistence(wallet: Wallet) {
        return {
            id: wallet.id.toString(),
            userId: wallet.userId.toString(),
            name: wallet.name.toString(),
            accountType: wallet.accountType.toString() as AccountTypeEnum,
            currency: wallet.currency.toString(),
            balanceCache: wallet.balance.toString(),
            createdAt: wallet.createdAt,
            updatedAt: wallet.updatedAt
        };
    }
}
