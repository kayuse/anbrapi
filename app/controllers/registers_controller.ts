// import type { HttpContext } from '@adonisjs/core/http'

import RegistrationService from "#services/registration.service";
import { HttpContext } from "@adonisjs/core/http";
import { RegistrationDocument } from "../requests/registration.js";
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
    async encrypt(ctx: HttpContext) {
        try {
            const data = ctx.request.all()
          const  response = {
                data : this.encryption.encrypt(data.data)
            }
            return response

        } catch (error) {
            ctx.response.badRequest(error)
        }
    }
}