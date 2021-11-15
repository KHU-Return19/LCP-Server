const { User } = require("../models/User");
const { Board } = require("../models/Community/Board");
const { Types } = require("mongoose");

const communityPermission = (req, res, next) => {
  let userId = new Types.ObjectId(req.user._id);
  var communityNo = req.params.no;

  Board.findByNo(communityNo, (err, board) => {
    if (err) throw err;
    if (!board) {
      return res.status(404).json({ succress: false, msg: "Board Not Found" });
    } else if (!userId.equals(board.userId)) {
      return res.status(403).json({ succress: false, msg: "No Permission" });
    } else {
      req.board = board;
      next();
    }
  });
};

module.exports = { communityPermission };
