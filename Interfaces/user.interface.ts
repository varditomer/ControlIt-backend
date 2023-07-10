export interface UserCredentials {
    email: string,
    password: string
}

export interface Partner {
    _id: string,
    name: string
}

// extends UserCredentials with the password
export interface PartnerUser extends UserCredentials {
    _id: string,
    partner_id: string
    // email: string,
}

// extends PartnerUser without the password
export interface User extends Omit<PartnerUser, 'password'> {
    // _id: string,
    // partner_id: string
    // email: string,
    // password: string
}
