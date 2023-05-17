export default interface CarMaintenanceModel {
    id?: number
    car?: string
    maintenanceDate?:string
    fileMaintenance?:string
    // fileMaintenance?:  File | null
    fileType?: string
    expirationDate?: string
    nextMaintenancekilometer?:string
    comments?:string
    car_name? : string
    car_file_type_name?: string
    car_fileFolderName ?: string
}