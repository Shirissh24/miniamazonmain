import jwt from 'jsonwebtoken';
import user from '../Controllers/user.model.js';

const isUser = async (req, res, next) => {
  // extract token from req.headers.authorization
  const authorization = req?.headers?.authorization;
  const splittedToken = authorization?.split(' ');

  const token = splittedToken?.length === 2 ? splittedToken[1] : null;

  //if not found token throw error
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized.' });
  }

  let payload = null;
  try {
    const secretKey = 'sushilganduhokoteshwormabasxa';

    //decrypt token
    payload = jwt.verify(token, secretKey);
  } catch (error) {

    //if decryption failed, throw error
    //reasons: secretkey is different, token is expired, token is not from our system
    return res.status(401).send({ message: 'Unauthorized.' });
  }

  //  find user using email from payload
    const user = await user.findOne({ email: payload.email });

  if (!user) {
    return res.status(401).send({ message: 'Unauthorized.' });
  }

  next();
};

export default isUser;
