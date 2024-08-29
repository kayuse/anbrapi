// import type { HttpContext } from '@adonisjs/core/http'

import RegistrationService from "#services/registration.service";
import { HttpContext } from "@adonisjs/core/http";
import { RegistrationConfirmation, RegistrationDocument } from "../requests/registration.js";
import { inject } from "@adonisjs/core";
import env from '#start/env'
import path from 'path'
import { Encryption } from '@adonisjs/core/encryption'
import Registration from "#models/registration";
import createCsvWriter from 'csv-writer'
import { promisify } from 'util'
import app from '@adonisjs/core/services/app'


@inject()
export default class RegistersController {
    protected encryption: Encryption
    constructor(protected service: RegistrationService) {
        this.encryption = new Encryption({
            secret: env.get('APP_KEY')
        })

    }
    async index(ctx: HttpContext) {
        try {
            const data = ctx.request.all() as RegistrationDocument;
            const res = this.service.process(data)
            return res
        } catch (error) {
            ctx.response.badRequest(error)
        }
    }
    async confirm(ctx: HttpContext) {
        const data = ctx.request.all() as RegistrationConfirmation;
        const response = this.service.confirmWithUrl(data)
        if (response != null) {
            return response
        }
        return null;
    }
    async sync(ctx: HttpContext) {
        try {
            const res = this.service.sync()
            return res
        } catch (error) {
            ctx.response.badRequest(error)
        }
    }
    async get(ctx: HttpContext) {
        try {
            const id = ctx.params.id;
            const res = await this.service.getRegistration(id);
            console.log(res)
            return res
        } catch (error) {
            ctx.response.badRequest(error)
        }
    }
    public async downloadCsv({ response }: HttpContext) {
        // Example data that you might fetch from your database
        const records = await Registration.all()
        const filePath = app.makePath(`output.csv`)
        // Define the path to the CSV file
        const csvFilePath = path.join('output.csv')
        console.log('CSV File Path:', csvFilePath)


        // Set up the CSV writer
        const csvWriter = createCsvWriter.createObjectCsvWriter({
            path: csvFilePath,
            header: [
                { id: 'id', title: 'ID' },
                { id: 'registration_id', title: 'Registration ID' },
                { id: 'firstname', title: 'Name' },
                { id: 'mobile', title: 'Mobile' },
                { id: 'email', title: 'Email' },
                { id: 'address', title: 'Address' },
                { id: 'occupation', title: 'Occupation' },
                { id: 'marital_status', title: 'Marital Status' },
                { id: 'country', title: 'Country' },

                { id: 'has_attended', title: 'Has Attended ANBR' },
                { id: 'needs_attention', title: 'Any Thing that Needs Attention' },
                { id: 'expectations', title: 'Expectations' },
                { id: 'bible_study_group_name', title: 'Bible Study Group Name' },
                { id: 'ministry_workshop_group_name', title: 'Minsitry Workshop Group Name' },
                { id: 'age_group', title: 'Age Group' },
                { id: 'confirmed', title: 'Registration Confirmed' },

            ],
        })

        // Write records to CSV
        await csvWriter.writeRecords(records)
        const delay = promisify(setTimeout)
        await delay(100)
        // Send the file for Ídownload
        response.download(filePath)
    }
    async encrypt(ctx: HttpContext) {
        try {
            const data = ctx.request.all()
            const response = {
                data: this.encryption.encrypt(data.data)
            }
            return response

        } catch (error) {
            ctx.response.badRequest(error)
        }
    }
}