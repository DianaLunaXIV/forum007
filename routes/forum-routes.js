const router = require("express").Router();
const { Board, Thread, Comment, User } = require("../models");

router.get("/", async (req, res) => {
  try {
    const boardsResult = await Board.findAll();

    const boards = boardsResult.map((board) => board.get({ plain: true }));
    res.render("all", {
      boards,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json({ "err": err });
  }
});

router.get("/board/:id", async (req, res) => {
  try {
    const boardResult = await Board.findByPk(req.params.id, {
      raw: true,
    });
    const threadsResult = await Thread.findAll({
      where: { board_id: req.params.id },
      include: [
        {
          model: User,
          attributes: ["user_name"],
        },
      ],
    });
    const threads = threadsResult.map((thread) => thread.get({ plain: true }));
    if (!boardResult) {
      res.status(404).render("page404");
      return;
    }
    const boardName = boardResult.name;
    //messy
    for (let a in threads) {
      threads[a].preview = threads[a].body;
      let charLength = 30;
      if (threads[a].preview.length > charLength) {
        threads[a].preview = `${threads[a].preview.slice(0, charLength)}...`;
      }
    }

    res.render("board", {
      threads,
      boardName,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ "err": err });
  }
});

router.get("/login", async (req, res) => {
  if (req.session.logged_in === true) {
    res.redirect(`/profile`);
  } else {
    res.render("login");
  }
});

router.get("/profile", async (req, res) => {
  //get user data from session
  try {
    if (req.session.logged_in === true) {
      const userData = await User.findOne({
        where: {
          id: req.session.user_id,
        },
      });
      //serialize user data
      const user = userData.get({ plain: true });
      //pass user to profile
      res.render("profile", {
        ...user,
        logged_in: true,
      });
    } else {
      res.render("login");
    }
  } catch (err) {
    res.status(500).json({ "err": err });
  }
});

router.get("/thread/:id", async (req, res) => {
  const threadData = await Thread.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ['user_name'],
      },
      {
        model: Board,
        attributes: ['name']
      },
    ],
  });
  const commentData = await Comment.findAll({
    where: { thread_id: req.params.id },
    include: [
      {
        model: User,
        attributes: ["user_name"],
      },
    ],
  });
  const comments = commentData.map((comment) => comment.get({ plain: true }));
  const thread = threadData.get({ plain: true });
  console.log("comments: " + JSON.stringify(comments));
  res.render("thread", {
    thread,
    comments,
    logged_in: req.session.logged_in,
  });
});

module.exports = router;
