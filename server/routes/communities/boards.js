const express = require("express");
const router = express.Router();

const { Board } = require("../../models/Community/Board");

const { auth } = require("../../middleware/auth");
const { communityPermission } = require("../../middleware/permission");
const { Types } = require("mongoose");

router.get("/", auth, (req, res) => {
  let userId = req.query.userId;

  if (userId) {
    // find by userId
    Board.find({ userId: userId }, (err, boards) => {
      if (err) {
        return res.json({ success: false, msg: err });
      } else {
        return res.json({ success: true, boards: boards });
      }
    });
  } else {
    // find all
    Board.find((err, boards) => {
      if (err) {
        return res.json({ success: false, msg: err });
      } else {
        return res.json({ success: true, boards: boards });
      }
    });
  }
});

router.get("/:no", auth, (req, res) => {
  // find by board Id
  Board.findOne({ no: req.params.no }, (err, board) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      if (!board) {
        return res
          .status(404)
          .json({ succress: false, msg: "Board Not Found" });
      } else {
        board.updateView(() => {
          return res.json({ success: true, board: board });
        });
      }
    }
  });
});

router.post("/", auth, (req, res) => {
  let userId = req.user._id;
  let newBoard = new Board({
    title: req.body.title,
    content: req.body.content,
    userId: userId,
  });
  newBoard.save((err, data) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      return res.json({
        success: true,
        msg: "Create new board in community",
      });
    }
  });
});

// MODIFIED -m
router.put("/hearts/:no", auth, (req, res) => {
  let userId = req.user._id;
  Board.findOne({ no: req.params.no }, (err, board) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      if (!board) {
        return res
          .status(404)
          .json({ succress: false, msg: "Board Not Found" });
      } else {
        board.updateHeart(() => {
          return res.json({ success: true, board: board });
        });
      }
    }
  });
});

router.put("/:no", auth, communityPermission, (req, res) => {
  // upate
  let board = req.board;
  board.update(
    {
      title: req.body.title,
      content: req.body.content,
      updateAt: Date.now(),
    },
    (err, updated) => {
      if (err) {
        return res.json({ success: false, msg: err });
      } else {
        return res.json({ success: true });
      }
    }
  );
});

router.delete("/:no", auth, (req, res) => {
  let userId = new Types.ObjectId(req.user._id);
  Board.findOne({ no: req.params.no }, (err, board) => {
    if (err) {
      return res.json({ success: false, msg: err });
    } else {
      if (!board) {
        return res
          .status(404)
          .json({ succress: false, msg: "Board Not Found" });
      } else if (!userId.equals(board.userId)) {
        console.log(userId);
        console.log(board.userId);
        return res.status(403).json({ succress: false, msg: "No Permission" });
      } else {
        board.remove((err, board) => {
          if (err) {
            return res.json({ success: false, msg: err });
          } else {
            return res.json({ success: true });
          }
        });
      }
    }
  });
});

module.exports = router;
