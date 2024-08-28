// import type { HttpContext } from '@adonisjs/core/http'

import RegistrationService from "#services/registration.service";
import { HttpContext } from "@adonisjs/core/http";
import { RegistrationConfirmation, RegistrationDocument } from "../requests/registration.js";
import { inject } from "@adonisjs/core";
import env from '#start/env'

import { Encryption } from '@adonisjs/core/encryption'




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
        if(response != null){
            return response
        }
        return null;
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