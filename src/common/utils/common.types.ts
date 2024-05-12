export type CurrentUser = { id: string };

export interface AuthenticatedRequest extends Request {
    params: any;
    currentUser: CurrentUser;
  }
  