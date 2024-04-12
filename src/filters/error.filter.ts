import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { NotFoundException } from 'src/exceptions/NotFoundException';
import { UnauthorizedException } from 'src/exceptions/UnauthorizedException';
import { IncidentsService } from 'src/modules/incidents/incidents.service';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(private incidentsService: IncidentsService) {}

  async catch(error: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const req = host.switchToHttp().getRequest();
    const status = (error instanceof HttpException) ? error.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR;
    // console.log(error)
    // if (status === HttpStatus.UNAUTHORIZED) {
    //   return response.status(status).json({ status: 403 });
    //   throw new UnauthorizedException();
    // }
    // if (status === HttpStatus.NOT_FOUND) {
    //   return response.status(status).json({ status: 404 });
    //   throw new NotFoundException();
    // }
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        const incident = await this.incidentsService.register(error.stack, req.ip);
        console.error(error.stack);
        return response.status(status).json({ status: 5000, IncidentID: incident.id });
    }

    if (error instanceof HttpException) {
      // set httpException res to res
      response.status(error.getStatus()).json(error.getResponse());
      return;
    }
  }
}