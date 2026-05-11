import "reflect-metadata";
import "./instrumentation.js";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./modules/app.module.js";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("Grid Ops API")
      .setDescription("Operational APIs for grid asset telemetry and dispatch.")
      .setVersion("0.1.0")
      .build(),
  );
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(Number(process.env.PORT ?? 4000));
};

void bootstrap();
