export default interface CarModel {
    id?: number
    licenseNum?: string
    nickName?:string
    make?: string
    model?: string
    color?: string
    year?:  string
    garageName?:string
    garagePhone?:string
    department? : string
    dep_name?: string
    image ?: File | null
    isDisabled?:boolean
}
