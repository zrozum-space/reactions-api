export async function welcome(request, reply): Promise<void> {
  reply.header('Content-Type', 'text/html; charset=utf-8').send(`<h1>Welcome to Fastify + Typescript App 🔥 </h1>`)
}
