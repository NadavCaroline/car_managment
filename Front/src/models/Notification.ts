export default interface NotificationModel {
    id?: number
    recipient ?: string
    title?:string
    message ?: string
    created_at ?: string
    is_read ?:boolean
}
