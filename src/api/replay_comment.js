import express from 'express';
import { authContext } from 'utils/auth';
import { ReplayComment, Kuski } from '../data/models';

const router = express.Router();

const getReplayCommentsByReplayId = async ReplayIndex => {
  const data = await ReplayComment.findAll({
    where: { ReplayIndex },
    order: [['ReplayCommentIndex', 'DESC']],
    include: [
      {
        model: Kuski,
        attributes: ['Kuski'],
        as: 'KuskiData',
      },
    ],
  });
  return data;
};

const addReplayComment = async Data => {
  const NewReplayComment = await ReplayComment.create(Data);
  return NewReplayComment;
};

router
  .get('/', (req, res) => {
    res.sendStatus(404);
  })
  .get('/:ReplayIndex', async (req, res) => {
    const data = await getReplayCommentsByReplayId(req.params.ReplayIndex);
    res.json(data);
  })
  .post('/add', async (req, res) => {
    const auth = authContext(req);
    if (auth.auth) {
      const data = await addReplayComment({
        ...req.body,
        KuskiIndex: auth.userid,
      });
      res.json(data);
    } else {
      res.sendStatus(401);
    }
  });

export default router;
