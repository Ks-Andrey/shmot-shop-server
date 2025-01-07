import { RepositoryError } from "../application/exceptions";
import { IStatusRepo } from "../application/order/interfaces/statusRepo";
import { Status } from "../domain/order";
import { UUID } from "../types";
import { Pool } from 'pg';

export class StatusRepo implements IStatusRepo {
    constructor(
        readonly pool: Pool
    ) {}

    async getAllStatuses(): Promise<Status[]> {
        try {
            const result = await this.pool.query('SELECT * FROM statuses');
            return result.rows.map(row => Status.create(row?.id, row?.status_name));
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения всех статусов.");
        }
    }

    async getStatusById(id: UUID): Promise<Status | null> {
        try {
            const result = await this.pool.query('SELECT * FROM statuses WHERE id = $1', [id]);
            const row = result.rows[0];

            if (!row) return null;

            return Status.create(row?.id, row?.status_name);
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка получения статуса.");
        }
    }

    async addStatus(status: Status): Promise<UUID> {
        try {
            const result = await this.pool.query(
                'INSERT INTO statuses (id, status_name) VALUES ($1, $2) RETURNING id',
                [status.id, status.statusName]
            );
            return result.rows[0].id;
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка добавления статуса.");
        }
    }

    async updateStatus(status: Status): Promise<void> {
        try {
            await this.pool.query(
                'UPDATE statuses SET status_name = $1 WHERE id = $2',
                [status.statusName, status.id]
            );
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка обновления статуса.");
        }
    }

    async deleteStatus(id: UUID): Promise<void> {
        try {
            await this.pool.query('DELETE FROM statuses WHERE id = $1', [id]);
        } catch (error) {
            console.log(error);
            throw new RepositoryError("Ошибка удаления статуса.");
        }
    }
}
