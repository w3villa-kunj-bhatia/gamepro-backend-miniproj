const Profile = require("../models/Profile");
const Reaction = require("../models/Reaction");
const Comment = require("../models/Comment");

exports.getProfiles = async ({ userId, page = 1, limit = 6, search = "" }) => {
  const skip = (page - 1) * limit;

  const query = { user: { $ne: userId } };
  if (search) {
    query.username = { $regex: search, $options: "i" };
  }

  const profiles = await Profile.find(query)
    .populate("user", "plan")
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Profile.countDocuments(query);

  const profileIds = profiles.map((p) => p._id);

  const reactions = await Reaction.aggregate([
    { $match: { profile: { $in: profileIds } } },
    {
      $group: {
        _id: { profile: "$profile", type: "$type" },
        count: { $sum: 1 },
      },
    },
  ]);

  const comments = await Comment.aggregate([
    { $match: { profile: { $in: profileIds } } },
    {
      $group: {
        _id: "$profile",
        count: { $sum: 1 },
      },
    },
  ]);

  const userReactions = await Reaction.find({
    user: userId,
    profile: { $in: profileIds },
  });

  const countsMap = {};
  reactions.forEach((r) => {
    const pid = r._id.profile.toString();
    if (!countsMap[pid]) {
      countsMap[pid] = { likes: 0, dislikes: 0 };
    }
    countsMap[pid][`${r._id.type}s`] = r.count;
  });

  const commentsMap = {};
  comments.forEach((c) => {
    commentsMap[c._id.toString()] = c.count;
  });

  const userReactionMap = {};
  userReactions.forEach((r) => {
    userReactionMap[r.profile.toString()] = r.type;
  });

  const result = profiles.map((p) => {
    const pid = p._id.toString();
    return {
      ...p,
      plan: p.user?.plan || "free",
      likes: countsMap[pid]?.likes || 0,
      dislikes: countsMap[pid]?.dislikes || 0,
      commentCount: commentsMap[pid] || 0,
      userReaction: userReactionMap[pid] || null,
    };
  });

  return {
    data: result,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalProfiles: total,
  };
};
