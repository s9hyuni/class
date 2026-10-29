import { Controller, Get, Header } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("api/v1/health")
  @Header("Cache-Control", "no-store")
  health() {
    return { status: "ok", releaseId: process.env.RELEASE_ID || "local" };
  }
}
