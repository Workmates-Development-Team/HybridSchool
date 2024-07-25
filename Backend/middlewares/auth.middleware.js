import jwt from 'jsonwebtoken'

export default async function (req, res, next) {
  const authHeader = req.header("Authorization");
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRECT);

    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err)
    res.status(401).json({ msg: "Token is not valid" });
  }
}
