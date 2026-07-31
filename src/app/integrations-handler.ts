import { app } from '../../__create/index';

export async function loader({ request }: { request: Request }) {
  return app.fetch(request);
}

export async function action({ request }: { request: Request }) {
  return app.fetch(request);
}
