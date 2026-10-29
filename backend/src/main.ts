import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: "*", methods: ["GET"], credentials: false });
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT 값이 잘못되었습니다.");
  }
  await app.listen(port, process.env.HOST || "127.0.0.1");
}

bootstrap().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
