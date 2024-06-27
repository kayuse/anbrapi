import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

import { Encryption } from '@adonisjs/core/encryption'


const encryption = new Encryption({
  secret: env.get('APP_KEY')
})


const username: string = encryption.decrypt(env.get('SMTP_USERNAME', '')) as string
const password: string = encryption.decrypt(env.get('SMTP_PASSWORD', '')) as string

console.log(username,'username')
const mailConfig = defineConfig({
  default: 'smtp',

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or same transport with different
   * options.
  */
  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST'),
      port: env.get('SMTP_PORT'),
      /**
       * Uncomment the auth block if your SMTP
       * server needs authentication
       */
      auth: {
        type: 'login',
        user: username,
        pass: password,
      },
      secure: true,
    }),

  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> { }
}