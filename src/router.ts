import { welcome } from "./handlers";
import { FastifyInstance, RouteOptions } from "fastify";

export default function router(
  fastify: FastifyInstance,
  options: RouteOptions,
  next: any
) {
  fastify.get("/", welcome);
  next();
}
