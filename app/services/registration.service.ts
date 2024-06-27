import { inject } from "@adonisjs/core";
import Registration from "#models/registration";
import mail from '@adonisjs/mail/services/main'
import { RegistrationDocument } from "../requests/registration.js";
import { ApiResponse } from "../requests/api_response.js";
import BibleStudyGroup from "#models/bible_study_group";
import env from '#start/env'
import axios from 'axios';

import { Encryption } from '@adonisjs/core/encryption'


@inject()
export default class RegistrationService {
    // const errors = []
    protected encryption: Encryption
    protected apiToken: string;
    protected smsApiUrl: string
    constructor() {
        this.encryption = new Encryption({
            secret: env.get('APP_KEY')
        })
        this.smsApiUrl = env.get('SMS_API')
        this.apiToken = this.encryption.decrypt(env.get('API_TOKEN')) as string
    }
    async process(data: RegistrationDocument): Promise<ApiResponse> {
        const registrations = await Registration.findManyBy({ email: data.email, mobile: data.mobile })
        if (registrations.length > 0) {
            return {
                data: null,
                status: 400,
                message: 'This user already exists'
            }
        }
        const bibleStudyGroup = await BibleStudyGroup.query().orderBy('attendant', 'asc').first()
        const registration = await Registration.create({
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            mobile: data.mobile,
            address: data.address,
            occupation: data.occupation,
            marital_status: data.marital_status,
            country: data.country,
            has_attended: data.has_attended,
            your_description: data.your_description,
            needs_attention: data.needs_attention,
            nursing_mum: data.nursing_mum,
            expectations: data.expectations,
            invited_by: data.invited_by,
            biblestudy_id: bibleStudyGroup?.study_id,
        })

        registration.registration_id = `THREG${registration.id}`
        registration.save()
        if (bibleStudyGroup != null) {
            bibleStudyGroup.attendant = bibleStudyGroup.attendant += 1
            bibleStudyGroup.save()
        }
        try {
            const res = await mail.send((message) => {
                message.to(registration.email)
                    .from('threshinghouseteam@gmail.com')
                    .subject('ANBR 2024, Registration')
                    .htmlView('emails/confirm_registration', registration)
            })
            console.log(res)
        } catch (e) {
            let postData = {
                from: "ThresHOUSE",
                to: registration.mobile,
                body: `Your ANBR Registration is Successful, 
                your Registration ID ${registration.registration_id} 
                and BibleStudy Group ${registration.biblestudy_id}`,
                api_token : this.apiToken
            }
            const res = await axios.post(this.smsApiUrl, postData);
            console.log(res)
        }

        const response: ApiResponse = {
            status: 200,
            data: registration,
            message: "Successful"
        }
        return response
    }
}