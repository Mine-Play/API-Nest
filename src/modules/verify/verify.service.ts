import { Injectable } from '@nestjs/common';
import { Confirmation } from './verify.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { BadRequestException } from 'src/exceptions/BadRequestException';
import { ThrottleException } from 'src/exceptions/ThrottleException';

@Injectable()
export class VerifyService {
    constructor(@InjectRepository(Confirmation) private confirmationsRepository: Repository<Confirmation>,
                                                 @InjectQueue('emailSendings') private emailQueue: Queue) {}

    /**
     * Compare request code and code in DB
     * @param user User instance
     * ERRORS: 4101 - User hasn't got any confirmation codes
     *         4102 - Code has been expired
     *         4103 - Invalid code
     */
    async verify(type: string, user: User, dto: VerifyCodeDto) {
        const activeCode = await this.confirmationsRepository.findOne({ where: { user: user, type: type } });
        if(activeCode){
            if((activeCode.createdAt + 3600) <= Math.round(new Date().getTime() / 1000)){ // <----  If code has been expired
                //return { code: 4102 };
                throw new BadRequestException(4102, "Code has been expired");
            }else{ // <---- If code is up-to-date
                if(activeCode.code === dto.code){
                    this.confirmationsRepository.remove(activeCode);
                    return true;
                }
                //return { code: 4103 };
                throw new BadRequestException(4103, "Invalid code");
            }
        }
        //return { code: 4101 };
        throw new BadRequestException(4101, "User hasn't got any confirmation codes");
    }

    /**
     * Generate a code
     * @param type for "email" or for "password"
     * @param user User instance
     * ERRORS: nope.
     */
    async generate(type: string, user: User): Promise<boolean>{
        let processName;
        switch(type){
            case "email":
                processName = "account-confirmation";
                break;
            case "password":
                processName = "password-reset";
                break;
        }
        const code = this.code();
        this.emailQueue.add(processName, {
            to: user.email,
            context: {
              code: String(code).split(""),
              name: user.name
            }
        });
        const newCode = await this.confirmationsRepository.create({ code: code, user: user, type: type });
        this.confirmationsRepository.save(newCode);
        return true;
    }

    /**
     * Compare request code and code in DB
     * @param user User instance
     * ERRORS: 4101 - User hasn't got any confirmation codes
     *         4102 - Code has been expired
     *         4103 - Invalid code
     */
    async regenerate(type: string, user: User, silent: boolean = false): Promise<boolean>{
        let processName;
        switch(type){
            case "email":
                processName = "account-confirmation";
                break;
            case "password":
                processName = "password-reset";
                break;
        }
        const activeCode = await this.confirmationsRepository.findOne({ where: { user: user, type: type } });
        const code = this.code();
        if(activeCode){
            if((Number(activeCode.createdAt) + 60) >= Math.round(new Date().getTime() / 1000)){ // Trottling 1 code = 1 minute
                if(!silent){
                    throw new ThrottleException((Number(activeCode.createdAt) + 60) - Math.round(new Date().getTime() / 1000));
                }
            }else{
                activeCode.code = code;
                activeCode.createdAt = Math.round(new Date().getTime() / 1000)
                this.confirmationsRepository.save(activeCode); // TODO NOT WORK!
            }
        }else{
            const newCode = await this.confirmationsRepository.create({ code: code, user: user, type: type });
            this.confirmationsRepository.save(newCode);
        }
        this.emailQueue.add(processName, {
            to: user.email,
            context: {
              code: String(code).split(""),
              name: user.name
            }
        });
        return true;
    }

    private code(): number{
        return Math.round(Math.random() * (99999 - 10000) + 10000);
    }
}