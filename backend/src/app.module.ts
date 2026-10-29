import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { StateService } from "./state.service";

@Module({ controllers: [AppController], providers: [StateService] })
export class AppModule {}
