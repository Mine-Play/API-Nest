import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('emailSendings')
export class EmailProcessor {
  constructor(private readonly mailService: MailerService) {}

  @Process('account-confirmation')
  async sendWelcomeEmail(job: Job) {
    const { data } = job;
    await this.mailService.sendMail({ 
      ...data,
      subject: `${process.env.APP_NAME} | Подтверждение аккаунта`,
      template: "AccountConfirm",
    });
  }

  @Process('password-reset')
  async sendResetPasswordEmail(job: Job) {
    const { data } = job;

    await this.mailService.sendMail({ 
      ...data,
      subject: `${process.env.APP_NAME} | Сброс пароля`,
      template: "PasswordReset",
    });
  }
}