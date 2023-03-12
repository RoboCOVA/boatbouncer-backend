import { google } from 'googleapis';
import { googleConsoleKey } from './environments';

export const identityToolkit = google.identitytoolkit({
  auth: googleConsoleKey,
  version: 'v3',
});
