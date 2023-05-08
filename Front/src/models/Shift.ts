export default interface ShiftModel {
    id?: number
    user1:string
    user_name1?: string
    user2?:string
    user_name2?: string
    car?: string
    car_name?: string
    shiftDate?: string
    maintenanceType: string
    maintenance_name?: string
    maintenance_logo?:string
    comments:string
    isDone?:boolean
}
