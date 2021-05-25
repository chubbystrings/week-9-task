/* eslint-disable no-unused-vars */
import { ICurrentUser } from '../../src/types/index';

declare global {
    namespace Express {
        interface Request {
            currentUser?: ICurrentUser
        }
    }
}
