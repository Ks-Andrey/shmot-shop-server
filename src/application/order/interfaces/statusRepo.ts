import { UUID } from "../../../types"
import { Status } from "../../../domain/order"; 

export interface IStatusRepo {
    getAllStatuses():Promise<Status[]>
    getStatusById(id: UUID):Promise<Status | null> 
    addStatus(order: Status):Promise<UUID>
    updateStatus(status: Status):Promise<void>
    deleteStatus(id: UUID):Promise<void>
}