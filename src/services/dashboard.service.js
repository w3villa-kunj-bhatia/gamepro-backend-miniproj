const Profile = require("../models/Profile");
const Reaction = require("../models/Reaction");

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

  const countsMap = {};
  reactions.forEach((r) => {
    const pid = r._id.profile.toString();
    if (!countsMap[pid]) {
      countsMap[pid] = { likes: 0, dislikes: 0 };
    }
    countsMap[pid][`${r._id.type}s`] = r.count;
  });

  const result = profiles.map((p) => ({
    ...p,
    plan: p.user?.plan || "free",
    likes: countsMap[p._id.toString()]?.likes || 0,
    dislikes: countsMap[p._id.toString()]?.dislikes || 0,
  }));

  return {
    data: result,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalProfiles: total,
  };
};
