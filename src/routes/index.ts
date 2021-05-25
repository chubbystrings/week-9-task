import express, { Request, Response } from 'express';
import usersRoute from './users';
import organizationRoute from './organization';

const router = express.Router();

/* GET home page. */
router.get('/', (req: Request, res: Response) => {
  res.send('Server is Live');
});

router.use('/organizations', organizationRoute);
router.use('/users', usersRoute);

export default router;
