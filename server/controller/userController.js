// module.exports.register = (req, res, next) => {
//     console.log(req.body);
// };

const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  console.log(req.body);
  try {
    const { choice, username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "사용자 아이디 사용 중.", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck) 
        return res.json({ msg: "등록된 이메일.", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      choice,
      username,
      email,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.login = async (req, res, next) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "회원이 일치하지 않습니다.", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "비밀번호가 일치하지 않습니다.", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      {new: true}
      );
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({_id: {$ne: req.params.id } }).select([
      "email","username","avatarImage", "_id"
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
}