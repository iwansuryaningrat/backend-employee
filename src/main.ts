import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    optionsSuccessStatus: 200,
    credentials: true
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const options = new DocumentBuilder()
    .setTitle('Employees API')
    .setDescription('API for Employees Test')
    .setContact('Iwan Suryaningrat', 'https://iwansuryaningrat.tech', 'iwan.suryaningrat28@gmail.com')
    .addServer(`http://localhost:${port}`, "Local Server",)
    .setVersion('1.0')
    .setLicense('MIT', 'https://github.com/nestjs/nest/blob/master/LICENSE')
    .addBearerAuth({
      type: 'http', scheme: 'bearer', bearerFormat: 'token', in: 'header'
    }, 'Authorization')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  const setupOptions: SwaggerCustomOptions = {
    explorer: true,
    customSiteTitle: "Employees API Documentation",
    url: "/docs",
    jsonDocumentUrl: "/docs/json",
    yamlDocumentUrl: "/docs/yaml",
    swaggerOptions: {
      filter: true,
      tagsSorter: 'alpha',
      showRequestDuration: true,
      deepLinking: true,
      displayOperationId: false,
      syntaxHighlight: {
        activate: true,
        theme: 'shades-of-purple',
      },
    },
  };

  SwaggerModule.setup('docs', app, document, setupOptions);

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger is running on: ${await app.getUrl()}/docs`);
}
bootstrap();
