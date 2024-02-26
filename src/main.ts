import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { ErrorFilter } from './filters/error.filter';
import { MyThrottleErrorFilter, ThrottleErrorFilter } from './filters/throttle.filter';
import helmet from 'helmet';

async function bootstrap() {
  const port = process.env.PORT || 8000;
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  await CommandFactory.run(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ThrottleErrorFilter(), new MyThrottleErrorFilter());
  app.use(helmet());
  app.enableCors();
  console.info('Server started on port ' + port + ' 🔥');
  console.info('HTTP Address: http://127.0.0.1:' + port + '/');
  await app.listen(port);
}
bootstrap();