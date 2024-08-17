import env from "#start/env";
import { Encryption } from "@adonisjs/core/encryption";
import { Bot } from "grammy";
import RegistrationService from "./registration.service.js";
import { inject } from "@adonisjs/core";

@inject()
export default class TelegramBotService {
    protected token: string
    protected encryption: Encryption

    //  private commandStack: CommandStack = 
    private commandRegistration: Map<string, string> = new Map();
    private commandStack: Map<string, string[]> = new Map();
    protected bot: Bot
    constructor(protected registrationService: RegistrationService) {
        this.encryption = new Encryption({
            secret: env.get('APP_KEY')
        })
        this.registrationService = new RegistrationService()
        this.token = this.encryption.decrypt(env.get('TELEGRAM_TOKEN')) as string
        this.bot = new Bot(this.token);
    }

    async initialize() {
        this.bot.on('message', (ctx) => {
            console.log('message')
            const message = ctx.message.text as string
            const response = this.run(`User${ctx.chat.id}`, message)
            response.then(res => {
                ctx.reply(res)
            })
            // ctx.reply(response)
        })
        this.bot.start()
    }
    async run(id: string, message: string): Promise<string> {
        switch (message) {
            case '/start':
                this.commandStack.set(id, ['start'])
                return `Welcome to Threshing House ANBR Confirmation Bot Kindly put in the Registration ID to continue
                        `
            case '/report':
                return "You have asked to generate a report, Kindly click on the link below to download the report"
            default:
                return await this.processTransaction(id, message)
        }
        return ''
    }
    async processTransaction(id: string, message: string): Promise<string> {
        const lastCommand = this.commandStack.get(id)
        const lastmessage = lastCommand?.at(lastCommand?.length - 1)
        console.log(lastmessage)
        if (lastmessage == 'start') {
            const reg = await this.registrationService.getRegistration(message)
            if (reg == null) {
                return 'This Registration ID cannot be found please try again'
            }
            let data = "";
            Object.entries(reg.toJSON()).forEach(([key, value]) => {
               data += (`${key}, Value: ${value}`);
               data += "\n";
              });
            const response = `This is the details we found 
                             ${data}
                             Do you want to confirm this person (Y/N)`
            lastCommand?.push('registration')
            this.commandRegistration.set(id, message)
            this.commandStack.set(id, lastCommand as [])
            return response
        } else if (lastmessage == 'registration') {
            const regId = this.commandRegistration.get(id)
            if(regId == null){
                return 'Invalid REGID Please Start the Process Again'
            }
            const registrationConfirmed = await this.registrationService.confirm(regId)
            if(registrationConfirmed){
                return `You have confirmed the registration of this person, The Room Number for the Person is Female Hoster, Floor 1, Room 2`
            }
            return 'Could not confirm the reigstration please try again'
        }
        return message
    }
}

