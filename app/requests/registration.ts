import Registration from "#models/registration"

export type RegistrationDocument = {
    firstname: string
    lastname: string,
    email: string
    mobile: string
    address: string
    occupation: string
    marital_status: string
    country: string
    has_attended: string
    your_description: string
    needs_attention: string
    nursing_mum: string
    expectations: string
    invited_by: string
}
export type RegistrationConfirmation = {
    regId: string
    bibleStudyId: string,
    ministryWorkshopId: string,
    hasAccomodation: string
}
export type RegistrationResponse = {
    registration : Registration
    room : string
}