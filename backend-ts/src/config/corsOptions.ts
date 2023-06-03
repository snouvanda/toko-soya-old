import { CorsOptions } from "cors"
import { allowedOrigins } from "./allowedOrigins"

export const corsOptions: CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: allowedOrigins,
  //preflightContinue: false,
}
