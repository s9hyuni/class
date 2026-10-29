import { Controller, Get, Header, NotFoundException, Param, Query, StreamableFile } from "@nestjs/common";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { StateService } from "./state.service";

@Controller()
export class AppController {
  constructor(private readonly state: StateService) {}

  @Get("api/v1/health")
  @Header("Cache-Control", "no-store")
  health() {
    return { status: "ok", releaseId: process.env.RELEASE_ID || "local" };
  }

  @Get("api/v1/images/:id")
  @Header("Content-Type", "image/png")
  image(@Param("id") id: string) {
    if (id !== "factory" && id !== "warehouse") {
      throw new NotFoundException();
    }
    return new StreamableFile(createReadStream(resolve(__dirname, "../assets", id + ".png")));
  }

  @Get("api/v1/snapshot")
  @Header("Cache-Control", "no-store")
  snapshot(@Query("at") at?: string) {
    return this.state.snapshot(at);
  }

  @Get("api/v1/records")
  @Header("Cache-Control", "no-store")
  records(
    @Query("kind") kind: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("at") at?: string,
  ) {
    return this.state.records(kind, from, to, at);
  }
}
